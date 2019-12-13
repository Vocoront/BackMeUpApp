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
                .Merge("(t:Tag { Title:'" + t + "' })")
                .Create("(p)-[:tagged]->(t)").Return<Tag>("t").ResultsAsync;

                var paaom=tret;

            }

            return pom.Data;
        }
        public async Task<IEnumerable<PostForDisplayDto>> GetPostAsync(string Username)
        {
            var query = this._client.Cypher.Match("(m:Post)-[r:CreatedBy]-(u:User)")
                .Where((User u) => u.Username == Username)
                .Match("(m)-[:tagged]-(t:Tag)")
                .With("id(m) as id,m,u,t")
              .Return((id,m, u, t) => new PostForDisplayDto
              {
                  Id= id.As<long>(),
                  Text=m.As<Post>().Text,
                  Username=u.As<User>().Username,
                  Title=m.As<Post>().Title,              
                  Tags = t.CollectAs<Tag>()
              }
              ) ;
            var results = await query.ResultsAsync;
 
            return results;
        }

        public async Task<IEnumerable<PostForDisplayDto>> GetPostsByTagUsernameAsync(string Username,string Tag)
        {
            var query = this._client.Cypher.Match("(m:Post)-[r:CreatedBy]-(u:User)")
                .Where((User u) => u.Username == Username)
                .Match("(m)-[:tagged]-(t:Tag)")
                .Where((Tag t)=> t.Title==Tag)
                .With("id(m) as id,m,u,t")
              .Return((id, m, u, t) => new PostForDisplayDto
              {
                  Id = id.As<long>(),
                  Text = m.As<Post>().Text,
                  Username = u.As<User>().Username,
                  Title = m.As<Post>().Title,
                  Tags = t.CollectAs<Tag>()
              }
              );
            var results = await query.ResultsAsync;

            return results;
        }

        public async Task<IEnumerable<PostForDisplayDto>> GetPostsByTagAsync(string Tag)
        {
            var query = this._client.
                Cypher
                .Match("(m:Post)-[r:CreatedBy]-(u:User)")
                .Match("(m)-[:tagged]-(t:Tag)")
                .Where((Tag t)=>t.Title==Tag)
                .With("id(m) as id,m,u,t")
                .Return((m, u, t, id) => new PostForDisplayDto
                {
                    Id = id.As<long>(),
                    Text = m.As<Post>().Text,
                    Username = u.As<User>().Username,
                    Title = m.As<Post>().Title,
                    Tags = t.CollectAs<Tag>()
                }
                );
            var results = await query.ResultsAsync;

            return results;
        }

        public async Task<IEnumerable<PostForDisplayDto>> GetPostsAsync()
        {
            var query = this._client.
                Cypher
                .Match("(m:Post)-[r:CreatedBy]-(u:User)")
                .Match("(m)-[:tagged]-(t:Tag)")
                .With("id(m) as id,m,u,t")
                .Return((m, u, t, id) => new PostForDisplayDto
                {
                    Id = id.As<long>(),
                    Text = m.As<Post>().Text,
                    Username = u.As<User>().Username,
                    Title = m.As<Post>().Title,
                    Tags = t.CollectAs<Tag>()
                }
                );
            var results = await query.ResultsAsync;

            return results;
        }
        public async Task<PostForDisplayDto> GetPostsByIdAsync(int id)
        {

            var query = this._client.Cypher.Match("(p:Post)-[:CreatedBy]-(u:User)")
                .Where("id(p)=" + id)
                .Match("(p)-[:tagged]-(t:Tag)")
                .Return((p, u,t) => new PostForDisplayDto
                {
                    Title=p.As<Post>().Title,
                    Text=p.As<Post>().Text,
                    Username = u.As<User>().Username,
                    Tags = t.CollectAs<Tag>()
                }
                );
            var results = await query.ResultsAsync;

            PostForDisplayDto post= results.First();
            post.Id = id;
            return post;

        }
        public async Task<IEnumerable<CommentForDisplayDto>> GetCommentsForPost(int postId)
        {
            var query = this._client.Cypher.Match("(p:Post)-[c:Comment]-(u:User)").Where("id(p)="+postId)
                   .Return((c,u) => new CommentForDisplayDto
                   {
                       Text = c.As<CommentForDisplayDto>().Text,
                       Username = u.As<User>().Username
                   }
                   );
            var results = await query.ResultsAsync;
            return results;
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
        public async Task<User> AddCommentAsync(int postId, string username, string comment_text)
        {
            
            IEnumerable<User> ret = await _client.Cypher.Match("(u:User),(p:Post)")
                .Where("u.Username = '" + username + "' AND  id(p)=" + postId)
                .Create("(u)-[:Comment {text:'" + comment_text + "'}]->(p)")
                .Return<User>("u").ResultsAsync;
            return ret.First();

        }

    }
}
