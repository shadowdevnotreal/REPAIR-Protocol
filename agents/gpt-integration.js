/**
 * GPT Integration Module for REPAIR Protocol
 * Provides comprehensive AI-powered analysis and guidance throughout the repair process
 */

class GPTIntegration {
    constructor(apiConfig) {
        this.apiConfig = apiConfig || window.repairAPIConfig;
        this.conversationHistory = [];
        this.contextManager = new ConversationContextManager();
        this.errorHandler = new ErrorHandler();
        this.retryManager = new RetryManager();

        // State management
        this.currentPhase = 0;
        this.userProfile = {};
        this.analysisCache = new Map();
        this.isInitialized = false;

        // Performance tracking
        this.metrics = {
            requestCount: 0,
            averageResponseTime: 0,
            successRate: 0,
            errors: []
        };

        this.initialize();
    }

    async initialize() {
        try {
            console.log('Initializing GPT Integration...');

            // Load configuration
            if (!this.apiConfig) {
                throw new Error('API configuration not available');
            }

            // Test connection
            const connectionTest = await this.testConnection();
            if (!connectionTest.success) {
                console.warn('Primary API connection failed, checking fallback...');
                await this.checkFallbackOptions();
            }

            // Initialize conversation context
            this.contextManager.initialize();

            // Load any saved state
            this.loadSavedState();

            this.isInitialized = true;
            console.log('GPT Integration initialized successfully');

        } catch (error) {
            console.error('Failed to initialize GPT Integration:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Main API Request Method
     */
    async makeRequest(messages, options = {}) {
        const startTime = Date.now();

        try {
            // Check rate limiting
            this.apiConfig.checkRateLimit();

            // Prepare request
            const requestConfig = this.prepareRequest(messages, options);

            // Make API call with retry logic
            const response = await this.retryManager.executeWithRetry(
                () => this.executeAPICall(requestConfig),
                { maxRetries: 3, backoffMultiplier: 2 }
            );

            // Process response
            const processedResponse = this.processResponse(response);

            // Update metrics and history
            this.updateMetrics(startTime, true);
            this.recordConversation(messages, processedResponse);

            // Track usage
            this.apiConfig.recordRequest();
            if (response.usage) {
                this.apiConfig.trackUsage(response.usage.total_tokens);
            }

            return processedResponse;

        } catch (error) {
            this.updateMetrics(startTime, false, error);
            return this.handleRequestError(error, messages, options);
        }
    }

    prepareRequest(messages, options) {
        const config = this.apiConfig.config.primary;

        // Ensure messages are properly formatted
        const formattedMessages = this.formatMessages(messages, config.provider);

        // Add context from conversation history if enabled
        if (this.apiConfig.isFeatureEnabled('conversationHistory')) {
            const contextMessages = this.contextManager.getRelevantContext(formattedMessages);
            formattedMessages.unshift(...contextMessages);
        }

        const requestPayload = {
            model: options.model || config.model,
            max_tokens: options.maxTokens || config.maxTokens,
            temperature: options.temperature || config.temperature,
            ...options.additionalParams
        };

        // Add provider-specific parameters and message formatting
        if (config.provider === 'anthropic') {
            requestPayload.messages = this.formatAnthropicMessages(formattedMessages);

            // Add system message if present
            const systemMessage = formattedMessages.find(msg => msg.role === 'system');
            if (systemMessage) {
                requestPayload.system = systemMessage.content;
                requestPayload.messages = requestPayload.messages.filter(msg => msg.role !== 'system');
            }

            // Anthropic-specific parameters
            if (options.stream) {
                requestPayload.stream = true;
            }
        } else if (config.provider === 'openai') {
            requestPayload.messages = formattedMessages;

            if (options.functions) {
                requestPayload.functions = options.functions;
            }
            if (options.function_call) {
                requestPayload.function_call = options.function_call;
            }
            if (options.stream) {
                requestPayload.stream = true;
            }
        } else {
            requestPayload.messages = formattedMessages;
        }

        return {
            endpoint: this.apiConfig.getEndpointConfig('primary'),
            payload: requestPayload,
            timeout: config.timeout
        };
    }

    async executeAPICall(requestConfig) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), requestConfig.timeout);

        try {
            const response = await fetch(requestConfig.endpoint.url, {
                method: 'POST',
                headers: requestConfig.endpoint.headers,
                body: JSON.stringify(requestConfig.payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`API request failed: ${response.status} - ${errorData}`);
            }

            // Handle streaming responses
            if (requestConfig.payload.stream) {
                return this.handleStreamingResponse(response, requestConfig);
            }

            return await response.json();

        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    async handleStreamingResponse(response, requestConfig) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';
        let lastResponse = null;

        try {
            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n').filter(line => line.trim());

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);

                        if (data === '[DONE]') {
                            break;
                        }

                        try {
                            const parsed = JSON.parse(data);

                            // Handle Anthropic streaming format
                            if (requestConfig.endpoint.headers['anthropic-version']) {
                                if (parsed.type === 'content_block_delta') {
                                    fullContent += parsed.delta?.text || '';
                                } else if (parsed.type === 'message_stop') {
                                    lastResponse = parsed;
                                }
                            }
                            // Handle OpenAI streaming format
                            else {
                                const delta = parsed.choices?.[0]?.delta;
                                if (delta?.content) {
                                    fullContent += delta.content;
                                }
                                if (parsed.choices?.[0]?.finish_reason) {
                                    lastResponse = parsed;
                                }
                            }

                            // Emit streaming events if callback provided
                            if (requestConfig.onStreamChunk) {
                                requestConfig.onStreamChunk({
                                    content: fullContent,
                                    chunk: parsed,
                                    done: false
                                });
                            }

                        } catch (parseError) {
                            console.warn('Failed to parse streaming chunk:', parseError);
                        }
                    }
                }
            }

            // Return final response in expected format
            if (requestConfig.endpoint.headers['anthropic-version']) {
                return {
                    content: [{ text: fullContent }],
                    stop_reason: 'end_turn',
                    model: requestConfig.payload.model,
                    usage: lastResponse?.usage || null
                };
            } else {
                return {
                    choices: [{
                        message: { content: fullContent },
                        finish_reason: 'stop'
                    }],
                    model: requestConfig.payload.model,
                    usage: lastResponse?.usage || null
                };
            }

        } finally {
            reader.releaseLock();
        }
    }

    processResponse(response) {
        try {
            const config = this.apiConfig.config.primary;

            switch (config.provider) {
                case 'openai':
                    return {
                        content: response.choices[0]?.message?.content || '',
                        functionCall: response.choices[0]?.message?.function_call,
                        finishReason: response.choices[0]?.finish_reason,
                        usage: response.usage,
                        model: response.model,
                        timestamp: Date.now()
                    };

                case 'anthropic':
                    // Handle Anthropic's response format
                    const content = response.content?.[0]?.text ||
                                    response.content?.[0]?.content ||
                                    response.text || '';
                    return {
                        content: content,
                        finishReason: response.stop_reason,
                        usage: response.usage ? {
                            prompt_tokens: response.usage.input_tokens,
                            completion_tokens: response.usage.output_tokens,
                            total_tokens: response.usage.input_tokens + response.usage.output_tokens
                        } : null,
                        model: response.model,
                        timestamp: Date.now()
                    };

                default:
                    return {
                        content: response.choices?.[0]?.message?.content ||
                                response.content?.[0]?.text ||
                                response.text || '',
                        usage: response.usage,
                        model: response.model,
                        timestamp: Date.now()
                    };
            }
        } catch (error) {
            console.error('Error processing response:', error);
            return {
                content: 'Sorry, I encountered an error processing the response.',
                error: error.message,
                timestamp: Date.now()
            };
        }
    }

    /**
     * REPAIR Protocol Specific Methods
     */
    async analyzePhase(phaseIndex, formData) {
        const phaseAnalysisPrompts = this.getPhaseAnalysisPrompts();
        const currentPhase = phaseAnalysisPrompts[phaseIndex];

        if (!currentPhase) {
            console.warn(`No analysis prompt for phase ${phaseIndex}`);
            return null;
        }

        const contextualPrompt = this.buildContextualPrompt(currentPhase, formData, phaseIndex);

        try {
            const response = await this.makeRequest([
                { role: 'user', content: contextualPrompt }
            ], {
                temperature: 0.7,
                maxTokens: 1500
            });

            const analysis = this.parsePhaseAnalysis(response.content, phaseIndex);

            // Cache the analysis
            this.analysisCache.set(`phase_${phaseIndex}`, analysis);

            // Update UI if available
            if (typeof window !== 'undefined' && window.updateAIAnalysis) {
                window.updateAIAnalysis(analysis);
            }

            return analysis;

        } catch (error) {
            console.error(`Error analyzing phase ${phaseIndex}:`, error);
            return this.getFallbackAnalysis(phaseIndex);
        }
    }

    async provideFeedback(fieldName, content, phaseIndex) {
        if (!this.apiConfig.isFeatureEnabled('realTimeFeedback')) {
            return null;
        }

        // Rate limit feedback requests
        const cacheKey = `feedback_${fieldName}_${content.slice(0, 50)}`;
        const cached = this.analysisCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < 30000) {
            return cached;
        }

        const feedbackPrompt = this.buildFeedbackPrompt(fieldName, content, phaseIndex);

        try {
            const response = await this.makeRequest([
                { role: 'user', content: feedbackPrompt }
            ], {
                temperature: 0.6,
                maxTokens: 300
            });

            const feedback = this.parseFeedback(response.content);
            feedback.timestamp = Date.now();

            // Cache for 30 seconds
            this.analysisCache.set(cacheKey, feedback);

            return feedback;

        } catch (error) {
            console.error('Error providing feedback:', error);
            return this.getFallbackFeedback(fieldName);
        }
    }

    async generateInsights(formData, currentPhase) {
        const insightPrompt = this.buildInsightPrompt(formData, currentPhase);

        try {
            const response = await this.makeRequest([
                { role: 'user', content: insightPrompt }
            ], {
                temperature: 0.8,
                maxTokens: 800
            });

            return this.parseInsights(response.content);

        } catch (error) {
            console.error('Error generating insights:', error);
            return this.getFallbackInsights(currentPhase);
        }
    }

    async detectBias(content, context = '') {
        if (!this.apiConfig.isFeatureEnabled('biasDetection')) {
            return { biasLevel: 'unknown', suggestions: [] };
        }

        const biasPrompt = this.buildBiasDetectionPrompt(content, context);

        try {
            const response = await this.makeRequest([
                { role: 'user', content: biasPrompt }
            ], {
                temperature: 0.3,
                maxTokens: 400
            });

            return this.parseBiasAnalysis(response.content);

        } catch (error) {
            console.error('Error detecting bias:', error);
            return { biasLevel: 'unknown', suggestions: [], error: error.message };
        }
    }

    async analyzeEmotionalIntelligence(content, targetPhase) {
        if (!this.apiConfig.isFeatureEnabled('emotionalAnalysis')) {
            return { empathy: 0, sincerity: 0, completeness: 0 };
        }

        const emotionalPrompt = this.buildEmotionalAnalysisPrompt(content, targetPhase);

        try {
            const response = await this.makeRequest([
                { role: 'user', content: emotionalPrompt }
            ], {
                temperature: 0.4,
                maxTokens: 500
            });

            return this.parseEmotionalAnalysis(response.content);

        } catch (error) {
            console.error('Error analyzing emotional intelligence:', error);
            return { empathy: 0, sincerity: 0, completeness: 0, error: error.message };
        }
    }

    /**
     * Prompt Building Methods
     */
    getPhaseAnalysisPrompts() {
        return [
            // Phase 0: Assessment
            `Analyze this REPAIR Protocol assessment for completeness and readiness. Focus on:
            1. Clarity and specificity of harm description
            2. Appropriate severity assessment
            3. Genuine readiness indicators
            4. Missing critical information
            Provide specific, actionable feedback in JSON format with scores (0-1) and suggestions.`,

            // Phase 1: Recognize
            `Evaluate this recognition phase for authentic acknowledgment. Assess:
            1. Specific action identification without minimization
            2. Genuine responsibility acceptance without deflection
            3. Accurate emotional impact understanding
            4. Bias mitigation effectiveness
            Provide detailed analysis in JSON format with empathy and authenticity scores.`,

            // Phase 2: Examine
            `Analyze this examination phase for comprehensive impact understanding. Review:
            1. Complete direct impact assessment
            2. Secondary effect recognition
            3. Systemic implication awareness
            4. Logical consistency and depth
            Provide thorough analysis in JSON format with completeness and insight scores.`,

            // Phase 3: Prepare
            `Evaluate this preparation phase for authentic commitment. Examine:
            1. Clear, specific acknowledgment statements
            2. Meaningful, actionable change commitments
            3. Appropriate, realistic amends proposals
            4. Feasible implementation timeline
            Provide detailed feedback in JSON format with authenticity and feasibility scores.`,

            // Phase 4: Articulate
            `Assess this apology articulation for effectiveness and sincerity. Analyze:
            1. Complete structure adherence
            2. Emotional authenticity and appropriateness
            3. Specific, actionable commitments
            4. Respectful, non-defensive tone
            Provide comprehensive evaluation in JSON format with delivery and sincerity scores.`,

            // Phase 5: Implement
            `Review this implementation plan for realistic execution. Evaluate:
            1. Immediate action clarity and appropriateness
            2. Long-term change sustainability
            3. Progress tracking feasibility
            4. Accountability mechanism strength
            Provide implementation analysis in JSON format with feasibility and commitment scores.`,

            // Phase 6: Restore
            `Analyze this restoration plan for relationship healing effectiveness. Assess:
            1. Trust rebuilding metric appropriateness
            2. Healing indicator relevance and measurability
            3. Patience and respect for healing timeline
            4. Sustainable relationship improvement focus
            Provide restoration analysis in JSON format with healing potential and sustainability scores.`,

            // Phase 7: Contract
            `Evaluate this complete REPAIR contract for comprehensiveness and commitment. Review:
            1. All phase completion quality
            2. Overall coherence and consistency
            3. Realistic expectation setting
            4. Long-term success probability
            Provide final assessment in JSON format with overall effectiveness and sustainability scores.`
        ];
    }

    buildContextualPrompt(basePrompt, formData, phaseIndex) {
        const phaseName = ['Assessment', 'Recognize', 'Examine', 'Prepare', 'Articulate', 'Implement', 'Restore', 'Contract'][phaseIndex];

        const contextData = this.extractRelevantFormData(formData, phaseIndex);

        return `${basePrompt}

PHASE: ${phaseName} (${phaseIndex + 1}/8)

CONTEXT DATA:
${JSON.stringify(contextData, null, 2)}

ANALYSIS REQUIREMENTS:
- Provide specific, actionable feedback
- Include numerical scores (0.0-1.0) for key metrics
- Identify potential risks or concerns
- Suggest concrete improvements
- Format as valid JSON for parsing

RESPONSE FORMAT:
{
    "phase": "${phaseName}",
    "scores": {
        "overall": 0.0,
        "specific_metrics": {}
    },
    "insights": ["insight1", "insight2"],
    "suggestions": ["suggestion1", "suggestion2"],
    "warnings": ["warning1", "warning2"],
    "status": "needs_improvement|good|excellent"
}`;
    }

    buildFeedbackPrompt(fieldName, content, phaseIndex) {
        const phaseContext = ['assessment', 'recognition', 'examination', 'preparation', 'articulation', 'implementation', 'restoration', 'contract'][phaseIndex];

        return `Provide real-time feedback on this ${fieldName} input for the ${phaseContext} phase of the REPAIR Protocol:

CONTENT: "${content}"

FEEDBACK CRITERIA:
- Specificity and clarity
- Emotional appropriateness
- Bias detection
- Constructive improvement suggestions

Respond with brief, actionable feedback in JSON format:
{
    "quality": "poor|fair|good|excellent",
    "score": 0.0,
    "feedback": "brief specific feedback",
    "suggestion": "concrete improvement tip"
}`;
    }

    buildInsightPrompt(formData, currentPhase) {
        return `Generate helpful insights for the REPAIR Protocol based on the current progress:

CURRENT PHASE: ${currentPhase + 1}/8
FORM DATA: ${JSON.stringify(formData, null, 2)}

Provide 3-5 actionable insights focusing on:
1. Pattern recognition in the user's responses
2. Potential challenges ahead
3. Strengths to build upon
4. Specific next steps

Format as JSON array of insight objects with type and message.`;
    }

    buildBiasDetectionPrompt(content, context) {
        return `Analyze this content for cognitive biases common in apologies and reconciliation:

CONTENT: "${content}"
CONTEXT: "${context}"

COMMON BIASES TO DETECT:
- Minimization ("it wasn't that bad")
- Intent fallacy ("I didn't mean to")
- Comparative bias ("others do worse")
- Victim blaming ("they're too sensitive")
- Self-pity ("I'm the real victim")

Respond in JSON format:
{
    "biasLevel": "none|low|medium|high",
    "detectedBiases": ["bias1", "bias2"],
    "evidence": ["evidence1", "evidence2"],
    "suggestions": ["improvement1", "improvement2"]
}`;
    }

    buildEmotionalAnalysisPrompt(content, targetPhase) {
        return `Analyze the emotional intelligence metrics of this content for the REPAIR Protocol:

CONTENT: "${content}"
TARGET PHASE: ${targetPhase}

Evaluate on these dimensions (0.0-1.0 scale):
1. EMPATHY: Understanding and acknowledging others' feelings
2. SINCERITY: Genuine emotion and commitment expressed
3. COMPLETENESS: Thoroughness in addressing emotional aspects

Respond in JSON format:
{
    "empathy": 0.0,
    "sincerity": 0.0,
    "completeness": 0.0,
    "analysis": "detailed analysis of emotional content",
    "improvements": ["specific improvement suggestions"]
}`;
    }

    /**
     * Response Parsing Methods
     */
    parsePhaseAnalysis(content, phaseIndex) {
        try {
            const parsed = JSON.parse(content);
            return {
                phase: phaseIndex,
                ...parsed,
                timestamp: Date.now()
            };
        } catch (error) {
            console.error('Error parsing phase analysis:', error);
            return this.createFallbackPhaseAnalysis(phaseIndex);
        }
    }

    parseFeedback(content) {
        try {
            return JSON.parse(content);
        } catch (error) {
            return {
                quality: 'unknown',
                score: 0.5,
                feedback: 'Unable to analyze at this time',
                suggestion: 'Continue with your input'
            };
        }
    }

    parseInsights(content) {
        try {
            const parsed = JSON.parse(content);
            return Array.isArray(parsed) ? parsed : [parsed];
        } catch (error) {
            return [{
                type: 'general',
                message: 'Continue working through the process step by step'
            }];
        }
    }

    parseBiasAnalysis(content) {
        try {
            return JSON.parse(content);
        } catch (error) {
            return {
                biasLevel: 'unknown',
                detectedBiases: [],
                suggestions: ['Review your responses for objectivity']
            };
        }
    }

    parseEmotionalAnalysis(content) {
        try {
            return JSON.parse(content);
        } catch (error) {
            return {
                empathy: 0.5,
                sincerity: 0.5,
                completeness: 0.5,
                analysis: 'Unable to analyze emotional content',
                improvements: ['Focus on genuine expression of feelings']
            };
        }
    }

    /**
     * Fallback Methods
     */
    getFallbackAnalysis(phaseIndex) {
        const phaseNames = ['Assessment', 'Recognition', 'Examination', 'Preparation', 'Articulation', 'Implementation', 'Restoration', 'Contract'];

        return {
            phase: phaseIndex,
            scores: { overall: 0.5, specific_metrics: {} },
            insights: [`Continue working on the ${phaseNames[phaseIndex]} phase`],
            suggestions: ['Take your time and be thorough'],
            warnings: [],
            status: 'needs_improvement',
            fallback: true,
            timestamp: Date.now()
        };
    }

    getFallbackFeedback(fieldName) {
        return {
            quality: 'unknown',
            score: 0.5,
            feedback: `Keep working on the ${fieldName} section`,
            suggestion: 'Be specific and honest in your response'
        };
    }

    getFallbackInsights(currentPhase) {
        const phaseInsights = [
            'Focus on being completely honest about what happened',
            'Take full responsibility without making excuses',
            'Consider all the ways your actions affected others',
            'Plan specific, meaningful ways to make amends',
            'Express your apology clearly and sincerely',
            'Follow through consistently on your commitments',
            'Be patient as trust is rebuilt over time',
            'Review and commit to your complete agreement'
        ];

        return [{
            type: 'guidance',
            message: phaseInsights[currentPhase] || 'Continue working through the process'
        }];
    }

    /**
     * Utility Methods
     */
    extractRelevantFormData(formData, phaseIndex) {
        const phaseFields = [
            // Assessment
            ['harmDescription', 'affectedParty', 'harmSeverity', 'readiness'],
            // Recognize
            ['specificActions', 'responsibility', 'emotionalImpact', 'biasChecklist'],
            // Examine
            ['directImpacts', 'secondaryEffects', 'systemicImplications'],
            // Prepare
            ['acknowledgmentStatement', 'changeCommitment', 'amendsProposal', 'timeline'],
            // Articulate
            ['apologyText'],
            // Implement
            ['immediateActions', 'longTermChanges', 'progressCheckins'],
            // Restore
            ['trustMetrics', 'healingIndicators'],
            // Contract
            Object.keys(formData)
        ];

        const relevantFields = phaseFields[phaseIndex] || [];
        const extracted = {};

        relevantFields.forEach(field => {
            if (formData[field] !== undefined) {
                extracted[field] = formData[field];
            }
        });

        return extracted;
    }

    formatMessages(messages, provider = 'openai') {
        if (typeof messages === 'string') {
            return [{ role: 'user', content: messages }];
        }

        if (Array.isArray(messages)) {
            return messages.map(msg => {
                if (typeof msg === 'string') {
                    return { role: 'user', content: msg };
                }
                return msg;
            });
        }

        return [messages];
    }

    formatAnthropicMessages(messages) {
        return messages.map(msg => {
            // Anthropic requires specific format for messages
            if (msg.role === 'system') {
                return msg; // System messages are handled separately
            }

            return {
                role: msg.role,
                content: typeof msg.content === 'string' ?
                    msg.content :
                    JSON.stringify(msg.content)
            };
        }).filter(msg => msg.role !== 'system');
    }

    updateMetrics(startTime, success, error = null) {
        const duration = Date.now() - startTime;
        this.metrics.requestCount++;

        if (success) {
            this.metrics.averageResponseTime =
                (this.metrics.averageResponseTime * (this.metrics.requestCount - 1) + duration) /
                this.metrics.requestCount;
        } else {
            this.metrics.errors.push({
                timestamp: Date.now(),
                error: error?.message || 'Unknown error',
                duration
            });
        }

        this.metrics.successRate =
            (this.metrics.requestCount - this.metrics.errors.length) /
            this.metrics.requestCount;
    }

    recordConversation(messages, response) {
        if (this.apiConfig.isFeatureEnabled('conversationHistory')) {
            this.conversationHistory.push({
                timestamp: Date.now(),
                messages,
                response,
                phase: this.currentPhase
            });

            // Limit history size
            if (this.conversationHistory.length > 50) {
                this.conversationHistory = this.conversationHistory.slice(-50);
            }

            this.saveState();
        }
    }

    /**
     * Error Handling
     */
    handleRequestError(error, messages, options) {
        console.error('GPT request error:', error);

        // Try fallback API if available
        if (this.apiConfig.config.fallback.endpoint && !options._usedFallback) {
            console.log('Attempting fallback API...');
            return this.makeRequestWithFallback(messages, { ...options, _usedFallback: true });
        }

        // Return offline response
        return this.getOfflineResponse(messages, error);
    }

    async makeRequestWithFallback(messages, options) {
        try {
            const originalConfig = { ...this.apiConfig.config.primary };
            this.apiConfig.config.primary = { ...this.apiConfig.config.fallback };

            const response = await this.makeRequest(messages, options);

            // Restore original config
            this.apiConfig.config.primary = originalConfig;

            return response;
        } catch (error) {
            console.error('Fallback API also failed:', error);
            return this.getOfflineResponse(messages, error);
        }
    }

    getOfflineResponse(messages, error) {
        return {
            content: 'I\'m currently offline, but you can continue with the REPAIR Protocol. Your progress is being saved.',
            offline: true,
            error: error.message,
            timestamp: Date.now()
        };
    }

    handleInitializationError(error) {
        console.warn('GPT Integration running in limited mode:', error.message);

        // Set up minimal functionality
        this.isInitialized = false;
        this.offlineMode = true;

        // Provide basic analysis functions
        this.analyzePhase = (phaseIndex, formData) => this.getFallbackAnalysis(phaseIndex);
        this.provideFeedback = (fieldName) => this.getFallbackFeedback(fieldName);
        this.generateInsights = (formData, currentPhase) => this.getFallbackInsights(currentPhase);
    }

    /**
     * State Management
     */
    saveState() {
        if (typeof localStorage !== 'undefined' && this.apiConfig.isFeatureEnabled('autoSave')) {
            try {
                const state = {
                    conversationHistory: this.conversationHistory.slice(-20), // Keep last 20
                    userProfile: this.userProfile,
                    currentPhase: this.currentPhase,
                    timestamp: Date.now()
                };
                localStorage.setItem('repairGPTState', JSON.stringify(state));
            } catch (error) {
                console.warn('Failed to save state:', error);
            }
        }
    }

    loadSavedState() {
        if (typeof localStorage !== 'undefined' && this.apiConfig.isFeatureEnabled('autoSave')) {
            try {
                const saved = localStorage.getItem('repairGPTState');
                if (saved) {
                    const state = JSON.parse(saved);
                    this.conversationHistory = state.conversationHistory || [];
                    this.userProfile = state.userProfile || {};
                    this.currentPhase = state.currentPhase || 0;
                }
            } catch (error) {
                console.warn('Failed to load saved state:', error);
            }
        }
    }

    /**
     * Connection Testing
     */
    async testConnection() {
        try {
            return await this.apiConfig.testConnection('primary');
        } catch (error) {
            console.error('Connection test failed:', error);
            return { success: false, error: error.message };
        }
    }

    async checkFallbackOptions() {
        if (this.apiConfig.config.fallback.endpoint) {
            const fallbackTest = await this.apiConfig.testConnection('fallback');
            if (fallbackTest.success) {
                console.log('Fallback API available');
                return true;
            }
        }

        console.warn('No working API endpoints available, entering offline mode');
        this.offlineMode = true;
        return false;
    }

    /**
     * Public Interface Methods
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            offline: this.offlineMode,
            metrics: this.metrics,
            apiStatus: this.apiConfig.getStatus(),
            conversationLength: this.conversationHistory.length,
            currentPhase: this.currentPhase
        };
    }

    setPhase(phaseIndex) {
        this.currentPhase = phaseIndex;
        this.saveState();
    }

    clearHistory() {
        this.conversationHistory = [];
        this.analysisCache.clear();
        this.saveState();
    }

    exportConversation() {
        return {
            history: this.conversationHistory,
            userProfile: this.userProfile,
            metrics: this.metrics,
            timestamp: Date.now()
        };
    }
}

/**
 * Conversation Context Manager
 */
class ConversationContextManager {
    constructor() {
        this.contextWindows = new Map();
        this.maxContextLength = 4000; // tokens
    }

    initialize() {
        // Set up context management
    }

    getRelevantContext(currentMessages) {
        // Return relevant context messages for the current conversation
        return [];
    }

    addContext(key, value) {
        this.contextWindows.set(key, value);
    }
}

/**
 * Error Handler
 */
class ErrorHandler {
    constructor() {
        this.errorLog = [];
    }

    logError(error, context = '') {
        this.errorLog.push({
            timestamp: Date.now(),
            error: error.message,
            context,
            stack: error.stack
        });
    }

    getRecentErrors(hours = 24) {
        const cutoff = Date.now() - (hours * 60 * 60 * 1000);
        return this.errorLog.filter(entry => entry.timestamp > cutoff);
    }
}

/**
 * Retry Manager
 */
class RetryManager {
    async executeWithRetry(operation, options = {}) {
        const { maxRetries = 3, backoffMultiplier = 2, initialDelay = 1000 } = options;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                if (attempt === maxRetries) {
                    throw error;
                }

                const delay = initialDelay * Math.pow(backoffMultiplier, attempt);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GPTIntegration;
} else {
    window.GPTIntegration = GPTIntegration;
}