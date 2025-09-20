/**
 * REPAIR Protocol AI Integrator
 * Provides seamless integration with existing HTML forms
 * Real-time agent feedback and analysis
 */

(function() {
    'use strict';

    window.RepairIntegrator = {
        // Configuration
        config: {
            analysisDelay: 1000, // ms delay for real-time analysis
            minTextLength: 10,
            empathyKeywords: ['sorry', 'apologize', 'understand', 'hurt', 'pain', 'regret', 'mistake', 'wrong'],
            sincerityKeywords: ['commit', 'promise', 'will', 'change', 'learn', 'better', 'improve'],
            riskKeywords: ['but', 'however', 'if only', 'you made me', 'not my fault', 'overreacting'],
            biasIndicators: ['not that bad', 'others do worse', 'too sensitive', 'accident', 'didn\'t mean to']
        },

        // State management
        state: {
            currentAnalysis: {},
            phaseScores: {},
            riskLevel: 'low',
            recommendations: [],
            progressMetrics: {
                empathy: 0,
                sincerity: 0,
                completeness: 0,
                riskMitigation: 0
            }
        },

        // Initialize the integrator
        initialize: function() {
            console.log('REPAIR Protocol AI Integrator initialized');
            this.setupAnalysisTimers();
            this.initializeUI();
            this.loadProgressData();
        },

        // Setup real-time analysis timers
        setupAnalysisTimers: function() {
            this.analysisTimer = null;
        },

        // Initialize UI components
        initializeUI: function() {
            this.updateAgentStatus('Ready to analyze your REPAIR Protocol journey');
            this.updateProgressMetrics();
        },

        // Load any existing progress data
        loadProgressData: function() {
            // In a real implementation, this would load from a backend or localStorage
            console.log('Loading progress data...');
        },

        // Main analysis function triggered by form changes
        analyzeFormData: function(formData) {
            if (this.analysisTimer) {
                clearTimeout(this.analysisTimer);
            }

            this.analysisTimer = setTimeout(() => {
                this.performAnalysis(formData);
            }, this.config.analysisDelay);
        },

        // Perform comprehensive analysis
        performAnalysis: function(formData) {
            console.log('Performing AI analysis...', formData);

            const analysis = {
                textAnalysis: this.analyzeText(formData),
                empathyScore: this.calculateEmpathyScore(formData),
                sincerityScore: this.calculateSincerityScore(formData),
                completenessScore: this.calculateCompletenessScore(formData),
                riskAssessment: this.assessRisks(formData),
                recommendations: this.generateRecommendations(formData)
            };

            this.state.currentAnalysis = analysis;
            this.updateUI(analysis);
        },

        // Analyze text content for various metrics
        analyzeText: function(formData) {
            let allText = Object.values(formData)
                .filter(value => typeof value === 'string')
                .join(' ')
                .toLowerCase();

            return {
                wordCount: allText.split(' ').length,
                sentimentScore: this.analyzeSentiment(allText),
                biasDetection: this.detectBias(allText),
                clarityScore: this.assessClarity(allText)
            };
        },

        // Calculate empathy score based on language patterns
        calculateEmpathyScore: function(formData) {
            let score = 0;
            let totalText = '';

            // Focus on emotional impact and responsibility sections
            const relevantFields = [
                formData.emotionalImpact,
                formData.responsibility,
                formData.acknowledgmentStatement,
                formData.apologyText
            ];

            relevantFields.forEach(text => {
                if (text) {
                    totalText += text.toLowerCase() + ' ';
                }
            });

            // Check for empathy keywords
            this.config.empathyKeywords.forEach(keyword => {
                if (totalText.includes(keyword)) {
                    score += 10;
                }
            });

            // Check for perspective-taking language
            if (totalText.includes('you must have felt') ||
                totalText.includes('i can imagine') ||
                totalText.includes('from your perspective')) {
                score += 20;
            }

            // Penalize for defensive language
            this.config.riskKeywords.forEach(keyword => {
                if (totalText.includes(keyword)) {
                    score -= 15;
                }
            });

            return Math.max(0, Math.min(100, score));
        },

        // Calculate sincerity score
        calculateSincerityScore: function(formData) {
            let score = 50; // Base score
            let totalText = '';

            const relevantFields = [
                formData.changeCommitment,
                formData.amendsProposal,
                formData.apologyText,
                formData.immediateActions
            ];

            relevantFields.forEach(text => {
                if (text) {
                    totalText += text.toLowerCase() + ' ';
                }
            });

            // Look for concrete commitments
            this.config.sincerityKeywords.forEach(keyword => {
                if (totalText.includes(keyword)) {
                    score += 8;
                }
            });

            // Check for specific, actionable language
            if (totalText.includes('i will') && totalText.length > 100) {
                score += 15;
            }

            // Check for timeline specificity
            if (totalText.includes('by') || totalText.includes('within') ||
                totalText.includes('every') || totalText.includes('daily')) {
                score += 10;
            }

            return Math.max(0, Math.min(100, score));
        },

        // Calculate completeness score
        calculateCompletenessScore: function(formData) {
            let filledFields = 0;
            let totalFields = 0;
            let weightedScore = 0;

            // Define field weights based on importance
            const fieldWeights = {
                harmDescription: 10,
                specificActions: 10,
                responsibility: 10,
                emotionalImpact: 10,
                acknowledgmentStatement: 8,
                changeCommitment: 8,
                amendsProposal: 8,
                apologyText: 10,
                immediateActions: 6,
                longTermChanges: 6,
                directImpacts: 8,
                secondaryEffects: 6,
                systemicImplications: 6,
                trustMetrics: 5,
                healingIndicators: 5
            };

            Object.keys(fieldWeights).forEach(field => {
                totalFields += fieldWeights[field];
                if (formData[field] && formData[field].length > this.config.minTextLength) {
                    filledFields += fieldWeights[field];

                    // Bonus for comprehensive responses
                    if (formData[field].length > 50) {
                        weightedScore += fieldWeights[field] * 0.1;
                    }
                }
            });

            const baseScore = (filledFields / totalFields) * 100;
            return Math.min(100, baseScore + weightedScore);
        },

        // Assess potential risks in the response
        assessRisks: function(formData) {
            const risks = [];
            let riskLevel = 'low';

            const allText = Object.values(formData)
                .filter(value => typeof value === 'string')
                .join(' ')
                .toLowerCase();

            // Check for bias indicators
            this.config.biasIndicators.forEach(indicator => {
                if (allText.includes(indicator)) {
                    risks.push({
                        type: 'bias',
                        severity: 'medium',
                        message: `Potential bias detected: "${indicator}"`
                    });
                    riskLevel = 'medium';
                }
            });

            // Check for deflection patterns
            if (allText.includes('but ') || allText.includes('however ')) {
                const deflectionCount = (allText.match(/but |however /g) || []).length;
                if (deflectionCount > 2) {
                    risks.push({
                        type: 'deflection',
                        severity: 'high',
                        message: 'Multiple deflection patterns detected'
                    });
                    riskLevel = 'high';
                }
            }

            // Check for victim blaming
            if (allText.includes('you ') &&
                (allText.includes('made me') || allText.includes('caused me'))) {
                risks.push({
                    type: 'victim_blaming',
                    severity: 'high',
                    message: 'Potential victim blaming language detected'
                });
                riskLevel = 'high';
            }

            // Check for insufficient empathy
            const empathyScore = this.calculateEmpathyScore(formData);
            if (empathyScore < 30) {
                risks.push({
                    type: 'low_empathy',
                    severity: 'medium',
                    message: 'Low empathy indicators - consider focusing more on the other person\'s experience'
                });
                if (riskLevel === 'low') riskLevel = 'medium';
            }

            this.state.riskLevel = riskLevel;
            return risks;
        },

        // Generate personalized recommendations
        generateRecommendations: function(formData) {
            const recommendations = [];
            const empathyScore = this.calculateEmpathyScore(formData);
            const sincerityScore = this.calculateSincerityScore(formData);
            const completenessScore = this.calculateCompletenessScore(formData);

            // Empathy recommendations
            if (empathyScore < 50) {
                recommendations.push({
                    type: 'empathy',
                    priority: 'high',
                    message: 'Consider adding more perspective-taking language like "You must have felt..." or "I can imagine how..."'
                });
            }

            // Sincerity recommendations
            if (sincerityScore < 50) {
                recommendations.push({
                    type: 'sincerity',
                    priority: 'high',
                    message: 'Include more specific commitments with timelines and concrete actions'
                });
            }

            // Completeness recommendations
            if (completenessScore < 70) {
                recommendations.push({
                    type: 'completeness',
                    priority: 'medium',
                    message: 'Provide more detailed responses in key sections for a more comprehensive approach'
                });
            }

            // Phase-specific recommendations
            if (!formData.directImpacts || formData.directImpacts.length < 50) {
                recommendations.push({
                    type: 'analysis',
                    priority: 'medium',
                    message: 'Expand on the direct impacts to show deeper understanding of consequences'
                });
            }

            return recommendations;
        },

        // Analyze sentiment of text
        analyzeSentiment: function(text) {
            // Simplified sentiment analysis
            const positiveWords = ['sorry', 'committed', 'change', 'better', 'understand', 'learn'];
            const negativeWords = ['but', 'however', 'if', 'fault', 'blame'];

            let score = 0;
            positiveWords.forEach(word => {
                if (text.includes(word)) score += 1;
            });
            negativeWords.forEach(word => {
                if (text.includes(word)) score -= 1;
            });

            return score;
        },

        // Detect bias patterns
        detectBias: function(text) {
            const biases = [];

            this.config.biasIndicators.forEach(indicator => {
                if (text.includes(indicator)) {
                    biases.push(indicator);
                }
            });

            return biases;
        },

        // Assess clarity of communication
        assessClarity: function(text) {
            // Simple clarity metrics
            const sentences = text.split(/[.!?]+/).length;
            const words = text.split(' ').length;
            const avgWordsPerSentence = words / sentences;

            // Prefer moderate sentence length for clarity
            if (avgWordsPerSentence < 10 || avgWordsPerSentence > 25) {
                return 60;
            }
            return 85;
        },

        // Provide real-time feedback for specific fields
        provideFeedback: function(fieldName, value, currentPhase) {
            if (!value || value.length < 5) return;

            const feedback = this.generateFieldFeedback(fieldName, value, currentPhase);
            this.showFeedbackPopup(feedback);
        },

        // Generate field-specific feedback
        generateFieldFeedback: function(fieldName, value, phase) {
            const feedback = {
                field: fieldName,
                phase: phase,
                suggestions: []
            };

            switch (fieldName) {
                case 'harmDescription':
                    if (value.length < 50) {
                        feedback.suggestions.push('Consider providing more specific details about what happened');
                    }
                    break;

                case 'emotionalImpact':
                    const empathyWords = this.config.empathyKeywords.filter(word =>
                        value.toLowerCase().includes(word)
                    );
                    if (empathyWords.length === 0) {
                        feedback.suggestions.push('Try including words that show emotional understanding');
                    }
                    break;

                case 'apologyText':
                    if (!value.toLowerCase().includes('i acknowledge')) {
                        feedback.suggestions.push('Consider starting with "I acknowledge that..."');
                    }
                    if (!value.toLowerCase().includes('i will')) {
                        feedback.suggestions.push('Include specific commitments using "I will..."');
                    }
                    break;
            }

            return feedback;
        },

        // Show feedback popup
        showFeedbackPopup: function(feedback) {
            if (feedback.suggestions.length > 0) {
                const popup = document.getElementById('ai-popup');
                const content = document.getElementById('popup-content');

                content.innerHTML = `
                    <strong>💡 AI Suggestion:</strong><br>
                    ${feedback.suggestions[0]}
                `;

                popup.classList.add('show');

                setTimeout(() => {
                    popup.classList.remove('show');
                }, 5000);
            }
        },

        // Analyze specific phase completion
        analyzePhase: function(phaseIndex, formData) {
            console.log(`Analyzing phase ${phaseIndex}...`);

            const phaseAnalysis = this.getPhaseSpecificAnalysis(phaseIndex, formData);
            this.updatePhaseInsights(phaseAnalysis);
            this.updateProgressMetrics();
        },

        // Get phase-specific analysis
        getPhaseSpecificAnalysis: function(phaseIndex, formData) {
            const phaseNames = ['Assessment', 'Recognize', 'Examine', 'Prepare', 'Articulate', 'Implement', 'Restore', 'Contract'];
            const phaseName = phaseNames[phaseIndex];

            const analysis = {
                phase: phaseName,
                insights: [],
                warnings: [],
                suggestions: []
            };

            switch (phaseIndex) {
                case 0: // Assessment
                    if (formData.harmSeverity === 'severe' && formData.readiness !== 'fully') {
                        analysis.warnings.push('Severe harm with limited readiness may require additional support');
                    }
                    analysis.insights.push('Assessment complete - ready for recognition phase');
                    break;

                case 1: // Recognize
                    const empathyScore = this.calculateEmpathyScore(formData);
                    if (empathyScore < 40) {
                        analysis.warnings.push('Low empathy indicators detected');
                        analysis.suggestions.push('Focus more on the other person\'s perspective');
                    }
                    break;

                case 4: // Articulate
                    if (formData.apologyText && formData.apologyText.length > 200) {
                        analysis.insights.push('Comprehensive apology structure detected');
                    } else {
                        analysis.suggestions.push('Consider expanding your apology for completeness');
                    }
                    break;
            }

            return analysis;
        },

        // Update UI components
        updateUI: function(analysis) {
            this.updateAgentStatus('Analysis complete');
            this.updateProgressMetrics();
            this.updateInsights(analysis.recommendations);
            this.updateRiskWarnings(analysis.riskAssessment);
        },

        // Update agent status
        updateAgentStatus: function(status) {
            const statusElement = document.getElementById('status-text');
            if (statusElement) {
                statusElement.textContent = status;
            }

            const agentStatus = document.getElementById('agent-status');
            if (agentStatus) {
                agentStatus.className = 'agent-status';
                if (status.includes('analyzing')) {
                    agentStatus.classList.add('analyzing');
                } else if (status.includes('warning') || status.includes('risk')) {
                    agentStatus.classList.add('warning');
                }
            }
        },

        // Update progress metrics
        updateProgressMetrics: function() {
            const metrics = this.state.progressMetrics;

            // Update empathy gauge
            this.updateGauge('empathy', metrics.empathy);
            this.updateGauge('sincerity', metrics.sincerity);
            this.updateGauge('completeness', metrics.completeness);
        },

        // Update individual gauge
        updateGauge: function(type, value) {
            const gauge = document.getElementById(`${type}-gauge`);
            const score = document.getElementById(`${type}-score`);

            if (gauge && score) {
                gauge.style.width = `${value}%`;
                score.textContent = `${Math.round(value)}%`;
            }
        },

        // Update insights panel
        updateInsights: function(recommendations) {
            const insightsList = document.getElementById('insights-list');
            if (!insightsList || !recommendations) return;

            insightsList.innerHTML = '';

            if (recommendations.length === 0) {
                insightsList.innerHTML = '<div class="insight-item">Looking good! Continue with your thoughtful responses.</div>';
                return;
            }

            recommendations.slice(0, 3).forEach(rec => {
                const insight = document.createElement('div');
                insight.className = `insight-item ${rec.type}`;
                insight.textContent = rec.message;
                insightsList.appendChild(insight);
            });
        },

        // Update risk warnings
        updateRiskWarnings: function(risks) {
            const warningsPanel = document.getElementById('risk-warnings');
            const warningsList = document.getElementById('warnings-list');

            if (!warningsPanel || !warningsList) return;

            if (risks.length === 0) {
                warningsPanel.style.display = 'none';
                return;
            }

            warningsPanel.style.display = 'block';
            warningsList.innerHTML = '';

            risks.forEach(risk => {
                const warning = document.createElement('div');
                warning.className = `insight-item ${risk.type}`;
                warning.innerHTML = `<strong>${risk.severity.toUpperCase()}:</strong> ${risk.message}`;
                warningsList.appendChild(warning);
            });
        },

        // Update phase-specific insights
        updatePhaseInsights: function(phaseAnalysis) {
            // Update insights based on phase analysis
            const allInsights = [
                ...phaseAnalysis.insights.map(insight => ({ type: 'suggestion', message: insight })),
                ...phaseAnalysis.suggestions.map(suggestion => ({ type: 'suggestion', message: suggestion }))
            ];

            this.updateInsights(allInsights);

            // Update warnings
            if (phaseAnalysis.warnings.length > 0) {
                const riskAssessment = phaseAnalysis.warnings.map(warning => ({
                    type: 'phase_warning',
                    severity: 'medium',
                    message: warning
                }));
                this.updateRiskWarnings(riskAssessment);
            }
        },

        // Finalize contract with AI enhancements
        finalizeContract: function(formData) {
            console.log('Finalizing AI-enhanced contract...');

            // Perform final analysis
            const finalAnalysis = this.performFinalAnalysis(formData);

            // Update metrics
            this.state.progressMetrics = {
                empathy: this.calculateEmpathyScore(formData),
                sincerity: this.calculateSincerityScore(formData),
                completeness: this.calculateCompletenessScore(formData),
                riskMitigation: Math.max(0, 100 - (this.assessRisks(formData).length * 20))
            };

            this.updateProgressMetrics();
            this.updateAgentStatus('Contract finalized with AI insights');

            // Generate final report
            this.generateFinalReport(finalAnalysis);
        },

        // Perform final comprehensive analysis
        performFinalAnalysis: function(formData) {
            return {
                overallScore: (
                    this.calculateEmpathyScore(formData) +
                    this.calculateSincerityScore(formData) +
                    this.calculateCompletenessScore(formData)
                ) / 3,
                strengths: this.identifyStrengths(formData),
                areasForImprovement: this.identifyImprovements(formData),
                riskAssessment: this.assessRisks(formData),
                recommendedFollowUp: this.generateFollowUpPlan(formData)
            };
        },

        // Identify strengths in the submission
        identifyStrengths: function(formData) {
            const strengths = [];

            if (this.calculateEmpathyScore(formData) > 70) {
                strengths.push('Strong empathy and perspective-taking');
            }

            if (this.calculateSincerityScore(formData) > 70) {
                strengths.push('Clear commitments and actionable plans');
            }

            if (formData.amendsProposal && formData.amendsProposal.length > 100) {
                strengths.push('Comprehensive amends proposal');
            }

            return strengths;
        },

        // Identify areas for improvement
        identifyImprovements: function(formData) {
            const improvements = [];

            if (this.calculateEmpathyScore(formData) < 50) {
                improvements.push('Develop stronger empathy and perspective-taking skills');
            }

            if (!formData.timeline || formData.timeline.length < 50) {
                improvements.push('Create more detailed implementation timeline');
            }

            return improvements;
        },

        // Generate follow-up plan
        generateFollowUpPlan: function(formData) {
            const plan = [];

            plan.push('Continue with AI coach for ongoing support');
            plan.push('Schedule regular progress check-ins');

            if (this.state.riskLevel === 'high') {
                plan.push('Consider professional mediation support');
            }

            return plan;
        },

        // Generate final report
        generateFinalReport: function(analysis) {
            console.log('Final AI Analysis Report:', analysis);

            // In a real implementation, this would save the report
            // and potentially display it in the UI

            this.updateAgentStatus(`Final analysis complete - Overall score: ${Math.round(analysis.overallScore)}%`);
        }
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            window.RepairIntegrator.initialize();
        });
    } else {
        window.RepairIntegrator.initialize();
    }

})();