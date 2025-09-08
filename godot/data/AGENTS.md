# AGENTS: Godot data assets

## VerbDef `.tres`

### Fields

- `verb: String`
  Canonical verb token. Lowercase. One word.
- `synonyms: PackedStringArray`
  Zero or more alias tokens. Lowercase. No spaces. Each maps to the same verb.

### Constraints

- `verb` is required and unique across all verbs.
- Synonyms must not collide with any other verb's `verb` or synonyms.
- Use ASCII, no punctuation beyond hyphen if needed.

### Example (`res://data/verbs/inspect.tres`)

```
[resource]
script = ExtResource("res://resources/verb_def.gd")
verb = "inspect"
synonyms = ["examine", "look", "view", "study"]
```

### Naming

- File name: `<verb>.tres` (e.g., `inspect.tres`).
- Folder: `res://data/verbs/`.

---

## NounDef `.tres`

### Fields

- `canonical: String`
  Canonical noun token. Lowercase. One word.
- `synonyms: PackedStringArray`
  Zero or more alias tokens. Lowercase. No spaces.
- `tags: PackedStringArray`
  Optional descriptors (e.g., `ancient`, `unique`). Lowercase.

### Constraints

- `canonical` is required and unique across all nouns.
- Synonyms must not collide with any other noun's `canonical` or synonyms.
- Tags are free-form but keep lowercase tokens.

### Example (`res://data/nouns/relic.tres`)

```
[resource]
script = ExtResource("res://resources/noun_def.gd")
canonical = "relic"
synonyms = ["artifact", "idol"]
tags = ["ancient"]
```

### Naming

- File name: `<canonical>.tres` (e.g., `relic.tres`).
- Folder: `res://data/nouns/`.

---

## Editor steps (Godot 4.3)

1. **Create**: Right-click target folder → **New Resource…** → pick `VerbDef` or `NounDef` → Save.
2. **Fill**: In Inspector, set fields exactly as above.
3. **Repeat** for each asset.

---

## Validation checklist

- Tokens are lowercase, single words, no spaces.
- No duplicate tokens across all files:
  - For verbs: `verb` and each `synonym`.
  - For nouns: `canonical` and each `synonym`.
- File paths:
  - Verbs in `res://data/verbs/`
  - Nouns in `res://data/nouns/`
- Parser reload:
  - Call `Parser.refresh()` or restart to pick up new assets.

---

## Common errors and fixes

- **“Trying to assign PackedStringArray to Array[String]”**
  Use `PackedStringArray` in resource scripts (you already do).
- **Unknown verb/noun in game**
  Missed lowercase, typo, or file saved to wrong folder. Verify with `Parser.has_verb("token")` / `Parser.has_noun("token").`
- **Collision**
  Two assets define the same token. Remove or rename duplicates.

---

## Quick starters

### `wait.tres`

```
[resource]
script = ExtResource("res://resources/verb_def.gd")
verb = "wait"
synonyms = ["pause", "hold", "delay"]
```

### `door.tres`

```
[resource]
script = ExtResource("res://resources/noun_def.gd")
canonical = "door"
synonyms = ["gate", "portal"]
tags = ["structure"]
```

---

## Exit checks

- `Parser.parse("examine relic")` → `{ "verb": "inspect", "noun": "relic", ... }`
- `Parser.parse("portal")` resolves to noun `door`.
- No red errors in Debugger on startup.
