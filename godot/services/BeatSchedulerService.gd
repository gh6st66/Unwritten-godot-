extends Node
class_name BeatSchedulerService

signal beat_triggered(beat: Dictionary)

var _beats: Array = []
var _cooldowns: Dictionary = {} # id -> next allowed time
var _time: int = 0

func load_beats(path: String = "res://data/beats") -> void:
    _beats.clear()
    _cooldowns.clear()
    var dir := DirAccess.open(path)
    if dir:
        dir.list_dir_begin()
        var f = dir.get_next()
        while f != "":
            if f.ends_with(".json"):
                var text := FileAccess.get_file_as_string("%s/%s" % [path, f])
                var beat := JSON.parse_string(text)
                if beat is Dictionary:
                    _beats.append(beat)
                    _cooldowns[beat.id] = 0
            f = dir.get_next()
        dir.list_dir_end()

func step() -> void:
    _time += 1
    for beat in _beats:
        if not _can_fire(beat):
            continue
        if _check_trigger(beat):
            _trigger(beat)

func _can_fire(beat: Dictionary) -> bool:
    return _time >= _cooldowns.get(beat.id, 0)

func _check_trigger(beat: Dictionary) -> bool:
    var t := beat.trigger
    match t.type:
        "time":
            return _time % int(t.at_time) == 0
        _:
            return false

func _trigger(beat: Dictionary) -> void:
    emit_signal("beat_triggered", beat)
    var cd: int = beat.get("cooldown", 0)
    if cd > 0:
        _cooldowns[beat.id] = _time + cd

func get_time() -> int:
    return _time
