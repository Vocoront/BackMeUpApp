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
        Task<IEnumerable<PostForDisplayDto>> GetPostsAsync(int startPage, int sortBy);
        Task<IEnumerable<PostForDisplayDto>> GetPostsAsync(string username);
        Task<IEnumerable<PostForDisplayDto>> GetPostCreatedByAsync(String Username);
        Task<IEnumerable<PostForDisplayDto>> GetPostsByTagUsernameAsync(String Username,String Tag);
        Task<IEnumerable<PostForDisplayDto>> GetPostsByTagAsync(String Tag);
        Task<long> AddPostAsync(Post post,string tags,string username, List<IFormFile> images);
        Task<Choice> AddChoiceAsync(int postId, string username, bool opinion);
        Task<CommentForDisplayDto> AddCommentAsync(int postId, string username, string comment_text);
        Task<IEnumerable<CommentForDisplayDto>> GetCommentsForPost(int postId);
        Task<PostForDisplayDto> GetPostsByIdAsync(int id);

        Task<IEnumerable<PostForDisplayDto>> GetPostsAsync(FiltersDto filtersDto);
        Task<IEnumerable<PostForDisplayDto>> GetPostsForUserAsync(FiltersDto filtersDto,string username);
        Task<IEnumerable<PostForDisplayDto>> GetPostsWithTagAsync(FiltersDto filtersDto,string tag);
        Task<IEnumerable<PostForDisplayDto>> GetPostsWithTagForUserAsync(FiltersDto filtersDto,string tag,string username);

        Task<IEnumerable<PostForDisplayDto>> GetPostsCreatedByAsync(FiltersDto filtersDto,string creator);
        Task<IEnumerable<PostForDisplayDto>> GetPostsCreatedByForUserAsync(FiltersDto filtersDto,string creator, string username);
        Task<PostForDisplayDto> GetPostByIdAsync(int id);
        Task<PostForDisplayDto> GetPostByIdForUserAsync(int id,string username);




    }
}
