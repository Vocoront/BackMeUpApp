using BackMeUpApp.DomainModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackMeUpApp.Repository
{
    public interface IAuthRepository
    {
        Task<User> Login(string username,string password);
        Task<User> CreateAccount(User user, string password);
        Task<bool> UsernameExists(string username);
        Task<bool> UsernameAndEmailExists(string username,string email);


    }
}
