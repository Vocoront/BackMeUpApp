using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BackMeUpApp.DomainModel;
using BackMeUpApp.DTOs;
using BackMeUpApp.Repository;
using System.Security.Claims;
using System.IO;

namespace BackMeUpApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class PostController : ControllerBase
    {
        private readonly IPostRepository _rep;
        public PostController(IPostRepository rep)
        {
            _rep = rep;
        }
        [HttpGet("getFrom/{startPage}/{sortBy}")] //sortBy 1 za newest-defult; 2-popular; 3-controversial
        public async Task<IActionResult> GetPosts(int startPage, String sortBy)
        {
            int sort=1;
            if (sortBy == "MostPopular")
                sort = 2;
            else 
            if (sortBy == "Controversial")
                sort = 3;

            var identity = HttpContext.User.Identity as ClaimsIdentity;
            IEnumerable<Claim> claim = identity.Claims;
            var usernameClaim = claim
                .Where(x => x.Type == ClaimTypes.Name)
                .FirstOrDefault();
           
            IEnumerable<PostForDisplayDto> posts;
            if (usernameClaim != null)
                posts = await _rep.GetPostsAsync(usernameClaim.Value);
            else
                posts=await _rep.GetPostsAsync(startPage, sort);
            return Ok(posts);
        }
        [HttpGet ("getPostById/{postId}")]
        public async Task<IActionResult> GetPostById(int postId)
        {
            PostForDisplayDto post= await _rep.GetPostsByIdAsync(postId);
            return Ok(post);
        }

        [HttpGet("getPostByTagUsername/{username}/{tag}")]
        public async Task<IActionResult> GetPostByTagUsername(string username,string tag)
        {
            IEnumerable<PostForDisplayDto> posts = await _rep.GetPostsByTagUsernameAsync(username, tag);
            return Ok(posts);
        }

        [HttpGet("getPostByTag/{tag}")]
        public async Task<IActionResult> GetPostByTag(string tag)
        {
            IEnumerable<PostForDisplayDto> posts = await _rep.GetPostsByTagAsync(tag);
            return Ok(posts);
        }

        [HttpGet("GetCommentsForPost/{postId}")]
        public async Task<IActionResult> GetCommentsForPost(int postId)
        {

            IEnumerable < CommentForDisplayDto > comments = await _rep.GetCommentsForPost(postId);
            return Ok(comments);
        }
        [HttpGet("createdby/{username}")]
        public async Task<IActionResult> GetPostCreatedBy(String username)
        {

            IEnumerable<PostForDisplayDto> posts = await _rep.GetPostCreatedByAsync(username);
            return Ok(posts);
        }

        [HttpPost("create")]
        [Authorize]
        public async Task<IActionResult> CreatePost([FromForm]PostForCreationDto newPostDto)
        {

            if (newPostDto.Files!=null&&!Services.ImageService.ValidateImages(newPostDto.Files))
            {
                return Conflict(new { error="invalid file format" });
            }
            Post post = new Post { Text = newPostDto.Text,
                Title = newPostDto.Title,
                CreatedAt=DateTime.UtcNow};
            var addedPost = await _rep.AddPostAsync(post,newPostDto.Tags,newPostDto.Username,newPostDto.Files);
            return Ok(addedPost); 
        }
        [HttpPost("vote")]
        public async Task<IActionResult> AddNewVote([FromForm] VoteForCreation newVote)
        {

            var ret = await _rep.AddChoiceAsync(newVote.IdPosta, newVote.Username, newVote.Opinion);
            return Ok(ret);

        }
        [HttpPost("make_comment")]
        public async Task<IActionResult> AddNewComment([FromForm] CommentForCreationDto newComment)
        {

            var ret = await _rep.AddCommentAsync(newComment.IdPosta, newComment.Username, newComment.CommentText);
            return Ok(ret);

        }


        [HttpPost("getposts")]
        public async Task<IActionResult> GetPosts1([FromForm]FiltersDto filter)
        {
            var posts = await _rep.GetPosts1(filter);
            return Ok(posts);
        }

    }
}