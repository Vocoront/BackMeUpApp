using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackMeUpApp.DTOs
{
    public class NotificationMessageDto
    {
        public String Message { get; set; }
        public String Creator { get; set; }
        public DateTime CreatedAt { get; set; }

        public long PostId { get; set; }
    }
}
