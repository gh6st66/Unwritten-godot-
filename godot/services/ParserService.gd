extends Node
class_name ParserService

var verbs: Dictionary = {}
var nouns: Dictionary = {}
var phrase_map: Dictionary = {}
var rng := RandomNumberGenerator.new()

func _ready():
    refresh()

func refresh() -> void:
    verbs.clear()
    nouns.clear()
    phrase_map.clear()
    _load_verbs()
    _load_nouns()
    _load_phrase_map()

func _load_verbs() -> void:
    var dir = DirAccess.open("res://data/verbs")
    if dir:
        dir.list_dir_begin()
        var file = dir.get_next()
        while file != "":
            if file.ends_with(".tres"):
                var res: VerbDef = load("res://data/verbs/%s" % file)
                if res:
                    verbs[res.verb] = res.verb
                    for s in res.synonyms:
                        verbs[s] = res.verb
            file = dir.get_next()
        dir.list_dir_end()

func _load_nouns() -> void:
    var dir = DirAccess.open("res://data/nouns")
    if dir:
        dir.list_dir_begin()
        var file = dir.get_next()
        while file != "":
            if file.ends_with(".tres"):
                var res: NounDef = load("res://data/nouns/%s" % file)
                if res:
                    nouns[res.canonical] = res.canonical
                    for s in res.synonyms:
                        nouns[s] = res.canonical
            file = dir.get_next()
        dir.list_dir_end()

func _load_phrase_map() -> void:
    var path = "res://data/lex/phrase_map.json"
    if FileAccess.file_exists(path):
        var text = FileAccess.get_file_as_string(path)
        var data = JSON.parse_string(text)
        if data is Dictionary:
            phrase_map = data

func normalize_token(phrase: String) -> String:
    var s = phrase.to_lower()
    s = s.strip_edges()
    var reg = RegEx.new()
    reg.compile("\\s+")
    s = reg.sub(s, " ", true)
    if s.begins_with("to "):
        s = s.substr(3)
    reg.compile("[^a-z0-9 '\-]")
    s = reg.sub(s, "", true)
    s = s.replace(" ", "_")
    s = s.to_ascii()
    reg.compile("[^a-z0-9_'-]")
    s = reg.sub(s, "", true)
    if s.length() > 48:
        s = s.substr(0, 48)
    return s

func tokenize(input: String) -> Array[String]:
    var clean = input.to_lower()
    var reg = RegEx.new()
    reg.compile("[^a-z0-9 '\-]")
    clean = reg.sub(clean, " ", true)
    reg.compile("\\s+")
    clean = reg.sub(clean, " ", true)
    var parts = clean.strip_edges().split(" ")
    var tokens: Array[String] = []
    var i = 0
    while i < parts.size():
        var matched = false
        for n in range(3, 0, -1):
            if i + n > parts.size():
                continue
            var phrase = " ".join(parts.slice(i, i + n))
            var token = normalize_token(phrase)
            if verbs.has(token) or nouns.has(token):
                tokens.append(token)
                i += n
                matched = true
                break
        if not matched:
            tokens.append(normalize_token(parts[i]))
            i += 1
    return tokens

func parse(input: String) -> Dictionary:
    var tokens = tokenize(input)
    var result = {
        "verb": "",
        "direct": "",
        "indirect": "",
        "preposition": "",
        "raw": input,
        "tokens": tokens,
        "errors": []
    }
    if tokens.size() > 0:
        var v = tokens[0]
        if verbs.has(v):
            result["verb"] = verbs[v]
        else:
            result["errors"].append("unknown verb: %s" % v)
    if tokens.size() > 1:
        var n = tokens[1]
        var resolved = resolve_noun(n)
        if resolved["noun"] != "":
            result["direct"] = resolved["noun"]
        else:
            result["errors"].append("unknown noun: %s" % n)
    return result

func add_synonym(token: String, canonical: String) -> void:
    if verbs.has(canonical):
        verbs[token] = canonical
    elif nouns.has(canonical):
        nouns[token] = canonical

func remove_synonym(token: String) -> void:
    verbs.erase(token)
    nouns.erase(token)

func resolve_noun(token: String, context: Dictionary = {}) -> Dictionary:
    return {"noun": nouns.get(token, "")}

func is_known_verb(token: String) -> bool:
    return verbs.has(token)

func get_verb(token: String) -> String:
    return verbs.get(token, "")

func get_noun(token: String) -> String:
    return nouns.get(token, "")
