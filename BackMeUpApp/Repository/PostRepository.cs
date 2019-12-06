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

        public async Task<Post> AddPostAsync(Post post,string username)
        {
            


            IEnumerable<Post> ret = await this._client.Cypher.Match("(u:User)")
                .Where((User u)=>u.Username==username)
                .Create("(p:Post { params })")
                .WithParam("params", post)
                .Create("(p)-[:CreatedBy]->(u)")
                .Return<Post>("p").ResultsAsync;
            return ret.First();
        }


        public async Task<Post> GetPostAsync()
        {
            return null; 
        }

        public async Task<IEnumerable<Post>> GetPostsAsync()
        {
            IEnumerable<Post> posts= await this._client.Cypher.Match("(m:Post)").Return<Post>("m").ResultsAsync;
            return posts;
        }
    }
}
