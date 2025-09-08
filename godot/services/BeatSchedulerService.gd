extends Node
class_name BeatSchedulerService

signal beat_triggered(beat: Dictionary)

var _beats: Array = []
var _cooldowns: Dictionary = {}
var _pending: Array = []
var _time: int = 0
var rng := RandomNumberGenerator.new()

func _ready() -> void:
    rng.seed = 1
    if has_node("/root/Chronicle"):
        get_node("/root/Chronicle").echo_written.connect(_on_echo)
    if has_node("/root/MaskSystem"):
        var ms = get_node("/root/MaskSystem")
        ms.mask_equipped.connect(func(mid): _try_mask_beats(mid))
        ms.mask_state_changed.connect(func(mid, _s): _try_mask_beats(mid))

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
                    _cooldowns[beat["id"]] = 0
            f = dir.get_next()
        dir.list_dir_end()

func step() -> void:
    _time += 1
    for beat in _beats:
        if beat["trigger"]["type"] == "time" and _can_fire(beat) and int(beat["trigger"].get("at_time", 0)) > 0 and _time % int(beat["trigger"].get("at_time", 0)) == 0:
            _queue_or_fire(beat)
    if _pending.size() > 0:
        var chosen = _weighted_pick(_pending)
        _trigger(chosen)
        _pending.clear()

func _queue_or_fire(beat: Dictionary) -> void:
    _pending.append(beat)

func _can_fire(beat: Dictionary) -> bool:
    return _time >= _cooldowns.get(beat["id"], 0)

func _on_echo(e: Dictionary) -> void:
    for beat in _beats:
        if beat["trigger"]["type"] != "echo":
            continue
        if not _can_fire(beat):
            continue
        if _tags_match(beat["trigger"].get("echo_tags", []), e.get("tags", [])):
            _queue_or_fire(beat)

func _try_mask_beats(mask_id: String) -> void:
    for beat in _beats:
        if beat["trigger"]["type"] != "mask":
            continue
        if not _can_fire(beat):
            continue
        if beat["trigger"].get("mask_id", "") == mask_id:
            _queue_or_fire(beat)

func _tags_match(req: Array, have: Array) -> bool:
    for t in req:
        if t in have:
            return true
    return false

func _weighted_pick(arr: Array) -> Dictionary:
    var w = 0.0
    for b in arr:
        w += float(b.get("weight", 1.0))
    var r = rng.randf_range(0.0, w)
    var acc = 0.0
    for b in arr:
        acc += float(b.get("weight", 1.0))
        if r <= acc:
            return b
    return arr.back()

func _trigger(beat: Dictionary) -> void:
    emit_signal("beat_triggered", beat)
    var cd: int = beat.get("cooldown", 0)
    if cd > 0:
        _cooldowns[beat["id"]] = _time + cd

func get_time() -> int:
    return _time
