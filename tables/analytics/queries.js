const totalUsers = {
  text: 'SELECT COUNT(*) FROM "user"',
  params: [],
};

const totalFreshmen = {
  text: 'SELECT COUNT(*) FROM "user" WHERE current_class = $1',
  params: ['Freshman'],
};

const totalSophomores = {
  text: 'SELECT COUNT(*) FROM "user" WHERE current_class = $1',
  params: ['Sophomore'],
};

const totalJuniors = {
  text: 'SELECT COUNT(*) FROM "user" WHERE current_class = $1',
  params: ['Junior'],
};

const totalSeniors = {
  text: 'SELECT COUNT(*) FROM "user" WHERE current_class = $1',
  params: ['Senior'],
};

const totalGraduates = {
  text: 'SELECT COUNT(*) FROM "user" WHERE current_class = $1',
  params: ['Graduate'],
};

const totalAlumni = {
  text: 'SELECT COUNT(*) FROM "user" WHERE current_class = $1',
  params: ['Alumni'],
};

const totalFaculty = {
  text: 'SELECT COUNT(*) FROM "user" WHERE current_class = $1',
  params: ['Faculty'],
};

const totalLikes = {
  text: 'SELECT COUNT(*) FROM (SELECT unnest(internships_favorited) FROM "user") AS t',
  params: [],
};

const totalApplied = {
  text: 'SELECT COUNT(*) FROM (SELECT unnest(internships_applied) FROM "user") AS t',
  params: [],
};

const totalPosts = {
  text: 'SELECT COUNT(*) FROM post',
  params: [],
};

const totalComments = {
  text: 'SELECT COUNT(*) FROM comment',
  params: [],
};

const totalEvents = {
  text: 'SELECT COUNT(*) FROM event',
  params: [],
};

const insertUserAnalytics = 'INSERT INTO user_analytics (total_users, total_freshmen, total_sophomores, total_juniors, total_seniors, total_graduates, total_alumni, total_faculty, total_likes, total_applied, total_posts, total_comments, total_events) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)';

module.exports = {
  totalUsers,
  totalFreshmen,
  totalSophomores,
  totalJuniors,
  totalSeniors,
  totalGraduates,
  totalAlumni,
  totalFaculty,
  totalLikes,
  totalApplied,
  totalPosts,
  totalComments,
  totalEvents,
  insertUserAnalytics,
};