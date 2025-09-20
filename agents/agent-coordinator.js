/**
 * REPAIR Protocol - Agent Coordinator
 * Orchestrates all agents, manages inter-agent communication, and provides unified API
 */

class AgentCoordinator {
    constructor() {
        this.agents = {
            contractAnalyzer: null,
            mediationEngine: null,
            emotionalIntelligence: null,
            progressOptimizer: null
        };

        this.agentPriorities = {
            critical: ['emotional_crisis', 'immediate_safety', 'contract_violation'],
            high: ['progress_stall', 'escalation_risk', 'authenticity_concern'],
            medium: ['optimization_opportunity', 'milestone_approaching', 'engagement_decline'],
            low: ['routine_analysis', 'data_update', 'maintenance']
        };

        this.coordinationProtocols = {
            consensus_required: ['major_intervention', 'process_termination', 'escalation_protocol'],
            majority_vote: ['intervention_priority', 'resource_allocation', 'timeline_adjustment'],
            autonomous: ['data_collection', 'routine_analysis', 'status_updates']
        };

        this.activeCoordinations = new Map();
        this.agentCommunicationLog = [];
        this.decisionHistory = [];
        this.systemHealth = {
            status: 'operational',
            agentStatus: {},
            lastHealthCheck: null
        };

        this.eventQueue = [];
        this.processingQueue = false;
    }

    /**
     * Initialize all agents and establish coordination protocols
     * @param {Object} config - Configuration for all agents
     * @returns {Object} Initialization results
     */
    async initializeAgents(config = {}) {
        const initResults = {
            timestamp: new Date().toISOString(),
            success: true,
            agents: {},
            errors: [],
            systemReadiness: false
        };

        try {
            // Initialize Contract Analyzer
            if (typeof ContractAnalyzer !== 'undefined') {
                this.agents.contractAnalyzer = new ContractAnalyzer();
                initResults.agents.contractAnalyzer = 'initialized';
            } else {
                throw new Error('ContractAnalyzer not available');
            }

            // Initialize Mediation Engine
            if (typeof MediationEngine !== 'undefined') {
                this.agents.mediationEngine = new MediationEngine();
                initResults.agents.mediationEngine = 'initialized';
            } else {
                throw new Error('MediationEngine not available');
            }

            // Initialize Emotional Intelligence Agent
            if (typeof EmotionalIntelligenceAgent !== 'undefined') {
                this.agents.emotionalIntelligence = new EmotionalIntelligenceAgent();
                initResults.agents.emotionalIntelligence = 'initialized';
            } else {
                throw new Error('EmotionalIntelligenceAgent not available');
            }

            // Initialize Progress Optimizer
            if (typeof ProgressOptimizer !== 'undefined') {
                this.agents.progressOptimizer = new ProgressOptimizer();
                initResults.agents.progressOptimizer = 'initialized';
            } else {
                throw new Error('ProgressOptimizer not available');
            }

            // Perform system health check
            await this.performHealthCheck();
            initResults.systemReadiness = this.systemHealth.status === 'operational';

            // Start event processing
            this.startEventProcessing();

            return initResults;

        } catch (error) {
            initResults.success = false;
            initResults.errors.push(error.message);
            console.error('Agent initialization failed:', error);
            return initResults;
        }
    }

    /**
     * Comprehensive REPAIR process analysis using all agents
     * @param {Object} repairContext - Complete context of the repair process
     * @returns {Object} Unified analysis from all agents
     */
    async analyzeRepairProcess(repairContext) {
        const analysisId = this.generateAnalysisId();
        const coordination = {
            id: analysisId,
            startTime: new Date().toISOString(),
            context: repairContext,
            agentResults: {},
            conflicts: [],
            consensus: {},
            recommendations: [],
            priority: this.determinePriority(repairContext),
            status: 'in_progress'
        };

        this.activeCoordinations.set(analysisId, coordination);

        try {
            // Parallel execution of agent analyses
            const agentPromises = [];

            // Contract Analysis
            if (this.agents.contractAnalyzer && repairContext.contract) {
                agentPromises.push(
                    this.executeAgentAnalysis('contractAnalyzer', 'analyzeContract', repairContext.contract)
                );
            }

            // Emotional Intelligence Analysis
            if (this.agents.emotionalIntelligence) {
                if (repairContext.communications) {
                    agentPromises.push(
                        this.executeAgentAnalysis('emotionalIntelligence', 'recognizeEmotionalPatterns',
                            repairContext.communications, repairContext.speakerId)
                    );
                }
                if (repairContext.apologyText) {
                    agentPromises.push(
                        this.executeAgentAnalysis('emotionalIntelligence', 'analyzeAuthenticity',
                            repairContext.apologyText, repairContext)
                    );
                }
            }

            // Mediation Analysis (if multi-party)
            if (this.agents.mediationEngine && repairContext.parties && repairContext.parties.length > 1) {
                agentPromises.push(
                    this.executeAgentAnalysis('mediationEngine', 'initiateMediationSession',
                        repairContext.parties, repairContext)
                );
            }

            // Progress Analysis
            if (this.agents.progressOptimizer && repairContext.processId) {
                agentPromises.push(
                    this.executeAgentAnalysis('progressOptimizer', 'analyzeProgress',
                        repairContext.processId, repairContext.currentStatus)
                );
            }

            // Wait for all analyses to complete
            const results = await Promise.allSettled(agentPromises);

            // Process results and handle any failures
            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    Object.assign(coordination.agentResults, result.value);
                } else {
                    console.error(`Agent analysis failed:`, result.reason);
                    coordination.conflicts.push({
                        type: 'agent_failure',
                        agent: agentPromises[index].agent,
                        error: result.reason.message
                    });
                }
            });

            // Synthesize results
            coordination.consensus = await this.synthesizeResults(coordination.agentResults);
            coordination.recommendations = await this.generateUnifiedRecommendations(coordination);
            coordination.status = 'completed';
            coordination.endTime = new Date().toISOString();

            return coordination;

        } catch (error) {
            coordination.status = 'failed';
            coordination.error = error.message;
            coordination.endTime = new Date().toISOString();
            throw error;
        }
    }

    /**
     * Handle real-time events and coordinate agent responses
     * @param {Object} event - The event to process
     * @returns {Object} Coordinated response
     */
    async handleEvent(event) {
        const eventId = this.generateEventId();
        const eventProcessing = {
            id: eventId,
            timestamp: new Date().toISOString(),
            event: event,
            priority: this.assessEventPriority(event),
            involvedAgents: this.identifyInvolvedAgents(event),
            responses: {},
            coordinatedAction: null,
            status: 'processing'
        };

        this.eventQueue.push(eventProcessing);

        try {
            // Immediate response for critical events
            if (eventProcessing.priority === 'critical') {
                return await this.handleCriticalEvent(eventProcessing);
            }

            // Queue for normal processing
            if (!this.processingQueue) {
                this.processEventQueue();
            }

            return {
                eventId: eventId,
                status: 'queued',
                priority: eventProcessing.priority,
                estimatedProcessingTime: this.estimateProcessingTime(eventProcessing)
            };

        } catch (error) {
            eventProcessing.status = 'failed';
            eventProcessing.error = error.message;
            throw error;
        }
    }

    /**
     * Coordinate intervention recommendations across agents
     * @param {string} processId - The process requiring intervention
     * @param {Object} context - Current process context
     * @returns {Object} Coordinated intervention plan
     */
    async coordinateIntervention(processId, context) {
        const interventionId = this.generateInterventionId();
        const coordination = {
            id: interventionId,
            processId: processId,
            timestamp: new Date().toISOString(),
            context: context,
            agentRecommendations: {},
            conflictResolution: {},
            finalPlan: {},
            implementation: {},
            status: 'planning'
        };

        try {
            // Gather recommendations from relevant agents
            coordination.agentRecommendations = await this.gatherInterventionRecommendations(processId, context);

            // Resolve any conflicts between agent recommendations
            coordination.conflictResolution = await this.resolveInterventionConflicts(coordination.agentRecommendations);

            // Create unified intervention plan
            coordination.finalPlan = await this.createUnifiedInterventionPlan(coordination);

            // Plan implementation
            coordination.implementation = await this.planInterventionImplementation(coordination.finalPlan);

            coordination.status = 'ready';
            return coordination;

        } catch (error) {
            coordination.status = 'failed';
            coordination.error = error.message;
            throw error;
        }
    }

    /**
     * Manage agent priorities and resource allocation
     * @param {Array} tasks - List of tasks requiring agent attention
     * @returns {Object} Priority and resource allocation plan
     */
    managePriorities(tasks) {
        const allocation = {
            timestamp: new Date().toISOString(),
            totalTasks: tasks.length,
            prioritizedTasks: [],
            agentAssignments: {},
            resourceConstraints: this.assessResourceConstraints(),
            schedulingConflicts: [],
            optimization: {}
        };

        // Prioritize tasks
        allocation.prioritizedTasks = this.prioritizeTasks(tasks);

        // Assign agents to tasks
        allocation.agentAssignments = this.assignAgentsToTasks(allocation.prioritizedTasks);

        // Identify scheduling conflicts
        allocation.schedulingConflicts = this.identifySchedulingConflicts(allocation.agentAssignments);

        // Optimize allocation
        allocation.optimization = this.optimizeResourceAllocation(allocation);

        return allocation;
    }

    /**
     * Handle conflicts between agent recommendations
     * @param {Object} agentRecommendations - Recommendations from different agents
     * @returns {Object} Conflict resolution and final decision
     */
    async resolveAgentConflicts(agentRecommendations) {
        const conflicts = this.identifyConflicts(agentRecommendations);
        const resolution = {
            timestamp: new Date().toISOString(),
            conflicts: conflicts,
            resolutionMethod: {},
            finalDecisions: {},
            consensus: {}
        };

        for (const conflict of conflicts) {
            switch (conflict.severity) {
                case 'critical':
                    resolution.resolutionMethod[conflict.id] = 'expert_override';
                    resolution.finalDecisions[conflict.id] = await this.expertOverride(conflict);
                    break;

                case 'high':
                    resolution.resolutionMethod[conflict.id] = 'weighted_voting';
                    resolution.finalDecisions[conflict.id] = await this.weightedVoting(conflict);
                    break;

                case 'medium':
                    resolution.resolutionMethod[conflict.id] = 'consensus_building';
                    resolution.finalDecisions[conflict.id] = await this.buildConsensus(conflict);
                    break;

                case 'low':
                    resolution.resolutionMethod[conflict.id] = 'compromise';
                    resolution.finalDecisions[conflict.id] = await this.findCompromise(conflict);
                    break;
            }
        }

        // Build overall consensus
        resolution.consensus = await this.buildOverallConsensus(resolution.finalDecisions);

        return resolution;
    }

    // Agent execution and coordination methods
    async executeAgentAnalysis(agentName, method, ...args) {
        const agent = this.agents[agentName];
        if (!agent || typeof agent[method] !== 'function') {
            throw new Error(`Agent ${agentName} or method ${method} not available`);
        }

        const startTime = Date.now();
        try {
            const result = await agent[method](...args);
            const executionTime = Date.now() - startTime;

            this.logAgentCommunication({
                agent: agentName,
                method: method,
                executionTime: executionTime,
                success: true,
                timestamp: new Date().toISOString()
            });

            return { [agentName]: result };

        } catch (error) {
            const executionTime = Date.now() - startTime;

            this.logAgentCommunication({
                agent: agentName,
                method: method,
                executionTime: executionTime,
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            });

            throw error;
        }
    }

    async synthesizeResults(agentResults) {
        const synthesis = {
            overallAssessment: {},
            keyInsights: [],
            riskFactors: [],
            opportunities: [],
            recommendations: [],
            confidence: 0
        };

        // Extract insights from each agent
        Object.keys(agentResults).forEach(agentName => {
            const result = agentResults[agentName];

            switch (agentName) {
                case 'contractAnalyzer':
                    synthesis.keyInsights.push({
                        source: 'contractAnalyzer',
                        insight: `Contract quality score: ${result.scores?.overall?.score || 'N/A'}`,
                        confidence: result.confidence || 0
                    });
                    if (result.riskAssessment) {
                        synthesis.riskFactors.push(...result.riskAssessment.factors);
                    }
                    break;

                case 'emotionalIntelligence':
                    if (result.scores) {
                        synthesis.keyInsights.push({
                            source: 'emotionalIntelligence',
                            insight: `Authenticity score: ${result.scores.overall}%`,
                            confidence: result.confidence || 0
                        });
                    }
                    if (result.manipulationRisk) {
                        synthesis.riskFactors.push({
                            factor: 'manipulation_risk',
                            level: result.manipulationRisk.riskLevel,
                            details: result.manipulationRisk.detectedTactics
                        });
                    }
                    break;

                case 'progressOptimizer':
                    if (result.progressScore) {
                        synthesis.keyInsights.push({
                            source: 'progressOptimizer',
                            insight: `Progress score: ${result.progressScore.overall}%`,
                            confidence: 85
                        });
                    }
                    if (result.bottlenecks) {
                        synthesis.riskFactors.push(...result.bottlenecks.map(b => ({
                            factor: b.type + '_bottleneck',
                            level: b.severity,
                            details: b.indicators
                        })));
                    }
                    break;

                case 'mediationEngine':
                    if (result.progressTracking) {
                        synthesis.keyInsights.push({
                            source: 'mediationEngine',
                            insight: `Mediation phase: ${result.progressTracking.phase}`,
                            confidence: 80
                        });
                    }
                    break;
            }
        });

        // Calculate overall confidence
        const confidenceScores = synthesis.keyInsights.map(i => i.confidence).filter(c => c > 0);
        synthesis.confidence = confidenceScores.length > 0 ?
            Math.round(confidenceScores.reduce((sum, c) => sum + c, 0) / confidenceScores.length) : 0;

        return synthesis;
    }

    async generateUnifiedRecommendations(coordination) {
        const recommendations = [];
        const agentResults = coordination.agentResults;

        // Collect recommendations from all agents
        Object.keys(agentResults).forEach(agentName => {
            const result = agentResults[agentName];
            if (result.recommendations) {
                result.recommendations.forEach(rec => {
                    recommendations.push({
                        ...rec,
                        source: agentName,
                        coordinationId: coordination.id
                    });
                });
            }
        });

        // Prioritize and deduplicate recommendations
        const prioritizedRecommendations = this.prioritizeRecommendations(recommendations);
        const deduplicatedRecommendations = this.deduplicateRecommendations(prioritizedRecommendations);

        // Add coordination-level recommendations
        const coordinationRecommendations = this.generateCoordinationRecommendations(coordination);

        return [...deduplicatedRecommendations, ...coordinationRecommendations];
    }

    // Event processing methods
    async processEventQueue() {
        this.processingQueue = true;

        while (this.eventQueue.length > 0) {
            const event = this.eventQueue.shift();

            try {
                await this.processEvent(event);
            } catch (error) {
                console.error('Event processing failed:', error);
                event.status = 'failed';
                event.error = error.message;
            }
        }

        this.processingQueue = false;
    }

    async processEvent(eventProcessing) {
        const startTime = Date.now();

        // Route event to appropriate agents
        for (const agentName of eventProcessing.involvedAgents) {
            try {
                const response = await this.routeEventToAgent(agentName, eventProcessing.event);
                eventProcessing.responses[agentName] = response;
            } catch (error) {
                eventProcessing.responses[agentName] = { error: error.message };
            }
        }

        // Coordinate responses
        eventProcessing.coordinatedAction = await this.coordinateEventResponses(eventProcessing);
        eventProcessing.status = 'completed';
        eventProcessing.processingTime = Date.now() - startTime;

        return eventProcessing;
    }

    async handleCriticalEvent(eventProcessing) {
        // Immediate processing for critical events
        const criticalResponse = {
            eventId: eventProcessing.id,
            timestamp: new Date().toISOString(),
            priority: 'critical',
            immediateActions: [],
            alertsSent: [],
            status: 'handled'
        };

        // Determine immediate actions based on event type
        switch (eventProcessing.event.type) {
            case 'emotional_crisis':
                criticalResponse.immediateActions.push('activate_emotional_support');
                criticalResponse.immediateActions.push('notify_emergency_contacts');
                break;

            case 'immediate_safety':
                criticalResponse.immediateActions.push('activate_safety_protocol');
                criticalResponse.immediateActions.push('contact_authorities');
                break;

            case 'contract_violation':
                criticalResponse.immediateActions.push('document_violation');
                criticalResponse.immediateActions.push('notify_stakeholders');
                break;
        }

        return criticalResponse;
    }

    // Health monitoring and maintenance
    async performHealthCheck() {
        const healthCheck = {
            timestamp: new Date().toISOString(),
            overallStatus: 'operational',
            agentStatus: {},
            issues: [],
            recommendations: []
        };

        // Check each agent
        Object.keys(this.agents).forEach(agentName => {
            const agent = this.agents[agentName];
            if (agent) {
                healthCheck.agentStatus[agentName] = {
                    status: 'operational',
                    lastActivity: this.getLastAgentActivity(agentName),
                    performance: this.getAgentPerformanceMetrics(agentName)
                };
            } else {
                healthCheck.agentStatus[agentName] = {
                    status: 'unavailable',
                    issue: 'Agent not initialized'
                };
                healthCheck.issues.push(`${agentName} is not available`);
            }
        });

        // Check system resources
        healthCheck.systemResources = {
            memory: this.checkMemoryUsage(),
            eventQueueSize: this.eventQueue.length,
            activeCoordinations: this.activeCoordinations.size
        };

        // Determine overall status
        const unavailableAgents = Object.values(healthCheck.agentStatus)
            .filter(status => status.status === 'unavailable').length;

        if (unavailableAgents > 0) {
            healthCheck.overallStatus = unavailableAgents > 2 ? 'critical' : 'degraded';
        }

        this.systemHealth = healthCheck;
        return healthCheck;
    }

    // Utility methods
    determinePriority(context) {
        if (context.emergency || context.safety_risk) return 'critical';
        if (context.escalation_risk || context.deadline_approaching) return 'high';
        if (context.optimization_opportunity) return 'medium';
        return 'low';
    }

    assessEventPriority(event) {
        const criticalTypes = ['emotional_crisis', 'immediate_safety', 'contract_violation'];
        const highTypes = ['progress_stall', 'escalation_risk', 'authenticity_concern'];
        const mediumTypes = ['optimization_opportunity', 'milestone_approaching', 'engagement_decline'];

        if (criticalTypes.includes(event.type)) return 'critical';
        if (highTypes.includes(event.type)) return 'high';
        if (mediumTypes.includes(event.type)) return 'medium';
        return 'low';
    }

    identifyInvolvedAgents(event) {
        const agentMap = {
            contract_analysis: ['contractAnalyzer'],
            emotional_event: ['emotionalIntelligence'],
            communication_event: ['mediationEngine', 'emotionalIntelligence'],
            progress_event: ['progressOptimizer'],
            multi_party_event: ['mediationEngine', 'progressOptimizer']
        };

        return agentMap[event.category] || ['contractAnalyzer', 'emotionalIntelligence', 'progressOptimizer'];
    }

    generateAnalysisId() {
        return 'analysis_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateEventId() {
        return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateInterventionId() {
        return 'intervention_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    logAgentCommunication(logEntry) {
        this.agentCommunicationLog.push(logEntry);

        // Keep only last 1000 entries
        if (this.agentCommunicationLog.length > 1000) {
            this.agentCommunicationLog = this.agentCommunicationLog.slice(-1000);
        }
    }

    // Public API methods
    getSystemStatus() {
        return {
            health: this.systemHealth,
            activeCoordinations: this.activeCoordinations.size,
            eventQueueSize: this.eventQueue.length,
            agentCommunicationLog: this.agentCommunicationLog.slice(-10) // Last 10 entries
        };
    }

    getActiveCoordinations() {
        return Array.from(this.activeCoordinations.values());
    }

    getCoordination(coordinationId) {
        return this.activeCoordinations.get(coordinationId);
    }

    stopEventProcessing() {
        this.processingQueue = false;
    }

    startEventProcessing() {
        if (!this.processingQueue && this.eventQueue.length > 0) {
            this.processEventQueue();
        }
    }

    // Placeholder methods for complex operations (would be fully implemented in production)
    prioritizeRecommendations(recommendations) {
        return recommendations.sort((a, b) => {
            const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        });
    }

    deduplicateRecommendations(recommendations) {
        const seen = new Set();
        return recommendations.filter(rec => {
            const key = rec.action + rec.category;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    generateCoordinationRecommendations(coordination) {
        return [{
            category: 'coordination',
            priority: 'medium',
            action: 'Continue coordinated monitoring of repair process',
            reason: 'Multiple agents are actively monitoring this process',
            source: 'coordinator'
        }];
    }

    getLastAgentActivity(agentName) {
        const recent = this.agentCommunicationLog
            .filter(log => log.agent === agentName)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
        return recent?.timestamp || null;
    }

    getAgentPerformanceMetrics(agentName) {
        const logs = this.agentCommunicationLog.filter(log => log.agent === agentName);
        const successRate = logs.length > 0 ?
            logs.filter(log => log.success).length / logs.length : 0;
        const avgExecutionTime = logs.length > 0 ?
            logs.reduce((sum, log) => sum + log.executionTime, 0) / logs.length : 0;

        return {
            successRate: Math.round(successRate * 100),
            averageExecutionTime: Math.round(avgExecutionTime),
            totalCalls: logs.length
        };
    }

    checkMemoryUsage() {
        // Simplified memory check
        return {
            coordinationsCount: this.activeCoordinations.size,
            eventQueueSize: this.eventQueue.length,
            logSize: this.agentCommunicationLog.length
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AgentCoordinator;
} else if (typeof window !== 'undefined') {
    window.AgentCoordinator = AgentCoordinator;
}