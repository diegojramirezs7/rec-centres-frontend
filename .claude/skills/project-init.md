# Skill: Project Initialization

Set up or improve project structure with proper configuration files, dependency management, and directory layout.

## When to Use

Trigger phrases:
- "Initialize this project"
- "Set up structure for this project"
- "Help me make this project ready"
- "Add missing config files"
- "Make this project shareable/team-ready"

## Process

### Step 1: Detect Tech Stack

Analyze the repository to identify:
- **Python**: Look for `*.py`, `requirements.txt`, `pyproject.toml`, `setup.py`
- **Node/TypeScript**: Look for `package.json`, `*.ts`, `*.js`
- **Framework**: FastAPI, Django, Express, Next.js, T3, etc.

### Step 2: Audit Existing Structure

Check what already exists:
- [ ] `.gitignore`
- [ ] Environment config (`.env.example`)
- [ ] README with setup instructions
- [ ] Dependency management (lockfile, etc.)
- [ ] Source code directory structure
- [ ] Data/output directories (if applicable)

### Step 3: Propose Changes

Present a plan to the user covering:
1. What files need to be created
2. What files need to be updated
3. Suggested directory structure
4. Best practices for their tech stack

**Always ask for user confirmation before making changes.**

### Step 4: Implement

After approval, create/update files following the standards below.

---

## Standards by Tech Stack

### Python

**Dependency Management**: Use `uv` with `pyproject.toml`
```toml
[project]
name = "project-name"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = []

[dependency-groups]
dev = []

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```

**Directory Structure**:
```
project/
├── src/                    # Source code (package)
│   ├── __init__.py
│   └── ...
├── tests/                  # Test files (if applicable)
├── data/                   # Data files (if applicable)
├── notebooks/              # Jupyter notebooks (if applicable)
├── .env.example
├── .gitignore
├── pyproject.toml
├── uv.lock
└── README.md
```

**Key Commands** (for README):
```bash
uv venv --python 3.11
source .venv/bin/activate
uv sync
uv add <package>
```

### Node / TypeScript

**Dependency Management**: Use `npm` or `pnpm` (check existing lockfile)
- If `pnpm-lock.yaml` exists → use pnpm
- If `package-lock.json` exists → use npm
- For new projects → suggest pnpm

**Directory Structure**:
```
project/
├── src/                    # Source code
│   └── ...
├── tests/                  # Test files (if applicable)
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json           # If TypeScript
└── README.md
```

### Framework-Specific Notes

**FastAPI**:
- Entry point typically `src/main.py` or `src/app.py`
- Include `uvicorn` in dependencies

**Django**:
- Follow Django's default structure (`manage.py` at root)
- Settings in `project/settings.py` or split settings

**Express**:
- Entry point typically `src/index.ts` or `src/app.ts`

**Next.js / T3**:
- Follow framework conventions (`app/` or `pages/`)
- Use existing scaffolding, don't restructure

**Drizzle ORM**:
- Schema files in `src/db/schema/` or `src/schema/`
- Database client in `src/db/index.ts`
- Migrations in `drizzle/` directory (generated)
- Config file `drizzle.config.ts` at project root
- Key commands for README:
  ```bash
  pnpm drizzle-kit generate   # Generate migrations
  pnpm drizzle-kit migrate    # Run migrations
  pnpm drizzle-kit studio     # Open Drizzle Studio
  ```
- Add to `.gitignore`: nothing extra needed (migrations should be tracked)

---

## .gitignore Essentials

### Python
```gitignore
# Python
__pycache__/
*.py[cod]
*.egg-info/
.venv/
venv/

# Environment
.env

# IDE
.idea/
.vscode/
*.swp

# Jupyter
.ipynb_checkpoints/

# OS
.DS_Store
```

### Node
```gitignore
# Dependencies
node_modules/

# Environment
.env
.env.local

# Build
dist/
.next/
out/

# IDE
.idea/
.vscode/

# OS
.DS_Store
```

---

## .env.example Template

List all required environment variables with placeholder values:
```
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# API Keys
OPENAI_API_KEY=your_api_key_here

# App Config
PORT=3000
NODE_ENV=development
```

---

## README Structure

A good README should include:

1. **Project Title** - One-line description
2. **Prerequisites** - Required tools (Python version, Node version, etc.)
3. **Getting Started** - Clone, install, configure steps
4. **Project Structure** - Brief directory overview
5. **Available Commands** - How to run, test, build
6. **Environment Variables** - Table of required vars

---

## Checklist Before Completing

- [ ] `.gitignore` covers all generated/sensitive files
- [ ] `.env.example` documents all required env vars
- [ ] README has clear setup instructions
- [ ] Dependency lockfile exists and is tracked
- [ ] Source code has consistent directory structure
- [ ] Data directories have `.gitkeep` if needed
