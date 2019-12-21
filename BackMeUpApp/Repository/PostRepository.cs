using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using BackMeUpApp.DomainModel;
using BackMeUpApp.DTOs;
using BackMeUpApp.Models;
using BackMeUpApp.Services;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Neo4jClient;

namespace BackMeUpApp.Repository
{
    public class PostRepository : IPostRepository
    {
        private readonly IGraphClient _client;

        private readonly IHostingEnvironment _hostingEnvironment;

        private readonly NotificationService _notificationService;
        public PostRepository(IGraphClient client, IHostingEnvironment hostingEnvironment, NotificationService notificationService)
        {
            this._client = client;
            this._hostingEnvironment = hostingEnvironment;
            _notificationService = notificationService;
       
        }
        public async Task<Post> AddPostAsync(Post post,string postTags,string username, List<IFormFile> images)
        {
            post.Text = post.Text.Replace("\\", @"\u005c")// da se dodaju escape karakteri za znakove, ako nadjete jos neki dodajte
                .Replace("\"", @"\u0022")
                .Replace("'", @"\u0027");
            IEnumerable<Node<Post>> ret = await this._client.Cypher.Match("(u:User)")
                .Where((User u)=>u.Username==username)
                .Create("(p:Post { Title:'"+post.Title+"', " +
                "Text:'" +post.Text+
                "', CreatedAt: '"+post.CreatedAt+"' })")
                .Create("(p)-[:CreatedBy]->(u)")
                .Return<Node<Post>>("p").ResultsAsync;

            var pom= ret.First();

            int id = (int)pom.Reference.Id;
            string fileName = $"img;{id};";
            string imagesPath = ImageService.SaveImagesToFS(images,fileName, Path.Combine(_hostingEnvironment.ContentRootPath,"ImageFolder"));
            await this._client.Cypher.Match("(p:Post)").Where("id(p)=" + id).Set($"p.ImageUrls='{imagesPath}'").ExecuteWithoutResultsAsync();

            if (postTags != null)
            {
                String[] tags = postTags.Split('#');

                foreach (string t in tags)
                {
                    if (t.Equals(""))
                        continue;
                    IEnumerable<Tag> tret = await this._client.Cypher.Match("(p:Post)")
                    .Where("id(p)=" + id)
                    .Merge("(t:Tag { Title:'" + t + "' })")
                    .Create("(p)-[:tagged]->(t)").Return<Tag>("t").ResultsAsync;

                    var paaom = tret;

                }
            }
            return pom.Data;
        }
        public async Task<IEnumerable<PostForDisplayDto>> GetPostCreatedByAsync(string Username)
        {
            var query = this._client.Cypher.Match("(m:Post)-[r:CreatedBy]-(u:User)")
                .Where((User u) => u.Username == Username)
                .OptionalMatch("(m)-[:tagged]-(t:Tag)")
                .With("id(m) as id,m,u,t")
              .Return((id,m, u, t) => new PostForDisplayDto
              {
                  Id= id.As<long>(),
                  Text=m.As<Post>().Text,
                  Username=u.As<User>().Username,
                  Title=m.As<Post>().Title,              
                  Tags = t.CollectAsDistinct<Tag>(),
                  CreatedAt = m.As<Post>().CreatedAt,
                  ImageUrls = m.As<Post>().ImageUrls

              }
              ) ;
            var results = await query.ResultsAsync;
 
            return results;
        }
        public async Task<IEnumerable<PostForDisplayDto>> GetPostsByTagUsernameAsync(string Username,string Tag)
        {
            var query = this._client.Cypher.Match("(m:Post)-[r:CreatedBy]-(u:User)")
                .Where((User u) => u.Username == Username)
                .OptionalMatch("(m)-[:tagged]-(t:Tag)")
                .Where((Tag t)=> t.Title==Tag)
                .With("id(m) as id,m,u,t")
              .Return((id, m, u, t) => new PostForDisplayDto
              {
                  Id = id.As<long>(),
                  Text = m.As<Post>().Text,
                  Username = u.As<User>().Username,
                  Title = m.As<Post>().Title,
                  Tags = t.CollectAsDistinct<Tag>(),
                  CreatedAt = m.As<Post>().CreatedAt,
                   ImageUrls = m.As<Post>().ImageUrls
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
                .OptionalMatch("(m)-[:tagged]-(t:Tag)")
                .Where((Tag t)=>t.Title==Tag)
                .With("id(m) as id,m,u,t")
                .Return((m, u, t, id) => new PostForDisplayDto
                {
                    Id = id.As<long>(),
                    Text = m.As<Post>().Text,
                    Username = u.As<User>().Username,
                    Title = m.As<Post>().Title,
                    Tags = t.CollectAsDistinct<Tag>(),
                    CreatedAt = m.As<Post>().CreatedAt,
                    ImageUrls = m.As<Post>().ImageUrls


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
                .OptionalMatch("(m)-[:tagged]-(t:Tag)")
                .OptionalMatch("(u)-[c:Comment]->(m)")
                .OptionalMatch("(u)-[agr:Choice {Opinion: \"agree\"}]->(m)")
                .OptionalMatch("(u)-[dagr:Choice{Opinion: \"disagree\"}]->(m)")
                .With("id(m) as id,m,u,t,c,agr,dagr")
                .Return((m, u, t, id,c,agr,dagr) => new PostForDisplayDto
                {
                    Id = id.As<long>(),
                    Text = m.As<Post>().Text,
                    Username = u.As<User>().Username,
                    Title = m.As<Post>().Title,
                    Tags = t.CollectAsDistinct<Tag>(),
                    CreatedAt=m.As<Post>().CreatedAt,
                    ImageUrls = m.As<Post>().ImageUrls,
                    CommentNo = (int)c.CountDistinct(),
                    AgreeNo = (int)agr.CountDistinct(),
                    DisagreeNo = (int)dagr.CountDistinct()
                }
                );
            var results = await query.ResultsAsync;

            return results;
        }
        public async Task<IEnumerable<PostForDisplayDto>> GetPostsAsync(string username)
        {
            var query = this._client.Cypher.Match("(m:Post)-[r:CreatedBy]-(u:User)")
            .OptionalMatch("(m)-[:tagged]-(t:Tag)")
            .OptionalMatch($"(user:User {{Username:'{username}'}})-[c:Choice]-(m)")
            .With("id(m) as id,c,m,u,t")
            .Return((id, c, m, u, t) => new PostForDisplayDto
            {
                Id = id.As<long>(),
                Text = m.As<Post>().Text,
                Username = u.As<User>().Username,
                Title = m.As<Post>().Title,
                Tags = t.CollectAsDistinct<Tag>(),
                ImageUrls = m.As<Post>().ImageUrls,
                CreatedAt = m.As<Post>().CreatedAt,
                Choice = c.As<Choice>().Opinion
            }
            ); 
            var results = await query.ResultsAsync;
 
            return results;
        }
        public async Task<PostForDisplayDto> GetPostsByIdAsync(int id)
        {

            var query = this._client.Cypher.Match("(p:Post)-[:CreatedBy]-(u:User)")
                .Where("id(p)=" + id)
                .OptionalMatch("(p)-[:tagged]-(t:Tag)")
                .Return((p, u,t) => new PostForDisplayDto
                {
                    Title=p.As<Post>().Title,
                    Text=p.As<Post>().Text,
                    Username = u.As<User>().Username,
                    Tags = t.CollectAsDistinct<Tag>(),
                    CreatedAt = p.As<Post>().CreatedAt,
                    ImageUrls = p.As<Post>().ImageUrls

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
                       Text = c.As<Comment>().Text,
                       Username = u.As<User>().Username,
                       CreatedAt=c.As<Comment>().CreatedAt
                   }
                   );
            var results = await query.ResultsAsync;
            return results;
        }
        public async Task<Choice> AddChoiceAsync(int postId, string username, bool opinion)
        {
            String choice;
            if (opinion)
                choice = "agree";
            else
                choice = "disagree";

            IEnumerable<Choice> ret = await _client.Cypher.Match("(u:User),(p:Post)")
                .Where("u.Username = '" + username + "' AND  id(p)=" + postId)
                .Merge("(u)-[c:Choice]->(p)")
                .Set($"c.Opinion='{choice}'")
                .Return<Choice>("c").ResultsAsync;
            return ret.First();

        }
        public async Task<CommentForDisplayDto> AddCommentAsync(int postId, string username, string comment_text)
        {

            var query =  _client.Cypher.Match("(u:User),(p:Post)")
                .Where("u.Username = '" + username + "' AND  id(p)=" + postId)
                .Create("(u)-[c:Comment {Text:'" + comment_text + "', CreatedAt: '" + DateTime.UtcNow + "'}]->(p)")
                .With("id(p) as idPosta,c,u")
                .Return((idPosta,c,u) => new
                {
                    Text = c.As<Comment>().Text,
                    Username = u.As<User>().Username,
                    CreatedAt = c.As<Comment>().CreatedAt,
                    IdPosta=idPosta.As<int>()
                });

            var ret = await query.ResultsAsync;
            _notificationService.SendNotification($"{username} commented on a post {ret.First().IdPosta}", ret.First().CreatedAt, ret.First().IdPosta);

            return new CommentForDisplayDto { 
                CreatedAt=ret.First().CreatedAt,
                Text=ret.First().Text,
                Username=ret.First().Username
            };

        }

       
    }
}
