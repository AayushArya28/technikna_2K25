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
    poetry: 110,
    kavi_sammelan: 111,
    debate: 112,
    fashion_insta: 113,
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
    cad_modelling: "CAD Modelling",
    brain_brawl: "Brain Brawl",
    utility_bot: "Utility Bot",

    // Cultural
    solo_saga: "Solo Saga",
    exuberance: "Exuberance",
    synced_showdown: "Synced Showdown",
    raag_unreleased: "Raag Unreleased",
    fusion_fiesta: "Fusion Fiesta",
    musical_marvel: "Musical Marvel",
    ekanki: "Ekanki",
    matargasthi: "Matargasthi",
    hulchul: "Hulchul",
    poetry: "Poetry",
    kavi_sammelan: "Kavi Sammelan",
    debate: "Vaad-Vivaad (Debate)",
    fashion_insta: "Fashion Insta",
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
    return null;
}

export function getEventRouteById(eventId) {
    const category = getEventCategoryById(eventId);
    if (category === "Technical") return "/technical";
    if (category === "Cultural") return "/cultural";
    return "/events";
}
