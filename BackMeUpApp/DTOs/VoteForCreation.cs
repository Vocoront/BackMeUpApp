using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackMeUpApp.DTOs
{
    public class VoteForCreation
    {
        public int IdPosta { get; set; }
        public string Username { get; set; }
        public bool isLeft { get; set; }
        
    }
}
