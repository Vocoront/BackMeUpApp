using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackMeUpApp.DTOs
{
    public class FiltersDto
    {
        public String Filter { get; set; }
        public String Order { get; set; }
        public int Page { get; set; }
        public int Limit { get; set; }
        public string Period { get; set; }
    }
}
