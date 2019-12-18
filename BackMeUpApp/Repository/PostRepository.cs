﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using BackMeUpApp.DomainModel;
using BackMeUpApp.DTOs;
using BackMeUpApp.Models;
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
        public async Task<Post> AddPostAsync(Post post,string postTags,string username)
        {
            IEnumerable<Node<Post>> ret = await this._client.Cypher.Match("(u:User)")
                .Where((User u)=>u.Username==username)
                .Create("(p:Post { Title:'"+post.Title+"', " +
                "Text:'" +post.Text+
                "', CreatedAt: '"+post.CreatedAt+"' })")
                .Create("(p)-[:CreatedBy]->(u)")
                .Return<Node<Post>>("p").ResultsAsync;

            var pom= ret.First();

            int id = (int)pom.Reference.Id;

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
                .Match("(m)-[:tagged]-(t:Tag)")
                .With("id(m) as id,m,u,t")
              .Return((id,m, u, t) => new PostForDisplayDto
              {
                  Id= id.As<long>(),
                  Text=m.As<Post>().Text,
                  Username=u.As<User>().Username,
                  Title=m.As<Post>().Title,              
                  Tags = t.CollectAs<Tag>(),
                  CreatedAt = m.As<Post>().CreatedAt

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
                  Tags = t.CollectAs<Tag>(),
                  CreatedAt = m.As<Post>().CreatedAt

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
                    Tags = t.CollectAs<Tag>(),
                    CreatedAt = m.As<Post>().CreatedAt

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
                .With("id(m) as id,m,u,t")
                .Return((m, u, t, id) => new PostForDisplayDto
                {
                    Id = id.As<long>(),
                    Text = m.As<Post>().Text,
                    Username = u.As<User>().Username,
                    Title = m.As<Post>().Title,
                    Tags = t.CollectAs<Tag>(),
                    CreatedAt=m.As<Post>().CreatedAt
                }
                );
            var results = await query.ResultsAsync;

            return results;
        }
        public async Task<IEnumerable<PostForDisplayDto>> GetPostsAsync(string username)
        {
            var query = this._client.Cypher.Match("(m:Post)-[r:CreatedBy]-(u:User)")
            .Match("(m)-[:tagged]-(t:Tag)")
            .OptionalMatch($"(user:User {{Username:'{username}'}})-[c:Choice]-(m)")
            .With("id(m) as id,c,m,u,t")
            .Return((id,c,m, u, t) => new PostForDisplayDto
                {
                    Id= id.As<long>(),
                    Text=m.As<Post>().Text,
                    Username=u.As<User>().Username,
                    Title=m.As<Post>().Title,              
                    Tags = t.CollectAs<Tag>(),
                    CreatedAt = m.As<Post>().CreatedAt,
                    Choice=c.As<Choice>().Opinion
                }
            ) ;
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
                    Tags = t.CollectAs<Tag>(),
                    CreatedAt = p.As<Post>().CreatedAt

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
        public async Task<User> AddCommentAsync(int postId, string username, string comment_text)
        {
            
            IEnumerable<User> ret = await _client.Cypher.Match("(u:User),(p:Post)")
                .Where("u.Username = '" + username + "' AND  id(p)=" + postId)
                .Create("(u)-[:Comment {Text:'" + comment_text + "', CreatedAt: '"+DateTime.UtcNow+"'}]->(p)")
                .Return<User>("u").ResultsAsync;
            
            return ret.First();

        }

       
    }
}
