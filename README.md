# RAVANA AGI Documentation System

This is a Node.js-based documentation website for the RAVANA AGI system, built with Next.js, Tailwind CSS, and supporting Mermaid diagrams.

## Features

- **Next.js Framework**: Modern React-based framework for production-ready applications
- **Markdown Support**: Full support for Markdown files with GitHub Flavored Markdown
- **Mermaid Diagrams**: Automatic rendering of Mermaid diagrams in documentation
- **Code Syntax Highlighting**: Syntax highlighting for multiple programming languages
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **GitHub Pages Deployment**: Automated deployment via GitHub Actions

## Getting Started

### Prerequisites

- Node.js 18+
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd wiki
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the documentation.

### Building for Production

To create a production build:

```bash
npm run build
```

To serve the production build locally:

```bash
npm run start
```

## Project Structure

```
/wiki-nodejs/
├── pages/                  # Next.js pages
│   ├── index.js            # Main documentation index
│   ├── docs/[slug].js      # Dynamic documentation pages
│   └── 404.js              # Custom 404 page
├── lib/                    # Business logic and utilities
│   └── markdown.js         # Markdown processing utilities
├── styles/                 # Global styles
│   └── globals.css         # Tailwind CSS and custom styles
├── docs/                   # Documentation content (existing Markdown files)
├── public/                 # Static assets
├── scripts/                # Utility scripts
│   └── mermaid-debug.js    # Mermaid diagram debugging script
└── components/             # Reusable UI components (to be added)
```

## Documentation Format

The documentation system supports:

1. **Standard Markdown**: All GitHub Flavored Markdown features
2. **Mermaid Diagrams**: Enclosed in ```mermaid code blocks
3. **Code Syntax Highlighting**: For JavaScript, TypeScript, Python, Bash, JSON, YAML, and more
4. **Frontmatter**: YAML frontmatter for page metadata (optional)

Example Mermaid diagram:
```markdown
\```mermaid
graph TD
  A[Start] --> B[Process]
  B --> C[End]
\```
```

## Debugging Mermaid Diagrams

A debugging script is available to identify issues with Mermaid diagrams in documentation files:

```bash
npm run mermaid:debug
```

This script scans all documentation files and reports:
- Missing diagram type declarations
- Metadata sections that should be removed
- Style directives that might cause issues
- Round bracket node syntax that needs conversion
- Inconsistent arrow syntax
- Missing line breaks between node definitions
- Unbalanced quotes

## Deployment

The documentation is automatically deployed to GitHub Pages using GitHub Actions. The workflow is defined in `.github/workflows/deploy-wiki.yml`.

## Contributing

To contribute to the documentation:

1. Edit the Markdown files in the `docs/` directory
2. Run the Mermaid debugging script to check for issues:
   ```bash
   npm run mermaid:debug
   ```
3. Fix any issues identified by the script
4. Submit a pull request with your changes

The documentation website will be automatically updated when changes are merged to the `main` branch.