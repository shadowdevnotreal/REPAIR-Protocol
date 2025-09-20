/**
 * API Examples Configuration for REPAIR Protocol
 * Contains template code for multiple programming languages supporting both OpenAI and Anthropic APIs
 */

class APIExamples {
    constructor() {
        this.examples = {
            javascript: {
                fetch: {
                    openai: {
                        title: "JavaScript (Fetch API) - OpenAI",
                        code: `// OpenAI API using Fetch
const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer YOUR_OPENAI_API_KEY',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        model: 'gpt-4',
        messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant for relationship repair using the REPAIR protocol.'
            },
            {
                role: 'user',
                content: 'Help me understand the REPAIR framework for relationship healing.'
            }
        ],
        max_tokens: 2000,
        temperature: 0.7
    })
});

if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
}

const data = await response.json();
console.log(data.choices[0].message.content);`
                    },
                    anthropic: {
                        title: "JavaScript (Fetch API) - Anthropic",
                        code: `// Anthropic Claude API using Fetch
const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
        'x-api-key': 'YOUR_ANTHROPIC_API_KEY',
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        temperature: 0.7,
        system: 'You are a helpful assistant for relationship repair using the REPAIR protocol.',
        messages: [
            {
                role: 'user',
                content: 'Help me understand the REPAIR framework for relationship healing.'
            }
        ]
    })
});

if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
}

const data = await response.json();
console.log(data.content[0].text);`
                    }
                },
                axios: {
                    openai: {
                        title: "JavaScript (Axios) - OpenAI",
                        code: `// OpenAI API using Axios
import axios from 'axios';

try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4',
        messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant for relationship repair using the REPAIR protocol.'
            },
            {
                role: 'user',
                content: 'Help me understand the REPAIR framework for relationship healing.'
            }
        ],
        max_tokens: 2000,
        temperature: 0.7
    }, {
        headers: {
            'Authorization': 'Bearer YOUR_OPENAI_API_KEY',
            'Content-Type': 'application/json'
        }
    });

    console.log(response.data.choices[0].message.content);
} catch (error) {
    console.error('Error:', error.response?.data || error.message);
}`
                    },
                    anthropic: {
                        title: "JavaScript (Axios) - Anthropic",
                        code: `// Anthropic Claude API using Axios
import axios from 'axios';

try {
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        temperature: 0.7,
        system: 'You are a helpful assistant for relationship repair using the REPAIR protocol.',
        messages: [
            {
                role: 'user',
                content: 'Help me understand the REPAIR framework for relationship healing.'
            }
        ]
    }, {
        headers: {
            'x-api-key': 'YOUR_ANTHROPIC_API_KEY',
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
        }
    });

    console.log(response.data.content[0].text);
} catch (error) {
    console.error('Error:', error.response?.data || error.message);
}`
                    }
                }
            },
            typescript: {
                openai: {
                    title: "TypeScript - OpenAI",
                    code: `// OpenAI API with TypeScript
interface OpenAIMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface OpenAIRequest {
    model: string;
    messages: OpenAIMessage[];
    max_tokens: number;
    temperature: number;
}

interface OpenAIResponse {
    choices: Array<{
        message: {
            role: string;
            content: string;
        };
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

async function callOpenAI(): Promise<string> {
    const requestBody: OpenAIRequest = {
        model: 'gpt-4',
        messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant for relationship repair using the REPAIR protocol.'
            },
            {
                role: 'user',
                content: 'Help me understand the REPAIR framework for relationship healing.'
            }
        ],
        max_tokens: 2000,
        temperature: 0.7
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer YOUR_OPENAI_API_KEY',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    const data: OpenAIResponse = await response.json();
    return data.choices[0].message.content;
}

// Usage
callOpenAI()
    .then(result => console.log(result))
    .catch(error => console.error('Error:', error));`
                },
                anthropic: {
                    title: "TypeScript - Anthropic",
                    code: `// Anthropic Claude API with TypeScript
interface AnthropicMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface AnthropicRequest {
    model: string;
    max_tokens: number;
    temperature: number;
    system: string;
    messages: AnthropicMessage[];
}

interface AnthropicResponse {
    content: Array<{
        type: 'text';
        text: string;
    }>;
    usage: {
        input_tokens: number;
        output_tokens: number;
    };
}

async function callAnthropic(): Promise<string> {
    const requestBody: AnthropicRequest = {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        temperature: 0.7,
        system: 'You are a helpful assistant for relationship repair using the REPAIR protocol.',
        messages: [
            {
                role: 'user',
                content: 'Help me understand the REPAIR framework for relationship healing.'
            }
        ]
    };

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'x-api-key': 'YOUR_ANTHROPIC_API_KEY',
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    const data: AnthropicResponse = await response.json();
    return data.content[0].text;
}

// Usage
callAnthropic()
    .then(result => console.log(result))
    .catch(error => console.error('Error:', error));`
                }
            },
            python: {
                requests: {
                    openai: {
                        title: "Python (Requests) - OpenAI",
                        code: `# OpenAI API using requests library
import requests
import json

def call_openai():
    url = "https://api.openai.com/v1/chat/completions"

    headers = {
        "Authorization": "Bearer YOUR_OPENAI_API_KEY",
        "Content-Type": "application/json"
    }

    data = {
        "model": "gpt-4",
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful assistant for relationship repair using the REPAIR protocol."
            },
            {
                "role": "user",
                "content": "Help me understand the REPAIR framework for relationship healing."
            }
        ],
        "max_tokens": 2000,
        "temperature": 0.7
    }

    try:
        response = requests.post(url, headers=headers, json=data, timeout=30)
        response.raise_for_status()

        result = response.json()
        return result["choices"][0]["message"]["content"]

    except requests.exceptions.RequestException as e:
        print(f"Error calling OpenAI API: {e}")
        return None

# Usage
result = call_openai()
if result:
    print(result)`
                    },
                    anthropic: {
                        title: "Python (Requests) - Anthropic",
                        code: `# Anthropic Claude API using requests library
import requests
import json

def call_anthropic():
    url = "https://api.anthropic.com/v1/messages"

    headers = {
        "x-api-key": "YOUR_ANTHROPIC_API_KEY",
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01"
    }

    data = {
        "model": "claude-sonnet-4-20250514",
        "max_tokens": 2000,
        "temperature": 0.7,
        "system": "You are a helpful assistant for relationship repair using the REPAIR protocol.",
        "messages": [
            {
                "role": "user",
                "content": "Help me understand the REPAIR framework for relationship healing."
            }
        ]
    }

    try:
        response = requests.post(url, headers=headers, json=data, timeout=30)
        response.raise_for_status()

        result = response.json()
        return result["content"][0]["text"]

    except requests.exceptions.RequestException as e:
        print(f"Error calling Anthropic API: {e}")
        return None

# Usage
result = call_anthropic()
if result:
    print(result)`
                    }
                },
                sdk: {
                    openai: {
                        title: "Python (OpenAI SDK)",
                        code: `# OpenAI API using official SDK
from openai import OpenAI

# Initialize the client
client = OpenAI(api_key="YOUR_OPENAI_API_KEY")

try:
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant for relationship repair using the REPAIR protocol."
            },
            {
                "role": "user",
                "content": "Help me understand the REPAIR framework for relationship healing."
            }
        ],
        max_tokens=2000,
        temperature=0.7
    )

    print(response.choices[0].message.content)

except Exception as e:
    print(f"Error calling OpenAI API: {e}")`
                    },
                    anthropic: {
                        title: "Python (Anthropic SDK)",
                        code: `# Anthropic Claude API using official SDK
import anthropic

# Initialize the client
client = anthropic.Anthropic(api_key="YOUR_ANTHROPIC_API_KEY")

try:
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2000,
        temperature=0.7,
        system="You are a helpful assistant for relationship repair using the REPAIR protocol.",
        messages=[
            {
                "role": "user",
                "content": "Help me understand the REPAIR framework for relationship healing."
            }
        ]
    )

    print(response.content[0].text)

except Exception as e:
    print(f"Error calling Anthropic API: {e}")`
                    }
                }
            },
            java: {
                openai: {
                    title: "Java - OpenAI",
                    code: `// OpenAI API using Java HttpClient
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import java.time.Duration;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

public class OpenAIClient {
    private static final String API_URL = "https://api.openai.com/v1/chat/completions";
    private static final String API_KEY = "YOUR_OPENAI_API_KEY";

    public static void main(String[] args) {
        try {
            String result = callOpenAI();
            System.out.println(result);
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
        }
    }

    public static String callOpenAI() throws Exception {
        HttpClient client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(30))
            .build();

        String requestBody = """
        {
            "model": "gpt-4",
            "messages": [
                {
                    "role": "system",
                    "content": "You are a helpful assistant for relationship repair using the REPAIR protocol."
                },
                {
                    "role": "user",
                    "content": "Help me understand the REPAIR framework for relationship healing."
                }
            ],
            "max_tokens": 2000,
            "temperature": 0.7
        }
        """;

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(API_URL))
            .timeout(Duration.ofSeconds(30))
            .header("Authorization", "Bearer " + API_KEY)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build();

        HttpResponse<String> response = client.send(request,
            HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("HTTP Error: " + response.statusCode());
        }

        ObjectMapper mapper = new ObjectMapper();
        JsonNode jsonNode = mapper.readTree(response.body());

        return jsonNode.get("choices").get(0).get("message").get("content").asText();
    }
}`
                },
                anthropic: {
                    title: "Java - Anthropic",
                    code: `// Anthropic Claude API using Java HttpClient
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import java.time.Duration;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

public class AnthropicClient {
    private static final String API_URL = "https://api.anthropic.com/v1/messages";
    private static final String API_KEY = "YOUR_ANTHROPIC_API_KEY";

    public static void main(String[] args) {
        try {
            String result = callAnthropic();
            System.out.println(result);
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
        }
    }

    public static String callAnthropic() throws Exception {
        HttpClient client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(30))
            .build();

        String requestBody = """
        {
            "model": "claude-sonnet-4-20250514",
            "max_tokens": 2000,
            "temperature": 0.7,
            "system": "You are a helpful assistant for relationship repair using the REPAIR protocol.",
            "messages": [
                {
                    "role": "user",
                    "content": "Help me understand the REPAIR framework for relationship healing."
                }
            ]
        }
        """;

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(API_URL))
            .timeout(Duration.ofSeconds(30))
            .header("x-api-key", API_KEY)
            .header("Content-Type", "application/json")
            .header("anthropic-version", "2023-06-01")
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build();

        HttpResponse<String> response = client.send(request,
            HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("HTTP Error: " + response.statusCode());
        }

        ObjectMapper mapper = new ObjectMapper();
        JsonNode jsonNode = mapper.readTree(response.body());

        return jsonNode.get("content").get(0).get("text").asText();
    }
}`
                }
            },
            curl: {
                openai: {
                    title: "cURL - OpenAI",
                    code: `# OpenAI API using cURL
curl -X POST "https://api.openai.com/v1/chat/completions" \\
  -H "Authorization: Bearer YOUR_OPENAI_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant for relationship repair using the REPAIR protocol."
      },
      {
        "role": "user",
        "content": "Help me understand the REPAIR framework for relationship healing."
      }
    ],
    "max_tokens": 2000,
    "temperature": 0.7
  }'`
                },
                anthropic: {
                    title: "cURL - Anthropic",
                    code: `# Anthropic Claude API using cURL
curl -X POST "https://api.anthropic.com/v1/messages" \\
  -H "x-api-key: YOUR_ANTHROPIC_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "anthropic-version: 2023-06-01" \\
  -d '{
    "model": "claude-sonnet-4-20250514",
    "max_tokens": 2000,
    "temperature": 0.7,
    "system": "You are a helpful assistant for relationship repair using the REPAIR protocol.",
    "messages": [
      {
        "role": "user",
        "content": "Help me understand the REPAIR framework for relationship healing."
      }
    ]
  }'`
                }
            },
            php: {
                openai: {
                    title: "PHP - OpenAI",
                    code: `<?php
// OpenAI API using PHP cURL
function callOpenAI() {
    $url = "https://api.openai.com/v1/chat/completions";
    $apiKey = "YOUR_OPENAI_API_KEY";

    $data = [
        "model" => "gpt-4",
        "messages" => [
            [
                "role" => "system",
                "content" => "You are a helpful assistant for relationship repair using the REPAIR protocol."
            ],
            [
                "role" => "user",
                "content" => "Help me understand the REPAIR framework for relationship healing."
            ]
        ],
        "max_tokens" => 2000,
        "temperature" => 0.7
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer " . $apiKey,
        "Content-Type: application/json"
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        throw new Exception("HTTP Error: " . $httpCode);
    }

    $result = json_decode($response, true);
    return $result['choices'][0]['message']['content'];
}

try {
    $result = callOpenAI();
    echo $result;
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>`
                },
                anthropic: {
                    title: "PHP - Anthropic",
                    code: `<?php
// Anthropic Claude API using PHP cURL
function callAnthropic() {
    $url = "https://api.anthropic.com/v1/messages";
    $apiKey = "YOUR_ANTHROPIC_API_KEY";

    $data = [
        "model" => "claude-sonnet-4-20250514",
        "max_tokens" => 2000,
        "temperature" => 0.7,
        "system" => "You are a helpful assistant for relationship repair using the REPAIR protocol.",
        "messages" => [
            [
                "role" => "user",
                "content" => "Help me understand the REPAIR framework for relationship healing."
            ]
        ]
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "x-api-key: " . $apiKey,
        "Content-Type: application/json",
        "anthropic-version: 2023-06-01"
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        throw new Exception("HTTP Error: " . $httpCode);
    }

    $result = json_decode($response, true);
    return $result['content'][0]['text'];
}

try {
    $result = callAnthropic();
    echo $result;
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>`
                }
            },
            go: {
                openai: {
                    title: "Go - OpenAI",
                    code: `// OpenAI API using Go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "time"
)

type OpenAIMessage struct {
    Role    string \`json:"role"\`
    Content string \`json:"content"\`
}

type OpenAIRequest struct {
    Model       string          \`json:"model"\`
    Messages    []OpenAIMessage \`json:"messages"\`
    MaxTokens   int             \`json:"max_tokens"\`
    Temperature float64         \`json:"temperature"\`
}

type OpenAIChoice struct {
    Message OpenAIMessage \`json:"message"\`
}

type OpenAIResponse struct {
    Choices []OpenAIChoice \`json:"choices"\`
}

func callOpenAI() (string, error) {
    url := "https://api.openai.com/v1/chat/completions"
    apiKey := "YOUR_OPENAI_API_KEY"

    request := OpenAIRequest{
        Model: "gpt-4",
        Messages: []OpenAIMessage{
            {
                Role:    "system",
                Content: "You are a helpful assistant for relationship repair using the REPAIR protocol.",
            },
            {
                Role:    "user",
                Content: "Help me understand the REPAIR framework for relationship healing.",
            },
        },
        MaxTokens:   2000,
        Temperature: 0.7,
    }

    jsonData, err := json.Marshal(request)
    if err != nil {
        return "", err
    }

    req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
    if err != nil {
        return "", err
    }

    req.Header.Set("Authorization", "Bearer "+apiKey)
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{Timeout: 30 * time.Second}
    resp, err := client.Do(req)
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return "", fmt.Errorf("HTTP error: %d", resp.StatusCode)
    }

    body, err := io.ReadAll(resp.Body)
    if err != nil {
        return "", err
    }

    var response OpenAIResponse
    err = json.Unmarshal(body, &response)
    if err != nil {
        return "", err
    }

    return response.Choices[0].Message.Content, nil
}

func main() {
    result, err := callOpenAI()
    if err != nil {
        fmt.Printf("Error: %v\\n", err)
        return
    }

    fmt.Println(result)
}`
                },
                anthropic: {
                    title: "Go - Anthropic",
                    code: `// Anthropic Claude API using Go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "time"
)

type AnthropicMessage struct {
    Role    string \`json:"role"\`
    Content string \`json:"content"\`
}

type AnthropicRequest struct {
    Model       string             \`json:"model"\`
    MaxTokens   int                \`json:"max_tokens"\`
    Temperature float64            \`json:"temperature"\`
    System      string             \`json:"system"\`
    Messages    []AnthropicMessage \`json:"messages"\`
}

type AnthropicContent struct {
    Type string \`json:"type"\`
    Text string \`json:"text"\`
}

type AnthropicResponse struct {
    Content []AnthropicContent \`json:"content"\`
}

func callAnthropic() (string, error) {
    url := "https://api.anthropic.com/v1/messages"
    apiKey := "YOUR_ANTHROPIC_API_KEY"

    request := AnthropicRequest{
        Model:       "claude-sonnet-4-20250514",
        MaxTokens:   2000,
        Temperature: 0.7,
        System:      "You are a helpful assistant for relationship repair using the REPAIR protocol.",
        Messages: []AnthropicMessage{
            {
                Role:    "user",
                Content: "Help me understand the REPAIR framework for relationship healing.",
            },
        },
    }

    jsonData, err := json.Marshal(request)
    if err != nil {
        return "", err
    }

    req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
    if err != nil {
        return "", err
    }

    req.Header.Set("x-api-key", apiKey)
    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("anthropic-version", "2023-06-01")

    client := &http.Client{Timeout: 30 * time.Second}
    resp, err := client.Do(req)
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return "", fmt.Errorf("HTTP error: %d", resp.StatusCode)
    }

    body, err := io.ReadAll(resp.Body)
    if err != nil {
        return "", err
    }

    var response AnthropicResponse
    err = json.Unmarshal(body, &response)
    if err != nil {
        return "", err
    }

    return response.Content[0].Text, nil
}

func main() {
    result, err := callAnthropic()
    if err != nil {
        fmt.Printf("Error: %v\\n", err)
        return
    }

    fmt.Println(result)
}`
                }
            },
            ruby: {
                openai: {
                    title: "Ruby - OpenAI",
                    code: `# OpenAI API using Ruby
require 'net/http'
require 'json'
require 'uri'

def call_openai
  uri = URI('https://api.openai.com/v1/chat/completions')
  api_key = 'YOUR_OPENAI_API_KEY'

  request_data = {
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant for relationship repair using the REPAIR protocol.'
      },
      {
        role: 'user',
        content: 'Help me understand the REPAIR framework for relationship healing.'
      }
    ],
    max_tokens: 2000,
    temperature: 0.7
  }

  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true
  http.read_timeout = 30

  request = Net::HTTP::Post.new(uri)
  request['Authorization'] = "Bearer #{api_key}"
  request['Content-Type'] = 'application/json'
  request.body = request_data.to_json

  response = http.request(request)

  if response.code != '200'
    raise "HTTP Error: #{response.code}"
  end

  result = JSON.parse(response.body)
  result['choices'][0]['message']['content']
rescue => e
  puts "Error: #{e.message}"
  nil
end

# Usage
result = call_openai
puts result if result`
                },
                anthropic: {
                    title: "Ruby - Anthropic",
                    code: `# Anthropic Claude API using Ruby
require 'net/http'
require 'json'
require 'uri'

def call_anthropic
  uri = URI('https://api.anthropic.com/v1/messages')
  api_key = 'YOUR_ANTHROPIC_API_KEY'

  request_data = {
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    temperature: 0.7,
    system: 'You are a helpful assistant for relationship repair using the REPAIR protocol.',
    messages: [
      {
        role: 'user',
        content: 'Help me understand the REPAIR framework for relationship healing.'
      }
    ]
  }

  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true
  http.read_timeout = 30

  request = Net::HTTP::Post.new(uri)
  request['x-api-key'] = api_key
  request['Content-Type'] = 'application/json'
  request['anthropic-version'] = '2023-06-01'
  request.body = request_data.to_json

  response = http.request(request)

  if response.code != '200'
    raise "HTTP Error: #{response.code}"
  end

  result = JSON.parse(response.body)
  result['content'][0]['text']
rescue => e
  puts "Error: #{e.message}"
  nil
end

# Usage
result = call_anthropic
puts result if result`
                }
            }
        };
    }

    // Get all available examples
    getAllExamples() {
        return this.examples;
    }

    // Get examples for a specific language
    getLanguageExamples(language) {
        return this.examples[language] || {};
    }

    // Get example by language and provider
    getExample(language, provider, variant = null) {
        const langExamples = this.examples[language];
        if (!langExamples) return null;

        if (variant && langExamples[variant]) {
            return langExamples[variant][provider] || null;
        }

        // Return direct provider match
        return langExamples[provider] || null;
    }

    // Get all available languages
    getAvailableLanguages() {
        return Object.keys(this.examples);
    }

    // Get available providers for a language
    getProvidersForLanguage(language) {
        const langExamples = this.examples[language];
        if (!langExamples) return [];

        const providers = new Set();

        Object.values(langExamples).forEach(example => {
            if (example.openai) providers.add('openai');
            if (example.anthropic) providers.add('anthropic');
        });

        return Array.from(providers);
    }

    // Update API keys in examples
    updateApiKeys(examples, openaiKey = null, anthropicKey = null) {
        const updatedExamples = JSON.parse(JSON.stringify(examples));

        function replaceKeys(obj) {
            if (typeof obj === 'string') {
                let result = obj;
                if (openaiKey) {
                    result = result.replace(/YOUR_OPENAI_API_KEY/g, openaiKey);
                }
                if (anthropicKey) {
                    result = result.replace(/YOUR_ANTHROPIC_API_KEY/g, anthropicKey);
                }
                return result;
            } else if (typeof obj === 'object' && obj !== null) {
                for (const key in obj) {
                    obj[key] = replaceKeys(obj[key]);
                }
            }
            return obj;
        }

        return replaceKeys(updatedExamples);
    }

    // Update model names in examples
    updateModels(examples, openaiModel = null, anthropicModel = null) {
        const updatedExamples = JSON.parse(JSON.stringify(examples));

        function replaceModels(obj) {
            if (typeof obj === 'string') {
                let result = obj;
                if (openaiModel) {
                    result = result.replace(/"gpt-4"/g, `"${openaiModel}"`);
                    result = result.replace(/gpt-4/g, openaiModel);
                }
                if (anthropicModel) {
                    result = result.replace(/"claude-sonnet-4-20250514"/g, `"${anthropicModel}"`);
                    result = result.replace(/claude-sonnet-4-20250514/g, anthropicModel);
                }
                return result;
            } else if (typeof obj === 'object' && obj !== null) {
                for (const key in obj) {
                    obj[key] = replaceModels(obj[key]);
                }
            }
            return obj;
        }

        return replaceModels(updatedExamples);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIExamples;
} else {
    window.APIExamples = APIExamples;
}

// Initialize global instance
if (typeof window !== 'undefined') {
    window.repairAPIExamples = new APIExamples();
}