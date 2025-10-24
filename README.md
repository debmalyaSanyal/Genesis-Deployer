# Genesis Deployer

**Genesis Deployer** is an AI-powered Large Language Model (LLM) application that generates and deploys software projects to GitHub with a single prompt. It automates code generation, repository setup, and deployment—making rapid prototyping effortless.

## Features

- Prompt-driven project creation (just describe your project idea!)
- Automated GitHub repo setup and deployment
- Customizable prompt templates
- [Add any other features: CI/CD, Framework support, etc.]

## How It Works

1. Enter your project idea as a simple prompt.
2. The app generates the code using an LLM.
3. Genesis Deployer sets up a new GitHub repository and pushes the code.

## Installation

git clone https://github.com/yourusername/genesis-deployer.git
cd genesis-deployer
pip install -r requirements.txt

text

## Usage

python -m genesis_deployer --prompt "A Flask app that says hello world"

text

Or, try out the interactive CLI:

python cli.py

text

## Configuration

- Set your GitHub token via environment variable `GITHUB_TOKEN`.
- LLM API keys/configuration in `.env`.

## Folder Structure

- `/genesis_deployer`: Main source code
- `/prompt_templates`: Reusable prompts for different project types
- `/tests`: Unit tests
- `/examples`: Example prompts and outputs

## Contributing

Pull requests are welcome! Please see `CONTRIBUTING.md` for guidance.

## License

[MIT](LICENSE)
