using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using BackMeUpApp.DomainModel;
using BackMeUpApp.DTOs;
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

        public async Task<IEnumerable<PostForDisplayDto>> GetPostsAsync()
        {
            var query = this._client.Cypher.Match("(m:Post)-[r:CreatedBy]-(u:User)")
                .Return((m, u) => new 
                {
                    Post= m.As<Node<Post>>(),
                    Username = u.As<User>().Username
                }
                );
            var results = await query.ResultsAsync;

            List<PostForDisplayDto> posts = new List<PostForDisplayDto>();
            foreach(var post in results)
            {
                posts.Add(new PostForDisplayDto
                {
                    Id = post.Post.Reference.Id,
                    Title = post.Post.Data.Title,
                    Text = post.Post.Data.Text,
                    Username = post.Username
                });
            }
            return posts;
        }
        public async Task<User> AddChoiceAsync(int postId, string username, bool ChoiceLeft)
        {
            String choice;
            if (ChoiceLeft)
            {
                choice = "left";
            }
            else
                choice = "right";

            IEnumerable<User> ret = await _client.Cypher.Match("(u:User),(p:Post)")
                .Where("u.Username = '" + username + "' AND  id(p)=" + postId)
                .CreateUnique("(u)-[:Choice {side:'" + choice + "'}]->(p)")
                .Return<User>("u").ResultsAsync;
            return ret.First();

        }

    }
}
