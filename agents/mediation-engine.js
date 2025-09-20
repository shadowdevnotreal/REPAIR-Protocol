/**
 * REPAIR Protocol - Mediation Engine Agent
 * Multi-party communication management and conflict resolution
 */

class MediationEngine {
    constructor() {
        this.communicationStyles = {
            assertive: { directness: 0.8, empathy: 0.6, formality: 0.5 },
            passive: { directness: 0.3, empathy: 0.8, formality: 0.7 },
            aggressive: { directness: 0.9, empathy: 0.2, formality: 0.3 },
            passive_aggressive: { directness: 0.4, empathy: 0.3, formality: 0.6 }
        };

        this.culturalAdaptations = {
            high_context: { indirect_communication: true, relationship_focus: true, formal_approach: true },
            low_context: { direct_communication: true, task_focus: true, informal_approach: true },
            collectivist: { group_harmony: true, face_saving: true, consensus_building: true },
            individualist: { personal_responsibility: true, direct_feedback: true, efficiency_focus: true }
        };

        this.deescalationStrategies = [
            'acknowledge_emotions',
            'find_common_ground',
            'reframe_perspective',
            'suggest_break',
            'introduce_neutral_facilitator',
            'focus_on_future',
            'validate_concerns'
        ];

        this.activeConversations = new Map();
        this.conflictPatterns = new Map();
        this.successfulResolutions = [];
    }

    /**
     * Start a new mediation session
     * @param {Array} parties - The parties involved in the mediation
     * @param {Object} context - Context about the conflict and repair process
     * @returns {Object} Mediation session details
     */
    initiateMediationSession(parties, context) {
        const sessionId = this.generateSessionId();

        const session = {
            id: sessionId,
            parties: this.analyzeParties(parties),
            context: context,
            status: 'active',
            startTime: new Date().toISOString(),
            communicationRules: this.establishCommunicationRules(parties),
            culturalConsiderations: this.assessCulturalFactors(parties),
            conflictAnalysis: this.analyzeConflict(context),
            mediationStrategy: this.developMediationStrategy(parties, context),
            progressTracking: {
                phase: 'opening',
                escalationLevel: 'low',
                commonGroundFound: [],
                majorObstacles: [],
                breakthroughs: []
            }
        };

        this.activeConversations.set(sessionId, session);
        return session;
    }

    /**
     * Process incoming communication from a party
     * @param {string} sessionId - The mediation session ID
     * @param {string} speakerId - ID of the party speaking
     * @param {string} message - The message content
     * @returns {Object} Communication analysis and response suggestions
     */
    processIncomingCommunication(sessionId, speakerId, message) {
        const session = this.activeConversations.get(sessionId);
        if (!session) {
            throw new Error('Session not found');
        }

        const analysis = {
            timestamp: new Date().toISOString(),
            speaker: speakerId,
            originalMessage: message,
            emotionalTone: this.analyzeEmotionalTone(message),
            communicationStyle: this.identifyCommunicationStyle(message),
            escalationRisk: this.assessEscalationRisk(message, session),
            triggers: this.identifyTriggers(message, session),
            opportunities: this.identifyOpportunities(message, session),
            suggestedResponses: this.generateResponseSuggestions(message, session, speakerId),
            interventionRecommendations: this.recommendInterventions(message, session)
        };

        // Update session progress
        this.updateSessionProgress(session, analysis);

        return analysis;
    }

    /**
     * Generate facilitated communication suggestions
     * @param {string} sessionId - The mediation session ID
     * @param {Object} communicationGoal - What the communication aims to achieve
     * @returns {Object} Facilitated communication suggestions
     */
    facilitateCommunication(sessionId, communicationGoal) {
        const session = this.activeConversations.get(sessionId);
        if (!session) {
            throw new Error('Session not found');
        }

        const facilitation = {
            goal: communicationGoal,
            structuredApproach: this.designStructuredApproach(session, communicationGoal),
            speakingOrder: this.determineSpeakingOrder(session),
            timeAllocation: this.allocateTime(session),
            groundRules: this.reinforceGroundRules(session),
            facilitatorPrompts: this.generateFacilitatorPrompts(session, communicationGoal),
            safetyMeasures: this.establishSafetyMeasures(session),
            exitStrategies: this.prepareExitStrategies(session)
        };

        return facilitation;
    }

    /**
     * Find and strengthen common ground between parties
     * @param {string} sessionId - The mediation session ID
     * @returns {Object} Common ground analysis and strengthening strategies
     */
    identifyCommonGround(sessionId) {
        const session = this.activeConversations.get(sessionId);
        if (!session) {
            throw new Error('Session not found');
        }

        const commonGround = {
            sharedValues: this.findSharedValues(session),
            commonGoals: this.identifyCommonGoals(session),
            mutualInterests: this.discoverMutualInterests(session),
            sharedConcerns: this.recognizeSharedConcerns(session),
            overlappingNeeds: this.mapOverlappingNeeds(session),
            strengtheningStrategies: this.developStrengtheningStrategies(session),
            buildingActivities: this.suggestBuildingActivities(session)
        };

        // Update session with found common ground
        session.progressTracking.commonGroundFound.push({
            timestamp: new Date().toISOString(),
            discoveries: commonGround
        });

        return commonGround;
    }

    /**
     * Generate compromise solutions
     * @param {string} sessionId - The mediation session ID
     * @param {Array} positions - The positions held by different parties
     * @returns {Object} Compromise solution suggestions
     */
    generateCompromiseSolutions(sessionId, positions) {
        const session = this.activeConversations.get(sessionId);
        if (!session) {
            throw new Error('Session not found');
        }

        const compromises = {
            tradeoffOpportunities: this.identifyTradeoffs(positions, session),
            phaseImplementation: this.suggestPhasedImplementation(positions),
            partialSolutions: this.developPartialSolutions(positions, session),
            creativeAlternatives: this.generateCreativeAlternatives(positions, session),
            winWinScenarios: this.constructWinWinScenarios(positions, session),
            implementationGuidance: this.provideImplementationGuidance(positions, session),
            successMetrics: this.defineSuccessMetrics(positions, session)
        };

        return compromises;
    }

    /**
     * Adapt communication and mediation approach based on cultural factors
     * @param {string} sessionId - The mediation session ID
     * @param {Object} culturalContext - Cultural information about the parties
     * @returns {Object} Culturally adapted mediation approach
     */
    adaptToCulturalContext(sessionId, culturalContext) {
        const session = this.activeConversations.get(sessionId);
        if (!session) {
            throw new Error('Session not found');
        }

        const adaptations = {
            communicationStyleAdjustments: this.adjustCommunicationStyles(culturalContext),
            conflictResolutionApproach: this.adaptConflictResolution(culturalContext),
            timeAndPacingConsiderations: this.adjustTimeAndPacing(culturalContext),
            hierarchyAndRespectProtocols: this.establishHierarchyProtocols(culturalContext),
            faceSavingStrategies: this.developFaceSavingStrategies(culturalContext),
            consensusBuildingMethods: this.adaptConsensusMethods(culturalContext),
            ritualAndCeremonyIntegration: this.integrateRitualsAndCeremony(culturalContext)
        };

        // Update session with cultural adaptations
        session.culturalConsiderations = {
            ...session.culturalConsiderations,
            activeAdaptations: adaptations
        };

        return adaptations;
    }

    /**
     * Handle escalation and de-escalation
     * @param {string} sessionId - The mediation session ID
     * @param {string} escalationType - Type of escalation detected
     * @returns {Object} De-escalation strategy and immediate actions
     */
    handleEscalation(sessionId, escalationType) {
        const session = this.activeConversations.get(sessionId);
        if (!session) {
            throw new Error('Session not found');
        }

        const deescalation = {
            escalationType: escalationType,
            severity: this.assessEscalationSeverity(escalationType, session),
            immediateActions: this.determineImmediateActions(escalationType, session),
            strategicInterventions: this.selectStrategicInterventions(escalationType, session),
            communicationAdjustments: this.adjustCommunicationForDeescalation(session),
            timeoutRecommendations: this.recommendTimeouts(escalationType, session),
            neutralizingTechniques: this.applyNeutralizingTechniques(escalationType, session),
            preventionStrategies: this.developPreventionStrategies(escalationType, session)
        };

        // Update escalation level in session
        session.progressTracking.escalationLevel = deescalation.severity;

        return deescalation;
    }

    // Analysis methods
    analyzeParties(parties) {
        return parties.map(party => ({
            id: party.id,
            name: party.name,
            role: party.role || 'participant',
            communicationStyle: this.assessCommunicationStyle(party),
            emotionalState: this.assessEmotionalState(party),
            culturalBackground: this.assessCulturalBackground(party),
            powerDynamics: this.assessPowerDynamics(party, parties),
            stakes: this.assessStakes(party),
            flexibility: this.assessFlexibility(party),
            trustLevel: this.assessTrustLevel(party, parties)
        }));
    }

    analyzeConflict(context) {
        return {
            type: this.categorizeConflictType(context),
            intensity: this.assessConflictIntensity(context),
            duration: this.estimateConflictDuration(context),
            rootCauses: this.identifyRootCauses(context),
            manifestations: this.identifyConflictManifestations(context),
            stakeholderImpact: this.assessStakeholderImpact(context),
            resolutionComplexity: this.assessResolutionComplexity(context),
            historicalFactors: this.identifyHistoricalFactors(context)
        };
    }

    analyzeEmotionalTone(message) {
        const emotionalIndicators = {
            anger: ['angry', 'furious', 'outraged', 'livid', 'mad'],
            sadness: ['sad', 'disappointed', 'hurt', 'devastated', 'heartbroken'],
            fear: ['afraid', 'worried', 'anxious', 'scared', 'concerned'],
            joy: ['happy', 'pleased', 'glad', 'delighted', 'satisfied'],
            surprise: ['surprised', 'shocked', 'amazed', 'stunned'],
            disgust: ['disgusted', 'repulsed', 'sickened', 'revolted']
        };

        const toneAnalysis = {
            primary: 'neutral',
            secondary: [],
            intensity: 'low',
            indicators: []
        };

        const text = message.toLowerCase();
        let maxMatches = 0;

        Object.keys(emotionalIndicators).forEach(emotion => {
            const matches = emotionalIndicators[emotion].filter(word => text.includes(word));
            if (matches.length > maxMatches) {
                maxMatches = matches.length;
                toneAnalysis.primary = emotion;
                toneAnalysis.indicators = matches;
            } else if (matches.length > 0) {
                toneAnalysis.secondary.push({ emotion, matches });
            }
        });

        // Assess intensity based on various factors
        const intensityIndicators = ['extremely', 'very', 'really', 'absolutely', 'totally'];
        const capsRatio = (message.match(/[A-Z]/g) || []).length / message.length;
        const exclamationCount = (message.match(/!/g) || []).length;

        if (intensityIndicators.some(word => text.includes(word)) ||
            capsRatio > 0.3 ||
            exclamationCount > 2) {
            toneAnalysis.intensity = 'high';
        } else if (maxMatches > 1 || capsRatio > 0.1 || exclamationCount > 0) {
            toneAnalysis.intensity = 'medium';
        }

        return toneAnalysis;
    }

    identifyCommunicationStyle(message) {
        const text = message.toLowerCase();
        const patterns = {
            assertive: {
                indicators: ['I feel', 'I think', 'I need', 'let\'s', 'we can', 'I understand'],
                score: 0
            },
            passive: {
                indicators: ['maybe', 'perhaps', 'I guess', 'sorry', 'if that\'s okay'],
                score: 0
            },
            aggressive: {
                indicators: ['you always', 'you never', 'that\'s ridiculous', 'obviously'],
                score: 0
            },
            passive_aggressive: {
                indicators: ['fine', 'whatever', 'if you say so', 'I suppose'],
                score: 0
            }
        };

        Object.keys(patterns).forEach(style => {
            patterns[style].score = patterns[style].indicators
                .filter(indicator => text.includes(indicator)).length;
        });

        const dominantStyle = Object.keys(patterns)
            .reduce((a, b) => patterns[a].score > patterns[b].score ? a : b);

        return {
            dominant: dominantStyle,
            scores: patterns,
            confidence: this.calculateStyleConfidence(patterns)
        };
    }

    assessEscalationRisk(message, session) {
        let riskScore = 0;
        const text = message.toLowerCase();

        // Check for escalation indicators
        const escalationWords = [
            'never', 'always', 'impossible', 'ridiculous', 'stupid',
            'liar', 'hypocrite', 'blame', 'fault', 'wrong'
        ];

        escalationWords.forEach(word => {
            if (text.includes(word)) riskScore += 10;
        });

        // Check emotional intensity
        const emotionalTone = this.analyzeEmotionalTone(message);
        if (emotionalTone.intensity === 'high') riskScore += 20;
        if (emotionalTone.primary === 'anger') riskScore += 15;

        // Check communication style
        const commStyle = this.identifyCommunicationStyle(message);
        if (commStyle.dominant === 'aggressive') riskScore += 25;

        // Historical escalation patterns
        if (session.progressTracking.escalationLevel !== 'low') riskScore += 10;

        return {
            level: this.categorizeRisk(riskScore),
            score: riskScore,
            factors: this.identifyEscalationFactors(message, session)
        };
    }

    generateResponseSuggestions(message, session, speakerId) {
        const suggestions = [];
        const emotionalTone = this.analyzeEmotionalTone(message);
        const commStyle = this.identifyCommunicationStyle(message);
        const escalationRisk = this.assessEscalationRisk(message, session);

        // Base response on emotional tone
        if (emotionalTone.primary === 'anger') {
            suggestions.push({
                type: 'acknowledgment',
                content: 'I can hear that you\'re feeling very frustrated about this.',
                purpose: 'Validate emotions without agreeing to content'
            });
        }

        if (emotionalTone.primary === 'sadness') {
            suggestions.push({
                type: 'empathy',
                content: 'I can see this situation has been really difficult for you.',
                purpose: 'Show understanding and compassion'
            });
        }

        // Address communication style
        if (commStyle.dominant === 'aggressive') {
            suggestions.push({
                type: 'deescalation',
                content: 'Let\'s take a step back and focus on what we can work on together.',
                purpose: 'Redirect from conflict to collaboration'
            });
        }

        if (commStyle.dominant === 'passive') {
            suggestions.push({
                type: 'encouragement',
                content: 'Your perspective is important here. Can you tell us more about what you\'re thinking?',
                purpose: 'Draw out passive communicator'
            });
        }

        // Add escalation-specific responses
        if (escalationRisk.level === 'high') {
            suggestions.push({
                type: 'circuit_breaker',
                content: 'I think we might benefit from taking a brief break to collect our thoughts.',
                purpose: 'Prevent further escalation'
            });
        }

        // Add solution-focused responses
        suggestions.push({
            type: 'solution_focus',
            content: 'What would need to happen for you to feel heard and respected in this situation?',
            purpose: 'Redirect to problem-solving'
        });

        return suggestions;
    }

    // Cultural adaptation methods
    adjustCommunicationStyles(culturalContext) {
        const adjustments = {};

        if (culturalContext.type === 'high_context') {
            adjustments.indirectCommunication = true;
            adjustments.implicitMeaning = true;
            adjustments.formalLanguage = true;
            adjustments.relationshipFocus = true;
        }

        if (culturalContext.type === 'collectivist') {
            adjustments.groupHarmony = true;
            adjustments.consensusBuilding = true;
            adjustments.faceSaving = true;
            adjustments.hierarchyRespect = true;
        }

        return adjustments;
    }

    adaptConflictResolution(culturalContext) {
        const approach = {
            style: 'collaborative',
            methods: [],
            considerations: []
        };

        if (culturalContext.powerDistance === 'high') {
            approach.methods.push('hierarchical_mediation');
            approach.considerations.push('Respect authority figures');
        }

        if (culturalContext.uncertaintyAvoidance === 'high') {
            approach.methods.push('structured_process');
            approach.considerations.push('Provide clear procedures and rules');
        }

        return approach;
    }

    // Common ground identification methods
    findSharedValues(session) {
        const sharedValues = [];
        const parties = session.parties;

        // Analyze stated values from each party
        parties.forEach(party => {
            if (party.values) {
                party.values.forEach(value => {
                    const sharedBy = parties.filter(p =>
                        p.values && p.values.includes(value)
                    ).length;

                    if (sharedBy > 1) {
                        sharedValues.push({
                            value: value,
                            sharedBy: sharedBy,
                            parties: parties.filter(p =>
                                p.values && p.values.includes(value)
                            ).map(p => p.id)
                        });
                    }
                });
            }
        });

        return sharedValues;
    }

    identifyCommonGoals(session) {
        const commonGoals = [];

        // Look for overlapping objectives
        const objectives = session.parties
            .map(party => party.objectives || [])
            .flat();

        const goalCounts = {};
        objectives.forEach(goal => {
            goalCounts[goal] = (goalCounts[goal] || 0) + 1;
        });

        Object.keys(goalCounts).forEach(goal => {
            if (goalCounts[goal] > 1) {
                commonGoals.push({
                    goal: goal,
                    supportCount: goalCounts[goal]
                });
            }
        });

        return commonGoals;
    }

    // Compromise generation methods
    identifyTradeoffs(positions, session) {
        const tradeoffs = [];

        positions.forEach((position1, index1) => {
            positions.forEach((position2, index2) => {
                if (index1 !== index2) {
                    const potential = this.findPotentialTradeoff(position1, position2);
                    if (potential) {
                        tradeoffs.push(potential);
                    }
                }
            });
        });

        return tradeoffs;
    }

    findPotentialTradeoff(position1, position2) {
        // Analyze if position1 can offer something position2 values
        // in exchange for something position1 values
        const offer1 = position1.canOffer || [];
        const wants2 = position2.wants || [];
        const offer2 = position2.canOffer || [];
        const wants1 = position1.wants || [];

        const matches1to2 = offer1.filter(item => wants2.includes(item));
        const matches2to1 = offer2.filter(item => wants1.includes(item));

        if (matches1to2.length > 0 && matches2to1.length > 0) {
            return {
                type: 'mutual_exchange',
                party1: position1.party,
                party2: position2.party,
                party1Offers: matches1to2,
                party2Offers: matches2to1,
                feasibility: this.assessTradeoffFeasibility(matches1to2, matches2to1)
            };
        }

        return null;
    }

    // Utility methods
    establishCommunicationRules(parties) {
        return {
            speakingTime: '5 minutes per person initially',
            interruptions: 'Not allowed - use hand signals',
            language: 'Use "I" statements when possible',
            respect: 'No personal attacks or name-calling',
            confidentiality: 'Discussion contents remain private',
            participation: 'All parties have equal voice',
            breaks: 'Any party can request a 10-minute break'
        };
    }

    assessCulturalFactors(parties) {
        return {
            diversity: this.calculateCulturalDiversity(parties),
            considerations: this.identifyCulturalConsiderations(parties),
            adaptations: this.suggestCulturalAdaptations(parties),
            sensitivities: this.flagCulturalSensitivities(parties)
        };
    }

    developMediationStrategy(parties, context) {
        return {
            approach: this.selectMediationApproach(parties, context),
            phases: this.defineMediationPhases(parties, context),
            techniques: this.selectMediationTechniques(parties, context),
            timeline: this.estimateMediationTimeline(parties, context),
            successFactors: this.identifySuccessFactors(parties, context),
            riskFactors: this.identifyRiskFactors(parties, context)
        };
    }

    updateSessionProgress(session, analysis) {
        // Update escalation level
        if (analysis.escalationRisk.level === 'high') {
            session.progressTracking.escalationLevel = 'high';
        }

        // Track triggers
        if (analysis.triggers.length > 0) {
            analysis.triggers.forEach(trigger => {
                if (!session.progressTracking.majorObstacles.includes(trigger)) {
                    session.progressTracking.majorObstacles.push(trigger);
                }
            });
        }

        // Track opportunities
        if (analysis.opportunities.length > 0) {
            session.progressTracking.breakthroughs.push({
                timestamp: analysis.timestamp,
                opportunities: analysis.opportunities
            });
        }
    }

    categorizeRisk(score) {
        if (score >= 50) return 'high';
        if (score >= 25) return 'medium';
        return 'low';
    }

    calculateStyleConfidence(patterns) {
        const scores = Object.values(patterns).map(p => p.score);
        const max = Math.max(...scores);
        const total = scores.reduce((sum, score) => sum + score, 0);

        return total > 0 ? max / total : 0;
    }

    generateSessionId() {
        return 'mediation_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Additional utility methods for completeness
    identifyTriggers(message, session) {
        // Implementation for identifying communication triggers
        return [];
    }

    identifyOpportunities(message, session) {
        // Implementation for identifying collaboration opportunities
        return [];
    }

    recommendInterventions(message, session) {
        // Implementation for recommending specific interventions
        return [];
    }

    // Public API methods
    getActiveSessionsCount() {
        return this.activeConversations.size;
    }

    getSessionStatus(sessionId) {
        const session = this.activeConversations.get(sessionId);
        return session ? session.progressTracking : null;
    }

    endMediationSession(sessionId, outcome) {
        const session = this.activeConversations.get(sessionId);
        if (session) {
            session.status = 'completed';
            session.endTime = new Date().toISOString();
            session.outcome = outcome;

            // Archive successful resolutions for learning
            if (outcome.success) {
                this.successfulResolutions.push({
                    sessionId,
                    strategies: session.mediationStrategy,
                    outcome: outcome,
                    duration: new Date(session.endTime) - new Date(session.startTime)
                });
            }

            this.activeConversations.delete(sessionId);
            return session;
        }
        return null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MediationEngine;
} else if (typeof window !== 'undefined') {
    window.MediationEngine = MediationEngine;
}