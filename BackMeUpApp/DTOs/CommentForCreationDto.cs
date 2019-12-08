using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackMeUpApp.DTOs
{
    public class CommentForCreationDto
    {
        public int IdPosta { get; set; }
        public string Username { get; set; }
        public string Comment_Text { get; set; }
    }
}
