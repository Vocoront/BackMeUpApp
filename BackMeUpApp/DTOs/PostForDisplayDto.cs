using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackMeUpApp.DomainModel;

namespace BackMeUpApp.DTOs
{
    public class PostForDisplayDto
    {
        public long Id { get; set; }
        public string Username { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public DateTime CreatedAt { get; set; }
        public IEnumerable<Tag> Tags { get; set; }
        public String ImageUrls { get; set; }
        public string Choice { get; set; }
        public int CommentNo { get; set; }
        public int AgreeNo { get; set; }
        public int DisagreeNo { get; set; }

    }
}
