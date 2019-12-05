using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using BackMeUpApp.DomainModel;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Neo4jClient;

namespace BackMeUpApp.Repository
{
    public class PostRepository : IPostRepository
    {
        private readonly IGraphClient _client;

        public PostRepository(IGraphClient client)
        {
            this._client = client;
        }

        public async Task<Post> addPost()
        {
            string naslov = "proba";

            IEnumerable<Post> ret = await this._client.Cypher.Create("(m:Post {param})").WithParam("param", naslov).Return<Post>("m").ResultsAsync;
            return ret.First();
        }
    }
}
