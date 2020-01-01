using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackMeUpApp.DTOs
{
    public class FiltersDto
    {
        public String Requester { get; set; }
        public String Tag { get; set; }
        public String CreatedBy { get; set; }
        public String Filter { get; set; }
        public String Page { get; set; }
    }
}
