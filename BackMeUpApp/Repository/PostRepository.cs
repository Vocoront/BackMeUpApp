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
            IEnumerable<Node<Post>> ret = await this._client.Cypher.Match("(u:User)")
                .Where((User u)=>u.Username==username)
                .Create("(p:Post { Title:'"+post.Title+"', " +
                "Text:'" +post.Text+
                "' })")
                .Create("(p)-[:CreatedBy]->(u)")
                .Return<Node<Post>>("p").ResultsAsync;

            var pom= ret.First();

            int id = (int)pom.Reference.Id;

            String str = post.Tags[0];

            String[] tags = str.Split(',');

            foreach (string t in tags)
            {
                IEnumerable<Tag> tret = await this._client.Cypher.Match("(p:Post)")
                .Where("id(p)=" + id)
                .Create("(t:Tag { Title:'" + t + "' })")
                .Create("(p)-[:tagged]->(t)").Return<Tag>("t").ResultsAsync;

                var paaom=tret;

            }

            return pom.Data;
        }


        public async Task<Post> GetPostAsync()
        {
            return null; 
        }

        public async Task<IEnumerable<PostForDisplayDto>> GetPostAsync(string Username)
        {
            var query = this._client.Cypher.Match("(m:Post)-[r:CreatedBy]-(u:User)")
                .Where((User u)=>u.Username==Username)
              .Return((m, u) => new
              {
                  Post = m.As<Node<Post>>(),
                  Username = u.As<User>().Username
              }
              );
            var results = await query.ResultsAsync;

            List<PostForDisplayDto> posts = new List<PostForDisplayDto>();
            foreach (var post in results)
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
    }
}
