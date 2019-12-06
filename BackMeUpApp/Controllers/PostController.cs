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

namespace BackMeUpApp.Controllers
{
    [Route("[controller]")]
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

        [HttpGet("{username}")]
        public async Task<IActionResult> Get(String username)
        {

            IEnumerable<PostForDisplayDto> posts = await _rep.GetPostAsync(username);
            return Ok(posts);
        }



        [HttpPost("create")]
        public async Task<IActionResult> AddNewPost([FromForm]PostForCreationDto newPostDto)
        {
            Post post = new Post { Text = newPostDto.Text, Title = newPostDto.Title };
            var addedPost = await _rep.AddPostAsync(post,newPostDto.Username);
            return Ok(addedPost); 
        }

    }
}