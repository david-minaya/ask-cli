# Ask CLI

[![NPM Version](https://img.shields.io/npm/v/ask-cli-ai)](https://www.npmjs.com/package/ask-cli-ai) ![Min Node Version](https://img.shields.io/node/v/ask-cli-ai)


A fast and lightweight AI-powered CLI tool to help you with commands, coding, apps and more.

- 🤖  Get help about commands, coding, apps, etc.
- 📝  Short and precise answers, just the info you need, straight to the point.
- 🚀  Blazing fast speed, almost instant responses.
- 🛡️  Safe by design, it cannot run commands or access your files without your explicit authorization.

Forget about switching between applications to know how to use a command or fix an error. Just ask your terminal how to do it.

![Ask CLI demo showing quick terminal responses](https://github.com/david-minaya/ask/raw/main/images/ask.gif)

## Content

- [Why use Ask CLI?](#why-use-ask-cli)
- [Installation](#installation)
- [Usage](#usage)
- [Select model](#select-model)
- [Supported models](#supported-models)
- [Connect to local or external providers](#connect-to-local-or-external-providers)
- [Reference](#reference)

## Why use Ask CLI?

Why use Ask CLI and not an AI agent like Claude or Gemini?

- Ask CLI was created to do one thing and do it well: help you with commands, coding, apps and more from your terminal.
- The AI models it uses are optimized to generate short, precise and fast answers.
- No risk of prompt injection, Ask CLI cannot run commands or access your files by default.
- No risk of running dangerous commands on your computer. See [Running commands](#running-commands) for more details.
- Designed for anyone who wants fast, secure, and precise help directly in the terminal.

## Installation

```bash
npm install -g ask-cli-ai
```

## Usage

> To use Ask CLI, you first need to set up the API key. See [Select model](#select-model) to learn how.

### Ask questions

```bash
# Basic usage
ask <your question>

# Examples
ask how to terminate a linux process
ask what is a javascript promise
ask how to create a git branch

# Using quotes
ask 'What does this command do: git config user.name "Ask CLI"?'
```

### Aliases

You can use **`how`** and **`what`** as aliases for the **`ask`** command:

```bash
# Using 'how' alias
how to install docker on ubuntu

# Using 'what' alias
what is the difference between git merge and rebase
```

### Running commands

By default, Ask CLI cannot run commands on your computer. However, you can use the **`-c`** or **`--command`** option to execute a command and include its output in your question. This allows Ask CLI to analyze errors, logs, or any command output and provide context-aware answers.

```bash
# Analyze an error
ask why is this failing -c "npm run build"

# Get help with command output
ask explain this output -c "docker ps -a"

# Debug issues
ask what is wrong here -c "git status"
```

## Select model

You can select a model using the **`ask /models`** command. This will list all the available models and let you select the model you want to use. 

![Model selection screen](https://github.com/david-minaya/ask/blob/main/images/select-model.png)

> If it's the first time you select a model, you will be prompted to set the API key for the model's provider.

## Supported models

**Gemini**

- Gemini 3 Flash Preview
- Gemini 3 Pro Preview
- Gemini 2.5 Flash
- Gemini 2.5 Flash Lite
- Gemini 2.5 Pro

**OpenAI**

- GPT-5 Mini
- GPT-5 Nano
- GPT-5
- GPT-5.2
- GPT-5.2 Pro
- GPT-4.1

**Anthropic**

- Claude Haiku 4.5
- Claude Sonnet 4.5
- Claude Opus 4.5

## Connect to local or external providers

You can use the **`ask /connect`** command to connect to local models or external providers, using an **OpenAI-compatible API**, like llama.cpp, Ollama, Hugging Face, etc.

![Connect screen](https://github.com/david-minaya/ask/blob/main/images/connect.png)

## Reference

```
AI CLI to help you with commands, coding, apps and more.

Version: 1.2.0

Usage: ask <prompt..>

Commands:
  ask <prompt..>     Ask something. Alias: what, how                   [default]
  ask /models        Select a model
  ask /providers     Setup providers
  ask /config        Configuration
  ask /connect       Connect to an external provider using OpenAI-compatible API
  ask /history       List the chat history
  ask /clear         Clear the chat history

Positionals:
  prompt                                                                [string]

Options:
      --version  Show version number                                   [boolean]
      --help     Show help                                             [boolean]
  -c, --command  Command to execute                                     [string]

Examples:
  ask how to run a docker container
  how to setup my git account
  what is the chmod command
  ask what is using port 80 -c "netstat -ano"
```
