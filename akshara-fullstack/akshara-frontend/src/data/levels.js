export const LEVELS = [
  {
    id: 1,
    key: "pre",
    name: "Pre-Literate / Beginner",
    short: "Beginner",
    desc: "Little to no familiarity with letters or numbers. Focus is on letter recognition, sound-symbol association, and pencil control.",
    skills: ["Letter recognition", "Sound matching", "Pencil grip & tracing"],
  },
  {
    id: 2,
    key: "emerging",
    name: "Emerging Reader",
    short: "Emerging",
    desc: "Recognises letters and simple words. Can read short, familiar words and copy simple text with guidance.",
    skills: ["Sight words", "Simple word reading", "Copying text"],
  },
  {
    id: 3,
    key: "developing",
    name: "Developing Reader",
    short: "Developing",
    desc: "Reads short sentences and simple passages. Begins to write independent sentences and answer basic comprehension questions.",
    skills: ["Sentence reading", "Guided writing", "Basic comprehension"],
  },
  {
    id: 4,
    key: "proficient",
    name: "Functionally Proficient",
    short: "Proficient",
    desc: "Reads and writes for everyday and work tasks — forms, notices, messages — with growing fluency and independent comprehension.",
    skills: ["Fluent reading", "Independent writing", "Applied comprehension"],
  },
];

export function levelById(id) {
  return LEVELS.find((l) => l.id === id) || LEVELS[0];
}
