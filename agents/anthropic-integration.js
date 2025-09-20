/**
 * Anthropic Claude Integration Module for REPAIR Protocol
 * Provides specialized integration with Anthropic's Claude API using the Messages endpoint
 */

class AnthropicIntegration {
    constructor(apiConfig) {
        this.apiConfig = apiConfig || window.repairAPIConfig;
        this.conversationHistory = [];
        this.systemPrompt = null;
        this.isInitialized = false;

        // Anthropic-specific configuration
        this.anthropicConfig = {
            endpoint: 'https://api.anthropic.com/v1/messages',
            version: '2023-06-01',
            maxTokens: 4000,
            temperature: 0.7,
            models: {
                'claude-3-opus': 'claude-3-opus-20240229',
                'claude-3-sonnet': 'claude-3-sonnet-20240229',
                'claude-3-haiku': 'claude-3-haiku-20240307'
            }
        };

        // Safety and content filtering
        this.safetySettings = {
            enableSafetyFilters: true,
            filterThreshold: 'medium',
            logSafetyEvents: true
        };

        this.initialize();
    }

    async initialize() {
        try {
            console.log('Initializing Anthropic Claude Integration...');

            // Validate API configuration
            if (!this.apiConfig) {
                throw new Error('API configuration not available');
            }

            // Set up Anthropic-specific configuration
            this.setupAnthropicConfig();

            // Test connection
            const connectionTest = await this.testConnection();
            if (!connectionTest.success) {
                console.warn('Anthropic API connection test failed:', connectionTest.error);
            }

            // Set up system prompt for REPAIR Protocol context
            this.setSystemPrompt(this.getREPAIRSystemPrompt());

            this.isInitialized = true;
            console.log('Anthropic Claude Integration initialized successfully');

        } catch (error) {
            console.error('Failed to initialize Anthropic Integration:', error);
            this.isInitialized = false;
        }
    }

    setupAnthropicConfig() {
        // Configure the API for Anthropic if not already set
        if (this.apiConfig.config.primary.provider !== 'anthropic') {
            this.apiConfig.setProvider('anthropic', {
                endpoint: this.anthropicConfig.endpoint,
                model: this.anthropicConfig.models['claude-3-sonnet'],
                maxTokens: this.anthropicConfig.maxTokens,
                temperature: this.anthropicConfig.temperature,
                anthropicVersion: this.anthropicConfig.version
            });
        }
    }

    /**
     * Main method to send messages to Claude
     */
    async sendMessage(messages, options = {}) {
        if (!this.isInitialized) {
            throw new Error('Anthropic integration not initialized');
        }

        try {
            const formattedMessages = this.formatMessages(messages);
            const requestPayload = this.buildRequestPayload(formattedMessages, options);

            const response = await this.makeAPICall(requestPayload, options);
            const processedResponse = this.processResponse(response);

            // Update conversation history
            this.updateConversationHistory(formattedMessages, processedResponse);

            return processedResponse;

        } catch (error) {
            console.error('Error sending message to Claude:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Streaming message support
     */
    async sendStreamingMessage(messages, options = {}) {
        const streamOptions = {
            ...options,
            stream: true,
            onStreamChunk: options.onChunk || this.defaultStreamHandler.bind(this)
        };

        return this.sendMessage(messages, streamOptions);
    }

    defaultStreamHandler(chunk) {
        if (chunk.content && typeof window !== 'undefined' && window.updateStreamingContent) {
            window.updateStreamingContent(chunk.content);
        }
    }

    /**
     * REPAIR Protocol specific methods
     */
    async analyzeREPAIRPhase(phaseIndex, formData, options = {}) {
        const phaseContext = this.getPhaseContext(phaseIndex);
        const analysisPrompt = this.buildPhaseAnalysisPrompt(phaseIndex, formData, phaseContext);

        try {
            const messages = [
                { role: 'user', content: analysisPrompt }
            ];

            const response = await this.sendMessage(messages, {
                temperature: 0.6,
                maxTokens: 2000,
                ...options
            });

            return this.parsePhaseAnalysis(response.content, phaseIndex);

        } catch (error) {
            console.error(`Error analyzing REPAIR phase ${phaseIndex}:`, error);
            return this.getFallbackAnalysis(phaseIndex);
        }
    }

    async provideLiveGuidance(currentInput, phaseIndex, options = {}) {
        const guidancePrompt = this.buildGuidancePrompt(currentInput, phaseIndex);

        try {
            const response = await this.sendMessage([
                { role: 'user', content: guidancePrompt }
            ], {
                temperature: 0.7,
                maxTokens: 500,
                ...options
            });

            return {
                guidance: response.content,
                suggestions: this.extractSuggestions(response.content),
                quality: this.assessInputQuality(currentInput, phaseIndex),
                timestamp: Date.now()
            };

        } catch (error) {
            console.error('Error providing live guidance:', error);
            return this.getFallbackGuidance(phaseIndex);
        }
    }

    async detectBiasAndTone(content, context = '') {
        const biasPrompt = this.buildBiasDetectionPrompt(content, context);

        try {
            const response = await this.sendMessage([
                { role: 'user', content: biasPrompt }
            ], {
                temperature: 0.3,
                maxTokens: 600
            });

            return this.parseBiasAnalysis(response.content);

        } catch (error) {
            console.error('Error detecting bias and tone:', error);
            return {
                biasLevel: 'unknown',
                toneAssessment: 'neutral',
                suggestions: ['Review your language for objectivity'],
                timestamp: Date.now()
            };
        }
    }

    async generateConversationContext(currentPhase, formData) {
        const contextPrompt = this.buildContextPrompt(currentPhase, formData);

        try {
            const response = await this.sendMessage([
                { role: 'user', content: contextPrompt }
            ], {
                temperature: 0.8,
                maxTokens: 800
            });

            return {
                context: response.content,
                insights: this.extractInsights(response.content),
                recommendations: this.extractRecommendations(response.content),
                timestamp: Date.now()
            };

        } catch (error) {
            console.error('Error generating conversation context:', error);
            return this.getFallbackContext(currentPhase);
        }
    }

    /**
     * Message formatting and processing methods
     */
    formatMessages(messages) {
        if (typeof messages === 'string') {
            return [{ role: 'user', content: messages }];
        }

        if (Array.isArray(messages)) {
            return messages.map(msg => {
                if (typeof msg === 'string') {
                    return { role: 'user', content: msg };
                }

                // Ensure valid roles for Anthropic
                const validRoles = ['user', 'assistant'];
                if (!validRoles.includes(msg.role)) {
                    return { role: 'user', content: msg.content || String(msg) };
                }

                return {
                    role: msg.role,
                    content: typeof msg.content === 'string' ?
                        msg.content :
                        JSON.stringify(msg.content)
                };
            });
        }

        return [{ role: 'user', content: String(messages) }];
    }

    buildRequestPayload(messages, options = {}) {
        const config = this.apiConfig.config.primary;

        const payload = {
            model: options.model || config.model || this.anthropicConfig.models['claude-3-sonnet'],
            max_tokens: options.maxTokens || config.maxTokens || this.anthropicConfig.maxTokens,
            temperature: options.temperature !== undefined ?
                options.temperature :
                (config.temperature || this.anthropicConfig.temperature),
            messages: messages
        };

        // Add system prompt if available
        if (this.systemPrompt) {
            payload.system = this.systemPrompt;
        }

        // Add streaming if requested
        if (options.stream) {
            payload.stream = true;
        }

        // Add additional Anthropic-specific parameters
        if (options.stop_sequences) {
            payload.stop_sequences = options.stop_sequences;
        }

        if (options.top_p !== undefined) {
            payload.top_p = options.top_p;
        }

        if (options.top_k !== undefined) {
            payload.top_k = options.top_k;
        }

        return payload;
    }

    async makeAPICall(payload, options = {}) {
        const endpoint = this.apiConfig.getEndpointConfig('primary');

        const response = await fetch(endpoint.url, {
            method: 'POST',
            headers: endpoint.headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Anthropic API request failed: ${response.status} - ${errorData}`);
        }

        // Handle streaming responses
        if (payload.stream && options.onStreamChunk) {
            return this.handleStreamingResponse(response, options.onStreamChunk);
        }

        return await response.json();
    }

    async handleStreamingResponse(response, onChunk) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n').filter(line => line.trim());

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);

                        try {
                            const parsed = JSON.parse(data);

                            if (parsed.type === 'content_block_delta') {
                                const deltaText = parsed.delta?.text || '';
                                fullContent += deltaText;

                                onChunk({
                                    content: fullContent,
                                    delta: deltaText,
                                    done: false,
                                    type: parsed.type
                                });
                            } else if (parsed.type === 'message_stop') {
                                onChunk({
                                    content: fullContent,
                                    done: true,
                                    type: parsed.type
                                });
                                break;
                            }
                        } catch (parseError) {
                            console.warn('Failed to parse streaming chunk:', parseError);
                        }
                    }
                }
            }

            return {
                content: [{ text: fullContent, type: 'text' }],
                stop_reason: 'end_turn',
                model: response.headers.get('anthropic-model'),
                usage: null // Usage info comes in the message_stop event
            };

        } finally {
            reader.releaseLock();
        }
    }

    processResponse(response) {
        try {
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

        } catch (error) {
            console.error('Error processing Anthropic response:', error);
            return {
                content: 'Sorry, I encountered an error processing the response.',
                error: error.message,
                timestamp: Date.now()
            };
        }
    }

    /**
     * System prompt and context management
     */
    setSystemPrompt(prompt) {
        this.systemPrompt = prompt;
    }

    getREPAIRSystemPrompt() {
        return `You are an AI assistant specialized in the REPAIR Protocol for meaningful apologies and relationship restoration. Your role is to provide expert guidance, analysis, and support throughout the 8-phase process.

REPAIR Protocol Phases:
1. **Responsibility** - Acknowledge what happened without deflection
2. **Empathy** - Understand and validate the impact on others
3. **Sincerity** - Express genuine remorse and commitment
4. **Accountability** - Take full ownership without excuses
5. **Impact** - Recognize all effects of actions
6. **Repair** - Propose meaningful amends and changes
7. **Relationship** - Focus on rebuilding trust
8. **Protocol** - Complete the process with commitment

Core Principles:
- **Authenticity**: Encourage genuine, heartfelt responses
- **Specificity**: Help users be concrete and detailed
- **Growth-oriented**: Focus on learning and positive change
- **Bias-aware**: Help identify and correct cognitive biases
- **Empathetic**: Always validate emotions while encouraging growth
- **Non-judgmental**: Provide supportive guidance without criticism

Your responses should be:
- Clear and actionable
- Emotionally intelligent
- Focused on personal growth
- Respectful of all parties involved
- Designed to facilitate genuine healing

Remember: The goal is authentic reconciliation and positive personal development.`;
    }

    updateConversationHistory(messages, response) {
        this.conversationHistory.push({
            timestamp: Date.now(),
            messages: messages,
            response: response,
            model: response.model
        });

        // Keep only last 20 conversations to manage memory
        if (this.conversationHistory.length > 20) {
            this.conversationHistory = this.conversationHistory.slice(-20);
        }
    }

    /**
     * Prompt building methods for REPAIR Protocol
     */
    getPhaseContext(phaseIndex) {
        const phases = [
            'Assessment and Readiness',
            'Recognition and Responsibility',
            'Examination of Impact',
            'Preparation for Amends',
            'Articulation of Apology',
            'Implementation of Changes',
            'Restoration of Trust',
            'Contract Completion'
        ];

        return {
            name: phases[phaseIndex] || 'Unknown Phase',
            index: phaseIndex,
            total: phases.length
        };
    }

    buildPhaseAnalysisPrompt(phaseIndex, formData, phaseContext) {
        return `Analyze this ${phaseContext.name} phase (${phaseIndex + 1}/${phaseContext.total}) of the REPAIR Protocol:

**Form Data:**
${JSON.stringify(formData, null, 2)}

**Analysis Requirements:**
1. Evaluate completeness and authenticity
2. Identify strengths and areas for improvement
3. Check for cognitive biases or defensive language
4. Assess emotional intelligence and empathy
5. Provide specific, actionable feedback

**Response Format:**
Please provide a JSON response with:
{
    "phase": "${phaseContext.name}",
    "scores": {
        "completeness": 0.0-1.0,
        "authenticity": 0.0-1.0,
        "empathy": 0.0-1.0,
        "specificity": 0.0-1.0,
        "overall": 0.0-1.0
    },
    "strengths": ["strength1", "strength2"],
    "improvements": ["improvement1", "improvement2"],
    "biasDetected": ["bias1", "bias2"],
    "recommendations": ["rec1", "rec2"],
    "status": "needs_work|good|excellent"
}`;
    }

    buildGuidancePrompt(currentInput, phaseIndex) {
        const phaseContext = this.getPhaseContext(phaseIndex);

        return `Provide real-time guidance for this ${phaseContext.name} input:

**Current Input:** "${currentInput}"

**Phase Context:** ${phaseContext.name} (${phaseIndex + 1}/8)

Please provide brief, constructive feedback focusing on:
1. Emotional authenticity
2. Specificity and clarity
3. Potential bias or defensive language
4. Suggestions for improvement

Keep response under 100 words and focus on the most important feedback.`;
    }

    buildBiasDetectionPrompt(content, context) {
        return `Analyze this content for cognitive biases common in apologies:

**Content:** "${content}"
**Context:** "${context}"

**Biases to detect:**
- Minimization ("it wasn't that bad")
- Intent fallacy ("I didn't mean to")
- Comparative bias ("others do worse")
- Victim blaming ("they're overreacting")
- Self-pity ("I'm suffering too")
- Deflection ("but you also...")

**Response format (JSON):**
{
    "biasLevel": "none|low|medium|high",
    "detectedBiases": ["bias1", "bias2"],
    "toneAssessment": "defensive|neutral|apologetic|authentic",
    "improvements": ["suggestion1", "suggestion2"],
    "reframedVersion": "improved version if needed"
}`;
    }

    buildContextPrompt(currentPhase, formData) {
        return `Generate helpful context and insights for the REPAIR Protocol process:

**Current Phase:** ${currentPhase + 1}/8
**Progress Data:** ${JSON.stringify(formData, null, 2)}

Provide insights focusing on:
1. Progress patterns and trends
2. Potential challenges ahead
3. Strengths to build upon
4. Specific next steps
5. Emotional considerations

Format as helpful, encouraging guidance that promotes growth and genuine reconciliation.`;
    }

    /**
     * Response parsing and analysis methods
     */
    parsePhaseAnalysis(content) {
        try {
            const parsed = JSON.parse(content);
            return {
                ...parsed,
                timestamp: Date.now(),
                source: 'anthropic-claude'
            };
        } catch (error) {
            console.error('Error parsing phase analysis:', error);
            return this.createFallbackAnalysis();
        }
    }

    parseBiasAnalysis(content) {
        try {
            return JSON.parse(content);
        } catch (error) {
            return {
                biasLevel: 'unknown',
                detectedBiases: [],
                toneAssessment: 'neutral',
                improvements: ['Review language for objectivity'],
                timestamp: Date.now()
            };
        }
    }

    extractSuggestions(content) {
        // Extract actionable suggestions from response
        const suggestionPatterns = [
            /suggest[^.]*[.]/gi,
            /consider[^.]*[.]/gi,
            /try[^.]*[.]/gi,
            /could[^.]*[.]/gi
        ];

        const suggestions = [];
        suggestionPatterns.forEach(pattern => {
            const matches = content.match(pattern);
            if (matches) {
                suggestions.push(...matches);
            }
        });

        return suggestions.slice(0, 3); // Limit to top 3 suggestions
    }

    extractInsights(content) {
        // Extract key insights from the response
        const lines = content.split('\n').filter(line => line.trim());
        return lines.filter(line =>
            line.includes('insight') ||
            line.includes('important') ||
            line.includes('notice')
        ).slice(0, 3);
    }

    extractRecommendations(content) {
        // Extract recommendations from the response
        const lines = content.split('\n').filter(line => line.trim());
        return lines.filter(line =>
            line.includes('recommend') ||
            line.includes('should') ||
            line.includes('next step')
        ).slice(0, 3);
    }

    assessInputQuality(input, phaseIndex) {
        // Simple quality assessment based on length and keywords
        const wordCount = input.split(' ').length;
        const hasSpecificDetails = /\b(specific|particular|exactly|precisely)\b/i.test(input);
        const hasEmotionalLanguage = /\b(feel|felt|sorry|regret|understand)\b/i.test(input);

        let score = 0;
        if (wordCount > 10) score += 0.3;
        if (wordCount > 25) score += 0.2;
        if (hasSpecificDetails) score += 0.3;
        if (hasEmotionalLanguage) score += 0.2;

        return {
            score: Math.min(score, 1.0),
            wordCount: wordCount,
            hasSpecificity: hasSpecificDetails,
            hasEmotion: hasEmotionalLanguage
        };
    }

    /**
     * Fallback methods for error handling
     */
    getFallbackAnalysis(phaseIndex) {
        const phaseNames = ['Assessment', 'Recognition', 'Examination', 'Preparation', 'Articulation', 'Implementation', 'Restoration', 'Contract'];

        return {
            phase: phaseNames[phaseIndex] || 'Unknown',
            scores: {
                completeness: 0.5,
                authenticity: 0.5,
                empathy: 0.5,
                specificity: 0.5,
                overall: 0.5
            },
            strengths: ['You are working through the process'],
            improvements: ['Continue being honest and specific'],
            biasDetected: [],
            recommendations: ['Take your time with each response'],
            status: 'needs_work',
            fallback: true,
            timestamp: Date.now()
        };
    }

    getFallbackGuidance(phaseIndex) {
        const guidance = [
            'Focus on being completely honest about what happened',
            'Take responsibility without making excuses',
            'Consider all the ways your actions affected others',
            'Plan specific, meaningful ways to make amends',
            'Express your apology clearly and sincerely',
            'Follow through consistently on your commitments',
            'Be patient as trust is rebuilt over time',
            'Review and commit to your complete agreement'
        ];

        return {
            guidance: guidance[phaseIndex] || 'Continue working through the process',
            suggestions: ['Be specific and honest in your responses'],
            quality: { score: 0.5 },
            timestamp: Date.now()
        };
    }

    getFallbackContext(currentPhase) {
        return {
            context: 'Continue working through the REPAIR Protocol step by step.',
            insights: ['Each phase builds on the previous ones'],
            recommendations: ['Take time to reflect on your responses'],
            timestamp: Date.now()
        };
    }

    createFallbackAnalysis() {
        return {
            phase: 'Analysis',
            scores: { overall: 0.5 },
            insights: ['Continue working on your response'],
            suggestions: ['Be specific and honest'],
            warnings: [],
            status: 'needs_improvement',
            fallback: true,
            timestamp: Date.now()
        };
    }

    /**
     * Error handling
     */
    handleError(error) {
        const anthropicErrors = {
            400: 'Invalid request format',
            401: 'Authentication failed - check your API key',
            403: 'Forbidden - insufficient permissions',
            429: 'Rate limit exceeded - please wait before retrying',
            500: 'Anthropic server error - please try again later'
        };

        const statusCode = error.message.match(/(\d{3})/)?.[1];
        const friendlyMessage = anthropicErrors[statusCode] || error.message;

        return new Error(`Anthropic API Error: ${friendlyMessage}`);
    }

    /**
     * Connection testing
     */
    async testConnection() {
        try {
            const testPayload = {
                model: this.anthropicConfig.models['claude-3-haiku'],
                max_tokens: 10,
                messages: [{ role: 'user', content: 'Test' }]
            };

            const response = await this.makeAPICall(testPayload);

            return {
                success: true,
                model: response.model,
                latency: Date.now()
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Utility methods
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            provider: 'anthropic',
            model: this.apiConfig?.config?.primary?.model,
            conversationLength: this.conversationHistory.length,
            systemPrompt: !!this.systemPrompt,
            safetyEnabled: this.safetySettings.enableSafetyFilters
        };
    }

    clearHistory() {
        this.conversationHistory = [];
    }

    exportConversation() {
        return {
            provider: 'anthropic',
            history: this.conversationHistory,
            systemPrompt: this.systemPrompt,
            timestamp: Date.now()
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnthropicIntegration;
} else {
    window.AnthropicIntegration = AnthropicIntegration;
}