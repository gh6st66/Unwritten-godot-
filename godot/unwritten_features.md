# Unwritten – Comprehensive Feature Specification (Expanded Extended Edition)

## 1. Parser & Lexicon System
The parser is the foundational linguistic engine that mediates between the unstructured expressivity of human language and the formalized structures required by computational systems. It transforms the infinite variability of natural language into structured `Intent` objects, enabling the game to respond with precision and consistency. It is not simply a matter of token matching; the parser is conceptualized as a semantic architecture that interprets, contextualizes, and resolves ambiguity in ways that reinforce the central theme of language as agency.

- **ParserService**: orchestrates the full end-to-end parsing pipeline, enforcing consistency and repeatability across sessions.
- **Lexicon Resources**: modular assets (`VerbDef.tres`, `NounDef.tres`, `AdjDef.tres`) stored hierarchically for extensibility by narrative designers.
- **Signals**: `intent_parsed`, `unknown_token`, `parse_failed` allow the system to respond dynamically to player input.
- **Pipeline Stages**: normalization → tokenization → part-of-speech tagging → semantic resolution → validation → emission. Each stage isolates a specific aspect of linguistic processing.
- **Unknown Lexical Forms**: catalogued automatically for lexicon refinement; suggestion mechanics provide the player with near matches, lowering frustration.
- **Data Hierarchy**: enforced via directories such as `res://data/verbs/`, ensuring discoverability and modular growth.
- **Exit Criteria**: valid utterances yield deterministic `Intent` structures, while invalid forms fail gracefully with legible error messaging.

Ultimately, the parser operationalizes *language as power*, encoding each utterance as a discrete, consequential act within the game’s systemic fabric.

---

## 2. Chronicle & Echo System
The Chronicle operates as a temporal substrate: a durable, append-only log capturing the unfolding of play. Each action is crystallized into an Echo, a structured record that becomes the atomic unit of inscription. Unlike conventional save logs, the Chronicle is designed to resist erasure and revision, preserving continuity and emphasizing permanence across both runs and generations.

- **ChronicleService**: autoload module managing the persistence of Echoes in JSONL format.
- **Echo Schema**: `{ts, run_id, seq, actor, action, outcome, tags, ctx}` captures both the event and its interpretive context.
- **Signals**: `echo_written`, `replay_line`, and `rotation_completed` provide hooks for reactive systems.
- **Persistence Mechanism**: stored as append-only files under `user://chronicles/<run_id>.jsonl`.
- **Replay Features**: sequential iteration through records, robust against data corruption or truncation.
- **Exit Criteria**: events remain ordered; throughput remains performant; corrupted entries fail gracefully without data loss.

The Chronicle embodies *memory as permanence*: a narrative historiography that guarantees every act leaves an indelible mark.

---

## 3. World Generation & Narrative Gravity
World generation functions as procedural cosmogenesis, producing an intricately layered cosmos from a deterministic seed. Narrative gravity fields are superimposed to create thematic attractors—probabilistic influences that bend emergent stories toward resonant arcs. This design ensures that unpredictability coexists with narrative coherence.

- **WorldService**: asynchronous generator, designed to run in parallel with invocation sequences.
- **Generative Layers**: sequential construction of regions → sites → factions → routes → NPCs → gravity fields.
- **Narrative Gravity**: thematic fields act as attractors, biasing encounter probabilities toward meaningful resonance.
- **Signals**: `generation_step`, `world_ready`, `gravity_peak` reveal intermediate and terminal states.
- **Exit Criteria**: identical seeds yield reproducible worlds; gravity peaks emerge as visible thematic nodes; encounters statistically align with narrative attractors.

This subsystem demonstrates *reactive proceduralism*: authored seeds and rules guiding emergent narrative ecosystems.

---

## 4. Masks & Marks System
Masks and Marks encode the duality of identity and legacy. Masks are fragile roles temporarily inhabited within a single run, prone to fracture under stress. Marks are durable inscriptions persisting across runs, bending probabilities and modifying systemic outcomes.

- **MaskSystemService**: governs runtime processes for equipping, fracturing, and inheriting.
- **Mask**: identity artifact with bounded durability and contextual affordances.
- **Mark**: inter-run legacy tokens encoding enduring systemic modifications.
- **Signals**: `mask_equipped`, `mask_fractured`, `mark_gained`, `mark_spent` reveal key identity transitions.
- **Triggers**: fire during parsing, beat scheduling, and world resolution events.
- **Exit Criteria**: equipment state transitions occur as expected; fracture mechanics culminate in shattering; marks persist across multiple generations of play.

Together, Masks and Marks enact *identity as mask, legacy as inscription*, binding mechanical progression to thematic gravitas.

---

## 5. Beat Scheduler & Accord System
This subsystem establishes rhythm and balance. Beats are the indivisible temporal units that give cadence to the world, while Accord represents systemic harmony versus disorder. Their interplay ensures narrative pacing emerges as both regular and dynamic.

- **BeatSchedulerService**: generates temporal beats at a defined BPM.
- **Accord**: scalar metric spanning [-1, +1], decaying naturally and adjusted by tags on Echoes.
- **Phases**: canonical cycle: `calm → rising → crisis → afterglow`.
- **Signals**: `beat`, `phase_changed`, `accord_changed` broadcast systemic state.
- **Exit Criteria**: beats fire with predictable cadence; accord adjusts proportionally; phase transitions occur deterministically.

This subsystem embodies *a living rhythm*, guaranteeing that narrative pace is neither arbitrary nor static but evolves in tension with player actions.

---

## 6. Opening Invocation & Run Flow
The Opening Invocation is both ritual and technical interlude. It frames each run with a thematic vignette while also affording time for computationally expensive world generation. Deterministic selection ensures resonance without repetition.

- **GameService**: orchestrates seeding, Chronicle initialization, and run creation.
- **OpeningInvocation.tscn**: interface that displays invocation lines, monitors generation progress, and handles transitions.
- **Determinism**: invocation line chosen by seed, with a cooldown buffer to prevent immediate recurrence.
- **Signals**: `run_started`, `run_ready`, `request_continue` coordinate flow.
- **Exit Criteria**: invocation displays consistently; world generation occurs asynchronously; transition to the Main scene is seamless.

The Opening Invocation enacts *ritual as interface*, bridging symbolic entry with computational readiness.

---

## 7. TimerBus & RNG Services
Time management and stochastic generation are centralized in deterministic services, ensuring reproducibility across runs and preventing inter-system interference.

- **RNGService**: master seed distributed into named substreams, preserving independence across subsystems.
- **TimerBusService**: schedules and manages multi-channel timers, both one-shot and repeating.
- **Signals**: `timer_fired`, `timer_canceled`.
- **Exit Criteria**: identical seeds yield consistent random sequences; timers trigger and cancel with reliability.

This subsystem realizes *determinism with modular stochasticity*, blending predictability with emergent variability.

---

## 8. UI & Player Interaction
The UI is designed not only as an input surface but as a performative stage. Rooted in the traditions of parser-based play, it enhances expression and comprehension by scaffolding suggestions, rendering systemic echoes, and reflecting world state visually.

- **MainConsole**: captures and displays player input alongside scrollback.
- **SuggestionBar**: surfaces candidate verbs and nouns when confidence is low.
- **RumorTicker**: synchronizes with beats to surface narrative fragments from the Chronicle.
- **AccordBadge**: provides dynamic visualization of phase and accord.
- **Exit Criteria**: inputs route consistently; outputs display in temporal order; suggestions are interactive; rumors progress on beats; accord updates without delay.

The UI is therefore *performative interface*, shaping player interpretation while reflecting systemic operations.

---

## 9. AudioBus & Atmosphere
The acoustic system acts as a parallel feedback architecture, weaving ambience, reactive stingers, and interface sounds into the experiential fabric. It binds narrative, systemic, and player actions to auditory space.

- **AudioBusService**: orchestrates ambient loops, stingers, and UI cues.
- **Banks**: JSON-based mappings connect contexts (region, phase, event) to assets.
- **Routing**: accord influences ambience intensity; stingers temporarily attenuate background layers.
- **Signals**: `ambience_changed`, `stinger_played`, `ui_played`.
- **Exit Criteria**: ambience responds to environmental changes; accord modulates intensity layers; stingers apply ducking reliably; UI cues play consistently.

Here, sound design embodies *systemic atmosphere*, an auditory dimension inseparable from mechanical operation.

---

## 10. Persistence & Saves
Persistence is the guarantor of continuity. It captures the totality of a run, secures legacies across multiple plays, and preserves player preferences. Its design emphasizes durability, integrity, and forward compatibility.

- **SaveService**: autoloaded, slot-based save manager.
- **Artifacts**: `slot.json`, `.bak`, `index.json`, `legacy.json`, `settings.json` represent layered persistence.
- **Autosave**: periodic and event-driven with debouncing.
- **Integrity**: transactional writes and atomic replacement ensure resilience.
- **Migration**: explicit schema versioning with forward-compatible transformations.
- **Exit Criteria**: saves and loads operate across sessions; backups restore on failure; migrations adapt legacy formats successfully.

Persistence guarantees *narrative immortality*, sustaining continuity beyond the ephemeral moment of play.

---

# Conclusion
The ten subsystems collectively comprise the architectural and philosophical foundation of **Unwritten**. Each subsystem is articulated with formal data models, structured hierarchies, signaling mechanisms, and explicit validation criteria. Beyond technical implementation, they represent a coherent philosophy emphasizing language, memory, identity, rhythm, atmosphere, and continuity. In their synthesis, Unwritten aspires to realize an emergent narrative medium—procedural yet authored, systemic yet literary, contingent yet enduring, fragile yet immortal.