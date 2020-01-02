using BackMeUpApp.DTOs;
using ServiceStack.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackMeUpApp.Services
{
    public class RedisMessageService
    {
        private readonly IRedisClient _redis;
        private int ttl;//time to live for keys in seconds
        private string redisns;//izgled kljuceva: {redisns}:key-value:globalId:(subpfx|msgpfx)
        public string SubPostfix { get; private set; }
        public string MsgPostfix { get; private set; }
        private string globalCounterKey = "next.message.id";

        public RedisMessageService(IRedisClientsManager rcm)
        {
            
            _redis = rcm.GetClient();
            ttl = 60 * 60;
            redisns = "backmeup";
            SubPostfix = "subscribers";
            MsgPostfix = "message";
            if (!CheckNextMessageGlobalCounterExists())
            {
                _redis.Set<int>(globalCounterKey, 1);
            }
        }
        private string GetNextMessageId()
        {
            var id=_redis.Increment(globalCounterKey, 1);
            return _redis.Get<string>(globalCounterKey);
        }
        private bool CheckNextMessageGlobalCounterExists()
        {
            var test = _redis.Get<object>(globalCounterKey);
            return (test != null) ? true : false;
        }
        public IEnumerable<String> GetKeysSubscribers(string idOfNode)
        {
            var keyPattern = $"{this.redisns}:{idOfNode}:*:"+SubPostfix;
            var pom= _redis.GetKeysByPattern(keyPattern);
            return pom;
        }
        public string GenerateKeyWithPrefix(string keyParticle)
        {
            return this.redisns + ":" + keyParticle + ":" + this.GetNextMessageId(); ;
        }
        public string CreateHashMessage(string key,NotificationMessageDto msg)
        {
            //pamtimo notifikaciju koju treba da saljemo korisnicima
            string hashKey = key + ":"+MsgPostfix;
            _redis.SetEntryInHash(hashKey,"message",msg.Message);
            _redis.SetEntryInHash(hashKey, "createdAt", msg.CreatedAt.ToString());
            _redis.SetEntryInHash(hashKey, "creator", msg.Creator);
            TimeSpan timeSpan = new TimeSpan(0, 0, ttl);
            _redis.ExpireEntryIn(hashKey,timeSpan);
            return hashKey;
        }
        public string CreateSetMessage(string key,IEnumerable<String> usernames)
        {
            //koristimo da pamtimo koji korisnici nisi dobili obavestenje
            string setKey = key + ":"+SubPostfix;
            //foreach (string i in usernames)
            //    _redis.AddItemToSet(setKey, i);
            _redis.AddRangeToSet(setKey, usernames.ToList());
            TimeSpan timeSpan = new TimeSpan(0, 0, ttl);
            _redis.ExpireEntryIn(setKey, timeSpan);
            return setKey;
        }
        private string GetKeyType(string key)
        {
            return _redis.Type(key);
        }
        public bool IsSetMember(string key,string username)
        {
            string type = GetKeyType(key);
            if(type.Equals("set"))
               return _redis.SetContainsItem(key, username);
            else
                return false;
        }
        public void RemoveItemFromSet(string key,string username)
        {
            var fullKey = key + ":"+SubPostfix;
            string keyType = GetKeyType(fullKey);
            if(keyType.Equals("set"))
                _redis.RemoveItemFromSet(fullKey, username);
        }

        public void RemoveHashMessage(string key)
        {
            var fullKey = key + ":" + MsgPostfix;
            ((IRedisNativeClient)_redis).Del(fullKey);

        }
        public void DeleteKey(string key)
        {
            ((IRedisNativeClient)_redis).Del(key);
        }

        public bool SetExists(string key)
        {
            var fullKey = key + ":" + SubPostfix;
            return _redis.ContainsKey(fullKey);
        }
        public NotificationMessageDto GetDataForMessage(string key)
        {
            var fullKey = key + ":" + MsgPostfix;
            Dictionary<String,String> data = _redis.GetAllEntriesFromHash(fullKey);

            return new NotificationMessageDto
            {
                Message = data["message"],
                CreatedAt = DateTime.Parse(data["createdAt"]).ToUniversalTime(),
                Creator = data["creator"]
            };
        }
    }
}
