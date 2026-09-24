// Real runs of each Agent, recorded on 2026-09-24 and replayed while the page idles
// and after a visitor has used their runs for the day.
import type { DependencyResult, Digest, LearnResult } from "@/lib/agentic-os/types";

export const DIGEST_REPLAY: Digest = {
  "generatedAt": "2026-09-24T16:38:03.196Z",
  "themes": [
    {
      "title": "Model releases",
      "items": [
        {
          "title": "anthropics/claude-code v2.1.281",
          "summary": "Claude-code v2.1.281 adds guardrail support on Claude apps gateway Bedrock upstreams to apply Amazon Bedrock guardrails per request.",
          "url": "https://github.com/anthropics/claude-code/releases/tag/v2.1.281",
          "source": "GitHub · anthropics/claude-code"
        },
        {
          "title": "anthropics/claude-code v2.1.280",
          "summary": "Claude-code v2.1.280 makes Claude Opus 5.5 the default Opus model with 1M context and new pricing.",
          "url": "https://github.com/anthropics/claude-code/releases/tag/v2.1.280",
          "source": "GitHub · anthropics/claude-code"
        },
        {
          "title": "openai/openai-python v3.19.0",
          "summary": "OpenAI Python SDK 3.19.0 adds the GPT‑Rosalind research model and GCP external storage support.",
          "url": "https://github.com/openai/openai-python/releases/tag/v3.19.0",
          "source": "GitHub · openai/openai-python"
        },
        {
          "title": "ollama/ollama v0.34.4",
          "summary": "Ollama 0.34.4 speeds up structured outputs, fixes model‑not‑found errors, and speeds Qwen 3.8 on Apple Silicon.",
          "url": "https://github.com/ollama/ollama/releases/tag/v0.34.4",
          "source": "GitHub · ollama/ollama"
        },
        {
          "title": "The new Gemini 3.8 TTS models are super-cheap and can generate conversations between multiple voices (from 2,000+, or you can clone your own) - I built a little playground UI for it, then had Claude knock up a script where two pelicans debate moving to Pacifica Pier simonwillison",
          "summary": "Gemini 3.8 TTS models are ultra‑cheap, support multi‑voice conversations, and a playground UI was released.",
          "url": "https://bsky.app/profile/simonwillison.net/post/3mw7magyrwc2i",
          "source": "Bluesky · @simonwillison.net"
        }
      ]
    },
    {
      "title": "Tooling updates",
      "items": [
        {
          "title": "vercel/next.js v16.4.0-canary.43",
          "summary": "Next.js canary 16.4.0‑43 tunes Node server chunking to reduce require overhead and fixes a Turbopack regression.",
          "url": "https://github.com/vercel/next.js/releases/tag/v16.4.0-canary.43",
          "source": "GitHub · vercel/next.js"
        },
        {
          "title": "vercel/next.js v16.4.0-canary.42",
          "summary": "Next.js canary 16.4.0‑42 adds retry logic for preview tarball uploads and promotes the new next analyze command.",
          "url": "https://github.com/vercel/next.js/releases/tag/v16.4.0-canary.42",
          "source": "GitHub · vercel/next.js"
        },
        {
          "title": "langchain-ai/langchain langchain-openai==1.6.6",
          "summary": "LangChain‑openai 1.6.6 fixes error handling in streaming paths.",
          "url": "https://github.com/langchain-ai/langchain/releases/tag/langchain-openai%3D%3D1.6.6",
          "source": "GitHub · langchain-ai/langchain"
        },
        {
          "title": "langchain-ai/langchain langchain-anthropic==1.7.4",
          "summary": "LangChain‑anthropic 1.7.4 adds Opus 5.5 and GPT‑6 profile augmentations and mid‑conversation tool changes on SystemMessage.",
          "url": "https://github.com/langchain-ai/langchain/releases/tag/langchain-anthropic%3D%3D1.7.4",
          "source": "GitHub · langchain-ai/langchain"
        },
        {
          "title": "openai/openai-python v3.19.2",
          "summary": "OpenAI Python SDK 3.19.2 fixes single‑file fallback extraction and clarifies approximate web‑search defaults.",
          "url": "https://github.com/openai/openai-python/releases/tag/v3.19.2",
          "source": "GitHub · openai/openai-python"
        }
      ]
    },
    {
      "title": "Research",
      "items": [
        {
          "title": "Self-Organizing Agent Teams Learn to Reason Together",
          "summary": "Self‑Organizing Agent Teams Learn to Reason Together introduces agents that coordinate to solve reasoning tasks.",
          "url": "https://huggingface.co/papers/2609.22682",
          "source": "Hugging Face papers"
        },
        {
          "title": "Calibration as a First-Class Criterion in LLM Evaluation",
          "summary": "Calibration as a First‑Class Criterion in LLM Evaluation proposes treating calibration as a primary evaluation metric.",
          "url": "https://huggingface.co/papers/2609.26489",
          "source": "Hugging Face papers"
        },
        {
          "title": "GeoPair: Geometry-Preserving Cross-Layer Factorization for Training-Free Transformer Compression",
          "summary": "GeoPair presents geometry‑preserving cross‑layer factorization for training‑free transformer compression.",
          "url": "https://huggingface.co/papers/2609.25963",
          "source": "Hugging Face papers"
        },
        {
          "title": "All modalities are equal, but video is more equal: Closing the Cross-Attention Gap in Joint Video Generation",
          "summary": "All modalities are equal, but video is more equal paper addresses the cross‑attention gap in joint video generation.",
          "url": "https://huggingface.co/papers/2609.27901",
          "source": "Hugging Face papers"
        },
        {
          "title": "PackLab: A Comprehensive Framework for Developing, Training, and Evaluating MLLMs in Robotic Bin Packing",
          "summary": "PackLab offers a comprehensive framework for developing, training, and evaluating multimodal LLMs in robotic bin‑packing tasks.",
          "url": "https://huggingface.co/papers/2609.23784",
          "source": "Hugging Face papers"
        }
      ]
    }
  ]
};

export const LEARN_REPLAY: LearnResult = {
  "topic": "How do AI agents use tools?",
  "explanation": "AI agents are programs that can reason, plan, and act autonomously. To extend their capabilities they invoke external tools—APIs, command‑line utilities, databases, or web browsers—rather than hard‑coding every function. This separation lets the agent stay lightweight while leveraging specialized services.",
  "plan": [
    {
      "step": "Identify needed tool",
      "detail": "Determine which external capability (e.g., web search, image generation, database query) the agent must call to solve the task."
    },
    {
      "step": "Define tool interface",
      "detail": "Specify the tool’s input schema, output format, and invocation method (REST endpoint, function call, CLI command)."
    },
    {
      "step": "Implement tool wrapper",
      "detail": "Write a thin adapter that translates the agent’s request into the tool’s call and returns a normalized response."
    },
    {
      "step": "Integrate with agent loop",
      "detail": "Add logic so the agent can decide when to call the tool, pass arguments, and incorporate the result back into its reasoning."
    },
    {
      "step": "Test and iterate",
      "detail": "Run end‑to‑end scenarios, verify correct tool usage, and refine prompts or decision rules to improve reliability."
    }
  ],
  "links": [
    {
      "kind": "glossary",
      "title": "Agent",
      "href": "/ai-glossary?term=agent"
    },
    {
      "kind": "glossary",
      "title": "Tool",
      "href": "/ai-glossary?term=tool"
    },
    {
      "kind": "glossary",
      "title": "Tool result",
      "href": "/ai-glossary?term=tool-result"
    },
    {
      "kind": "glossary",
      "title": "AI",
      "href": "/ai-glossary?term=ai"
    }
  ]
};

export const DEPENDENCY_REPLAY_INPUT = "{\n  \"dependencies\": {\n    \"next\": \"16.0.0\",\n    \"react\": \"19.2.8\",\n    \"@anthropic-ai/sdk\": \"0.100.0\"\n  },\n  \"devDependencies\": {\n    \"typescript\": \"5.4.0\"\n  }\n}";

export const DEPENDENCY_REPLAY: DependencyResult = {
  "ecosystem": "npm",
  "reports": [
    {
      "name": "next",
      "current": "16.0.0",
      "latest": "16.3.6",
      "breaking": false,
      "releasesUrl": "https://github.com/vercel/next.js/releases",
      "status": "outdated",
      "summary": "In the latest releases, v16.3.6 adds a security fix for a remote code execution vulnerability in ImageResponse. v16.3.5 backports several bug fixes for next/image cache handling, server NFTs, CSP nonces, and prerender signals. v16.3.4 re‑enables AVIF image optimization and includes additional bug fixes."
    },
    {
      "name": "react",
      "current": "19.2.8",
      "latest": "19.3.0",
      "breaking": false,
      "releasesUrl": "https://github.com/react/react/releases",
      "status": "outdated",
      "summary": "v19.3.0 introduces a new <ViewTransition /> component and addTransitionType APIs for view transition animations."
    },
    {
      "name": "@anthropic-ai/sdk",
      "current": "0.100.0",
      "latest": "0.128.0",
      "breaking": false,
      "releasesUrl": "https://github.com/anthropics/anthropic-sdk-typescript/releases",
      "status": "outdated",
      "summary": "v0.128.0 adds support for the claude‑opus‑5‑5 model, inline tool definitions, and MCP tool‑list pinning (beta), and fixes an enum sharing issue in Managed Agents events."
    },
    {
      "name": "typescript",
      "current": "5.4.0",
      "latest": "7.0.2",
      "breaking": false,
      "releasesUrl": "https://github.com/microsoft/TypeScript/releases",
      "status": "outdated",
      "summary": "The release notes for v7.0.2 only provide a link to the announcement blog and contain no detailed change list."
    }
  ]
};
