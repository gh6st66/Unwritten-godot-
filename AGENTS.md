# AGENTS

## Retrieval Order

1. Start with this file at the repository root.
2. For any file you touch, also read `AGENTS.md` files in ancestor directories.
3. More deeply nested instructions override parent scopes.

## Task Intake Template

### Summary

- <short bullet list of changes>

### Testing

- <command> (result)

## Repository Guidelines

- **Parser-first**: new features expose at least one intent or noun and update lexicon assets and tests.
- **Echoes over flags**: emit Echoes per schema; avoid ad hoc booleans.
- **Deterministic code only**: seed any RNG through state.
- **Respect file ownership**: do not modify `legacy/` without task notes.
- **TS strict, ESLint, Prettier**: match existing patterns.
- **Small PRs**: explain trade-offs and provide diffs, not blobs.
- **Tests required**: add/modify tests for state transitions and parser recognition (positive/negative).
- **Public API changes**: update `CHANGELOG.md` and provide migration notes.
- **Missing context**: state assumptions and add a stub in `docs/` with open questions.
