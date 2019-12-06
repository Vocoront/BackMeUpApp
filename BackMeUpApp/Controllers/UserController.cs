using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BackMeUpApp.DomainModel;
using BackMeUpApp.DTOs;
using BackMeUpApp.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace BackMeUpApp.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _repo;
        private readonly IConfiguration _config;
        private readonly IPostRepository _postRepo;
        public UserController(IUserRepository repo,IPostRepository postRepository,IConfiguration config)
        {
            this._repo = repo;
            this._config = config ;
            this._postRepo = postRepository;
        }

        [HttpGet("{username}")]
        public async Task<IActionResult> Get(String username)
        {

            IEnumerable<PostForDisplayDto> posts = await _postRepo.GetPostAsync(username);
            return Ok(posts);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromForm]UserForRegisterDto userForRegisterDto)
        {
            userForRegisterDto.Username = userForRegisterDto.Username.ToLower();
            var userToCreate = new User
            {
                Username = userForRegisterDto.Username,
                Email = userForRegisterDto.Email
            };


           User user=await  _repo.Login(userForRegisterDto.Username, userForRegisterDto.Password);
            if (user == null)
                return Unauthorized();

            var claims = new[]
            {
                new Claim(ClaimTypes.Email,user.Email),
                new Claim(ClaimTypes.Name,user.Username)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok(new  { 
                token=tokenHandler.WriteToken(token),
                username = user.Username
            });
        }


        [HttpPost("create")]
        public async Task<IActionResult> Register([FromForm]UserForRegisterDto userForRegisterDto)
        {
            userForRegisterDto.Username = userForRegisterDto.Username.ToLower();
            if (await this._repo.UsernameAndEmailExists(userForRegisterDto.Username,userForRegisterDto.Email))
                return BadRequest();
            var userToCreate = new User
            {
                Username = userForRegisterDto.Username,
                Email=userForRegisterDto.Email
            };

            var createdUser = await this._repo.CreateAccount(userToCreate, userForRegisterDto.Password);

            var claims = new[]
         {
                new Claim(ClaimTypes.Email,createdUser.Email),
                new Claim(ClaimTypes.Name,createdUser.Username)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddHours(2),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok(new
            {
                token = tokenHandler.WriteToken(token),
                username=createdUser.Username
            });
        }

        
    }
}