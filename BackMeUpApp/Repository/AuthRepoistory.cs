using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using BackMeUpApp.DomainModel;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Neo4jClient;

namespace BackMeUpApp.Repository
{
    public class AuthRepoistory : IAuthRepository
    {
        private readonly IGraphClient _client;

        public AuthRepoistory(IGraphClient client)
        {
            this._client = client;
        }

        public async Task<User> CreateAccount(User user, string password)
        {
            byte[] salt = new byte[128 / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));

            user.PasswordHash = hashed;
            user.PasswordSalt = Convert.ToBase64String(salt);

             IEnumerable<User> ret = await this._client.Cypher.Create("(m:User {params})").WithParam("params", user).Return<User>("m").ResultsAsync;
            return ret.First();
        }

  

        public async Task<User> Login(string username,string password)
        {

            IEnumerable<User> user = await this._client.Cypher.Match("(m:User)").Where((User m) => m.Username == username).Return<User>("m").ResultsAsync;
            if (user.Count() == 0)
                return null;
            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
             password: password,
             salt: Convert.FromBase64String(user.First().PasswordSalt),
             prf: KeyDerivationPrf.HMACSHA1,
             iterationCount: 10000,
             numBytesRequested: 256 / 8));

            if (hashed != user.First().PasswordHash)
                return null;

            return user.First();
        }

     

        public async Task<bool> UserExists(string username)
        {
            IEnumerable<User> user = await this._client.Cypher.Match("(m:User)").Where((User m) => m.Username == username).Return<User>("m").ResultsAsync;
            if (user.Count() == 0)
                return false;
            return true; 
        }
    }
}
