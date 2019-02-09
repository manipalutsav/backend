const USER_TYPES = {
  ADMINISTRATOR: 1 << 0,
  FACULTY_COORDINATOR: 1 << 1,
  STUDENT_COORDINATOR: 1 << 2,
  JUDGE: 1 << 3,
  PARTICIPANT: 1 << 4,
};

module.exports = {
  USER_TYPES,
};
