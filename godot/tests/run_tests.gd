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
            for s in res.synonyms:
                assert(parser.get_verb(s) == res.verb)
                assert(parser.get_verb("no-%s" % s) == "")
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
            for s in res.synonyms:
                assert(parser.get_noun(s) == res.canonical)
                assert(parser.get_noun("no-%s" % s) == "")
            assert(parser.get_noun("no-%s" % res.canonical) == "")
        file = dir.get_next()
    dir.list_dir_end()

func _test_scheduler():
    var scheduler = BeatSchedulerService.new()
    scheduler.load_beats()
    var kiln_times: Array = []
    var shrine_times: Array = []
    scheduler.beat_triggered.connect(func(beat):
        if beat["id"] == "beat.kiln.fire-or-ruin":
            kiln_times.append(scheduler.get_time())
        if beat["id"] == "beat.shrine.oath-or-price":
            shrine_times.append(scheduler.get_time())
    )
    for i in range(20):
        scheduler.step()
    assert(kiln_times == [2, 6, 10, 14])
    assert(shrine_times == [9, 18])
