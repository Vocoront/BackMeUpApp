using BackMeUpApp.DomainModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackMeUpApp.Repository
{
    public interface IPostRepository
    {
            Task<Post> addPost();
            


    }
}
