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
using BackMeUpApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace BackMeUpApp.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _repo;
        private readonly IConfiguration _config;
        private readonly NotificationService _notificationService;
        public UserController(IUserRepository repo,IConfiguration config, NotificationService notificationService)
        {
            this._repo = repo;
            this._config = config ;
            this._notificationService=notificationService;
        }


        [HttpPost("reconnect")]
        [Authorize]
        public IActionResult Reconnect()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            IEnumerable<Claim> claim = identity.Claims;
            var usernameClaim = claim
                .Where(x => x.Type == ClaimTypes.Name)
                .FirstOrDefault();
            return Ok(new
            {
                username = usernameClaim.Value
            });
        }


        [HttpGet("follows/{connectionId}")]
        [Authorize]
        public async Task<IActionResult> Follows(string connectionId)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            IEnumerable<Claim> claim = identity.Claims;
            var usernameClaim = claim
                .Where(x => x.Type == ClaimTypes.Name)
                .FirstOrDefault();
           IEnumerable<String> ids= await this._repo.GetSubscriptions(usernameClaim.Value);

            _notificationService.CheckForNotification(connectionId,usernameClaim.Value, ids);
            return Ok(ids);
        }

        [HttpGet("newfollow/{id}")]
        [Authorize]
        public async Task<IActionResult> AddFollow(string id)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            IEnumerable<Claim> claim = identity.Claims;
            var usernameClaim = claim
                .Where(x => x.Type == ClaimTypes.Name)
                .FirstOrDefault();
            await this._repo.AddSubscription(usernameClaim.Value, id);
            return Ok();
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromForm]UserForRegisterDto userForRegisterDto)
        {
            userForRegisterDto.Username = userForRegisterDto.Username.ToLower();
     
           User user=await  _repo.Login(userForRegisterDto.Username, userForRegisterDto.Password);
            if (user == null)
                return Conflict();

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
                Expires = DateTime.Now.AddHours(1),
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
                return Conflict();
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
                Expires = DateTime.Now.AddHours(1),
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