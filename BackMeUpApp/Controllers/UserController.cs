using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Neo4jClient;
using Neo4jClient.Cypher;
using BackMeUpApp.DomainModel;

namespace BackMeUpApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IGraphClient _client;

        public UserController(IGraphClient client)
        {
            this._client = client;
        }

        // GET: api/User
        [HttpGet("me")]
        public IList<User> Get()
        {

            var query = new Neo4jClient.Cypher.CypherQuery("match (m:User) return m",
                                                      new Dictionary<string, object>(), CypherResultMode.Set);

            List<User> users = ((IRawGraphClient)_client).ExecuteGetCypherResults<User>(query).ToList();



            return users;
        }

        // GET: api/User/5
        [HttpGet("{id}", Name = "Get")]
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/User
        [HttpPost]
        public async Task<User> Post([FromForm]User value)
        {
            IEnumerable<User> ret= await this._client.Cypher.Create("(m:User {params})").WithParam("params",value).Return<User>("m").ResultsAsync;
            return ret.First();
        }

        // PUT: api/User/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
