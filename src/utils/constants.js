const USER_TYPES = {
  ADMINISTRATOR: 1 << 0,
  SUPPORT_TEAM: 1 << 1,
  FACULTY_COORDINATOR: 1 << 2,
  STUDENT_COORDINATOR: 1 << 3,
};

const COMMANDS = [
  { emoji: "🍕", name: "pizza" },
  { emoji: "🍺", name: "beer" },
  { emoji: "💩", name: "poo" },
  { emoji: "✅", name: "tick" },
  { emoji: "👍", name: "thumbs" },
  { emoji: "👋", name: "bye" },
  { emoji: "👂", name: "listen" },
];

module.exports = {
  USER_TYPES,
  COMMANDS,
};
