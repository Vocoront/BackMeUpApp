using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackMeUpApp.DTOs
{
    public class NotificationMessage
    {
        public String Message { get; set; }
        public DateTime CreatedAt { get; set; }
        public String Subscribers { get; set; }
    }
}
