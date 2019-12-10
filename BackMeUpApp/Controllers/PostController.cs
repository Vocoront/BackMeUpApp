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


        [HttpGet]
        public async Task<IActionResult> Get()
        {
       
            IEnumerable<PostForDisplayDto> posts= await _rep.GetPostsAsync();
            return Ok(posts);
        }
        [HttpGet ("getPostById/{postId}")]
        public async Task<IActionResult> GetPostById(int postId)
        {

            PostForDisplayDto post= await _rep.GetPostsByIdAsync(postId);
            return Ok(post);
        }
        [HttpGet("GetCommentsForPost/{postId}")]
        public async Task<IActionResult> GetCommentsForPost(int postId)
        {

            IEnumerable < CommentForDisplayDto > comments = await _rep.GetCommentsForPost(postId);
            return Ok(comments);
        }
        [HttpGet("createdby/{username}")]
        public async Task<IActionResult> Get(String username)
        {

            IEnumerable<PostForDisplayDto> posts = await _rep.GetPostAsync(username);
            return Ok(posts);
        }



        [HttpPost("create")]
        public async Task<IActionResult> AddNewPost([FromForm]PostForCreationDto newPostDto)
        {
            Post post = new Post { Text = newPostDto.Text, Title = newPostDto.Title, Tags=newPostDto.Tags };
            var addedPost = await _rep.AddPostAsync(post,newPostDto.Username);
            return Ok(addedPost); 
        }
        [HttpPost("vote")]
        public async Task<IActionResult> AddNewVote([FromForm] VoteForCreation newVote)
        {

            var ret = await _rep.AddChoiceAsync(newVote.IdPosta, newVote.Username, newVote.isLeft);
            return Ok(ret);

        }
        [HttpPost("make_comment")]
        public async Task<IActionResult> AddNewComment([FromForm] CommentForCreationDto newComment)
        {

            var ret = await _rep.AddCommentAsync(newComment.IdPosta, newComment.Username, newComment.Comment_Text);
            return Ok(ret);

        }

    }
}