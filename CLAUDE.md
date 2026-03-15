# Skills Repo

This repo contains reusable AI agent skills published by the GAIA team at `theexperiencecompany/skills`.

## Structure

Each skill is a directory with:
- `SKILL.md` — frontmatter (name, description) + instructions
- `references/` — detailed docs loaded on demand
- `scripts/` — executable code (optional)
- `assets/` — templates/files used in output (optional)

## Adding a New Skill

1. Create a directory named after the skill (kebab-case)
2. Add `SKILL.md` with YAML frontmatter (`name`, `description`) and markdown body
3. Add `references/`, `scripts/`, `assets/` as needed
4. Update `README.md` — add a row to the Available Skills table
5. Commit and push to master

## Rules

- Always update README.md when adding or removing skills
- Skill descriptions must explain both what it does AND when to use it
- Keep SKILL.md under 500 lines — split into references/ for detailed content
- No README, CHANGELOG, or docs inside individual skill directories
- Test skills before publishing
