using Neo4jClient;
using Neo4jClient.Cypher;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackMeUpApp.DataProviders
{
    public class UserProvider
    {
        private GraphClient client;


        public UserProvider()
        {
            client = new GraphClient(new Uri("http://localhost:7474/db/data"), "neo4j", "misahaker69");
            try
            {
            //    client.Connect();
            }
            catch (Exception exc)
            {

            }
        }

        public void AddUser()
        {



            Dictionary<string, object> queryDict = new Dictionary<string, object>();
            queryDict.Add("name","Milos");

            var query = new Neo4jClient.Cypher.CypherQuery("CREATE (n:User {name:'Milos'}) return n",
                                                            queryDict, CypherResultMode.Set);

          
        }
    }
}
