extends Node

var beats: Array = []
var cooldowns: Dictionary = {}

func _ready():
    load_beats()

func load_beats():
    beats.clear()
    cooldowns.clear()
    var dir = DirAccess.open("res://data/beats")
    if dir:
        dir.list_dir_begin()
        var file = dir.get_next()
        while file != "":
            if file.ends_with(".json"):
                var json_text = FileAccess.get_file_as_string("res://data/beats/%s" % file)
                var data = JSON.parse_string(json_text)
                if typeof(data) == TYPE_ARRAY:
                    for beat in data:
                        beats.append(beat)
                        cooldowns[beat.id] = 0
            file = dir.get_next()
        dir.list_dir_end()

func select(verb: String):
    for beat in beats:
        if cooldowns[beat.id] == 0 and verb in beat.trigger.verbs:
            cooldowns[beat.id] = beat.cooldown.steps
            return beat
    return null

func step():
    for id in cooldowns.keys():
        if cooldowns[id] > 0:
            cooldowns[id] -= 1
