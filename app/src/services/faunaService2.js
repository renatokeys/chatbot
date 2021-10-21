var faunadb = require('faunadb'),
  q = faunadb.query

var client = new faunadb.Client({ secret: 'fnAEWDfZ3eACRILF8Guzjwer4vxVi69w5l0tBl5p', domain: "db.us.fauna.com" })

module.exports = [client, q]



