using BackMeUpApp.DomainModel;
using BackMeUpApp.DTOs;
using BackMeUpApp.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackMeUpApp.Repository
{
    public interface IPostRepository
    {
        Task<IEnumerable<PostForDisplayDto>> GetPostsAsync(int start);
        Task<IEnumerable<PostForDisplayDto>> GetPostsAsync(string username);
        Task<IEnumerable<PostForDisplayDto>> GetPostCreatedByAsync(String Username);
        Task<IEnumerable<PostForDisplayDto>> GetPostsByTagUsernameAsync(String Username,String Tag);
        Task<IEnumerable<PostForDisplayDto>> GetPostsByTagAsync(String Tag);
        Task<Post> AddPostAsync(Post post,string tags,string username, List<IFormFile> images);
        Task<Choice> AddChoiceAsync(int postId, string username, bool opinion);
        Task<CommentForDisplayDto> AddCommentAsync(int postId, string username, string comment_text);
        Task<PostForDisplayDto> GetPostsByIdAsync(int id);
        Task<IEnumerable<CommentForDisplayDto>> GetCommentsForPost(int postId);

    }
}
