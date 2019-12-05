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
        public string Get()
        {
            var newPost = _rep.addPost();
            return newPost.ToString();
        }
    }
}