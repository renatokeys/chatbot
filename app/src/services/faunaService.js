var faunadb = require('faunadb'),
  q = faunadb.query

  var client = new faunadb.Client({ secret: 'fnAETkoK5aAAQodbzWjfSIDnuWMlEUDZQeq2EpzP', domain: "db.us.fauna.com" })

module.exports = [client, q]