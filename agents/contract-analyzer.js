/**
 * REPAIR Protocol - Contract Analyzer Agent
 * Advanced contract parsing, quality scoring, and improvement suggestions
 */

class ContractAnalyzer {
    constructor() {
        this.analysisMetrics = {
            specificity: ['specific timeframes', 'concrete actions', 'measurable outcomes', 'clear deliverables'],
            measurability: ['quantitative metrics', 'verifiable milestones', 'objective criteria', 'tracking mechanisms'],
            achievability: ['realistic timelines', 'available resources', 'practical constraints', 'past performance']
        };

        this.riskFactors = [
            'vague commitments',
            'unrealistic timelines',
            'resource constraints',
            'external dependencies',
            'communication barriers',
            'trust deficits',
            'emotional volatility'
        ];

        this.historicalPatterns = new Map();
        this.initializePatterns();
    }

    initializePatterns() {
        // Historical success patterns based on contract characteristics
        this.historicalPatterns.set('high_specificity_high_measurability', 0.85);
        this.historicalPatterns.set('medium_specificity_high_measurability', 0.72);
        this.historicalPatterns.set('high_specificity_medium_measurability', 0.68);
        this.historicalPatterns.set('low_specificity_any_measurability', 0.34);
        this.historicalPatterns.set('any_specificity_low_measurability', 0.41);
    }

    /**
     * Analyze a repair contract comprehensively
     * @param {Object} contract - The repair contract to analyze
     * @returns {Object} Comprehensive analysis results
     */
    analyzeContract(contract) {
        const startTime = Date.now();

        const analysis = {
            id: this.generateAnalysisId(),
            timestamp: new Date().toISOString(),
            contract: contract,
            scores: this.calculateQualityScores(contract),
            riskAssessment: this.assessRisks(contract),
            successPrediction: this.predictSuccess(contract),
            improvements: this.generateImprovements(contract),
            timeline: this.analyzeTimeline(contract),
            dependencies: this.identifyDependencies(contract),
            confidence: 0,
            processingTime: 0
        };

        analysis.confidence = this.calculateConfidence(analysis);
        analysis.processingTime = Date.now() - startTime;

        return analysis;
    }

    /**
     * Calculate quality scores for different aspects of the contract
     */
    calculateQualityScores(contract) {
        const specificityScore = this.scoreSpecificity(contract);
        const measurabilityScore = this.scoreMeasurability(contract);
        const achievabilityScore = this.scoreAchievability(contract);

        return {
            specificity: {
                score: specificityScore.score,
                details: specificityScore.details,
                category: this.categorizeScore(specificityScore.score)
            },
            measurability: {
                score: measurabilityScore.score,
                details: measurabilityScore.details,
                category: this.categorizeScore(measurabilityScore.score)
            },
            achievability: {
                score: achievabilityScore.score,
                details: achievabilityScore.details,
                category: this.categorizeScore(achievabilityScore.score)
            },
            overall: this.calculateOverallScore(specificityScore.score, measurabilityScore.score, achievabilityScore.score)
        };
    }

    scoreSpecificity(contract) {
        let score = 0;
        const details = [];
        const text = this.getContractText(contract);

        // Check for specific timeframes
        const timeframePatterms = [
            /within \d+ (days?|weeks?|months?)/gi,
            /by (january|february|march|april|may|june|july|august|september|october|november|december)/gi,
            /on \d{1,2}\/\d{1,2}\/\d{4}/gi,
            /every (day|week|month)/gi
        ];

        let timeframeMatches = 0;
        timeframePatterms.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) {
                timeframeMatches += matches.length;
                details.push(`Found ${matches.length} specific timeframe(s): ${matches.join(', ')}`);
            }
        });

        score += Math.min(timeframeMatches * 15, 30);

        // Check for concrete actions
        const actionWords = ['will', 'shall', 'must', 'commit to', 'agree to', 'promise to'];
        let actionCount = 0;
        actionWords.forEach(word => {
            const regex = new RegExp(word, 'gi');
            const matches = text.match(regex);
            if (matches) actionCount += matches.length;
        });

        score += Math.min(actionCount * 8, 25);
        if (actionCount > 0) {
            details.push(`Found ${actionCount} concrete action commitment(s)`);
        }

        // Check for measurable outcomes
        const quantifiablePatterns = [
            /\d+(\.\d+)?\s*(percent|%|dollars?|\$|hours?|points?|times?)/gi,
            /increase by/gi,
            /reduce by/gi,
            /complete \d+/gi
        ];

        let quantifiableMatches = 0;
        quantifiablePatterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) {
                quantifiableMatches += matches.length;
            }
        });

        score += Math.min(quantifiableMatches * 12, 25);
        if (quantifiableMatches > 0) {
            details.push(`Found ${quantifiableMatches} quantifiable outcome(s)`);
        }

        // Penalty for vague language
        const vagueWords = ['try', 'attempt', 'hope', 'maybe', 'possibly', 'might', 'could'];
        let vagueCount = 0;
        vagueWords.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            const matches = text.match(regex);
            if (matches) vagueCount += matches.length;
        });

        score -= vagueCount * 5;
        if (vagueCount > 0) {
            details.push(`Warning: ${vagueCount} vague term(s) detected`);
        }

        return {
            score: Math.max(0, Math.min(100, score)),
            details
        };
    }

    scoreMeasurability(contract) {
        let score = 0;
        const details = [];
        const text = this.getContractText(contract);

        // Check for quantitative metrics
        const metricPatterns = [
            /\d+(\.\d+)?\s*(metric|kpi|measurement|indicator)/gi,
            /track(ing)?\s+\w+/gi,
            /measure\s+\w+/gi,
            /report\s+(weekly|monthly|quarterly)/gi
        ];

        let metricMatches = 0;
        metricPatterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) metricMatches += matches.length;
        });

        score += Math.min(metricMatches * 20, 40);
        if (metricMatches > 0) {
            details.push(`Found ${metricMatches} measurement mechanism(s)`);
        }

        // Check for verification methods
        const verificationWords = ['verify', 'confirm', 'validate', 'check', 'review', 'audit'];
        let verificationCount = 0;
        verificationWords.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            const matches = text.match(regex);
            if (matches) verificationCount += matches.length;
        });

        score += Math.min(verificationCount * 10, 30);
        if (verificationCount > 0) {
            details.push(`Found ${verificationCount} verification method(s)`);
        }

        // Check for milestone definitions
        const milestonePatterns = [
            /milestone/gi,
            /checkpoint/gi,
            /deliverable/gi,
            /phase \d+/gi
        ];

        let milestoneMatches = 0;
        milestonePatterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) milestoneMatches += matches.length;
        });

        score += Math.min(milestoneMatches * 15, 30);
        if (milestoneMatches > 0) {
            details.push(`Found ${milestoneMatches} milestone(s)/deliverable(s)`);
        }

        return {
            score: Math.max(0, Math.min(100, score)),
            details
        };
    }

    scoreAchievability(contract) {
        let score = 70; // Start with neutral score
        const details = [];
        const text = this.getContractText(contract);

        // Analyze timeline realism
        const timelineAnalysis = this.analyzeTimelineRealism(contract);
        score += timelineAnalysis.adjustment;
        details.push(...timelineAnalysis.details);

        // Check for resource availability mentions
        const resourcePatterns = [
            /budget/gi,
            /resource/gi,
            /team/gi,
            /support/gi,
            /funding/gi
        ];

        let resourceMentions = 0;
        resourcePatterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) resourceMentions += matches.length;
        });

        if (resourceMentions > 0) {
            score += 10;
            details.push(`Resource planning mentioned ${resourceMentions} time(s)`);
        }

        // Check for constraint acknowledgment
        const constraintWords = ['challenge', 'difficulty', 'limitation', 'constraint', 'barrier'];
        let constraintCount = 0;
        constraintWords.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            const matches = text.match(regex);
            if (matches) constraintCount += matches.length;
        });

        if (constraintCount > 0) {
            score += 5;
            details.push(`Constraints acknowledged: ${constraintCount} mention(s)`);
        }

        // Penalty for overly ambitious language
        const ambitiousWords = ['revolutionary', 'completely', 'entirely', 'perfect', 'flawless'];
        let ambitiousCount = 0;
        ambitiousWords.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            const matches = text.match(regex);
            if (matches) ambitiousCount += matches.length;
        });

        score -= ambitiousCount * 8;
        if (ambitiousCount > 0) {
            details.push(`Warning: ${ambitiousCount} overly ambitious term(s)`);
        }

        return {
            score: Math.max(0, Math.min(100, score)),
            details
        };
    }

    analyzeTimelineRealism(contract) {
        const details = [];
        let adjustment = 0;

        // Extract mentioned timeframes
        const text = this.getContractText(contract);
        const timeframes = text.match(/\d+\s*(day|week|month|year)s?/gi) || [];

        timeframes.forEach(timeframe => {
            const number = parseInt(timeframe.match(/\d+/)[0]);
            const unit = timeframe.match(/(day|week|month|year)/i)[1].toLowerCase();

            let daysEstimate = number;
            switch(unit) {
                case 'week': daysEstimate = number * 7; break;
                case 'month': daysEstimate = number * 30; break;
                case 'year': daysEstimate = number * 365; break;
            }

            if (daysEstimate < 7) {
                adjustment -= 10;
                details.push(`Very short timeline detected: ${timeframe} (may be unrealistic)`);
            } else if (daysEstimate > 365) {
                adjustment -= 5;
                details.push(`Very long timeline detected: ${timeframe} (may lack urgency)`);
            } else {
                adjustment += 5;
                details.push(`Reasonable timeline: ${timeframe}`);
            }
        });

        return { adjustment, details };
    }

    assessRisks(contract) {
        const risks = [];
        const text = this.getContractText(contract);

        // Check each risk factor
        this.riskFactors.forEach(factor => {
            const risk = this.evaluateRiskFactor(factor, contract, text);
            if (risk.level > 0) {
                risks.push(risk);
            }
        });

        // Calculate overall risk level
        const avgRisk = risks.length > 0 ?
            risks.reduce((sum, risk) => sum + risk.level, 0) / risks.length : 0;

        return {
            overall: this.categorizeRisk(avgRisk),
            level: avgRisk,
            factors: risks,
            mitigation: this.suggestRiskMitigation(risks)
        };
    }

    evaluateRiskFactor(factor, contract, text) {
        let level = 0;
        const indicators = [];

        switch(factor) {
            case 'vague commitments':
                const vagueWords = ['try', 'attempt', 'hope', 'maybe', 'possibly'];
                vagueWords.forEach(word => {
                    if (text.toLowerCase().includes(word)) {
                        level += 15;
                        indicators.push(`Contains "${word}"`);
                    }
                });
                break;

            case 'unrealistic timelines':
                const shortTimeframes = text.match(/\d+\s*days?/gi) || [];
                shortTimeframes.forEach(timeframe => {
                    const days = parseInt(timeframe);
                    if (days < 7) {
                        level += 20;
                        indicators.push(`Very short timeframe: ${timeframe}`);
                    }
                });
                break;

            case 'resource constraints':
                if (!text.toLowerCase().includes('budget') &&
                    !text.toLowerCase().includes('resource') &&
                    !text.toLowerCase().includes('support')) {
                    level += 25;
                    indicators.push('No resource planning mentioned');
                }
                break;

            case 'external dependencies':
                const dependencyWords = ['depend', 'require', 'need', 'third party'];
                dependencyWords.forEach(word => {
                    if (text.toLowerCase().includes(word)) {
                        level += 10;
                        indicators.push(`External dependency: ${word}`);
                    }
                });
                break;

            case 'communication barriers':
                if (contract.parties && contract.parties.length > 2) {
                    level += 15;
                    indicators.push(`Multiple parties (${contract.parties.length})`);
                }
                break;

            case 'trust deficits':
                const trustWords = ['distrust', 'doubt', 'skeptical', 'suspicious'];
                trustWords.forEach(word => {
                    if (text.toLowerCase().includes(word)) {
                        level += 20;
                        indicators.push(`Trust issue indicator: ${word}`);
                    }
                });
                break;

            case 'emotional volatility':
                const emotionalWords = ['angry', 'furious', 'devastated', 'betrayed'];
                emotionalWords.forEach(word => {
                    if (text.toLowerCase().includes(word)) {
                        level += 18;
                        indicators.push(`Emotional volatility: ${word}`);
                    }
                });
                break;
        }

        return {
            factor,
            level: Math.min(100, level),
            indicators,
            category: this.categorizeRisk(level)
        };
    }

    predictSuccess(contract) {
        const scores = this.calculateQualityScores(contract);
        const risks = this.assessRisks(contract);

        // Get pattern-based prediction
        const specificityCategory = this.categorizeScore(scores.specificity.score);
        const measurabilityCategory = this.categorizeScore(scores.measurability.score);
        const patternKey = `${specificityCategory}_specificity_${measurabilityCategory}_measurability`;

        let baseProbability = this.historicalPatterns.get(patternKey) || 0.5;

        // Adjust based on achievability
        const achievabilityAdjustment = (scores.achievability.score - 50) / 100 * 0.2;
        baseProbability += achievabilityAdjustment;

        // Adjust based on risk level
        const riskAdjustment = (50 - risks.level) / 100 * 0.3;
        baseProbability += riskAdjustment;

        const finalProbability = Math.max(0, Math.min(1, baseProbability));

        return {
            probability: finalProbability,
            confidence: this.calculatePredictionConfidence(scores, risks),
            factors: {
                specificity: scores.specificity.score,
                measurability: scores.measurability.score,
                achievability: scores.achievability.score,
                riskLevel: risks.level
            },
            category: this.categorizeProbability(finalProbability),
            reasoning: this.generateSuccessReasoning(scores, risks, finalProbability)
        };
    }

    generateImprovements(contract) {
        const improvements = [];
        const scores = this.calculateQualityScores(contract);
        const risks = this.assessRisks(contract);

        // Specificity improvements
        if (scores.specificity.score < 70) {
            improvements.push({
                category: 'specificity',
                priority: 'high',
                suggestion: 'Add specific timeframes and deadlines to commitments',
                example: 'Instead of "soon", specify "within 2 weeks" or "by March 15th"',
                impact: 'high'
            });

            improvements.push({
                category: 'specificity',
                priority: 'medium',
                suggestion: 'Replace vague language with concrete actions',
                example: 'Change "try to improve" to "will implement X, Y, and Z"',
                impact: 'medium'
            });
        }

        // Measurability improvements
        if (scores.measurability.score < 70) {
            improvements.push({
                category: 'measurability',
                priority: 'high',
                suggestion: 'Define clear success metrics and tracking methods',
                example: 'Add "Progress will be measured weekly using X metric"',
                impact: 'high'
            });

            improvements.push({
                category: 'measurability',
                priority: 'medium',
                suggestion: 'Include verification and reporting procedures',
                example: 'Specify who will verify progress and how often',
                impact: 'medium'
            });
        }

        // Achievability improvements
        if (scores.achievability.score < 60) {
            improvements.push({
                category: 'achievability',
                priority: 'high',
                suggestion: 'Break large commitments into smaller, manageable phases',
                example: 'Split 6-month goal into monthly milestones',
                impact: 'high'
            });

            improvements.push({
                category: 'achievability',
                priority: 'medium',
                suggestion: 'Address resource requirements and constraints',
                example: 'Specify budget, time, and support needed',
                impact: 'medium'
            });
        }

        // Risk-based improvements
        risks.factors.forEach(risk => {
            if (risk.level > 30) {
                const mitigation = this.getRiskMitigation(risk.factor);
                if (mitigation) {
                    improvements.push({
                        category: 'risk_mitigation',
                        priority: risk.level > 60 ? 'high' : 'medium',
                        suggestion: mitigation.suggestion,
                        example: mitigation.example,
                        impact: mitigation.impact
                    });
                }
            }
        });

        return improvements.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }

    getRiskMitigation(riskFactor) {
        const mitigations = {
            'vague commitments': {
                suggestion: 'Replace all vague language with specific, actionable commitments',
                example: 'Change "I will try to be better" to "I will attend weekly counseling sessions"',
                impact: 'high'
            },
            'unrealistic timelines': {
                suggestion: 'Extend timelines to realistic durations with buffer time',
                example: 'Change "complete in 3 days" to "complete in 2 weeks"',
                impact: 'medium'
            },
            'resource constraints': {
                suggestion: 'Explicitly plan for required resources and alternatives',
                example: 'Add "Budget of $X allocated" or "Backup plan if resources unavailable"',
                impact: 'high'
            },
            'external dependencies': {
                suggestion: 'Identify dependencies and create contingency plans',
                example: 'List required third-party approvals and backup options',
                impact: 'medium'
            }
        };

        return mitigations[riskFactor];
    }

    analyzeTimeline(contract) {
        const text = this.getContractText(contract);
        const timeframes = [];

        // Extract all timeframes
        const patterns = [
            /within \d+ (days?|weeks?|months?|years?)/gi,
            /in \d+ (days?|weeks?|months?|years?)/gi,
            /by (january|february|march|april|may|june|july|august|september|october|november|december)/gi,
            /every (day|week|month|quarter|year)/gi
        ];

        patterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) {
                matches.forEach(match => {
                    timeframes.push({
                        text: match,
                        type: this.categorizeTimeframe(match),
                        estimated_days: this.convertTosDays(match)
                    });
                });
            }
        });

        return {
            timeframes,
            total_duration: this.calculateTotalDuration(timeframes),
            critical_path: this.identifyCriticalPath(timeframes),
            feasibility: this.assessTimelineFeasibility(timeframes)
        };
    }

    identifyDependencies(contract) {
        const text = this.getContractText(contract);
        const dependencies = [];

        // Look for dependency indicators
        const dependencyPatterns = [
            /depend(s|ent) on/gi,
            /require(s|d)/gi,
            /need(s|ed)/gi,
            /after \w+/gi,
            /once \w+/gi,
            /when \w+/gi
        ];

        dependencyPatterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) {
                matches.forEach(match => {
                    dependencies.push({
                        type: 'conditional',
                        description: match,
                        risk_level: 'medium'
                    });
                });
            }
        });

        // Look for external party dependencies
        if (contract.parties && contract.parties.length > 2) {
            dependencies.push({
                type: 'multi_party',
                description: `Involves ${contract.parties.length} parties`,
                risk_level: 'high'
            });
        }

        return {
            count: dependencies.length,
            items: dependencies,
            risk_assessment: this.assessDependencyRisk(dependencies)
        };
    }

    // Utility methods
    getContractText(contract) {
        if (typeof contract === 'string') return contract;
        if (contract.text) return contract.text;
        if (contract.content) return contract.content;
        if (contract.commitments) return JSON.stringify(contract.commitments);
        return JSON.stringify(contract);
    }

    categorizeScore(score) {
        if (score >= 80) return 'high';
        if (score >= 60) return 'medium';
        return 'low';
    }

    categorizeRisk(level) {
        if (level >= 70) return 'high';
        if (level >= 40) return 'medium';
        return 'low';
    }

    categorizeProbability(prob) {
        if (prob >= 0.7) return 'high';
        if (prob >= 0.4) return 'medium';
        return 'low';
    }

    calculateOverallScore(specificity, measurability, achievability) {
        const weighted = (specificity * 0.35) + (measurability * 0.35) + (achievability * 0.3);
        return {
            score: Math.round(weighted),
            category: this.categorizeScore(weighted)
        };
    }

    calculateConfidence(analysis) {
        let confidence = 70;

        // Increase confidence based on data quality
        if (analysis.scores.specificity.score > 70) confidence += 10;
        if (analysis.scores.measurability.score > 70) confidence += 10;
        if (analysis.riskAssessment.factors.length > 0) confidence += 5;

        return Math.min(95, confidence);
    }

    calculatePredictionConfidence(scores, risks) {
        let confidence = 60;

        if (scores.overall.score > 70) confidence += 15;
        if (risks.level < 30) confidence += 15;
        if (scores.specificity.score > 80 && scores.measurability.score > 80) confidence += 10;

        return Math.min(90, confidence);
    }

    generateSuccessReasoning(scores, risks, probability) {
        const reasons = [];

        if (scores.specificity.score > 70) {
            reasons.push('High specificity increases clarity and accountability');
        }
        if (scores.measurability.score > 70) {
            reasons.push('Clear metrics enable effective progress tracking');
        }
        if (scores.achievability.score > 70) {
            reasons.push('Realistic commitments are more likely to be fulfilled');
        }
        if (risks.level < 30) {
            reasons.push('Low risk factors support successful completion');
        }

        if (probability > 0.7) {
            reasons.push('Strong foundation for relationship repair');
        } else if (probability < 0.4) {
            reasons.push('Significant improvements needed for success');
        }

        return reasons;
    }

    convertTosDays(timeframe) {
        const number = parseInt(timeframe.match(/\d+/)?.[0] || 0);
        const unit = timeframe.match(/(day|week|month|year)/i)?.[1]?.toLowerCase() || 'day';

        const multipliers = { day: 1, week: 7, month: 30, year: 365 };
        return number * (multipliers[unit] || 1);
    }

    categorizeTimeframe(timeframe) {
        const days = this.convertTosDays(timeframe);
        if (days <= 7) return 'short_term';
        if (days <= 90) return 'medium_term';
        return 'long_term';
    }

    calculateTotalDuration(timeframes) {
        if (timeframes.length === 0) return 0;
        return Math.max(...timeframes.map(tf => tf.estimated_days));
    }

    identifyCriticalPath(timeframes) {
        return timeframes
            .filter(tf => tf.estimated_days > 30)
            .sort((a, b) => b.estimated_days - a.estimated_days);
    }

    assessTimelineFeasibility(timeframes) {
        const totalDays = this.calculateTotalDuration(timeframes);
        if (totalDays < 7) return 'potentially_rushed';
        if (totalDays > 365) return 'very_long_term';
        return 'reasonable';
    }

    assessDependencyRisk(dependencies) {
        const highRisk = dependencies.filter(d => d.risk_level === 'high').length;
        const mediumRisk = dependencies.filter(d => d.risk_level === 'medium').length;

        if (highRisk > 2 || (highRisk > 0 && mediumRisk > 3)) return 'high';
        if (highRisk > 0 || mediumRisk > 2) return 'medium';
        return 'low';
    }

    suggestRiskMitigation(risks) {
        return risks.map(risk => ({
            factor: risk.factor,
            mitigation: this.getRiskMitigation(risk.factor)?.suggestion || 'Monitor closely and prepare contingency plans'
        }));
    }

    generateAnalysisId() {
        return 'contract_analysis_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Public API methods
    getAnalysisMetrics() {
        return this.analysisMetrics;
    }

    getRiskFactors() {
        return this.riskFactors;
    }

    getHistoricalPatterns() {
        return Object.fromEntries(this.historicalPatterns);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContractAnalyzer;
} else if (typeof window !== 'undefined') {
    window.ContractAnalyzer = ContractAnalyzer;
}