using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace BackMeUpApp.DTOs
{
    public class PostForCreationDto
    {
        public string Username { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public string Tags { get; set; }
        public List<IFormFile> Files { get; set; }
    }
}
