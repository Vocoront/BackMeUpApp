using Microsoft.AspNetCore.Http;

namespace BackMeUpApp.DTOs
{
    public class PostForCreationDto
    {
        public string Username { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public string Tags { get; set; }
        public IFormFile File { get; set; }
    }
}
