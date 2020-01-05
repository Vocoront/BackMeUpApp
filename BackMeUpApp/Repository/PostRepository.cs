using BackMeUpApp.DomainModel;
using BackMeUpApp.DTOs;
using BackMeUpApp.Models;
using BackMeUpApp.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Neo4jClient;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace BackMeUpApp.Repository
{
    public class PostRepository : IPostRepository
    {
        private readonly IGraphClient _client;

        private readonly IHostingEnvironment _hostingEnvironment;

        private readonly NotificationService _notificationService;
        public PostRepository(IGraphClientFactory factory, IHostingEnvironment hostingEnvironment, NotificationService notificationService)
        {
            this._client = factory.Create();
            this._hostingEnvironment = hostingEnvironment;
            _notificationService = notificationService;
       
        }
        public async Task<long> AddPostAsync(Post post,string postTags,string username, List<IFormFile> images)
        {
            post.Text = post.Text.Replace("\\", @"\u005c")// da se dodaju escape karakteri za znakove, ako nadjete jos neki dodajte
                .Replace("\"", @"\u0022")
                .Replace("'", @"\u0027");

            IEnumerable<Node<Post>> ret = await this._client.Cypher.Match("(u:User)")
                .Where((User u)=>u.Username==username)
                .Create("(p:Post { Title:'"+post.Title+"', " +"Text:'" +post.Text+ "', CreatedAt: datetime('" + DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss") + "') })")
                .Create("(p)-[:CreatedBy]->(u)")
                .Create("(u)-[:Follow]->(p)")
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
                    await this._client.Cypher.Match("(p:Post)")
                    .Where("id(p)=" + id)
                    .Merge("(t:Tag { Title:'" + t + "' })")
                    .Create("(p)-[:tagged]->(t)").Return<Tag>("t").ExecuteWithoutResultsAsync();
                    
                }
            }
            return pom.Reference.Id;
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
                   ).OrderBy("c.CreatedAt");
            var results = await query.ResultsAsync;
            return results;
        }
        public async Task<Choice> AddChoiceAsync(int postId, string username, bool opinion)
        {
            String choice;
            String msg;
            if (opinion)
            {
                choice = "agree";
                msg = "Agreed on post";
            }
            else
            {
                choice = "disagree";
                msg = "Disagreed on post";
            }

            IEnumerable<Choice> ret = await _client.Cypher.Match("(u:User),(p:Post)")
                .Where("u.Username = '" + username + "' AND  id(p)=" + postId)
                .Merge("(u)-[c:Choice]->(p)")
                .Set($"c.Opinion='{choice}'")
                .Return<Choice>("c").ResultsAsync;

            _notificationService.SendNotification(new NotificationMessageDto { Message = msg, CreatedAt = DateTime.UtcNow, Creator = username, PostId =postId});

            return ret.First();

        }
        public async Task<CommentForDisplayDto> AddCommentAsync(int postId, string username, string comment_text)
        {

            var query =  _client.Cypher.Match("(u:User),(p:Post)")
                .Where("u.Username = '" + username + "' AND  id(p)=" + postId)
                .Create("(u)-[c:Comment {Text:'" + comment_text + "', CreatedAt: datetime('" + DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss")+ "')}]->(p)")
                .With("id(p) as idPosta,c,u")
                .Return((idPosta,c,u) => new
                {   
                    Text = c.As<Comment>().Text,
                    Username = u.As<User>().Username,
                    CreatedAt = c.As<Comment>().CreatedAt,
                    IdPosta=idPosta.As<int>()
                });

            var ret = await query.ResultsAsync;
            _notificationService.SendNotification(new NotificationMessageDto { Message=$"commented {comment_text}",CreatedAt= ret.First().CreatedAt, Creator=username,PostId=ret.First().IdPosta });

            return new CommentForDisplayDto { 
                CreatedAt=ret.First().CreatedAt,
                Text=ret.First().Text,
                Username=ret.First().Username
            };

        }
        
        protected string GetOrderQuery(string filter,string order)
        {
            string orderQuery = "";

            if (filter.Equals("date"))
                orderQuery = "post.CreatedAt";
            else
                orderQuery = "agrNo";
            if (order.Equals("asc"))
                orderQuery += " ASC";
            else
                orderQuery += " DESC";
            return orderQuery;
        }
        protected string GetStartDate(string period)
        {
            switch(period)
            {
                case "day": return DateTime.UtcNow.AddDays(-1).ToString("yyyy-MM-ddTHH:mm:ss");
                case "week": return DateTime.UtcNow.AddDays(-7).ToString("yyyy-MM-ddTHH:mm:ss");
                case "month": return DateTime.UtcNow.AddMonths(-1).ToString("yyyy-MM-ddTHH:mm:ss");
                default: return DateTime.UtcNow.AddYears(-2000).ToString("yyyy-MM-ddTHH:mm:ss");
            }
        }     
        public async Task<IEnumerable<PostForDisplayDto>> GetPostsAsync(FiltersDto filter)
        {
            string orderQuery=GetOrderQuery(filter.Filter,filter.Order);
            string startingDate = GetStartDate(filter.Period);

            var query = this._client.
                Cypher
                .Match("(post:Post)")
                .Where($"post.CreatedAt>=datetime('{startingDate}')")
                .Match("(post)-[r:CreatedBy]-(creator:User)")
                .With("post,creator")
                .OptionalMatch($"(post)-[:tagged]-(tag:Tag)")
                .With("post,creator,tag")
                .OptionalMatch("()-[c:Comment]->(post)")
                .With("post,creator,tag,count(c) as CommentNo")
                .OptionalMatch("()-[agr:Choice {Opinion: \"agree\"}]->(post)")
                .With("post,creator,tag,CommentNo,count(agr) as agrNo")
                .OptionalMatch("()-[dagr:Choice {Opinion: \"disagree\"}]->(post)")
                .With("id(post) as id,post,creator,tag,CommentNo,agrNo, count(dagr) as dagrNo")
                .Return((post, creator, tag, id, CommentNo, agrNo, dagrNo) => new PostForDisplayDto
                {
                    Id = id.As<long>(),
                    Text = post.As<Post>().Text,
                    Creator = creator.As<User>().Username,
                    Title = post.As<Post>().Title,
                    Tags = tag.CollectAsDistinct<Tag>(),
                    CreatedAt = post.As<Post>().CreatedAt,
                    ImageUrls = post.As<Post>().ImageUrls,
                    CommentNo = CommentNo.As<int>(),
                    AgreeNo = (int)agrNo.As<int>(),
                    DisagreeNo = (int)dagrNo.As<int>()
                })
                .OrderBy(orderQuery)
                .Skip(filter.Page * filter.Limit)
                .Limit(filter.Limit);
            var results = await query.ResultsAsync;

            return results;
        }
        public async Task<IEnumerable<PostForDisplayDto>> GetPostsForUserAsync(FiltersDto filter, string username)
        {
            string orderQuery = GetOrderQuery(filter.Filter, filter.Order);
            string startingDate = GetStartDate(filter.Period);

            var query = this._client.
                Cypher
                .Match("(post:Post)")
                .Where($"post.CreatedAt>=datetime('{startingDate}')")
                .Match("(post)-[r:CreatedBy]-(creator:User)")
                .Match($"(user:User)")
                .Where((User user)=>user.Username==username)
                .With("post,creator,user")
                .OptionalMatch($"(post)-[:tagged]-(tag:Tag)")
                .With("post,creator,user,tag")
                .OptionalMatch("()-[c:Comment]->(post)")
                .With("post,creator,user,tag,count(c) as CommentNo")
                .OptionalMatch("()-[agr:Choice {Opinion: \"agree\"}]->(post)")
                .With("post,creator,user,tag,CommentNo,count(agr) as agrNo")
                .OptionalMatch("()-[dagr:Choice {Opinion: \"disagree\"}]->(post)")
                .With("id(post) as id,post,creator,user,tag,CommentNo,agrNo, count(dagr) as dagrNo")
                .OptionalMatch("(user)-[choice:Choice]-(post)")
                .With("id(post) as id,post,creator,user,tag,CommentNo,agrNo,dagrNo,choice, Exists((user)-[:Follow]-(post)) as follow")
                .Return((post, creator,tag, id, CommentNo, agrNo, dagrNo,choice,follow) => new PostForDisplayDto
                {
                    Id = id.As<long>(),
                    Text = post.As<Post>().Text,
                    Creator = creator.As<User>().Username,
                    Title = post.As<Post>().Title,
                    Tags = tag.CollectAsDistinct<Tag>(),
                    CreatedAt = post.As<Post>().CreatedAt,
                    Choice = choice.As<Choice>().Opinion,
                    ImageUrls = post.As<Post>().ImageUrls,
                    CommentNo = CommentNo.As<int>(),
                    AgreeNo = (int)agrNo.As<int>(),
                    DisagreeNo = (int)dagrNo.As<int>(),
                    Follow = follow.As<bool>()
                })
                .OrderBy(orderQuery)
                .Skip(filter.Page * filter.Limit)
                .Limit(filter.Limit);

            var results = await query.ResultsAsync;

            return results;
        }

        public async Task<IEnumerable<PostForDisplayDto>> GetPostsWithTagAsync(FiltersDto filter,string tagFilter)
        {
            string orderQuery = GetOrderQuery(filter.Filter, filter.Order);
            string startingDate = GetStartDate(filter.Period);

            var query = this._client.
                Cypher
                .Match("(post:Post)-[:tagged]-(t:Tag)")
                .Where($"post.CreatedAt>=datetime('{startingDate}') AND t.Title='{tagFilter}'")
                .Match("(post)-[r:CreatedBy]-(creator:User)")
                .With("post,creator")
                .OptionalMatch($"(post)-[:tagged]-(tag:Tag)")
                .With("post,creator,tag")
                .OptionalMatch("()-[c:Comment]->(post)")
                .With("post,creator,tag,count(c) as CommentNo")
                .OptionalMatch("()-[agr:Choice {Opinion: \"agree\"}]->(post)")
                .With("post,creator,tag,CommentNo,count(agr) as agrNo")
                .OptionalMatch("()-[dagr:Choice {Opinion: \"disagree\"}]->(post)")
                .With("id(post) as id,post,creator,tag,CommentNo,agrNo, count(dagr) as dagrNo")
                .Return((post, creator, tag, id, CommentNo, agrNo, dagrNo) => new PostForDisplayDto
                {
                    Id = id.As<long>(),
                    Text = post.As<Post>().Text,
                    Creator = creator.As<User>().Username,
                    Title = post.As<Post>().Title,
                    Tags = tag.CollectAsDistinct<Tag>(),
                    CreatedAt = post.As<Post>().CreatedAt,
                    ImageUrls = post.As<Post>().ImageUrls,
                    CommentNo = CommentNo.As<int>(),
                    AgreeNo = (int)agrNo.As<int>(),
                    DisagreeNo = (int)dagrNo.As<int>()
                })
                .OrderBy(orderQuery)
                .Skip(filter.Page * filter.Limit)
                .Limit(filter.Limit);
            var results = await query.ResultsAsync;

            return results;
        }

        public async Task<IEnumerable<PostForDisplayDto>> GetPostsWithTagForUserAsync(FiltersDto filter,string tagFilter, string username)
        {
            string orderQuery = GetOrderQuery(filter.Filter, filter.Order);
            string startingDate = GetStartDate(filter.Period);

            var query = this._client.
                Cypher
               .Match("(post:Post)-[:tagged]-(t:Tag)")
                .Where($"post.CreatedAt>=datetime('{startingDate}') AND t.Title='{tagFilter}'")
                .Match("(post)-[r:CreatedBy]-(creator:User)")
                .Match($"(user:User)")
                .Where((User user) => user.Username == username)
                .With("post,creator,user")
                .OptionalMatch($"(post)-[:tagged]-(tag:Tag)")
                .With("post,creator,user,tag")
                .OptionalMatch("()-[c:Comment]->(post)")
                .With("post,creator,user,tag,count(c) as CommentNo")
                .OptionalMatch("()-[agr:Choice {Opinion: \"agree\"}]->(post)")
                .With("post,creator,user,tag,CommentNo,count(agr) as agrNo")
                .OptionalMatch("()-[dagr:Choice {Opinion: \"disagree\"}]->(post)")
                .With("id(post) as id,post,creator,user,tag,CommentNo,agrNo, count(dagr) as dagrNo")
                .OptionalMatch("(user)-[choice:Choice]-(post)")
                .With("id(post) as id,post,creator,user,tag,CommentNo,agrNo,dagrNo,choice, Exists((user)-[:Follow]-(post)) as follow")
                .Return((post, creator, tag, id, CommentNo, agrNo, dagrNo, choice, follow) => new PostForDisplayDto
                {
                    Id = id.As<long>(),
                    Text = post.As<Post>().Text,
                    Creator = creator.As<User>().Username,
                    Title = post.As<Post>().Title,
                    Tags = tag.CollectAsDistinct<Tag>(),
                    CreatedAt = post.As<Post>().CreatedAt,
                    Choice = choice.As<Choice>().Opinion,
                    ImageUrls = post.As<Post>().ImageUrls,
                    CommentNo = CommentNo.As<int>(),
                    AgreeNo = (int)agrNo.As<int>(),
                    DisagreeNo = (int)dagrNo.As<int>(),
                    Follow = follow.As<bool>()
                })
                .OrderBy(orderQuery)
                .Skip(filter.Page * filter.Limit)
                .Limit(filter.Limit);

            var results = await query.ResultsAsync;

            return results;
        }

        public async Task<IEnumerable<PostForDisplayDto>> GetPostsCreatedByAsync(FiltersDto filter, string createdBy)
        {
            string orderQuery = GetOrderQuery(filter.Filter, filter.Order);
            string startingDate = GetStartDate(filter.Period);

            var query = this._client.
                Cypher
                .Match("(post)-[r:CreatedBy]-(creator:User)")
                .Where($"post.CreatedAt>=datetime('{startingDate}') AND creator.Username='{createdBy}'")
                .With("post,creator")
                .OptionalMatch($"(post)-[:tagged]-(tag:Tag)")
                .With("post,creator,tag")
                .OptionalMatch("()-[c:Comment]->(post)")
                .With("post,creator,tag,count(c) as CommentNo")
                .OptionalMatch("()-[agr:Choice {Opinion: \"agree\"}]->(post)")
                .With("post,creator,tag,CommentNo,count(agr) as agrNo")
                .OptionalMatch("()-[dagr:Choice {Opinion: \"disagree\"}]->(post)")
                .With("id(post) as id,post,creator,tag,CommentNo,agrNo, count(dagr) as dagrNo")
                .Return((post, creator, tag, id, CommentNo, agrNo, dagrNo) => new PostForDisplayDto
                {
                    Id = id.As<long>(),
                    Text = post.As<Post>().Text,
                    Creator = creator.As<User>().Username,
                    Title = post.As<Post>().Title,
                    Tags = tag.CollectAsDistinct<Tag>(),
                    CreatedAt = post.As<Post>().CreatedAt,
                    ImageUrls = post.As<Post>().ImageUrls,
                    CommentNo = CommentNo.As<int>(),
                    AgreeNo = (int)agrNo.As<int>(),
                    DisagreeNo = (int)dagrNo.As<int>()
                })
                .OrderBy(orderQuery)
                .Skip(filter.Page * filter.Limit)
                .Limit(filter.Limit);
            var results = await query.ResultsAsync;

            return results;
        }

        public async Task<IEnumerable<PostForDisplayDto>> GetPostsCreatedByForUserAsync(FiltersDto filter, string createdBy, string username)
        {
            string orderQuery = GetOrderQuery(filter.Filter, filter.Order);
            string startingDate = GetStartDate(filter.Period);

            var query = this._client.
                Cypher
                .Match("(post)-[r:CreatedBy]-(creator:User)")
                .Where($"post.CreatedAt>=datetime('{startingDate}') AND creator.Username='{createdBy}'")
                .Match($"(user:User)")
                .Where((User user) => user.Username == username)
                .With("post,creator,user")
                .OptionalMatch($"(post)-[:tagged]-(tag:Tag)")
                .With("post,creator,user,tag")
                .OptionalMatch("()-[c:Comment]->(post)")
                .With("post,creator,user,tag,count(c) as CommentNo")
                .OptionalMatch("()-[agr:Choice {Opinion: \"agree\"}]->(post)")
                .With("post,creator,user,tag,CommentNo,count(agr) as agrNo")
                .OptionalMatch("()-[dagr:Choice {Opinion: \"disagree\"}]->(post)")
                .With("id(post) as id,post,creator,user,tag,CommentNo,agrNo, count(dagr) as dagrNo")
                .OptionalMatch("(user)-[choice:Choice]-(post)")
                .With("id(post) as id,post,creator,user,tag,CommentNo,agrNo,dagrNo,choice, Exists((user)-[:Follow]-(post)) as follow")
                .Return((post, creator, tag, id, CommentNo, agrNo, dagrNo, choice, follow) => new PostForDisplayDto
                {
                    Id = id.As<long>(),
                    Text = post.As<Post>().Text,
                    Creator = creator.As<User>().Username,
                    Title = post.As<Post>().Title,
                    Tags = tag.CollectAsDistinct<Tag>(),
                    CreatedAt = post.As<Post>().CreatedAt,
                    Choice = choice.As<Choice>().Opinion,
                    ImageUrls = post.As<Post>().ImageUrls,
                    CommentNo = CommentNo.As<int>(),
                    AgreeNo = (int)agrNo.As<int>(),
                    DisagreeNo = (int)dagrNo.As<int>(),
                    Follow = follow.As<bool>()
                })
                .OrderBy(orderQuery)
                .Skip(filter.Page * filter.Limit)
                .Limit(filter.Limit);

            var results = await query.ResultsAsync;

            return results;
        }

        public async Task<PostForDisplayDto> GetPostByIdAsync(int postId)
        {

            var query = this._client.
                Cypher
                .Match("(post:Post)")
                .Where($"id(post)={postId}")
                .Match("(post)-[r:CreatedBy]-(creator:User)")
                .With("post,creator")
                .OptionalMatch($"(post)-[:tagged]-(tag:Tag)")
                .With("post,creator,tag")
                .OptionalMatch("()-[c:Comment]->(post)")
                .With("post,creator,tag,count(c) as CommentNo")
                .OptionalMatch("()-[agr:Choice {Opinion: \"agree\"}]->(post)")
                .With("post,creator,tag,CommentNo,count(agr) as agrNo")
                .OptionalMatch("()-[dagr:Choice {Opinion: \"disagree\"}]->(post)")
                .With("id(post) as id,post,creator,tag,CommentNo,agrNo, count(dagr) as dagrNo")
                .Return((post, creator, tag, id, CommentNo, agrNo, dagrNo) => new PostForDisplayDto
                {
                    Id = id.As<long>(),
                    Text = post.As<Post>().Text,
                    Creator = creator.As<User>().Username,
                    Title = post.As<Post>().Title,
                    Tags = tag.CollectAsDistinct<Tag>(),
                    CreatedAt = post.As<Post>().CreatedAt,
                    ImageUrls = post.As<Post>().ImageUrls,
                    CommentNo = CommentNo.As<int>(),
                    AgreeNo = (int)agrNo.As<int>(),
                    DisagreeNo = (int)dagrNo.As<int>()
                });
            var results = await query.ResultsAsync;

            return results.First();
        }

        public async Task<PostForDisplayDto> GetPostByIdForUserAsync(int postId, string username)
        {

            var query = this._client.
                Cypher
                .Match("(post:Post)")
                .Where($"id(post)={postId}")
                .Match("(post)-[r:CreatedBy]-(creator:User)")
                .Match($"(user:User)")
                .Where((User user) => user.Username == username)
                .With("post,creator,user")
                .OptionalMatch($"(post)-[:tagged]-(tag:Tag)")
                .With("post,creator,user,tag")
                .OptionalMatch("()-[c:Comment]->(post)")
                .With("post,creator,user,tag,count(c) as CommentNo")
                .OptionalMatch("()-[agr:Choice {Opinion: \"agree\"}]->(post)")
                .With("post,creator,user,tag,CommentNo,count(agr) as agrNo")
                .OptionalMatch("()-[dagr:Choice {Opinion: \"disagree\"}]->(post)")
                .With("id(post) as id,post,creator,user,tag,CommentNo,agrNo, count(dagr) as dagrNo")
                .OptionalMatch("(user)-[choice:Choice]-(post)")
                .With("id(post) as id,post,creator,user,tag,CommentNo,agrNo,dagrNo,choice, Exists((user)-[:Follow]-(post)) as follow")
                .Return((post, creator, tag, id, CommentNo, agrNo, dagrNo, choice, follow) => new PostForDisplayDto
                {
                    Id = id.As<long>(),
                    Text = post.As<Post>().Text,
                    Creator = creator.As<User>().Username,
                    Title = post.As<Post>().Title,
                    Tags = tag.CollectAsDistinct<Tag>(),
                    CreatedAt = post.As<Post>().CreatedAt,
                    Choice = choice.As<Choice>().Opinion,
                    ImageUrls = post.As<Post>().ImageUrls,
                    CommentNo = CommentNo.As<int>(),
                    AgreeNo = (int)agrNo.As<int>(),
                    DisagreeNo = (int)dagrNo.As<int>(),
                    Follow = follow.As<bool>()
                });

            var results = await query.ResultsAsync;

            return results.First();
        }
    }
}
