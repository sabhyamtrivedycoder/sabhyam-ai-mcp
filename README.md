# Sabhyam AI - Model Context Protocol (MCP) Server

Official Model Context Protocol (MCP) server for **Sabhyam AI**, the autonomous digital twin and co-pilot of **Sabhyam Trivedy** (14-year-old software engineer and founder of HoloVerse AI, Spark2Ship, and sabhyamai.in).

This MCP server allows any AI assistant (Claude, Antigravity, Cursor, Codex) to directly query Sabhyam's digital twin knowledge base, inspect startup architectures, retrieve mascot sprite atlas telemetry, and apply his engineering directives.

---

## Capabilities Provided

### Tools
- `sabhyam_profile`: Returns full biography, founder stats, active ventures, and core operating directives.
- `sabhyam_knowledge`: Searches Sabhyam's ecosystem (computer vision, mascot mechanics, cross-agent bridges, ventures).
- `sabhyam_venture_inspect`: Returns deep technical specs and architectures for `holoverse-ai`, `spark2ship`, `sabhyamai`, `cv-labs`, and `portfolio`.
- `sabhyam_mascot_telemetry`: Fetches 3x3 WebP atlas alignment data (0.00px boop shift) and embed snippets for React and Vanilla JS.
- `sabhyam_cross_agent_bridge`: Details the multi-agent synchronization status for Claude, Antigravity, and Codex.
- `sabhyam_code_review`: Analyzes code snippets against Sabhyam's zero-emoji rules and typing standards.

### Resources
- `sabhyam://profile/bio` - Identity and bio.
- `sabhyam://ventures/matrix` - All ventures and repository links.
- `sabhyam://rules/directives` - Zero-emoji protocol and git standards.
- `sabhyam://architecture/bridge` - Multi-agent sync configuration.
- `sabhyam://mascot/spec` - Sprite atlas specifications and alignment metrics.

### Prompts
- `sabhyam-digital-twin`: Embody Sabhyam as an autonomous digital twin engineer.
- `sabhyam-system-architect`: Directs the agent to architect high-performance solutions matching Sabhyam's stack.

---

## Installation & Configuration

### 1. Google Antigravity
Add to `~/.gemini/config/mcp_config.json`:
```json
{
  "mcpServers": {
    "sabhyam-ai": {
      "command": "node",
      "args": [
        "C:\\Users\\PC\\.gemini\\antigravity\\scratch\\sabhyam-ai-mcp\\index.js"
      ]
    }
  }
}
```

### 2. Claude Desktop
Add to `%APPDATA%\\Claude\\claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "sabhyam-ai": {
      "command": "node",
      "args": [
        "C:\\Users\\PC\\.gemini\\antigravity\\scratch\\sabhyam-ai-mcp\\index.js"
      ]
    }
  }
}
```

### 3. Claude Code CLI
```bash
claude mcp add sabhyam-ai node C:\\Users\\PC\\.gemini\\antigravity\\scratch\\sabhyam-ai-mcp\\index.js
```

### 4. Cursor / Windsurf
Add to `.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "sabhyam-ai": {
      "command": "node",
      "args": [
        "C:\\Users\\PC\\.gemini\\antigravity\\scratch\\sabhyam-ai-mcp\\index.js"
      ]
    }
  }
}
```

---

## Author & License
- **Founder:** Sabhyam Trivedy
- **GitHub:** [sabhyamtrivedycoder](https://github.com/sabhyamtrivedycoder)
- **License:** MIT
