# Ask CLI

A fast and lightweight AI-powered CLI tool to ask questions directly from your terminal. Get instant, concise answers about commands, coding, development, apps and more.

## ✨ Features

- 📝 **Concise Answers** - Short and precise responses, straight to the point
- 🚀 **Blazing Fast** - Almost instant responses optimized for terminal use


## 📦 Installation

```bash
npm install -g askcli
```

## 🚀 Quick Start

```bash
# Ask a question
ask how to list all files in a directory

# Or use alternative aliases
how to delete a git branch
what is the difference between npm and yarn
```

## 📖 Usage

### Ask Questions

```bash
# Basic usage
ask <your question>

# Examples
ask how to find files by name in linux
ask what is a promise in javascript
ask how to create a new branch in git
```

### Analyze Command Output

Use the `-c` flag to include a command's output in your question:

```bash
# Analyze an error
ask why is this failing -c "npm run build"

# Get help with command output
ask explain this output -c "docker ps -a"

# Debug issues
ask what's wrong here -c "git status"
```

### Manage Models

```bash
# Select a different AI model
ask /models
```

**Available Models:**

| Provider | Models |
|----------|--------|
| **Gemini** | Gemini 3 Flash Preview, Gemini 3 Pro Preview, Gemini 2.5 Flash, Gemini 2.5 Flash Lite, Gemini 2.5 Pro |
| **OpenAI** | GPT-5 Mini, GPT-5 Nano, GPT-5, GPT-5.2, GPT-5.2 Pro, GPT-4.1 |
| **Anthropic** | Claude Haiku 4.5, Claude Sonnet 4.5, Claude Opus 4.5 |

### Configure Providers

```bash
# Setup API keys for providers
ask /providers
```

### Conversation History

```bash
# View conversation history
ask /history

# Clear conversation history
ask /clear
```

## ⚙️ Commands Reference

| Command | Description |
|---------|-------------|
| `ask <prompt..>` | Ask a question to the AI model |
| `ask /models` | Select a different AI model |
| `ask /providers` | Configure provider API keys |
| `ask /history` | View conversation history |
| `ask /clear` | Clear the conversation history |

### Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--command` | `-c` | Include command output in your question |
| `--version` | | Show version number |
| `--help` | | Show help |

## 🛠️ Development

```bash
# Run in development mode
npm run dev

# Build the project
npm run build

# Run linter
npm run lint

# Type check
npm run typelint
```