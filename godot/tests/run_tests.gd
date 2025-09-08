extends SceneTree

func _init():
    _test_parser()
    _test_scheduler()
    print("OK")
    quit()

func _test_parser():
    var parser = ParserService.new()
    parser.refresh()
    var dir = DirAccess.open("res://data/verbs")
    dir.list_dir_begin()
    var file = dir.get_next()
    while file != "":
        if file.ends_with(".tres"):
            var res: VerbDef = load("res://data/verbs/%s" % file)
            assert(parser.get_verb(res.verb) == res.verb)
            if res.synonyms.size() > 0:
                assert(parser.get_verb(res.synonyms[0]) == res.verb)
            assert(parser.get_verb("no-%s" % res.verb) == "")
        file = dir.get_next()
    dir.list_dir_end()
    dir = DirAccess.open("res://data/nouns")
    dir.list_dir_begin()
    file = dir.get_next()
    while file != "":
        if file.ends_with(".tres"):
            var res: NounDef = load("res://data/nouns/%s" % file)
            assert(parser.get_noun(res.canonical) == res.canonical)
            if res.synonyms.size() > 0:
                assert(parser.get_noun(res.synonyms[0]) == res.canonical)
            assert(parser.get_noun("no-%s" % res.canonical) == "")
        file = dir.get_next()
    dir.list_dir_end()

func _test_scheduler():
    var scheduler = BeatSchedulerService.new()
    scheduler.load_beats()
    var times: Array = []
    scheduler.beat_triggered.connect(func(beat):
        if beat.id == "beat.kiln.fire-or-ruin":
            times.append(scheduler.get_time())
    )
    for i in range(6):
        scheduler.step()
    assert(times == [2, 6])
