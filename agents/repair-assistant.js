/**
 * Enhanced REPAIR Protocol Assistant
 * Provides specialized AI coaching and guidance throughout the reconciliation process
 */

class REPAIRAssistant {
    constructor(gptIntegration, apiConfig) {
        this.gpt = gptIntegration;
        this.apiConfig = apiConfig;
        this.conversationManager = new ConversationManager();
        this.progressTracker = new ProgressTracker();
        this.safetyProtocol = new SafetyProtocol();
        this.contentFilter = new ContentFilter();

        // Assistant state
        this.currentSession = null;
        this.userProfile = {};
        this.conversationHistory = [];
        this.activeCoaching = false;

        // Specialized prompts for each phase
        this.phasePrompts = this.initializePhasePrompts();
        this.coachingStrategies = this.initializeCoachingStrategies();

        this.initialize();
    }

    async initialize() {
        console.log('Initializing REPAIR Assistant...');

        try {
            // Initialize safety protocols
            await this.safetyProtocol.initialize();

            // Set up conversation management
            this.conversationManager.initialize();

            // Load user profile if available
            this.loadUserProfile();

            console.log('REPAIR Assistant initialized successfully');

        } catch (error) {
            console.error('Failed to initialize REPAIR Assistant:', error);
        }
    }

    /**
     * Main Coaching Interface
     */
    async startCoachingSession(formData, currentPhase) {
        this.currentSession = {
            id: this.generateSessionId(),
            startTime: Date.now(),
            phase: currentPhase,
            formData: { ...formData },
            interactions: [],
            status: 'active'
        };

        this.activeCoaching = true;

        // Initial assessment
        const initialGuidance = await this.providePhaseGuidance(currentPhase, formData);

        // Start conversation
        const welcomeMessage = this.createWelcomeMessage(currentPhase);

        this.recordInteraction('system', welcomeMessage);
        this.recordInteraction('system', initialGuidance);

        return {
            sessionId: this.currentSession.id,
            message: welcomeMessage,
            guidance: initialGuidance,
            suggestedActions: this.getSuggestedActions(currentPhase)
        };
    }

    async chat(userMessage, context = {}) {
        if (!this.activeCoaching) {
            return { error: 'No active coaching session. Please start a session first.' };
        }

        try {
            // Safety check
            const safetyCheck = await this.safetyProtocol.checkMessage(userMessage);
            if (!safetyCheck.safe) {
                return this.handleSafetyIssue(safetyCheck);
            }

            // Content filtering
            const filteredMessage = this.contentFilter.process(userMessage);

            // Record user input
            this.recordInteraction('user', filteredMessage);

            // Analyze message context
            const messageAnalysis = await this.analyzeUserMessage(filteredMessage, context);

            // Generate contextual response
            const response = await this.generateCoachingResponse(filteredMessage, messageAnalysis, context);

            // Record assistant response
            this.recordInteraction('assistant', response.content);

            // Update progress tracking
            this.progressTracker.updateProgress(this.currentSession.phase, messageAnalysis);

            return {
                content: response.content,
                suggestions: response.suggestions,
                insights: response.insights,
                nextSteps: response.nextSteps,
                emotionalSupport: response.emotionalSupport,
                progressUpdate: this.progressTracker.getProgress()
            };

        } catch (error) {
            console.error('Error in chat:', error);
            return this.handleChatError(error);
        }
    }

    async providePhaseGuidance(phaseIndex, formData) {
        const phaseData = this.getPhaseData(phaseIndex);
        const prompt = this.buildPhaseGuidancePrompt(phaseData, formData);

        try {
            const response = await this.gpt.makeRequest([
                { role: 'system', content: this.getSystemPrompt('phase_guidance') },
                { role: 'user', content: prompt }
            ], {
                temperature: 0.7,
                maxTokens: 1000
            });

            return this.parseGuidanceResponse(response.content, phaseIndex);

        } catch (error) {
            console.error('Error providing phase guidance:', error);
            return this.getFallbackGuidance(phaseIndex);
        }
    }

    async analyzeUserProgress(formData, currentPhase) {
        const progressPrompt = this.buildProgressAnalysisPrompt(formData, currentPhase);

        try {
            const response = await this.gpt.makeRequest([
                { role: 'system', content: this.getSystemPrompt('progress_analysis') },
                { role: 'user', content: progressPrompt }
            ], {
                temperature: 0.6,
                maxTokens: 800
            });

            const analysis = this.parseProgressAnalysis(response.content);

            // Update user profile with insights
            this.updateUserProfile(analysis);

            return analysis;

        } catch (error) {
            console.error('Error analyzing progress:', error);
            return this.getFallbackProgressAnalysis(currentPhase);
        }
    }

    async provideDifficultySupport(challenge, context) {
        const supportPrompt = this.buildSupportPrompt(challenge, context);

        try {
            const response = await this.gpt.makeRequest([
                { role: 'system', content: this.getSystemPrompt('difficulty_support') },
                { role: 'user', content: supportPrompt }
            ], {
                temperature: 0.8,
                maxTokens: 600
            });

            return this.parseSupportResponse(response.content);

        } catch (error) {
            console.error('Error providing support:', error);
            return this.getFallbackSupport(challenge);
        }
    }

    /**
     * Specialized Coaching Methods
     */
    async coachEmotionalExpression(content, targetPhase) {
        const emotionalPrompt = `Help the user improve their emotional expression for the REPAIR Protocol ${this.getPhaseData(targetPhase).name} phase:

CURRENT CONTENT: "${content}"

COACHING FOCUS:
1. Emotional authenticity and depth
2. Appropriate vulnerability and openness
3. Respectful acknowledgment of harm
4. Genuine remorse expression
5. Avoiding emotional manipulation

Provide specific, actionable coaching in a supportive tone that helps them express genuine emotions appropriately.`;

        try {
            const response = await this.gpt.makeRequest([
                { role: 'system', content: this.getSystemPrompt('emotional_coaching') },
                { role: 'user', content: emotionalPrompt }
            ], {
                temperature: 0.7,
                maxTokens: 500
            });

            return this.parseCoachingResponse(response.content, 'emotional');

        } catch (error) {
            return this.getFallbackEmotionalCoaching();
        }
    }

    async coachCommunicationSkills(content, recipient) {
        const communicationPrompt = `Coach the user on effective communication for their REPAIR Protocol apology:

CONTENT TO IMPROVE: "${content}"
RECIPIENT CONTEXT: "${recipient}"

COACHING AREAS:
1. Clear, specific language
2. Non-defensive communication
3. Active listening preparation
4. Respectful tone and approach
5. Cultural sensitivity considerations

Provide communication coaching that helps them express themselves clearly and respectfully.`;

        try {
            const response = await this.gpt.makeRequest([
                { role: 'system', content: this.getSystemPrompt('communication_coaching') },
                { role: 'user', content: communicationPrompt }
            ], {
                temperature: 0.6,
                maxTokens: 500
            });

            return this.parseCoachingResponse(response.content, 'communication');

        } catch (error) {
            return this.getFallbackCommunicationCoaching();
        }
    }

    async coachBiasRecognition(content, detectedBiases) {
        const biasPrompt = `Help the user recognize and address cognitive biases in their REPAIR Protocol responses:

CONTENT WITH BIASES: "${content}"
DETECTED BIASES: ${JSON.stringify(detectedBiases)}

COACHING APPROACH:
1. Gentle bias awareness education
2. Specific examples from their content
3. Alternative perspective suggestions
4. Self-reflection prompting questions
5. Bias mitigation strategies

Provide supportive coaching that helps them see and address their biases without shame or defensiveness.`;

        try {
            const response = await this.gpt.makeRequest([
                { role: 'system', content: this.getSystemPrompt('bias_coaching') },
                { role: 'user', content: biasPrompt }
            ], {
                temperature: 0.7,
                maxTokens: 600
            });

            return this.parseCoachingResponse(response.content, 'bias');

        } catch (error) {
            return this.getFallbackBiasCoaching();
        }
    }

    /**
     * Real-time Analysis and Feedback
     */
    async analyzeUserMessage(message, context) {
        try {
            // Emotional state analysis
            const emotionalState = await this.analyzeEmotionalState(message);

            // Readiness assessment
            const readiness = this.assessReadiness(message, context);

            // Challenge identification
            const challenges = this.identifyChallenges(message, context);

            // Progress indicators
            const progressIndicators = this.extractProgressIndicators(message);

            return {
                emotionalState,
                readiness,
                challenges,
                progressIndicators,
                timestamp: Date.now()
            };

        } catch (error) {
            console.error('Error analyzing user message:', error);
            return { error: error.message };
        }
    }

    async generateCoachingResponse(message, analysis, context) {
        const coachingPrompt = this.buildCoachingPrompt(message, analysis, context);

        try {
            const response = await this.gpt.makeRequest([
                { role: 'system', content: this.getSystemPrompt('coaching_response') },
                { role: 'user', content: coachingPrompt }
            ], {
                temperature: 0.7,
                maxTokens: 800
            });

            return this.parseCoachingFullResponse(response.content);

        } catch (error) {
            console.error('Error generating coaching response:', error);
            return this.getFallbackCoachingResponse(message);
        }
    }

    /**
     * System Prompts
     */
    getSystemPrompt(type) {
        const prompts = {
            phase_guidance: `You are a specialized REPAIR Protocol coach helping users navigate relationship reconciliation. Your role is to provide clear, compassionate guidance for each phase of the process.

CORE PRINCIPLES:
- Prioritize safety and respect for all parties
- Encourage genuine accountability without shame
- Support authentic emotional expression
- Guide users toward meaningful change
- Maintain hope while being realistic

COMMUNICATION STYLE:
- Warm, supportive, and non-judgmental
- Clear and specific in guidance
- Culturally sensitive and inclusive
- Encouraging yet honest about challenges
- Professional but approachable

Always focus on helping users create genuine, lasting positive change in their relationships.`,

            progress_analysis: `You are analyzing user progress through the REPAIR Protocol. Your analysis should be thorough, constructive, and encouraging while identifying areas for improvement.

ANALYSIS FOCUS:
- Authenticity and sincerity of responses
- Completeness and depth of reflection
- Evidence of genuine understanding
- Realistic commitment to change
- Emotional appropriateness and maturity

Provide actionable insights that help users improve their reconciliation process.`,

            difficulty_support: `You are providing specialized support for users facing challenges in their REPAIR Protocol journey. Offer compassionate, practical help while maintaining appropriate boundaries.

SUPPORT APPROACH:
- Validate their struggles while encouraging progress
- Provide concrete coping strategies
- Suggest alternative perspectives
- Recommend professional resources when appropriate
- Maintain focus on relationship healing goals

Help users navigate difficulties while staying committed to the reconciliation process.`,

            emotional_coaching: `You are coaching users on healthy emotional expression within the REPAIR Protocol framework. Help them express genuine emotions appropriately and effectively.

COACHING FOCUS:
- Authentic vulnerability without manipulation
- Appropriate emotional boundaries
- Respectful expression of remorse
- Balanced emotional processing
- Effective emotional communication

Guide users toward genuine, healing-focused emotional expression.`,

            communication_coaching: `You are coaching effective communication skills for reconciliation and apology. Help users communicate clearly, respectfully, and effectively.

COMMUNICATION PRINCIPLES:
- Clear, specific, and honest expression
- Non-defensive listening and responding
- Respectful tone and language
- Cultural and contextual sensitivity
- Focus on understanding and healing

Coach users to communicate in ways that promote understanding and healing.`,

            bias_coaching: `You are helping users recognize and address cognitive biases that interfere with genuine reconciliation. Approach this sensitively while promoting self-awareness.

BIAS COACHING APPROACH:
- Gentle awareness-building without shame
- Specific examples and alternatives
- Self-reflection prompting questions
- Practical bias mitigation strategies
- Encouragement of objective perspective

Help users see and address their biases with compassion and practical guidance.`,

            coaching_response: `You are having an ongoing coaching conversation with someone working through the REPAIR Protocol. Respond with empathy, practical guidance, and encouragement.

CONVERSATION GUIDELINES:
- Build on previous interactions
- Address their specific concerns and questions
- Provide actionable next steps
- Offer emotional support and validation
- Maintain focus on relationship healing

Create responses that feel like a supportive, knowledgeable coach who cares about their success.`
        };

        return prompts[type] || prompts.coaching_response;
    }

    /**
     * Prompt Building Methods
     */
    buildPhaseGuidancePrompt(phaseData, formData) {
        return `Provide comprehensive guidance for the ${phaseData.name} phase of the REPAIR Protocol:

PHASE DESCRIPTION: ${phaseData.description}
KEY OBJECTIVES: ${phaseData.objectives.join(', ')}

CURRENT USER DATA: ${JSON.stringify(this.extractRelevantData(formData, phaseData.phase), null, 2)}

USER PROFILE: ${JSON.stringify(this.userProfile, null, 2)}

Please provide:
1. Clear guidance for this phase
2. Specific action steps
3. Common challenges and how to address them
4. Success indicators to look for
5. Encouragement and motivation

Format as structured guidance that helps them succeed in this phase.`;
    }

    buildProgressAnalysisPrompt(formData, currentPhase) {
        return `Analyze the user's progress through the REPAIR Protocol:

CURRENT PHASE: ${currentPhase + 1}/8 (${this.getPhaseData(currentPhase).name})
FORM DATA: ${JSON.stringify(formData, null, 2)}
SESSION HISTORY: ${JSON.stringify(this.currentSession?.interactions?.slice(-5) || [], null, 2)}

Provide analysis of:
1. Overall progress quality and authenticity
2. Areas of strength and growth
3. Potential challenges ahead
4. Specific improvement recommendations
5. Emotional readiness assessment

Focus on constructive insights that support their reconciliation journey.`;
    }

    buildSupportPrompt(challenge, context) {
        return `Provide specialized support for this reconciliation challenge:

CHALLENGE: "${challenge}"
CONTEXT: ${JSON.stringify(context, null, 2)}
USER PROFILE: ${JSON.stringify(this.userProfile, null, 2)}

Support needed for:
1. Emotional processing and coping
2. Practical problem-solving strategies
3. Alternative perspectives and approaches
4. Professional resource recommendations if appropriate
5. Encouragement and motivation to continue

Offer compassionate, practical support that helps them move forward constructively.`;
    }

    buildCoachingPrompt(message, analysis, context) {
        return `Respond to this user message as their REPAIR Protocol coach:

USER MESSAGE: "${message}"
MESSAGE ANALYSIS: ${JSON.stringify(analysis, null, 2)}
CURRENT CONTEXT: ${JSON.stringify(context, null, 2)}
SESSION HISTORY: ${JSON.stringify(this.getRecentInteractions(3), null, 2)}

Provide a coaching response that:
1. Acknowledges their message and feelings
2. Offers specific, actionable guidance
3. Addresses any challenges or concerns
4. Provides emotional support and validation
5. Suggests concrete next steps
6. Maintains focus on relationship healing

Respond as a supportive coach who understands their situation and wants to help them succeed.`;
    }

    /**
     * Response Parsing Methods
     */
    parseGuidanceResponse(content, phaseIndex) {
        try {
            // Attempt to parse as JSON first
            const parsed = JSON.parse(content);
            return {
                type: 'structured',
                phase: phaseIndex,
                ...parsed,
                timestamp: Date.now()
            };
        } catch (error) {
            // Parse as natural language
            return {
                type: 'natural',
                phase: phaseIndex,
                content: content,
                guidance: this.extractGuidanceFromText(content),
                timestamp: Date.now()
            };
        }
    }

    parseProgressAnalysis(content) {
        try {
            return JSON.parse(content);
        } catch (error) {
            return {
                overall: 'Unable to analyze at this time',
                strengths: ['Continuing with the process'],
                challenges: ['Communication with AI temporarily limited'],
                recommendations: ['Continue working through each phase carefully']
            };
        }
    }

    parseCoachingResponse(content, type) {
        return {
            type: type,
            content: content,
            actionItems: this.extractActionItems(content),
            insights: this.extractInsights(content),
            timestamp: Date.now()
        };
    }

    parseCoachingFullResponse(content) {
        try {
            const parsed = JSON.parse(content);
            return {
                content: parsed.response || content,
                suggestions: parsed.suggestions || [],
                insights: parsed.insights || [],
                nextSteps: parsed.nextSteps || [],
                emotionalSupport: parsed.emotionalSupport || '',
                timestamp: Date.now()
            };
        } catch (error) {
            return {
                content: content,
                suggestions: this.extractSuggestions(content),
                insights: this.extractInsights(content),
                nextSteps: this.extractNextSteps(content),
                emotionalSupport: this.extractEmotionalSupport(content),
                timestamp: Date.now()
            };
        }
    }

    /**
     * Phase Data and Configuration
     */
    initializePhasePrompts() {
        return {
            0: { // Assessment
                name: 'Initial Assessment',
                description: 'Understanding the situation and readiness for reconciliation',
                objectives: ['Assess harm severity', 'Evaluate readiness', 'Gather basic information'],
                coachingFocus: ['Honesty', 'Self-awareness', 'Commitment preparation']
            },
            1: { // Recognize
                name: 'Recognition',
                description: 'Acknowledging harm and accepting responsibility',
                objectives: ['Identify specific harmful actions', 'Accept responsibility', 'Recognize impact'],
                coachingFocus: ['Bias awareness', 'Emotional validation', 'Authentic acknowledgment']
            },
            2: { // Examine
                name: 'Examination',
                description: 'Deep analysis of impacts and implications',
                objectives: ['Understand direct impacts', 'Identify secondary effects', 'Recognize patterns'],
                coachingFocus: ['Comprehensive thinking', 'Empathy building', 'Systems awareness']
            },
            3: { // Prepare
                name: 'Preparation',
                description: 'Planning meaningful amends and changes',
                objectives: ['Develop acknowledgment statement', 'Plan specific changes', 'Design amends'],
                coachingFocus: ['Authenticity', 'Specificity', 'Realistic commitment']
            },
            4: { // Articulate
                name: 'Articulation',
                description: 'Expressing sincere, complete apology',
                objectives: ['Craft clear apology', 'Ensure completeness', 'Prepare for delivery'],
                coachingFocus: ['Emotional expression', 'Communication skills', 'Respectful delivery']
            },
            5: { // Implement
                name: 'Implementation',
                description: 'Following through on commitments consistently',
                objectives: ['Execute immediate actions', 'Begin long-term changes', 'Track progress'],
                coachingFocus: ['Consistency', 'Accountability', 'Adaptation']
            },
            6: { // Restore
                name: 'Restoration',
                description: 'Rebuilding trust and healing relationships',
                objectives: ['Demonstrate change', 'Rebuild trust', 'Support healing'],
                coachingFocus: ['Patience', 'Persistence', 'Relationship skills']
            },
            7: { // Contract
                name: 'Contract Completion',
                description: 'Finalizing formal agreement and ongoing commitment',
                objectives: ['Review completeness', 'Commit formally', 'Plan ongoing support'],
                coachingFocus: ['Commitment', 'Long-term planning', 'Support systems']
            }
        };
    }

    initializeCoachingStrategies() {
        return {
            emotional_blocks: {
                identification: ['Resistance to vulnerability', 'Fear of judgment', 'Overwhelming guilt'],
                strategies: ['Graduated exposure', 'Safety building', 'Emotional regulation']
            },
            communication_challenges: {
                identification: ['Defensive responses', 'Unclear expression', 'Cultural barriers'],
                strategies: ['Active listening training', 'Clarity exercises', 'Cultural competency']
            },
            commitment_issues: {
                identification: ['Unrealistic promises', 'Vague commitments', 'Follow-through concerns'],
                strategies: ['SMART goal setting', 'Accountability systems', 'Support network building']
            }
        };
    }

    getPhaseData(phaseIndex) {
        return this.phasePrompts[phaseIndex] || {
            name: 'Unknown Phase',
            description: 'Phase information not available',
            objectives: ['Continue with the process'],
            coachingFocus: ['General guidance']
        };
    }

    /**
     * Utility Methods
     */
    createWelcomeMessage(phase) {
        const phaseData = this.getPhaseData(phase);
        return `Welcome to your REPAIR Protocol coaching session!

I'm here to support you through the ${phaseData.name} phase. This is an important step in your reconciliation journey, focusing on ${phaseData.description.toLowerCase()}.

I'm here to help you:
• Navigate challenges with compassion and wisdom
• Develop authentic, healing-focused responses
• Build skills for meaningful reconciliation
• Stay motivated throughout the process

How can I support you today? Feel free to share any questions, concerns, or areas where you'd like guidance.`;
    }

    getSuggestedActions(phase) {
        const suggestions = [
            // Assessment
            ['Reflect honestly on what happened', 'Consider the full impact of your actions', 'Assess your genuine readiness'],
            // Recognize
            ['Identify specific harmful behaviors', 'Practice accepting responsibility', 'Check for defensive thinking'],
            // Examine
            ['Map out all affected parties', 'Consider ripple effects', 'Look for behavioral patterns'],
            // Prepare
            ['Draft your acknowledgment statement', 'Plan specific changes', 'Design meaningful amends'],
            // Articulate
            ['Practice your apology aloud', 'Prepare for emotional responses', 'Focus on delivery timing'],
            // Implement
            ['Begin immediate corrective actions', 'Set up accountability systems', 'Track your progress'],
            // Restore
            ['Demonstrate consistent change', 'Be patient with healing timeline', 'Support the healing process'],
            // Contract
            ['Review all commitments carefully', 'Plan ongoing support', 'Celebrate your progress']
        ];

        return suggestions[phase] || ['Continue working through the process'];
    }

    extractRelevantData(formData, phase) {
        const phaseFields = [
            ['harmDescription', 'affectedParty', 'harmSeverity', 'readiness'],
            ['specificActions', 'responsibility', 'emotionalImpact'],
            ['directImpacts', 'secondaryEffects', 'systemicImplications'],
            ['acknowledgmentStatement', 'changeCommitment', 'amendsProposal'],
            ['apologyText'],
            ['immediateActions', 'longTermChanges', 'progressCheckins'],
            ['trustMetrics', 'healingIndicators'],
            Object.keys(formData)
        ];

        const relevant = {};
        const fields = phaseFields[phase] || [];

        fields.forEach(field => {
            if (formData[field]) {
                relevant[field] = formData[field];
            }
        });

        return relevant;
    }

    recordInteraction(role, content) {
        if (this.currentSession) {
            this.currentSession.interactions.push({
                role,
                content,
                timestamp: Date.now()
            });

            // Limit interaction history
            if (this.currentSession.interactions.length > 100) {
                this.currentSession.interactions = this.currentSession.interactions.slice(-100);
            }
        }
    }

    getRecentInteractions(count = 5) {
        if (!this.currentSession?.interactions) return [];
        return this.currentSession.interactions.slice(-count);
    }

    generateSessionId() {
        return 'repair_session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Fallback Methods
     */
    getFallbackGuidance(phaseIndex) {
        const phaseData = this.getPhaseData(phaseIndex);
        return {
            type: 'fallback',
            phase: phaseIndex,
            content: `Focus on the key objectives for the ${phaseData.name} phase: ${phaseData.objectives.join(', ')}. Take your time and be thorough in your responses.`,
            guidance: phaseData.objectives.map(obj => ({ action: obj, description: 'Work on this carefully' })),
            timestamp: Date.now()
        };
    }

    getFallbackProgressAnalysis(currentPhase) {
        return {
            overall: `Making progress through phase ${currentPhase + 1}`,
            strengths: ['Staying committed to the process'],
            challenges: ['Continue working systematically through each step'],
            recommendations: ['Take time for reflection and honest self-assessment']
        };
    }

    getFallbackSupport(challenge) {
        return {
            content: 'I understand you\'re facing a challenge. Remember that reconciliation is a process that takes time and patience. Focus on one step at a time.',
            strategies: ['Take breaks when needed', 'Seek support from trusted friends', 'Remember your commitment to healing'],
            encouragement: 'You\'re showing courage by working through this process.'
        };
    }

    getFallbackCoachingResponse(message) {
        return {
            content: 'I hear what you\'re sharing. This process can be challenging, but you\'re taking important steps toward healing. What would be most helpful for you right now?',
            suggestions: ['Continue working through the current phase', 'Take time for self-reflection', 'Consider seeking additional support'],
            insights: ['Progress takes time and patience'],
            nextSteps: ['Focus on the next required step in your current phase'],
            emotionalSupport: 'Remember that growth and healing are possible through committed effort.'
        };
    }

    getFallbackEmotionalCoaching() {
        return {
            type: 'emotional',
            content: 'Focus on expressing your genuine feelings honestly while being respectful of others. Authentic emotion is important in reconciliation.',
            actionItems: ['Practice expressing feelings clearly', 'Check for defensive language', 'Focus on genuine remorse'],
            insights: ['Emotional authenticity supports healing'],
            timestamp: Date.now()
        };
    }

    getFallbackCommunicationCoaching() {
        return {
            type: 'communication',
            content: 'Clear, respectful communication is essential. Focus on being specific, honest, and non-defensive in your expression.',
            actionItems: ['Use specific examples', 'Avoid defensive language', 'Practice active listening'],
            insights: ['Good communication builds understanding'],
            timestamp: Date.now()
        };
    }

    getFallbackBiasCoaching() {
        return {
            type: 'bias',
            content: 'We all have biases that can interfere with genuine reconciliation. Focus on being as objective and honest as possible.',
            actionItems: ['Question your initial reactions', 'Consider other perspectives', 'Seek feedback from trusted others'],
            insights: ['Self-awareness reduces the impact of bias'],
            timestamp: Date.now()
        };
    }

    /**
     * Content Analysis Methods
     */
    extractGuidanceFromText(text) {
        // Simple extraction of guidance elements
        const lines = text.split('\n').filter(line => line.trim());
        return lines.map(line => ({ guidance: line.trim() }));
    }

    extractActionItems(text) {
        const actionRegex = /(?:action|do|try|practice|focus on|consider):?\s*(.+)/gi;
        const matches = [];
        let match;
        while ((match = actionRegex.exec(text)) !== null) {
            matches.push(match[1].trim());
        }
        return matches.length > 0 ? matches : ['Continue with your current focus'];
    }

    extractSuggestions(text) {
        const suggestionRegex = /(?:suggest|recommend|try|consider):?\s*(.+)/gi;
        const matches = [];
        let match;
        while ((match = suggestionRegex.exec(text)) !== null) {
            matches.push(match[1].trim());
        }
        return matches.length > 0 ? matches : ['Keep working through the process'];
    }

    extractInsights(text) {
        const insightRegex = /(?:insight|remember|important|key):?\s*(.+)/gi;
        const matches = [];
        let match;
        while ((match = insightRegex.exec(text)) !== null) {
            matches.push(match[1].trim());
        }
        return matches.length > 0 ? matches : ['Every step forward matters'];
    }

    extractNextSteps(text) {
        const stepRegex = /(?:next|step|then|afterwards):?\s*(.+)/gi;
        const matches = [];
        let match;
        while ((match = stepRegex.exec(text)) !== null) {
            matches.push(match[1].trim());
        }
        return matches.length > 0 ? matches : ['Continue with the current phase'];
    }

    extractEmotionalSupport(text) {
        const supportRegex = /(?:remember|you can|you are|courage|strength):?\s*(.+)/gi;
        const matches = [];
        let match;
        while ((match = supportRegex.exec(text)) !== null) {
            matches.push(match[1].trim());
        }
        return matches.length > 0 ? matches.join(' ') : 'You are doing important work toward healing.';
    }

    /**
     * Analysis Methods
     */
    async analyzeEmotionalState(message) {
        // Simple emotional state analysis
        const emotionalIndicators = {
            anxiety: ['worried', 'scared', 'nervous', 'anxious'],
            guilt: ['guilty', 'ashamed', 'terrible', 'awful'],
            anger: ['angry', 'mad', 'furious', 'upset'],
            sadness: ['sad', 'depressed', 'hurt', 'painful'],
            hope: ['hope', 'optimistic', 'positive', 'better'],
            determination: ['committed', 'determined', 'will', 'going to']
        };

        const detected = {};
        const lowercaseMessage = message.toLowerCase();

        Object.keys(emotionalIndicators).forEach(emotion => {
            const indicators = emotionalIndicators[emotion];
            const matches = indicators.filter(indicator => lowercaseMessage.includes(indicator));
            if (matches.length > 0) {
                detected[emotion] = matches.length / indicators.length;
            }
        });

        return detected;
    }

    assessReadiness(message, context) {
        const readinessIndicators = {
            high: ['ready', 'committed', 'understand', 'responsibility'],
            medium: ['trying', 'working on', 'want to', 'hope'],
            low: ['maybe', 'not sure', 'difficult', 'can\'t']
        };

        const lowercaseMessage = message.toLowerCase();
        const scores = {};

        Object.keys(readinessIndicators).forEach(level => {
            const indicators = readinessIndicators[level];
            const matches = indicators.filter(indicator => lowercaseMessage.includes(indicator));
            scores[level] = matches.length;
        });

        const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
        if (total === 0) return 'unknown';

        const highestLevel = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
        return highestLevel;
    }

    identifyChallenges(message, context) {
        const challengePatterns = {
            emotional_overwhelm: ['overwhelmed', 'too much', 'can\'t handle', 'breaking down'],
            communication_difficulty: ['don\'t know what to say', 'hard to express', 'words fail'],
            resistance: ['don\'t want to', 'refuse to', 'won\'t', 'shouldn\'t have to'],
            fear: ['afraid', 'scared', 'worried about', 'fear'],
            guilt_shame: ['terrible person', 'can\'t forgive myself', 'awful', 'monster']
        };

        const identified = [];
        const lowercaseMessage = message.toLowerCase();

        Object.keys(challengePatterns).forEach(challenge => {
            const patterns = challengePatterns[challenge];
            if (patterns.some(pattern => lowercaseMessage.includes(pattern))) {
                identified.push(challenge);
            }
        });

        return identified;
    }

    extractProgressIndicators(message) {
        const progressMarkers = {
            understanding: ['understand', 'realize', 'see now', 'learned'],
            commitment: ['will', 'commit', 'promise', 'going to'],
            insight: ['insight', 'realize', 'figured out', 'understand now'],
            growth: ['growing', 'learning', 'changing', 'improving']
        };

        const indicators = {};
        const lowercaseMessage = message.toLowerCase();

        Object.keys(progressMarkers).forEach(marker => {
            const markers = progressMarkers[marker];
            const matches = markers.filter(m => lowercaseMessage.includes(m));
            if (matches.length > 0) {
                indicators[marker] = matches;
            }
        });

        return indicators;
    }

    /**
     * User Profile Management
     */
    updateUserProfile(analysis) {
        // Update user profile with new insights
        if (analysis.strengths) {
            this.userProfile.strengths = [...(this.userProfile.strengths || []), ...analysis.strengths];
        }
        if (analysis.challenges) {
            this.userProfile.challenges = [...(this.userProfile.challenges || []), ...analysis.challenges];
        }
        if (analysis.patterns) {
            this.userProfile.patterns = { ...(this.userProfile.patterns || {}), ...analysis.patterns };
        }

        this.saveUserProfile();
    }

    loadUserProfile() {
        try {
            if (typeof localStorage !== 'undefined') {
                const saved = localStorage.getItem('repairUserProfile');
                if (saved) {
                    this.userProfile = JSON.parse(saved);
                }
            }
        } catch (error) {
            console.warn('Failed to load user profile:', error);
        }
    }

    saveUserProfile() {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('repairUserProfile', JSON.stringify(this.userProfile));
            }
        } catch (error) {
            console.warn('Failed to save user profile:', error);
        }
    }

    /**
     * Session Management
     */
    endSession() {
        if (this.currentSession) {
            this.currentSession.endTime = Date.now();
            this.currentSession.status = 'completed';
            this.saveSession();
        }

        this.activeCoaching = false;
        this.currentSession = null;
    }

    saveSession() {
        if (this.currentSession) {
            try {
                if (typeof localStorage !== 'undefined') {
                    const sessions = this.getSavedSessions();
                    sessions.push(this.currentSession);

                    // Keep only last 10 sessions
                    const recentSessions = sessions.slice(-10);
                    localStorage.setItem('repairCoachingSessions', JSON.stringify(recentSessions));
                }
            } catch (error) {
                console.warn('Failed to save session:', error);
            }
        }
    }

    getSavedSessions() {
        try {
            if (typeof localStorage !== 'undefined') {
                const saved = localStorage.getItem('repairCoachingSessions');
                return saved ? JSON.parse(saved) : [];
            }
        } catch (error) {
            console.warn('Failed to load sessions:', error);
        }
        return [];
    }

    /**
     * Public Interface
     */
    getStatus() {
        return {
            activeCoaching: this.activeCoaching,
            currentSession: this.currentSession?.id || null,
            userProfile: Object.keys(this.userProfile).length > 0,
            conversationLength: this.currentSession?.interactions?.length || 0,
            gptStatus: this.gpt?.getStatus() || { initialized: false }
        };
    }

    exportSession() {
        return {
            session: this.currentSession,
            userProfile: this.userProfile,
            conversationHistory: this.conversationHistory,
            timestamp: Date.now()
        };
    }
}

/**
 * Supporting Classes
 */
class ConversationManager {
    constructor() {
        this.conversationFlow = new Map();
        this.contextWindow = [];
    }

    initialize() {
        // Initialize conversation management
    }

    addToContext(message, role = 'user') {
        this.contextWindow.push({ role, message, timestamp: Date.now() });

        // Maintain reasonable context size
        if (this.contextWindow.length > 20) {
            this.contextWindow = this.contextWindow.slice(-20);
        }
    }

    getContext(limit = 10) {
        return this.contextWindow.slice(-limit);
    }
}

class ProgressTracker {
    constructor() {
        this.phaseProgress = new Map();
        this.overallMetrics = {
            authenticity: 0,
            completeness: 0,
            commitment: 0,
            empathy: 0
        };
    }

    updateProgress(phase, analysis) {
        this.phaseProgress.set(phase, {
            ...analysis,
            timestamp: Date.now()
        });

        this.updateOverallMetrics();
    }

    updateOverallMetrics() {
        // Calculate overall progress metrics
        const phases = Array.from(this.phaseProgress.values());
        if (phases.length === 0) return;

        // Simple averaging of available metrics
        Object.keys(this.overallMetrics).forEach(metric => {
            const values = phases.filter(p => p[metric] !== undefined).map(p => p[metric]);
            if (values.length > 0) {
                this.overallMetrics[metric] = values.reduce((sum, val) => sum + val, 0) / values.length;
            }
        });
    }

    getProgress() {
        return {
            phaseProgress: Object.fromEntries(this.phaseProgress),
            overallMetrics: this.overallMetrics,
            completedPhases: this.phaseProgress.size
        };
    }
}

class SafetyProtocol {
    constructor() {
        this.riskIndicators = [
            'suicide', 'kill myself', 'end it all', 'not worth living',
            'hurt someone', 'make them pay', 'revenge', 'get back at',
            'drinking', 'drugs', 'self-harm', 'cutting'
        ];
        this.supportResources = {
            crisis: '988 Suicide & Crisis Lifeline',
            domestic: 'National Domestic Violence Hotline: 1-800-799-7233',
            substance: 'SAMHSA National Helpline: 1-800-662-4357'
        };
    }

    async initialize() {
        // Initialize safety protocols
    }

    async checkMessage(message) {
        const lowercaseMessage = message.toLowerCase();
        const riskFound = this.riskIndicators.some(indicator =>
            lowercaseMessage.includes(indicator)
        );

        if (riskFound) {
            return {
                safe: false,
                riskLevel: 'high',
                resources: this.supportResources,
                message: 'I notice you may be struggling with some serious concerns. Please consider reaching out to professional support resources.'
            };
        }

        return { safe: true };
    }
}

class ContentFilter {
    constructor() {
        this.inappropriatePatterns = [
            // Add content filtering patterns as needed
        ];
    }

    process(content) {
        // Basic content filtering and sanitization
        return content.trim();
    }

    isAppropriate(content) {
        // Check if content is appropriate for coaching context
        return true; // Implement as needed
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = REPAIRAssistant;
} else {
    window.REPAIRAssistant = REPAIRAssistant;
}