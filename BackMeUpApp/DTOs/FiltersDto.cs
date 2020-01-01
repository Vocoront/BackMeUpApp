using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackMeUpApp.DTOs
{
    public class FiltersDto
    {
        //public String Tag { get; set; }
        //public String CreatedBy { get; set; }
        public String Filter { get; set; }
        public String Order { get; set; }
        public int Page { get; set; }
        public int Limit { get; set; }
    }
}
