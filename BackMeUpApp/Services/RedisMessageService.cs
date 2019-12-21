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
        private string redisns;//redisns:keys
        private string globalCounterKey = "next.message.id";

        public RedisMessageService(string host,string port)
        {

            _redis = new RedisClient($"{host}:{port}");
            ttl = 60 * 60;
            redisns = "backmeup";
            if (!CheckNextMessageGlobalCounterExists())
            {
                _redis.Set<string>(globalCounterKey, "1");
            }
        }

        public string GetNextMessageId()
        {
            var id=_redis.Increment(globalCounterKey, 1);

            return _redis.Get<string>(globalCounterKey);
        }


        public bool CheckNextMessageGlobalCounterExists()
        {
            var test = _redis.Get<object>(globalCounterKey);
            return (test != null) ? true : false;
        }

        public string CreateHashMessage(string key,NotificationMessage msg)
        {
            string hashKey = this.redisns + ":" + key + ":" + this.GetNextMessageId();
            _redis.SetEntryInHash(hashKey,"message",msg.Message);
            _redis.SetEntryInHash(hashKey, "createdAt", msg.CreatedAt.ToString());
            _redis.SetEntryInHash(hashKey, "usersSubscribed", msg.Subscribers);
            TimeSpan timeSpan = new TimeSpan(0, 0, ttl);

            _redis.ExpireEntryIn(hashKey,timeSpan);
            return hashKey;
        }

        public void DeleteHashMessage(string key)
        {
            ((IRedisNativeClient)_redis).Del(key);
        }

        public IEnumerable<String> GetMessages(string key)
        {

            IEnumerable<String> kljucevi = _redis.GetKeysByPattern(this.redisns + ":"+key+":*");
            return kljucevi;
        }

        public NotificationMessage GetDataForMessage(string key)
        {
            Dictionary<String,String> data = _redis.GetAllEntriesFromHash(key);

            return new NotificationMessage
            {
                Message = data["message"],
                CreatedAt = DateTime.Parse(data["createdAt"]).ToUniversalTime(),
                Subscribers = data["usersSubscribed"]
            };
        }
    }
}
