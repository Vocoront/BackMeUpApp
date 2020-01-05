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
using BackMeUpApp.Models;

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
            var addedPostId = await _rep.AddPostAsync(post,newPostDto.Tags,newPostDto.Username,newPostDto.Files);
            return Ok(addedPostId); 
        }
        [HttpPost("vote")]
        [Authorize]
        public async Task<IActionResult> AddNewVote([FromForm] VoteForCreation newVote)
        {

            var identity = HttpContext.User.Identity as ClaimsIdentity;
            IEnumerable<Claim> claim = identity.Claims;
            var usernameClaim = claim
                .Where(x => x.Type == ClaimTypes.Name)
                .FirstOrDefault();

            Choice ret;
            if (usernameClaim != null)
                ret= await _rep.AddChoiceAsync(newVote.IdPosta, usernameClaim.Value, newVote.Opinion);
            else
                return BadRequest();
            return Ok(ret);

        }
        [HttpPost("make_comment")]
        [Authorize]
        public async Task<IActionResult> AddNewComment([FromForm] CommentForCreationDto newComment)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            IEnumerable<Claim> claim = identity.Claims;
            var usernameClaim = claim
                .Where(x => x.Type == ClaimTypes.Name)
                .FirstOrDefault();
            CommentForDisplayDto ret;
            if (usernameClaim != null)
                ret = await _rep.AddCommentAsync(newComment.IdPosta, usernameClaim.Value, newComment.CommentText);
            else
                return BadRequest();
            return Ok(ret);

        }

        [HttpPost]
        public async Task<IActionResult> GetPosts([FromForm]FiltersDto filter)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            IEnumerable<Claim> claim = identity.Claims;
            var usernameClaim = claim
                .Where(x => x.Type == ClaimTypes.Name)
                .FirstOrDefault();

            IEnumerable<PostForDisplayDto> posts;
            if (usernameClaim != null)
                posts = await _rep.GetPostsForUserAsync(filter,usernameClaim.Value);
            else
                posts = await _rep.GetPostsAsync(filter);
            return Ok(posts);
        }

        [HttpPost("tag/{tag}")]
        public async Task<IActionResult> GetPostsWithTag([FromForm]FiltersDto filter,string tag)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            IEnumerable<Claim> claim = identity.Claims;
            var usernameClaim = claim
                .Where(x => x.Type == ClaimTypes.Name)
                .FirstOrDefault();
            IEnumerable<PostForDisplayDto> posts;
            if (usernameClaim != null)
                posts = await _rep.GetPostsWithTagForUserAsync(filter,tag, usernameClaim.Value);
            else
                posts = await _rep.GetPostsWithTagAsync(filter,tag);
            return Ok(posts);
        }

        [HttpPost("createdby/{createdBy}")]
        public async Task<IActionResult> GetPostsCreatedBy([FromForm]FiltersDto filter, string createdBy)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            IEnumerable<Claim> claim = identity.Claims;
            var usernameClaim = claim
                .Where(x => x.Type == ClaimTypes.Name)
                .FirstOrDefault();
            IEnumerable<PostForDisplayDto> posts;
            if (usernameClaim != null)
                posts = await _rep.GetPostsCreatedByForUserAsync(filter, createdBy, usernameClaim.Value);
            else
                posts = await _rep.GetPostsCreatedByAsync(filter, createdBy);
            return Ok(posts);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPostFromId(int id)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            IEnumerable<Claim> claim = identity.Claims;
            var usernameClaim = claim
                .Where(x => x.Type == ClaimTypes.Name)
                .FirstOrDefault();
            PostForDisplayDto post;
            if (usernameClaim != null)
                post = await _rep.GetPostByIdForUserAsync(id, usernameClaim.Value);
            else
                post = await _rep.GetPostByIdAsync(id);
            return Ok(post);
        }

        [HttpGet("comments/{postId}")]
        public async Task<IActionResult> GetCommentsForPost(int postId)
        {
            IEnumerable<CommentForDisplayDto> comments = await _rep.GetCommentsForPost(postId);
            return Ok(comments);
        }

    }
}