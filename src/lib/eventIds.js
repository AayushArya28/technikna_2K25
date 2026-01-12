// IMPORTANT: These IDs must NEVER change once published.
// Backend expects a stable eventId per event.

export const EVENT_ID_MAP = Object.freeze({
    // Technical
    hackathon: 1,
    cp: 2,
    ampere_assemble: 3,
    robo_war: 4,
    robo_soccer: 5,
    robo_race: 6,
    tall_tower: 7,
    bridge_the_gap: 8,
    multisim_mavericks: 9,
    startup_sphere: 10,
    cad_modelling: 11,
    brain_brawl: 12,
    utility_bot: 13,

    // Cultural
    solo_saga: 101,
    exuberance: 102,
    synced_showdown: 103,
    raag_unreleased: 104,
    fusion_fiesta: 105,
    musical_marvel: 106,
    ekanki: 107,
    matargasthi: 108,
    hulchul: 109,
    kavi_sammelan: 111,
    debate: 112,
    fashion_insta: 113,

    // Cultural (new)
    street_dance: 115,
    pencil_perfection: 116,
    wall_painting: 117,

    // Frame & Focus (Photography & Film)
    motion_e_magic: 118,
    capture_the_unseen: 119,

    // Cultural (poetry split)
    poetry_english: 120,
    poetry_hindi: 121,

    // ESports
    bgmi: 301,
    valorant: 302,
    fifa: 303,
    tekken: 304,
    real_cricket: 305,
});

// Optional display titles (used by Profile when backend does not return event titles).
export const EVENT_TITLE_BY_KEY = Object.freeze({
    // Technical
    hackathon: "Dev Conquest (Hackathon)",
    cp: "Algo Apex (Competitive Programming)",
    ampere_assemble: "Ampere Assemble",
    robo_war: "Robo Gladiators (Robo War)",
    robo_soccer: "Robo Soccer",
    robo_race: "Dirt Race (Robo Race)",
    tall_tower: "Tall Tower",
    bridge_the_gap: "Aerofilia (Bridge the Gap)",
    multisim_mavericks: "Multisim Mavericks",
    startup_sphere: "Startup Sphere",
    cad_modelling: "CAD Master (AutoCAD / SketchUp Design Challenge)",
    brain_brawl: "Brain Brawl",
    utility_bot: "MachUtility Extreme (Utility Machine)",

    // Cultural
    solo_saga: "Solo Saga",
    exuberance: "Exuberance",
    synced_showdown: "Synced Showdown",
    raag_unreleased: "Raag Unreleased",
    fusion_fiesta: "Fusion Fiesta",
    musical_marvel: "Musical Marvel",
    ekanki: "Ekanki",
    matargasthi: "Matargashti",
    hulchul: "Hulchul",
    poetry_english: "Jashn-e-Jazbaat (Poetry) — English",
    poetry_hindi: "Jashn-e-Jazbaat (Poetry) — Hindi",
    kavi_sammelan: "Kavi Sammelan",
    debate: "Vaad Vivaad (Debate)",
    fashion_insta: "Fashion Insta",

    // Cultural (new)
    street_dance: "Street Dance",
    pencil_perfection: "Pencil Sketching (Pencil Perfection)",
    wall_painting: "Wall Painting: Colors of Culture",

    // Frame & Focus
    motion_e_magic: "Motion-e-Magic",
    capture_the_unseen: "Capture the Unseen",

    // ESports
    bgmi: "BGMI",
    valorant: "Valorant",
    fifa: "FIFA",
    tekken: "Tekken",
    real_cricket: "Real Cricket 24",
});

export const EVENT_KEY_BY_ID = Object.freeze(
    Object.fromEntries(Object.entries(EVENT_ID_MAP).map(([key, id]) => [String(id), key]))
);

export function getEventId(eventKey) {
    const key = String(eventKey || "").trim();
    return EVENT_ID_MAP[key] ?? null;
}

export function getEventKeyById(eventId) {
    const id = String(eventId || "").trim();
    return EVENT_KEY_BY_ID[id] ?? null;
}

export function getEventTitleByKey(eventKey) {
    const key = String(eventKey || "").trim();
    return EVENT_TITLE_BY_KEY[key] ?? null;
}

export function getEventTitleById(eventId) {
    const key = getEventKeyById(eventId);
    if (!key) return null;
    return getEventTitleByKey(key);
}

export function getEventCategoryById(eventId) {
    const n = Number(eventId);
    if (!Number.isFinite(n)) return null;
    if (n > 0 && n < 100) return "Technical";
    if (n >= 100 && n < 200) return "Cultural";
    if (n >= 300 && n < 400) return "Esports";
    return null;
}

export function getEventRouteById(eventId) {
    const key = getEventKeyById(eventId);
    if (key === "pencil_perfection" || key === "wall_painting") {
        return "/art-craft";
    }
    if (key === "motion_e_magic" || key === "capture_the_unseen") return "/frame-focus";

    const category = getEventCategoryById(eventId);
    if (category === "Technical") return "/technical";
    if (category === "Cultural") return "/cultural";
    if (category === "Esports") return "/esports";
    return "/events";
}
