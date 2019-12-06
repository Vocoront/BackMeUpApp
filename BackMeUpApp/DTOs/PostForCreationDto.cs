﻿using BackMeUpApp.DomainModel;
using Neo4jClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackMeUpApp.DTOs
{
    public class PostForCreationDto
    {
        public string Username { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
    }
}
