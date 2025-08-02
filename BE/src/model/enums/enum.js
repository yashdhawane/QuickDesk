const Language = Object.freeze({
  EN: 'English',
  HI: 'Hindi',
  FR: 'French',
  // Add more as needed
});

const Role = Object.freeze({
  ADMIN: 'admin',
  USER: 'user',
  SUPPORT: 'support',
});

const Status = Object.freeze({
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED:'Resolved',
  CLOSED: 'closed',
});

module.exports = { Language, Role, Status };
