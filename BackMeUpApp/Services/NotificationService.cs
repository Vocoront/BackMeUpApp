using BackMeUpApp.DomainModel;
using BackMeUpApp.Hubs;
using Microsoft.AspNetCore.SignalR;
using Neo4jClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackMeUpApp.Services
{
    public class NotificationService
    {
        private readonly RedisMessageService _rms;
        private readonly IGraphClient _client;
        private readonly IHubContext<MessageHub> _hubContext;

        public NotificationService(IGraphClient client, RedisMessageService redisMessageService,IHubContext<MessageHub> hubContext)
        {
            _client = client;
            _rms = redisMessageService;
            _hubContext = hubContext;
        }

        public async void SendNotification(string notification,DateTime createdAt,int idOfNode)
        {
            var query = _client.Cypher.Match("(p)-[:Choice]-(u:User)")
                .Where("id(p)=" + idOfNode)
                .With("u.Username as name")
                .Return((name) => new
                {
                    Users = name.CollectAsDistinct<String>()
                });
            var users = await query.ResultsAsync;
            string usersSubscribed = "";
            foreach(string i in users.First().Users)
            {
                usersSubscribed += i + ":";
            }

            string messageKey=_rms.CreateHashMessage(idOfNode.ToString(),new DTOs.NotificationMessage { Message=notification,CreatedAt=createdAt,Subscribers=usersSubscribed });
             

            // svakom korisniku posaljemo messageKey, i poruku, a on kad dobije da odgovri, a kad primimo odgovor izbrisemo njegov id iz Subscribers

        }
    }
}
