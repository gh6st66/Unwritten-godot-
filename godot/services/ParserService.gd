extends Node

var verbs: Dictionary = {}
var nouns: Dictionary = {}

func _ready():
    refresh()

func refresh():
    verbs.clear()
    nouns.clear()
    _load_verbs()
    _load_nouns()

func _load_verbs():
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

func _load_nouns():
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

func get_verb(token: String) -> String:
    return verbs.get(token, "")

func get_noun(token: String) -> String:
    return nouns.get(token, "")
