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

            IEnumerable<Post> posts= await _rep.GetPostsAsync();
            return Ok(posts);
        }



        [HttpPost("create")]
        public async Task<IActionResult> AddNewPost([FromForm]Post post)
        {
            var addedPost = await _rep.AddPostAsync(post);
            return Ok(addedPost); 
        }

    }
}