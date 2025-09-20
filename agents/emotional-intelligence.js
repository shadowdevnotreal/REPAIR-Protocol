/**
 * REPAIR Protocol - Emotional Intelligence Agent
 * Authenticity scoring, emotional pattern recognition, and manipulation detection
 */

class EmotionalIntelligenceAgent {
    constructor() {
        this.emotionalMarkers = {
            authentic: {
                vulnerability: ['vulnerable', 'exposed', 'raw', 'open', 'fragile'],
                self_awareness: ['I realize', 'I understand', 'I see now', 'I failed', 'I was wrong'],
                genuine_remorse: ['deeply sorry', 'truly regret', 'sincerely apologize', 'genuinely sorry'],
                specific_acknowledgment: ['when I', 'I did', 'I said', 'my actions', 'my behavior'],
                emotional_words: ['hurt', 'pain', 'devastated', 'broken', 'ashamed', 'guilty']
            },
            inauthentic: {
                deflection: ['but you', 'however', 'though', 'on the other hand', 'yet'],
                minimization: ['just', 'only', 'a little', 'kind of', 'sort of', 'maybe'],
                generic_language: ['sorry for everything', 'sorry if', 'mistakes were made'],
                blame_shifting: ['you made me', 'because you', 'if you hadn\'t', 'you caused'],
                manipulation: ['I\'ll leave you', 'you\'ll regret', 'think about our relationship']
            }
        };

        this.emotionalPatterns = {
            grief_stages: ['denial', 'anger', 'bargaining', 'depression', 'acceptance'],
            trauma_responses: ['fight', 'flight', 'freeze', 'fawn'],
            attachment_styles: ['secure', 'anxious', 'avoidant', 'disorganized'],
            emotional_regulation: ['suppression', 'expression', 'acceptance', 'transformation']
        };

        this.manipulationTactics = [
            'gaslighting',
            'love_bombing',
            'triangulation',
            'projection',
            'guilt_tripping',
            'silent_treatment',
            'emotional_blackmail',
            'blame_shifting',
            'victim_playing',
            'false_urgency'
        ];

        this.triggerCategories = {
            abandonment: ['leave', 'alone', 'reject', 'abandon', 'isolate'],
            betrayal: ['trust', 'betray', 'deceive', 'lie', 'cheat'],
            inadequacy: ['not enough', 'failure', 'worthless', 'useless', 'disappointing'],
            control: ['control', 'power', 'force', 'dominate', 'submit'],
            rejection: ['reject', 'dismiss', 'ignore', 'discard', 'unwanted']
        };

        this.emotionalProfiles = new Map();
        this.interactionHistory = new Map();
        this.authenticityScores = new Map();
    }

    /**
     * Analyze the authenticity of an apology or communication
     * @param {string} text - The text to analyze
     * @param {Object} context - Context about the speaker and situation
     * @returns {Object} Comprehensive authenticity analysis
     */
    analyzeAuthenticity(text, context = {}) {
        const analysis = {
            id: this.generateAnalysisId(),
            timestamp: new Date().toISOString(),
            text: text,
            context: context,
            scores: {
                overall: 0,
                components: {}
            },
            indicators: {
                authentic: [],
                inauthentic: [],
                neutral: []
            },
            emotionalDepth: this.assessEmotionalDepth(text),
            linguisticPatterns: this.analyzeLinguisticPatterns(text),
            manipulationRisk: this.assessManipulationRisk(text),
            recommendations: [],
            confidence: 0
        };

        // Calculate component scores
        analysis.scores.components = {
            vulnerability: this.scoreVulnerability(text),
            specificity: this.scoreSpecificity(text),
            accountability: this.scoreAccountability(text),
            empathy: this.scoreEmpathy(text),
            consistency: this.scoreConsistency(text, context),
            emotional_congruence: this.scoreEmotionalCongruence(text)
        };

        // Calculate overall authenticity score
        analysis.scores.overall = this.calculateOverallAuthenticity(analysis.scores.components);

        // Identify specific indicators
        analysis.indicators = this.identifyAuthenticityIndicators(text);

        // Generate recommendations for improvement
        analysis.recommendations = this.generateAuthenticityRecommendations(analysis);

        // Calculate confidence in the assessment
        analysis.confidence = this.calculateAuthenticityConfidence(analysis);

        return analysis;
    }

    /**
     * Recognize emotional patterns in communication
     * @param {Array} messages - Series of messages to analyze
     * @param {string} speakerId - ID of the speaker
     * @returns {Object} Emotional pattern analysis
     */
    recognizeEmotionalPatterns(messages, speakerId) {
        const patterns = {
            speakerId: speakerId,
            timeline: this.createEmotionalTimeline(messages),
            dominantEmotions: this.identifyDominantEmotions(messages),
            emotionalProgression: this.trackEmotionalProgression(messages),
            regulationStrategies: this.identifyRegulationStrategies(messages),
            triggerPatterns: this.identifyTriggerPatterns(messages),
            cyclicalBehaviors: this.detectCyclicalBehaviors(messages),
            attachmentStyle: this.assessAttachmentStyle(messages),
            traumaIndicators: this.detectTraumaIndicators(messages),
            copingMechanisms: this.identifyCopingMechanisms(messages),
            emotionalMaturity: this.assessEmotionalMaturity(messages),
            insights: this.generateEmotionalInsights(messages)
        };

        // Update emotional profile for this speaker
        this.updateEmotionalProfile(speakerId, patterns);

        return patterns;
    }

    /**
     * Detect manipulation attempts in communication
     * @param {string} text - The text to analyze
     * @param {Object} relationshipContext - Context about the relationship
     * @returns {Object} Manipulation detection analysis
     */
    detectManipulation(text, relationshipContext = {}) {
        const detection = {
            riskLevel: 'low',
            score: 0,
            detectedTactics: [],
            subtleIndicators: [],
            linguisticRedFlags: [],
            emotionalManipulation: [],
            cognitiveDistortions: [],
            powerDynamics: this.analyzePowerDynamics(text, relationshipContext),
            recommendations: [],
            protectiveStrategies: []
        };

        // Check each manipulation tactic
        this.manipulationTactics.forEach(tactic => {
            const result = this.checkManipulationTactic(text, tactic, relationshipContext);
            if (result.detected) {
                detection.detectedTactics.push(result);
                detection.score += result.severity;
            }
        });

        // Analyze subtle manipulation indicators
        detection.subtleIndicators = this.identifySubtleManipulation(text);
        detection.emotionalManipulation = this.detectEmotionalManipulation(text);
        detection.cognitiveDistortions = this.identifyCognitiveDistortions(text);

        // Calculate overall risk level
        detection.riskLevel = this.categorizeManipulationRisk(detection.score);

        // Generate protective recommendations
        detection.recommendations = this.generateManipulationRecommendations(detection);
        detection.protectiveStrategies = this.suggestProtectiveStrategies(detection);

        return detection;
    }

    /**
     * Predict emotional triggers for a person
     * @param {string} personId - ID of the person
     * @param {Object} context - Current situational context
     * @returns {Object} Trigger prediction analysis
     */
    predictTriggers(personId, context = {}) {
        const profile = this.emotionalProfiles.get(personId);
        const history = this.interactionHistory.get(personId) || [];

        const prediction = {
            personId: personId,
            primaryTriggers: this.identifyPrimaryTriggers(profile, history),
            secondaryTriggers: this.identifySecondaryTriggers(profile, history),
            contextualTriggers: this.assessContextualTriggers(context, profile),
            triggerSeverity: this.assessTriggerSeverity(profile, history),
            warningSignals: this.identifyWarningSignals(profile, history),
            preventionStrategies: this.generatePreventionStrategies(profile, history),
            deescalationTechniques: this.suggestDeescalationTechniques(profile),
            safeguards: this.recommendSafeguards(profile, context),
            confidence: this.calculateTriggerPredictionConfidence(profile, history)
        };

        return prediction;
    }

    /**
     * Provide personalized emotional regulation suggestions
     * @param {string} personId - ID of the person
     * @param {string} currentEmotion - Current emotional state
     * @param {number} intensity - Intensity level (1-10)
     * @returns {Object} Personalized regulation suggestions
     */
    suggestEmotionalRegulation(personId, currentEmotion, intensity) {
        const profile = this.emotionalProfiles.get(personId);

        const suggestions = {
            personId: personId,
            currentState: {
                emotion: currentEmotion,
                intensity: intensity,
                category: this.categorizeEmotionalIntensity(intensity)
            },
            immediateStrategies: this.generateImmediateStrategies(currentEmotion, intensity, profile),
            longTermStrategies: this.generateLongTermStrategies(profile),
            personalizedTechniques: this.selectPersonalizedTechniques(profile, currentEmotion),
            environmentalModifications: this.suggestEnvironmentalModifications(profile),
            supportSystemActivation: this.recommendSupportActivation(profile, intensity),
            professionalHelp: this.assessProfessionalHelpNeed(profile, intensity),
            progressTracking: this.designProgressTracking(profile),
            preventiveMeasures: this.suggestPreventiveMeasures(profile)
        };

        return suggestions;
    }

    /**
     * Create an emotional safety plan
     * @param {string} personId - ID of the person
     * @param {Array} riskFactors - Identified risk factors
     * @returns {Object} Comprehensive emotional safety plan
     */
    createEmotionalSafetyPlan(personId, riskFactors = []) {
        const profile = this.emotionalProfiles.get(personId);

        const safetyPlan = {
            personId: personId,
            riskAssessment: {
                factors: riskFactors,
                severity: this.assessRiskSeverity(riskFactors, profile),
                triggers: this.identifyHighRiskTriggers(profile, riskFactors)
            },
            warningSignsRecognition: this.defineWarningSignsRecognition(profile),
            copingStrategiesLibrary: this.buildCopingStrategiesLibrary(profile),
            supportNetworkActivation: this.designSupportNetworkActivation(profile),
            professionalResourcesGuide: this.compileProfessionalResourcesGuide(),
            environmentalSafetyMeasures: this.recommendEnvironmentalSafety(profile),
            communicationProtocols: this.establishCommunicationProtocols(profile),
            emergencyProcedures: this.defineEmergencyProcedures(profile),
            recoveryStrategies: this.outlineRecoveryStrategies(profile),
            progressMonitoring: this.setupProgressMonitoring(profile)
        };

        return safetyPlan;
    }

    // Scoring methods
    scoreVulnerability(text) {
        let score = 0;
        const vulnerabilityWords = this.emotionalMarkers.authentic.vulnerability;

        vulnerabilityWords.forEach(word => {
            if (text.toLowerCase().includes(word)) {
                score += 15;
            }
        });

        // Check for personal admission patterns
        const admissionPatterns = [
            /I (was|am|feel) (scared|afraid|worried|anxious)/gi,
            /I don't know (how|what|why)/gi,
            /I'm struggling with/gi,
            /I feel (lost|confused|overwhelmed)/gi
        ];

        admissionPatterns.forEach(pattern => {
            if (text.match(pattern)) {
                score += 20;
            }
        });

        return Math.min(100, score);
    }

    scoreSpecificity(text) {
        let score = 0;

        // Check for specific details
        const specificPatterns = [
            /on (january|february|march|april|may|june|july|august|september|october|november|december)/gi,
            /when I (said|did|wrote|called)/gi,
            /at \d+:\d+/gi,
            /\$\d+/gi,
            /\d+ (times|hours|days|weeks|months)/gi
        ];

        specificPatterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) {
                score += matches.length * 10;
            }
        });

        // Penalty for vague language
        const vagueWords = ['things', 'stuff', 'whatever', 'something', 'somehow'];
        vagueWords.forEach(word => {
            if (text.toLowerCase().includes(word)) {
                score -= 10;
            }
        });

        return Math.max(0, Math.min(100, score));
    }

    scoreAccountability(text) {
        let score = 0;

        // Check for accountability markers
        const accountabilityMarkers = this.emotionalMarkers.authentic.self_awareness;
        accountabilityMarkers.forEach(marker => {
            if (text.toLowerCase().includes(marker)) {
                score += 20;
            }
        });

        // Check for ownership language
        const ownershipPatterns = [
            /I (caused|created|did|said)/gi,
            /my (fault|mistake|error|responsibility)/gi,
            /I take full responsibility/gi
        ];

        ownershipPatterns.forEach(pattern => {
            if (text.match(pattern)) {
                score += 25;
            }
        });

        // Penalty for deflection
        const deflectionMarkers = this.emotionalMarkers.inauthentic.deflection;
        deflectionMarkers.forEach(marker => {
            if (text.toLowerCase().includes(marker)) {
                score -= 15;
            }
        });

        return Math.max(0, Math.min(100, score));
    }

    scoreEmpathy(text) {
        let score = 0;

        // Check for empathy indicators
        const empathyPatterns = [
            /I (understand|realize|see) (how|that|why)/gi,
            /you must (feel|be|have)/gi,
            /I can imagine/gi,
            /from your perspective/gi,
            /in your shoes/gi
        ];

        empathyPatterns.forEach(pattern => {
            if (text.match(pattern)) {
                score += 20;
            }
        });

        // Check for emotional recognition
        const emotionWords = ['hurt', 'pain', 'angry', 'sad', 'disappointed', 'betrayed'];
        emotionWords.forEach(word => {
            const pattern = new RegExp(`you.*${word}`, 'gi');
            if (text.match(pattern)) {
                score += 15;
            }
        });

        return Math.min(100, score);
    }

    scoreConsistency(text, context) {
        // Base score if no context available
        if (!context.previousMessages) {
            return 50;
        }

        let score = 70;
        const currentTone = this.analyzeEmotionalTone(text);
        const previousTones = context.previousMessages.map(msg => this.analyzeEmotionalTone(msg));

        // Check for major inconsistencies
        const toneShifts = this.identifyToneShifts(currentTone, previousTones);
        score -= toneShifts.major * 20;
        score -= toneShifts.minor * 5;

        return Math.max(0, Math.min(100, score));
    }

    scoreEmotionalCongruence(text) {
        let score = 70;

        const emotionalTone = this.analyzeEmotionalTone(text);
        const linguisticStyle = this.analyzeLinguisticStyle(text);

        // Check if emotional expression matches linguistic patterns
        if (emotionalTone.primary === 'anger' && linguisticStyle.aggression === 'low') {
            score -= 20; // Suppressed anger
        }

        if (emotionalTone.primary === 'sadness' && linguisticStyle.vulnerability === 'low') {
            score -= 15; // Suppressed sadness
        }

        if (emotionalTone.intensity === 'high' && linguisticStyle.intensity === 'low') {
            score -= 25; // Emotional suppression
        }

        return Math.max(0, Math.min(100, score));
    }

    calculateOverallAuthenticity(componentScores) {
        const weights = {
            vulnerability: 0.2,
            specificity: 0.15,
            accountability: 0.25,
            empathy: 0.2,
            consistency: 0.1,
            emotional_congruence: 0.1
        };

        let weightedSum = 0;
        Object.keys(componentScores).forEach(component => {
            weightedSum += componentScores[component] * (weights[component] || 0);
        });

        return Math.round(weightedSum);
    }

    // Pattern recognition methods
    createEmotionalTimeline(messages) {
        return messages.map((message, index) => ({
            index: index,
            timestamp: message.timestamp,
            emotion: this.analyzeEmotionalTone(message.text),
            intensity: this.measureEmotionalIntensity(message.text),
            triggers: this.identifyMessageTriggers(message.text),
            regulation: this.identifyRegulationAttempts(message.text)
        }));
    }

    identifyDominantEmotions(messages) {
        const emotionCounts = {};
        let totalIntensity = 0;

        messages.forEach(message => {
            const emotion = this.analyzeEmotionalTone(message.text);
            const intensity = this.measureEmotionalIntensity(message.text);

            emotionCounts[emotion.primary] = (emotionCounts[emotion.primary] || 0) + intensity;
            totalIntensity += intensity;
        });

        const sortedEmotions = Object.keys(emotionCounts)
            .sort((a, b) => emotionCounts[b] - emotionCounts[a])
            .map(emotion => ({
                emotion: emotion,
                prevalence: emotionCounts[emotion] / totalIntensity,
                totalIntensity: emotionCounts[emotion]
            }));

        return sortedEmotions.slice(0, 3); // Top 3 emotions
    }

    trackEmotionalProgression(messages) {
        const progression = [];
        let previousEmotion = null;

        messages.forEach((message, index) => {
            const currentEmotion = this.analyzeEmotionalTone(message.text);

            if (previousEmotion) {
                const transition = {
                    from: previousEmotion.primary,
                    to: currentEmotion.primary,
                    messageIndex: index,
                    transitionType: this.categorizeEmotionalTransition(previousEmotion, currentEmotion)
                };
                progression.push(transition);
            }

            previousEmotion = currentEmotion;
        });

        return {
            transitions: progression,
            overallDirection: this.determineOverallDirection(progression),
            stability: this.assessEmotionalStability(progression),
            volatility: this.measureEmotionalVolatility(progression)
        };
    }

    // Manipulation detection methods
    checkManipulationTactic(text, tactic, context) {
        const tactics = {
            gaslighting: this.detectGaslighting(text),
            love_bombing: this.detectLoveBombing(text),
            triangulation: this.detectTriangulation(text, context),
            projection: this.detectProjection(text),
            guilt_tripping: this.detectGuiltTripping(text),
            silent_treatment: this.detectSilentTreatment(text, context),
            emotional_blackmail: this.detectEmotionalBlackmail(text),
            blame_shifting: this.detectBlameShifting(text),
            victim_playing: this.detectVictimPlaying(text),
            false_urgency: this.detectFalseUrgency(text)
        };

        return tactics[tactic] || { detected: false, severity: 0 };
    }

    detectGaslighting(text) {
        const gaslightingPatterns = [
            /you're (crazy|insane|paranoid|imagining things)/gi,
            /that never happened/gi,
            /you're being too sensitive/gi,
            /you're overreacting/gi,
            /I never said that/gi,
            /you're remembering it wrong/gi
        ];

        let detected = false;
        let severity = 0;

        gaslightingPatterns.forEach(pattern => {
            if (text.match(pattern)) {
                detected = true;
                severity += 25;
            }
        });

        return {
            detected: detected,
            severity: Math.min(100, severity),
            tactic: 'gaslighting',
            indicators: gaslightingPatterns.filter(pattern => text.match(pattern))
        };
    }

    detectEmotionalBlackmail(text) {
        const blackmailPatterns = [
            /if you (really loved|cared about) me/gi,
            /I (can't|won't) live without you/gi,
            /you're going to regret this/gi,
            /I'll (leave|hurt myself|die) if/gi,
            /after everything I've done for you/gi
        ];

        let detected = false;
        let severity = 0;

        blackmailPatterns.forEach(pattern => {
            if (text.match(pattern)) {
                detected = true;
                severity += 30;
            }
        });

        return {
            detected: detected,
            severity: Math.min(100, severity),
            tactic: 'emotional_blackmail',
            indicators: blackmailPatterns.filter(pattern => text.match(pattern))
        };
    }

    // Utility methods
    analyzeEmotionalTone(text) {
        // Simplified version - in practice would use more sophisticated NLP
        const emotions = {
            anger: ['angry', 'furious', 'mad', 'irritated', 'frustrated'].reduce((count, word) =>
                count + (text.toLowerCase().includes(word) ? 1 : 0), 0),
            sadness: ['sad', 'depressed', 'hurt', 'devastated', 'heartbroken'].reduce((count, word) =>
                count + (text.toLowerCase().includes(word) ? 1 : 0), 0),
            fear: ['afraid', 'scared', 'worried', 'anxious', 'terrified'].reduce((count, word) =>
                count + (text.toLowerCase().includes(word) ? 1 : 0), 0),
            joy: ['happy', 'glad', 'pleased', 'excited', 'delighted'].reduce((count, word) =>
                count + (text.toLowerCase().includes(word) ? 1 : 0), 0)
        };

        const primaryEmotion = Object.keys(emotions).reduce((a, b) =>
            emotions[a] > emotions[b] ? a : b
        );

        return {
            primary: primaryEmotion,
            scores: emotions,
            intensity: this.measureEmotionalIntensity(text)
        };
    }

    measureEmotionalIntensity(text) {
        let intensity = 0;

        // Check for intensity markers
        const intensifiers = ['very', 'extremely', 'incredibly', 'absolutely', 'completely'];
        intensifiers.forEach(word => {
            if (text.toLowerCase().includes(word)) intensity += 10;
        });

        // Check for caps and exclamation marks
        const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
        const exclamationCount = (text.match(/!/g) || []).length;

        intensity += capsRatio * 30;
        intensity += exclamationCount * 5;

        return Math.min(100, intensity);
    }

    generateAnalysisId() {
        return 'emotional_analysis_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    updateEmotionalProfile(speakerId, patterns) {
        this.emotionalProfiles.set(speakerId, {
            lastUpdated: new Date().toISOString(),
            patterns: patterns,
            insights: this.generateProfileInsights(patterns)
        });
    }

    categorizeManipulationRisk(score) {
        if (score >= 70) return 'high';
        if (score >= 40) return 'medium';
        return 'low';
    }

    categorizeEmotionalIntensity(intensity) {
        if (intensity >= 70) return 'high';
        if (intensity >= 40) return 'medium';
        return 'low';
    }

    // Additional utility methods would be implemented here for completeness
    assessEmotionalDepth(text) { return { depth: 'medium', indicators: [] }; }
    analyzeLinguisticPatterns(text) { return { patterns: [] }; }
    assessManipulationRisk(text) { return { risk: 'low' }; }
    identifyAuthenticityIndicators(text) { return { authentic: [], inauthentic: [], neutral: [] }; }
    generateAuthenticityRecommendations(analysis) { return []; }
    calculateAuthenticityConfidence(analysis) { return 75; }

    // Public API methods
    getEmotionalProfile(personId) {
        return this.emotionalProfiles.get(personId);
    }

    getAuthenticityHistory(personId) {
        return this.authenticityScores.get(personId) || [];
    }

    updateInteractionHistory(personId, interaction) {
        const history = this.interactionHistory.get(personId) || [];
        history.push({
            timestamp: new Date().toISOString(),
            ...interaction
        });
        this.interactionHistory.set(personId, history);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmotionalIntelligenceAgent;
} else if (typeof window !== 'undefined') {
    window.EmotionalIntelligenceAgent = EmotionalIntelligenceAgent;
}