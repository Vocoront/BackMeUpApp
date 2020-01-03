﻿using System;
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
            var addedPostId = await _rep.AddPostAsync(post,newPostDto.Tags,newPostDto.Username,newPostDto.Files);
            return Ok(addedPostId); 
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

    }
}