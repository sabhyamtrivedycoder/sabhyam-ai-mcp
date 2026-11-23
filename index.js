#!/usr/bin/env node

/**
 * Sabhyam AI - Model Context Protocol (MCP) Server
 * Exposes Sabhyam Trivedy's digital twin capabilities, project telemetry,
 * computer vision assets, mascot specs, and cross-agent bridges to any MCP client.
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema
} = require('@modelcontextprotocol/sdk/types.js');

const SERVER_NAME = 'sabhyam-ai-mcp';
const SERVER_VERSION = '1.0.0';

// Database & System State
const SABHYAM_PROFILE = {
  name: 'Sabhyam Trivedy',
  age: 14,
  dob: '2011-06-22',
  role: 'Founder, Full-Stack Engineer, Spatial Computing & Vision Developer',
  location: 'Rajdhanwar, Jharkhand, India',
  github: 'https://github.com/sabhyamtrivedycoder',
  portfolio: 'https://sabhyamtrivedycoder.github.io/portfolio/',
  agent_website: 'https://sabhyamtrivedycoder.github.io/sabhyam-ai-agent/',
  ventures: [
    {
      id: 'holoverse-ai',
      name: 'HoloVerse AI',
      role: 'Founder & Architect',
      status: 'Live Platform',
      url: 'https://sabhyamtrivedycoder.github.io/holoverse-ai/',
      tech: ['Three.js', 'WebGL', 'Spatial WorldGen', 'Markerless MoCap'],
      description: 'Spatial 3D procedural world generator and motion capture studio.'
    },
    {
      id: 'spark2ship',
      name: 'Spark2Ship',
      role: 'Founder & Lead Engineer',
      status: 'Active Incubation Pipeline',
      url: 'https://github.com/sabhyamtrivedycoder',
      tech: ['TypeScript', 'FastAPI', 'Automation', 'CI/CD'],
      description: 'High-velocity software incubation engine shipping web platforms in 24hr sprints.'
    },
    {
      id: 'sabhyamai',
      name: 'sabhyamai.in',
      role: 'Creator',
      status: 'Neural Twin System',
      url: 'https://sabhyamtrivedycoder.github.io/sabhyam-ai-agent/',
      tech: ['Real-Time Avatar', 'Cross-Agent Bridge', 'WebP Sprite Atlases'],
      description: 'Autonomous digital twin presence and multi-agent coordination hub.'
    }
  ],
  stats: {
    repositories_created: '50+',
    live_startups: 3,
    connected_engines: ['Claude Code', 'Google Antigravity', 'OpenAI Codex'],
    mascot_alignment_shift: '0.00px'
  },
  operating_directives: [
    'Zero Emojis: Strictly forbid emojis across all code, commits, and outputs.',
    'Autonomous Execution: Build, test, and verify end-to-end with high velocity.',
    'Linear Git Discipline: Clean imperative commit messages, linear history on main.'
  ]
};

const VENTURES_SPECS = {
  'holoverse-ai': {
    name: 'HoloVerse AI',
    tagline: 'Spatial 3D WorldGen & MoCap Studio',
    architecture: 'Client-side procedural rendering engine using Three.js with custom shader passes and markerless motion capture tracking.',
    repo: 'https://github.com/sabhyamtrivedycoder/holoverse-ai',
    live: 'https://sabhyamtrivedycoder.github.io/holoverse-ai/'
  },
  'spark2ship': {
    name: 'Spark2Ship',
    tagline: 'Concept-to-Production Incubation Engine',
    architecture: 'Automated software scaffolding pipeline integrating full-stack templates with automated testing and deployment.',
    repo: 'https://github.com/sabhyamtrivedycoder',
    live: 'https://github.com/sabhyamtrivedycoder'
  },
  'sabhyamai': {
    name: 'sabhyamai.in / Sabhyam AI',
    tagline: 'Autonomous Digital Twin & Universal Agent Hub',
    architecture: 'Multi-agent bridge connecting Anthropic Claude, Google Antigravity, and OpenAI Codex under a shared directive engine.',
    repo: 'https://github.com/sabhyamtrivedycoder/sabhyam-ai-agent',
    live: 'https://sabhyamtrivedycoder.github.io/sabhyam-ai-agent/'
  },
  'cv-labs': {
    name: 'Computer Vision & Optical DSP Labs',
    tagline: 'Contactless Sensors & Spatial Gesture Controllers',
    architecture: 'OpenCV and MediaPipe pipelines: contactless webcam photoplethysmography pulse monitor, gesture combat spellcasting, and air-canvas.',
    repo: 'https://github.com/sabhyamtrivedycoder/portfolio',
    live: 'https://sabhyamtrivedycoder.github.io/portfolio/vision.html'
  },
  'portfolio': {
    name: 'Sabhyam Trivedy Portfolio',
    tagline: '14yo Software Engineer & Founder Hub',
    architecture: 'Vanilla JS, responsive modern CSS, and integrated cursor-tracking chibi mascot.',
    repo: 'https://github.com/sabhyamtrivedycoder/portfolio',
    live: 'https://sabhyamtrivedycoder.github.io/portfolio/'
  }
};

const MASCOT_METADATA = {
  name: 'Sabhyam Chibi Mascot',
  version: '2.0',
  grid_dimension: '3x3',
  resolution: '1024x1024',
  directions_atlas: 'assets/mascots/sabhyam-directions.webp',
  reactions_atlas: 'assets/mascots/sabhyam-reactions.webp',
  verification: {
    shift_px: 0.00,
    cross_sheet_scale: 0.995,
    overlap_pct: 87.7,
    shoulder_delta_pct: 6.4,
    status: 'VERIFIED_STABLE'
  },
  sectors: ['right', 'down-right', 'down', 'down-left', 'left', 'up-left', 'up', 'up-right'],
  reactions: ['blink', 'heart', 'sparkle', 'surprised', 'wink', 'bashful', 'sleepy', 'dizzy', 'delighted']
};

const CROSS_AGENT_BRIDGE = {
  status: 'ACTIVE_SYNCHRONIZED',
  endpoints: {
    claude: {
      location: '~/.claude/CLAUDE.md',
      role: 'Founder, Full-Stack & CV Engineer',
      rules: 'Zero Emojis, Autonomous Execution, Git linear push'
    },
    antigravity: {
      location: '~/.gemini/config/GEMINI.md',
      subagent: 'sabhyam-twin',
      capabilities: ['Full Write Tools', 'MCP Server Execution', 'Subagent Orchestration']
    },
    codex: {
      location: '~/.codex/instructions.md',
      config: '~/.codex/config.toml',
      target: 'antigravity'
    },
    universal: {
      location: '~/.agents/AGENTS.md and C:\\Users\\PC\\AGENTS.md',
      scope: 'Cross-Agent Multi-Tool Standard'
    }
  }
};

// Initialize MCP Server
const server = new Server(
  {
    name: SERVER_NAME,
    version: SERVER_VERSION
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {}
    }
  }
);

// --- TOOLS HANDLERS ---
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'sabhyam_profile',
        description: "Returns Sabhyam Trivedy's complete profile, founder bio, active ventures, repositories, and technical standards.",
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'sabhyam_knowledge',
        description: "Searches Sabhyam AI's knowledge base across ventures, computer vision labs, tech stack preferences, and system directives.",
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Topic to search (e.g., "computer vision", "ventures", "rules", "mascot", "architecture")'
            }
          },
          required: ['query']
        }
      },
      {
        name: 'sabhyam_venture_inspect',
        description: 'Retrieves technical specifications, architecture, and live links for any of Sabhyam\'s ventures.',
        inputSchema: {
          type: 'object',
          properties: {
            venture_id: {
              type: 'string',
              description: 'Identifier of the venture (holoverse-ai, spark2ship, sabhyamai, cv-labs, portfolio)',
              enum: ['holoverse-ai', 'spark2ship', 'sabhyamai', 'cv-labs', 'portfolio']
            }
          },
          required: ['venture_id']
        }
      },
      {
        name: 'sabhyam_mascot_telemetry',
        description: 'Returns the technical specifications, 3x3 WebP sprite atlas metrics, alignment data, and embed code for the Sabhyam Chibi Mascot.',
        inputSchema: {
          type: 'object',
          properties: {
            format: {
              type: 'string',
              description: 'Snippet format to return (react, vanilla_js, telemetry)',
              enum: ['react', 'vanilla_js', 'telemetry']
            }
          }
        }
      },
      {
        name: 'sabhyam_cross_agent_bridge',
        description: 'Returns the multi-agent synchronization status and configuration templates for Claude, Antigravity, and Codex.',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'sabhyam_code_review',
        description: 'Evaluates code or architecture against Sabhyam\'s engineering rules (clean typing, modular design, zero-emoji compliance).',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'Code snippet to review'
            },
            language: {
              type: 'string',
              description: 'Programming language (e.g. typescript, python, javascript)'
            }
          },
          required: ['code']
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'sabhyam_profile': {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(SABHYAM_PROFILE, null, 2)
          }
        ]
      };
    }

    case 'sabhyam_knowledge': {
      const q = (args.query || '').toLowerCase();
      let matched = {};

      if (q.includes('vision') || q.includes('cv') || q.includes('camera') || q.includes('gesture')) {
        matched = { category: 'computer_vision', data: VENTURES_SPECS['cv-labs'] };
      } else if (q.includes('mascot') || q.includes('chibi') || q.includes('cursor')) {
        matched = { category: 'page_mascot', data: MASCOT_METADATA };
      } else if (q.includes('bridge') || q.includes('agent') || q.includes('claude') || q.includes('codex') || q.includes('antigravity')) {
        matched = { category: 'cross_agent_bridge', data: CROSS_AGENT_BRIDGE };
      } else if (q.includes('rule') || q.includes('emoji')) {
        matched = { category: 'directives', data: SABHYAM_PROFILE.operating_directives };
      } else {
        matched = {
          category: 'general_profile',
          name: SABHYAM_PROFILE.name,
          role: SABHYAM_PROFILE.role,
          ventures: SABHYAM_PROFILE.ventures,
          stats: SABHYAM_PROFILE.stats
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(matched, null, 2)
          }
        ]
      };
    }

    case 'sabhyam_venture_inspect': {
      const spec = VENTURES_SPECS[args.venture_id];
      if (!spec) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Unknown venture_id: ${args.venture_id}` }]
        };
      }
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(spec, null, 2)
          }
        ]
      };
    }

    case 'sabhyam_mascot_telemetry': {
      const format = args.format || 'telemetry';
      let output = '';

      if (format === 'react') {
        output = `import { Mascot } from 'page-mascot';\n\n<Mascot\n  directions="/mascots/sabhyam-directions.webp"\n  reactions="/mascots/sabhyam-reactions.webp"\n  size={140}\n  label="Sabhyam"\n/>`;
      } else if (format === 'vanilla_js') {
        output = `// HTML: <div id="sabhyam-mascot"></div>\n// Script: <script src="assets/mascot.js"></script>\nwindow.createSabhyamMascot('sabhyam-mascot', {\n  size: 150,\n  directions: 'assets/mascots/sabhyam-directions.webp',\n  reactions: 'assets/mascots/sabhyam-reactions.webp'\n});`;
      } else {
        output = JSON.stringify(MASCOT_METADATA, null, 2);
      }

      return {
        content: [{ type: 'text', text: output }]
      };
    }

    case 'sabhyam_cross_agent_bridge': {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(CROSS_AGENT_BRIDGE, null, 2)
          }
        ]
      };
    }

    case 'sabhyam_code_review': {
      const code = args.code || '';
      const hasEmoji = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(code);
      const isTyped = /:\s*(string|number|boolean|any|void)|def\s+\w+\(.*->/i.test(code);

      const review = {
        compliant: !hasEmoji,
        zero_emoji_check: hasEmoji ? 'FAILED: Emoji detected in code. Violates rule 01.' : 'PASSED: No emojis present.',
        typing_analysis: isTyped ? 'PASSED: Modern type annotations detected.' : 'NOTE: Consider adding explicit static type annotations.',
        recommendation: hasEmoji ? 'Strip all emojis before committing to main.' : 'Code meets Sabhyam AI engineering standards.'
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(review, null, 2)
          }
        ]
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// --- RESOURCES HANDLERS ---
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'sabhyam://profile/bio',
        name: 'Sabhyam Trivedy Bio',
        description: 'Complete biography, founder background, and vision.',
        mimeType: 'application/json'
      },
      {
        uri: 'sabhyam://ventures/matrix',
        name: 'Sabhyam Ventures Matrix',
        description: 'Overview of HoloVerse AI, Spark2Ship, and sabhyamai.in.',
        mimeType: 'application/json'
      },
      {
        uri: 'sabhyam://rules/directives',
        name: 'Sabhyam Operating Directives',
        description: 'Zero-emoji rules, autonomous execution, and linear git discipline.',
        mimeType: 'text/markdown'
      },
      {
        uri: 'sabhyam://architecture/bridge',
        name: 'Cross-Agent Bridge Architecture',
        description: 'Configuration for Claude, Antigravity, and Codex.',
        mimeType: 'application/json'
      },
      {
        uri: 'sabhyam://mascot/spec',
        name: 'Mascot Sprite Atlas Spec',
        description: 'WebP 3x3 atlas telemetry and alignment verification metrics.',
        mimeType: 'application/json'
      }
    ]
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case 'sabhyam://profile/bio':
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(SABHYAM_PROFILE, null, 2)
          }
        ]
      };

    case 'sabhyam://ventures/matrix':
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(VENTURES_SPECS, null, 2)
          }
        ]
      };

    case 'sabhyam://rules/directives':
      return {
        contents: [
          {
            uri,
            mimeType: 'text/markdown',
            text: `# Sabhyam AI Directives\n\n1. Zero Emojis: Strictly forbidden in code, commits, and responses.\n2. Autonomous Execution: Complete tasks end-to-end.\n3. Linear Git Discipline: Clean imperative commit messages on main.`
          }
        ]
      };

    case 'sabhyam://architecture/bridge':
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(CROSS_AGENT_BRIDGE, null, 2)
          }
        ]
      };

    case 'sabhyam://mascot/spec':
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(MASCOT_METADATA, null, 2)
          }
        ]
      };

    default:
      throw new Error(`Resource not found: ${uri}`);
  }
});

// --- PROMPTS HANDLERS ---
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: 'sabhyam-digital-twin',
        description: 'System prompt to embody Sabhyam Trivedy as an autonomous digital twin co-pilot.',
        arguments: []
      },
      {
        name: 'sabhyam-system-architect',
        description: 'Directs the agent to design a high-performance system matching Sabhyam\'s stack.',
        arguments: [
          {
            name: 'domain',
            description: 'Domain of the project (e.g. computer-vision, 3d-graphics, web-platform)',
            required: true
          }
        ]
      }
    ]
  };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'sabhyam-digital-twin') {
    return {
      description: 'Embody Sabhyam Trivedy as an autonomous digital twin co-pilot',
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `You are Sabhyam AI, the digital twin of Sabhyam Trivedy (14yo software engineer and founder of HoloVerse AI, Spark2Ship, and sabhyamai.in). Build with extreme speed, modular clean code, full typing, and zero emojis. Maintain high technical standards across Python, TypeScript, React, and computer vision.`
          }
        }
      ]
    };
  }

  if (name === 'sabhyam-system-architect') {
    const domain = (args && args.domain) || 'full-stack';
    return {
      description: 'Architect a system using Sabhyam\'s high-velocity stack',
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Architect an end-to-end solution for ${domain}. Use modern modular patterns: React/Vite/Tailwind for UI, FastAPI/Fastify for APIs, OpenCV/MediaPipe for vision, or Three.js for 3D. Enforce clean interfaces, test coverage, and strict zero-emoji convention.`
          }
        }
      ]
    };
  }

  throw new Error(`Prompt not found: ${name}`);
});

// Start Transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  process.stderr.write(`Fatal error in sabhyam-ai-mcp: ${error.message}\n`);
  process.exit(1);
});
