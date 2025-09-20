/**
 * API Configuration for REPAIR Protocol GPT Integration
 * Handles API endpoints, authentication, rate limiting, and fallback mechanisms
 */

class APIConfig {
    constructor() {
        this.config = {
            // Primary API Configuration
            primary: {
                provider: 'openai', // 'openai', 'custom', 'azure', 'anthropic'
                endpoint: 'https://api.openai.com/v1/chat/completions',
                apiKey: null, // Set via setApiKey() method
                model: 'gpt-4',
                maxTokens: 2000,
                temperature: 0.7,
                timeout: 30000 // 30 seconds
            },

            // Anthropic-specific Configuration
            anthropic: {
                provider: 'anthropic',
                endpoint: 'https://api.anthropic.com/v1/messages',
                apiKey: null,
                model: 'claude-sonnet-4-20250514',
                maxTokens: 2000,
                temperature: 0.7,
                timeout: 30000,
                anthropicVersion: '2023-06-01',
                availableModels: [
                    'claude-opus-4-1-20250805',
                    'claude-sonnet-4-20250514',
                    'claude-3-5-sonnet-20241022',
                    'claude-3-5-haiku-20241022'
                ]
            },

            // Fallback API Configuration
            fallback: {
                provider: 'custom',
                endpoint: null, // Custom endpoint if available
                apiKey: null,
                model: 'gpt-3.5-turbo',
                maxTokens: 1500,
                temperature: 0.8,
                timeout: 25000
            },

            // Rate Limiting Configuration
            rateLimiting: {
                requestsPerMinute: 10,
                requestsPerHour: 100,
                requestsPerDay: 500,
                burstAllowance: 3, // Allow burst of requests
                cooldownPeriod: 60000 // 1 minute cooldown after rate limit hit
            },

            // Usage Tracking
            usage: {
                tokensUsed: 0,
                requestsToday: 0,
                lastReset: new Date().toDateString(),
                monthlyLimit: 10000, // Token limit
                costTracking: true
            },

            // Security Settings
            security: {
                encryptApiKey: true,
                allowLocalStorage: false, // For production, use secure storage
                sanitizeInputs: true,
                maxInputLength: 4000,
                contentFiltering: true
            },

            // Features Configuration
            features: {
                conversationHistory: true,
                contextRetention: true,
                emotionalAnalysis: true,
                biasDetection: true,
                progressTracking: true,
                realTimeFeedback: true,
                autoSave: true
            },

            // Offline/Fallback Configuration
            offline: {
                enableOfflineMode: true,
                localResponses: true,
                cachedInsights: true,
                offlineAnalytics: true
            }
        };

        this.requestQueue = [];
        this.rateLimitState = {
            requests: [],
            lastRequest: null,
            blocked: false,
            blockUntil: null
        };

        this.initialize();
    }

    initialize() {
        this.loadStoredConfig();
        this.setupRateLimiting();
        this.validateConfiguration();
    }

    /**
     * API Key Management
     */
    setApiKey(key, provider = 'primary') {
        if (!key || typeof key !== 'string') {
            throw new Error('Invalid API key provided');
        }

        // Basic validation for API key formats
        if (provider === 'primary') {
            if (this.config.primary.provider === 'openai') {
                if (!key.startsWith('sk-')) {
                    console.warn('API key may not be valid OpenAI format');
                }
            } else if (this.config.primary.provider === 'anthropic') {
                if (!key.startsWith('sk-ant-')) {
                    console.warn('API key may not be valid Anthropic format');
                }
            }
        }

        this.config[provider].apiKey = this.config.security.encryptApiKey ?
            this.encryptKey(key) : key;

        this.saveConfig();
        console.log(`API key configured for ${provider} provider`);
    }

    getApiKey(provider = 'primary') {
        const key = this.config[provider].apiKey;
        return this.config.security.encryptApiKey ? this.decryptKey(key) : key;
    }

    /**
     * Provider Configuration
     */
    setProvider(provider, config = {}) {
        const validProviders = ['openai', 'custom', 'azure', 'anthropic'];
        if (!validProviders.includes(provider)) {
            throw new Error(`Invalid provider: ${provider}`);
        }

        // Set provider-specific defaults
        if (provider === 'anthropic' && this.config.anthropic) {
            this.config.primary = {
                ...this.config.anthropic,
                ...config
            };
        } else if (provider === 'openai') {
            this.config.primary = {
                provider: 'openai',
                endpoint: 'https://api.openai.com/v1/chat/completions',
                model: 'gpt-4',
                maxTokens: 2000,
                temperature: 0.7,
                timeout: 30000,
                ...config
            };
        } else {
            this.config.primary.provider = provider;
            Object.assign(this.config.primary, config);
        }

        this.saveConfig();
    }

    /**
     * Get available models for current provider
     */
    getAvailableModels(provider = 'primary') {
        const config = this.config[provider];

        switch (config.provider) {
            case 'anthropic':
                return this.config.anthropic?.availableModels || [
                    'claude-opus-4-1-20250805',
                    'claude-sonnet-4-20250514',
                    'claude-3-5-sonnet-20241022',
                    'claude-3-5-haiku-20241022'
                ];
            case 'openai':
                return [
                    'gpt-4',
                    'gpt-4-turbo',
                    'gpt-3.5-turbo',
                    'gpt-4o'
                ];
            default:
                return [config.model];
        }
    }

    getEndpointConfig(provider = 'primary') {
        const config = this.config[provider];

        switch (config.provider) {
            case 'openai':
                return {
                    url: config.endpoint,
                    headers: {
                        'Authorization': `Bearer ${this.getApiKey(provider)}`,
                        'Content-Type': 'application/json'
                    }
                };

            case 'azure':
                return {
                    url: config.endpoint,
                    headers: {
                        'api-key': this.getApiKey(provider),
                        'Content-Type': 'application/json'
                    }
                };

            case 'anthropic':
                return {
                    url: config.endpoint,
                    headers: {
                        'x-api-key': this.getApiKey(provider),
                        'Content-Type': 'application/json',
                        'anthropic-version': config.anthropicVersion || '2023-06-01'
                    }
                };

            case 'custom':
                return {
                    url: config.endpoint,
                    headers: {
                        'Authorization': `Bearer ${this.getApiKey(provider)}`,
                        'Content-Type': 'application/json'
                    }
                };

            default:
                throw new Error(`Unsupported provider: ${config.provider}`);
        }
    }

    /**
     * Rate Limiting
     */
    setupRateLimiting() {
        // Clean old requests every minute
        setInterval(() => {
            this.cleanupRateLimit();
        }, 60000);
    }

    checkRateLimit() {
        const now = Date.now();
        const config = this.config.rateLimiting;

        // Check if currently blocked
        if (this.rateLimitState.blocked && now < this.rateLimitState.blockUntil) {
            const waitTime = Math.ceil((this.rateLimitState.blockUntil - now) / 1000);
            throw new Error(`Rate limited. Please wait ${waitTime} seconds.`);
        }

        // Reset block if cooldown period passed
        if (this.rateLimitState.blocked && now >= this.rateLimitState.blockUntil) {
            this.rateLimitState.blocked = false;
            this.rateLimitState.blockUntil = null;
        }

        // Check requests in last minute
        const lastMinute = this.rateLimitState.requests.filter(
            timestamp => now - timestamp < 60000
        );

        if (lastMinute.length >= config.requestsPerMinute) {
            this.rateLimitState.blocked = true;
            this.rateLimitState.blockUntil = now + config.cooldownPeriod;
            throw new Error('Rate limit exceeded. Please wait before making more requests.');
        }

        return true;
    }

    recordRequest() {
        this.rateLimitState.requests.push(Date.now());
        this.rateLimitState.lastRequest = Date.now();
    }

    cleanupRateLimit() {
        const now = Date.now();
        // Keep only requests from last hour for tracking
        this.rateLimitState.requests = this.rateLimitState.requests.filter(
            timestamp => now - timestamp < 3600000
        );
    }

    /**
     * Usage Tracking
     */
    trackUsage(tokens, cost = 0) {
        const today = new Date().toDateString();

        // Reset daily counter if new day
        if (this.config.usage.lastReset !== today) {
            this.config.usage.requestsToday = 0;
            this.config.usage.lastReset = today;
        }

        this.config.usage.tokensUsed += tokens;
        this.config.usage.requestsToday += 1;

        if (this.config.usage.costTracking && cost > 0) {
            this.config.usage.costToday = (this.config.usage.costToday || 0) + cost;
        }

        this.saveConfig();

        // Check monthly limits
        if (this.config.usage.tokensUsed > this.config.usage.monthlyLimit) {
            console.warn('Monthly token limit exceeded');
        }
    }

    getUsageStats() {
        return {
            tokensUsed: this.config.usage.tokensUsed,
            requestsToday: this.config.usage.requestsToday,
            monthlyLimit: this.config.usage.monthlyLimit,
            percentageUsed: (this.config.usage.tokensUsed / this.config.usage.monthlyLimit) * 100,
            rateLimitStatus: this.rateLimitState.blocked ? 'blocked' : 'active',
            lastRequest: this.rateLimitState.lastRequest
        };
    }

    /**
     * Configuration Management
     */
    updateConfig(updates) {
        function deepMerge(target, source) {
            for (const key in source) {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    target[key] = target[key] || {};
                    deepMerge(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        }

        deepMerge(this.config, updates);
        this.saveConfig();
        this.validateConfiguration();
    }

    validateConfiguration() {
        const errors = [];

        // Validate primary provider
        if (!this.config.primary.provider) {
            errors.push('Primary provider not configured');
        }

        if (!this.config.primary.endpoint) {
            errors.push('Primary endpoint not configured');
        }

        // Validate rate limits
        const rl = this.config.rateLimiting;
        if (rl.requestsPerMinute <= 0 || rl.requestsPerHour <= 0) {
            errors.push('Invalid rate limiting configuration');
        }

        if (errors.length > 0) {
            console.warn('Configuration validation errors:', errors);
            return false;
        }

        return true;
    }

    /**
     * Storage Management
     */
    saveConfig() {
        try {
            if (typeof localStorage !== 'undefined' && this.config.security.allowLocalStorage) {
                localStorage.setItem('repairProtocolConfig', JSON.stringify(this.config));
            }
        } catch (error) {
            console.warn('Failed to save configuration:', error);
        }
    }

    loadStoredConfig() {
        try {
            if (typeof localStorage !== 'undefined' && this.config.security.allowLocalStorage) {
                const stored = localStorage.getItem('repairProtocolConfig');
                if (stored) {
                    const storedConfig = JSON.parse(stored);
                    Object.assign(this.config, storedConfig);
                }
            }
        } catch (error) {
            console.warn('Failed to load stored configuration:', error);
        }
    }

    /**
     * Security Methods (Basic Implementation)
     */
    encryptKey(key) {
        // Basic encoding - in production, use proper encryption
        return btoa(key.split('').reverse().join(''));
    }

    decryptKey(encryptedKey) {
        if (!encryptedKey) return null;
        try {
            return atob(encryptedKey).split('').reverse().join('');
        } catch (error) {
            console.error('Failed to decrypt key:', error);
            return null;
        }
    }

    /**
     * Health Check Methods
     */
    async testConnection(provider = 'primary') {
        try {
            const endpoint = this.getEndpointConfig(provider);
            const testPayload = this.createTestPayload(provider);

            const response = await fetch(endpoint.url, {
                method: 'POST',
                headers: endpoint.headers,
                body: JSON.stringify(testPayload),
                timeout: this.config[provider].timeout
            });

            return {
                success: response.ok,
                status: response.status,
                provider: provider,
                latency: Date.now() - testPayload._timestamp
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                provider: provider
            };
        }
    }

    createTestPayload(provider) {
        const config = this.config[provider];
        const timestamp = Date.now();

        switch (config.provider) {
            case 'openai':
                return {
                    model: config.model,
                    messages: [{ role: 'user', content: 'Test connection' }],
                    max_tokens: 10,
                    temperature: 0,
                    _timestamp: timestamp
                };

            case 'anthropic':
                return {
                    model: config.model,
                    max_tokens: 10,
                    messages: [{ role: 'user', content: 'Test connection' }],
                    _timestamp: timestamp
                };

            default:
                return {
                    model: config.model,
                    messages: [{ role: 'user', content: 'Test connection' }],
                    max_tokens: 10,
                    _timestamp: timestamp
                };
        }
    }

    /**
     * Feature Management
     */
    isFeatureEnabled(feature) {
        return this.config.features[feature] === true;
    }

    enableFeature(feature) {
        this.config.features[feature] = true;
        this.saveConfig();
    }

    disableFeature(feature) {
        this.config.features[feature] = false;
        this.saveConfig();
    }

    /**
     * Export/Import Configuration
     */
    exportConfig(includeKeys = false) {
        const exportConfig = JSON.parse(JSON.stringify(this.config));

        if (!includeKeys) {
            exportConfig.primary.apiKey = null;
            exportConfig.fallback.apiKey = null;
        }

        return exportConfig;
    }

    importConfig(configData) {
        try {
            this.config = { ...this.config, ...configData };
            this.saveConfig();
            this.validateConfiguration();
            return true;
        } catch (error) {
            console.error('Failed to import configuration:', error);
            return false;
        }
    }

    /**
     * Reset Configuration
     */
    resetToDefaults() {
        const apiKey = this.getApiKey('primary');
        this.config = new APIConfig().config;
        if (apiKey) {
            this.setApiKey(apiKey, 'primary');
        }
        this.saveConfig();
    }

    /**
     * Get Configuration Status
     */
    getStatus() {
        return {
            configured: this.validateConfiguration(),
            hasApiKey: !!this.getApiKey('primary'),
            provider: this.config.primary.provider,
            features: this.config.features,
            usage: this.getUsageStats(),
            rateLimit: {
                blocked: this.rateLimitState.blocked,
                requestsInQueue: this.requestQueue.length
            }
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIConfig;
} else {
    window.APIConfig = APIConfig;
}

// Initialize global instance
if (typeof window !== 'undefined') {
    window.repairAPIConfig = new APIConfig();
}