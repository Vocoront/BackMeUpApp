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
    public class UserRepoistory : IUserRepository
    {
        private readonly IGraphClient _client;

        public UserRepoistory(IGraphClient client)
        {
            this._client = client;
        }

        private string CreateHash(string password,byte[] salt)
        {
            return Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));
        }

        public async Task<User> CreateAccount(User user, string password)
        {
            byte[] salt = new byte[128 / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            user.PasswordHash = this.CreateHash(password,salt);
            user.PasswordSalt = Convert.ToBase64String(salt);

            IEnumerable<User> ret = await this._client.Cypher.Create("(m:User {params})").WithParam("params", user).Return<User>("m").ResultsAsync;
            return ret.First();
        }

  

        public async Task<User> Login(string username,string password)
        {

            IEnumerable<User> user = await this._client.Cypher.Match("(m:User)").Where((User m) => m.Username == username).Return<User>("m").ResultsAsync;
            if (user.Count() == 0)
                return null;
            string hashed = CreateHash(password, Convert.FromBase64String(user.First().PasswordSalt));
            if (hashed != user.First().PasswordHash)
                return null;

            return user.First();
        }

     

        public async Task<bool> UsernameExists(string username)
        {
            IEnumerable<User> user = await this._client.Cypher.Match("(m:User)").Where((User m) => m.Username == username).Return<User>("m").ResultsAsync;
            if (user.Count() == 0)
                return false;
            return true; 
        }
        public async Task<bool> UsernameAndEmailExists(string username,string email)
        {
            IEnumerable<User> user = await this._client.Cypher.Match("(m:User)").Where((User m) => m.Username == username ||m.Email== email).Return<User>("m").ResultsAsync;
            if (user.Count() == 0)
                return false;
            return true;
        }

        public async  Task<IEnumerable<string>> GetSubscriptions(string username)
        {
            var query = this._client.Cypher.Match("(u:User)").Where((User u) => u.Username == username).Match("(u)-[f:Follow]-(p)").With("id(p) as idp").Return((idp) =>
              new
              {
                  SubscriptionId = idp.CollectAsDistinct<String>()
              });
            var result = await query.ResultsAsync;
            List<String> subIds = new List<string>();
            foreach(string i in result.First().SubscriptionId)
            {
                subIds.Add(i);
            }
            return subIds;

        }

        public async Task AddSubscription(string username, string id)
        {
            var query = this._client.Cypher.Match("(u:User)").Where((User u) => u.Username == username)
                .Match("(p)")
                .Where("id(p)=" + id)     
                .Create("(u)-[f:Follow]->(p)");

            await query.ExecuteWithoutResultsAsync();
          
        }
    }
}
