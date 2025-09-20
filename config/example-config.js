/**
 * Example Configuration for REPAIR Protocol GPT Integration
 * Copy this file and customize for your needs
 */

// Example API Configuration
const exampleConfig = {
    // Primary API Settings
    primary: {
        provider: 'openai',                                    // 'openai', 'azure', 'anthropic', 'custom'
        endpoint: 'https://api.openai.com/v1/chat/completions', // API endpoint URL
        apiKey: 'your-api-key-here',                           // Your API key (keep secure!)
        model: 'gpt-4',                                        // Model to use
        maxTokens: 2000,                                       // Maximum response length
        temperature: 0.7,                                      // Response creativity (0.0-1.0)
        timeout: 30000                                         // Request timeout in milliseconds
    },

    // Fallback API Settings (optional)
    fallback: {
        provider: 'openai',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        apiKey: 'your-fallback-api-key',
        model: 'gpt-3.5-turbo',
        maxTokens: 1500,
        temperature: 0.8,
        timeout: 25000
    },

    // Rate Limiting Configuration
    rateLimiting: {
        requestsPerMinute: 10,                                 // Max requests per minute
        requestsPerHour: 100,                                  // Max requests per hour
        requestsPerDay: 500,                                   // Max requests per day
        burstAllowance: 3,                                     // Allow burst requests
        cooldownPeriod: 60000                                  // Cooldown after rate limit (ms)
    },

    // Usage Tracking
    usage: {
        tokensUsed: 0,                                         // Track tokens consumed
        requestsToday: 0,                                      // Track daily requests
        lastReset: new Date().toDateString(),                  // Last reset date
        monthlyLimit: 10000,                                   // Monthly token limit
        costTracking: true                                     // Enable cost tracking
    },

    // Security Settings
    security: {
        encryptApiKey: true,                                   // Encrypt API keys
        allowLocalStorage: false,                              // Allow local storage (dev only)
        sanitizeInputs: true,                                  // Sanitize user inputs
        maxInputLength: 4000,                                  // Max input length
        contentFiltering: true                                 // Enable content filtering
    },

    // Feature Configuration
    features: {
        conversationHistory: true,                             // Enable chat history
        contextRetention: true,                                // Retain conversation context
        emotionalAnalysis: true,                               // Analyze emotional content
        biasDetection: true,                                   // Detect cognitive biases
        progressTracking: true,                                // Track user progress
        realTimeFeedback: true,                                // Provide real-time feedback
        autoSave: true                                         // Auto-save user data
    },

    // Offline/Fallback Configuration
    offline: {
        enableOfflineMode: true,                               // Enable offline functionality
        localResponses: true,                                  // Use local fallback responses
        cachedInsights: true,                                  // Cache insights for offline use
        offlineAnalytics: true                                 // Track offline interactions
    }
};

// Provider-specific configurations
const providerConfigs = {
    // OpenAI Configuration
    openai: {
        endpoint: 'https://api.openai.com/v1/chat/completions',
        models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
        authHeader: 'Authorization',
        authPrefix: 'Bearer ',
        contentType: 'application/json'
    },

    // Azure OpenAI Configuration
    azure: {
        endpoint: 'https://your-resource.openai.azure.com/openai/deployments/your-deployment/chat/completions?api-version=2023-05-15',
        models: ['gpt-4', 'gpt-35-turbo'], // Use your deployment names
        authHeader: 'api-key',
        authPrefix: '',
        contentType: 'application/json'
    },

    // Anthropic Claude Configuration
    anthropic: {
        endpoint: 'https://api.anthropic.com/v1/messages',
        models: ['claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
        authHeader: 'x-api-key',
        authPrefix: '',
        contentType: 'application/json',
        additionalHeaders: {
            'anthropic-version': '2023-06-01'
        }
    },

    // Custom Endpoint Configuration
    custom: {
        endpoint: 'https://your-custom-endpoint.com/v1/chat/completions',
        models: ['your-model-name'],
        authHeader: 'Authorization',
        authPrefix: 'Bearer ',
        contentType: 'application/json'
    }
};

// Specialized prompts for different use cases
const specializedPrompts = {
    // Corporate/Workplace Settings
    corporate: {
        systemPrompt: `You are a professional workplace mediation assistant specializing in corporate conflict resolution and professional apologies. Maintain a formal but empathetic tone suitable for workplace environments.`,
        biasPrompts: {
            defensiveness: "In workplace settings, defensive language can escalate conflicts. Focus on acknowledging impact rather than defending intentions.",
            minimization: "Workplace harm often affects team dynamics and productivity. Avoid minimizing the broader organizational impact."
        }
    },

    // Personal Relationships
    personal: {
        systemPrompt: `You are a compassionate relationship counselor assistant helping with personal conflicts and intimate apologies. Use warm, understanding language while maintaining professional boundaries.`,
        biasPrompts: {
            emotional_manipulation: "Ensure your emotional expression is genuine and not manipulative. Focus on authentic feelings and commitments.",
            victim_playing: "Avoid positioning yourself as the victim. Focus on the harm you caused and your commitment to change."
        }
    },

    // Family/Intergenerational
    family: {
        systemPrompt: `You are a family therapy assistant specializing in intergenerational conflicts and family healing. Consider family dynamics, cultural contexts, and long-term relationship preservation.`,
        biasPrompts: {
            generational_gap: "Acknowledge different generational perspectives while taking responsibility for your actions.",
            family_loyalty: "Balance family loyalty with accountability. Both are important for healthy family relationships."
        }
    },

    // Community/Group Settings
    community: {
        systemPrompt: `You are a community mediation specialist helping with group conflicts and public apologies. Consider community impact, cultural sensitivity, and collective healing.`,
        biasPrompts: {
            group_think: "Consider individual perspectives within the community while addressing collective harm.",
            public_pressure: "Focus on genuine accountability rather than managing public perception."
        }
    }
};

// Usage examples for different scenarios
const usageExamples = {
    quickSetup: {
        description: "Minimal setup for testing",
        config: {
            primary: {
                provider: 'openai',
                apiKey: 'your-api-key',
                model: 'gpt-3.5-turbo'
            }
        }
    },

    production: {
        description: "Full production configuration",
        config: {
            ...exampleConfig,
            security: {
                ...exampleConfig.security,
                allowLocalStorage: false,
                encryptApiKey: true
            },
            rateLimiting: {
                ...exampleConfig.rateLimiting,
                requestsPerMinute: 20,
                requestsPerHour: 200
            }
        }
    },

    development: {
        description: "Development environment setup",
        config: {
            ...exampleConfig,
            security: {
                ...exampleConfig.security,
                allowLocalStorage: true
            },
            rateLimiting: {
                ...exampleConfig.rateLimiting,
                requestsPerMinute: 60
            }
        }
    }
};

// Export configurations (uncomment based on your module system)
// module.exports = { exampleConfig, providerConfigs, specializedPrompts, usageExamples };
// export { exampleConfig, providerConfigs, specializedPrompts, usageExamples };

// For browser usage:
if (typeof window !== 'undefined') {
    window.REPAIRConfigExamples = {
        exampleConfig,
        providerConfigs,
        specializedPrompts,
        usageExamples
    };
}

/*
SETUP INSTRUCTIONS:

1. Copy this file to create your own configuration
2. Replace 'your-api-key-here' with your actual API key
3. Customize the settings based on your needs
4. For production use:
   - Set allowLocalStorage to false
   - Use environment variables for API keys
   - Configure appropriate rate limits
   - Enable all security features

5. For development:
   - You can use localStorage for convenience
   - Set higher rate limits for testing
   - Enable debug features

SECURITY NOTES:
- Never commit API keys to version control
- Use environment variables in production
- Regularly rotate API keys
- Monitor usage for unauthorized access
- Consider using a proxy server for additional security

COST MANAGEMENT:
- Set appropriate token limits
- Monitor daily/monthly usage
- Use cheaper models for development
- Implement user-based rate limiting if needed
- Consider caching responses to reduce API calls
*/