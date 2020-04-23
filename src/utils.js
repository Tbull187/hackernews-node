const jwt = require('jsonwebtoken');
const APP_SECRET = 'GraphQL-is-aw3some';

// TODO: refactor this into "auth service"
// TODO: Bearer tokens should expire after a time, implement sessions
const getUserId = (context) => {
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, APP_SECRET)
    return userId
  }

  throw new Error('Not authenticated')
}

module.exports = {
  APP_SECRET,
  getUserId,
}