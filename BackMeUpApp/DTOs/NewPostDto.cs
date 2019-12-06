using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackMeUpApp.DTOs
{
    public class NewPostDto
    {
        public string Username { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }

        public string Tags { get; set; }
    }
}
