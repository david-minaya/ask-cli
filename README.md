# Ask CLI

[![NPM Version](https://img.shields.io/npm/v/ask-cli-ai)](https://www.npmjs.com/package/ask-cli-ai)

A fast and lightweight AI-powered CLI tool to help you with commands, coding, apps and more.

- 🤖  Get help about commands, coding, apps, etc.
- 📝  Short and precise answers, just the info you need, straight to the point.
- 🚀  Blazing fast speed, almost instant responses.
- 🛡️  Safe by design, it cannot run commands or access your files without your explicit authorization.

Forget about switching between applications to know how to use a command or fix an error. Just ask your terminal how to do it.

![Ask CLI demo showing quick terminal responses](https://github.com/david-minaya/ask/raw/main/images/ask.gif)

## Content

- [Why use Ask CLI?](#why-use-ask-cli)
- [For whom is Ask CLI?](#for-whom-is-ask-cli)
- [Installation](#installation)
- [Usage](#usage)
- [Select model](#select-model)
- [Supported models](#supported-models)
- [Reference](#reference)

## Why use Ask CLI?

Why use Ask CLI and not an AI agent like Claude or Gemini?

- Ask CLI was created to do one thing and do it well: help you with commands, coding, apps and more from your terminal.
- The AI models it uses are optimized to generate short, precise and fast answers.
- No risk of prompt injection, Ask CLI cannot run commands or access your files by default.
- No risk of running dangerous commands on your computer, you have to explicitly authorize it using the `--command` option. See [Running commands](#running-commands) for more details.

## For whom is Ask CLI?

- Students who want to learn how to use commands and the terminal.
- Developers who want to be more productive and avoid context switching.
- Sysadmins who need quick help with commands and troubleshooting.
- DevOps engineers who want to automate tasks and get help with commands.
- Anyone working in production environments where security is critical.

## Installation

```bash
npm install -g ask-cli-ai
```

## Usage

> To use Ask CLI, you first need to set up the API key. See the [Select model](#select-model) section to learn how.

### Ask questions

```bash
# Basic usage
ask <your question>

# Examples
ask how to find files by name in linux
ask what is a promise in javascript
ask how to create a new branch in git

# Using quotes
ask 'What does this command do: git config user.name "Ask CLI"?'
```

### Aliases

You can use `how` and `what` as aliases for the `ask` command:

```bash
# Using 'how' alias
how to install docker on ubuntu

# Using 'what' alias
what is the difference between git merge and rebase
```

### Running commands

By default, Ask CLI cannot run commands on your computer. However, you can use the `-c` or `--command` option to execute a command and include its output in your question. This allows Ask CLI to analyze errors, logs, or any command output and provide context-aware answers.

```bash
# Analyze an error
ask why is this failing -c "npm run build"

# Get help with command output
ask explain this output -c "docker ps -a"

# Debug issues
ask what is wrong here -c "git status"
```

## Select model

You can select a model using the `ask /models` command. This will list all the available models and let you select the model you want to use. 

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

## Reference

```
AI CLI to help you with commands, coding, apps and more.

Usage: ask <prompt..>

Commands:
  ask <prompt..>     Ask something. Alias: what, how                   [default]
  ask /models        Select a model
  ask /providers     Setup providers
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
