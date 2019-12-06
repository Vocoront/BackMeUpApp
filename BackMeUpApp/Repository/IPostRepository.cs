﻿using BackMeUpApp.DomainModel;
using BackMeUpApp.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackMeUpApp.Repository
{
    public interface IPostRepository
    {
        Task<IEnumerable<PostWithCreatorDto>> GetPostsAsync();
        Task<Post> GetPostAsync();
        Task<Post> AddPostAsync(Post post,string username);
            


    }
}
