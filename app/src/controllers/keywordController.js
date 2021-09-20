const [ client, q ] = require('../services/faunaService')

exports.get_keyword_by_keyname = async (keyname) => {
    const keywords = await client.query(
        q.Let({
            userExists: q.Exists(
                q.Match(q.Index('get_keyword_by_keyname'), keyname)
            )
          },
            q.If(
              q.Var('userExists'),
              q.Get(q.Match(q.Index('get_keyword_by_keyname'), keyname)),
              false
            )
          )
    )
    if(! keywords) return false
    return keywords.data.start;
}