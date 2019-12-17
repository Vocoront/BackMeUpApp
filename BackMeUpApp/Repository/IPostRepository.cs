using BackMeUpApp.DomainModel;
using BackMeUpApp.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackMeUpApp.Repository
{
    public interface IPostRepository
    {
        Task<IEnumerable<PostForDisplayDto>> GetPostsAsync();
        Task<IEnumerable<PostForDisplayDto>> GetPostAsync(String Username);

        Task<IEnumerable<PostForDisplayDto>> GetPostsByTagUsernameAsync(String Username,String Tag);

        Task<IEnumerable<PostForDisplayDto>> GetPostsByTagAsync(String Tag);
        Task<Post> AddPostAsync(Post post,string[] tags,string username);
        Task<User> AddChoiceAsync(int postId, string username, bool ChoiceLeft);
        Task<User> AddCommentAsync(int postId, string username, string comment_text);
        Task<PostForDisplayDto> GetPostsByIdAsync(int id);
        Task<IEnumerable<CommentForDisplayDto>> GetCommentsForPost(int postId);

    }
}
