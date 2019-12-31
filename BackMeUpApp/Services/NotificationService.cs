using BackMeUpApp.DomainModel;
using BackMeUpApp.DTOs;
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
        public async void SendNotification(NotificationMessageDto msg)
        {
            var query = _client.Cypher.Match("(p)-[:Follow]-(u:User)")
                .Where("id(p)=" + msg.PostId)
                .With("u.Username as name")
                .Return((name) => new
                {
                    Users = name.CollectAsDistinct<String>()
                });
            var users = await query.ResultsAsync;
            if (users.First().Users.Count() == 0)
                return;
            var key = _rms.GenerateKeyWithPrefix(msg.PostId.ToString());
            string msgKey = _rms.CreateSetMessage(key, users.First().Users);
           
            string hashKey = _rms.CreateHashMessage(key, msg);
            await _hubContext.Clients.Group(msg.PostId.ToString()).SendAsync("ReceiveMessage", new { msg, key });
        }
        public async void SendNotification(string notification,DateTime createdAt,string username,int idOfNode)
        {
            var query = _client.Cypher.Match("(p)-[:Follow]-(u:User)")
                .Where("id(p)=" + idOfNode)
                .With("u.Username as name")
                .Return((name) => new
                {
                    Users = name.CollectAsDistinct<String>()
                });
            var users = await query.ResultsAsync;
            if (users.First().Users.Count() == 0)
                return;
            var key = _rms.GenerateKeyWithPrefix(idOfNode.ToString());
            string msgKey=_rms.CreateSetMessage(key, users.First().Users);
            var msg = new DTOs.NotificationMessageDto
            {
                Message = notification,
                CreatedAt = createdAt,
                Creator = username
            };
            string hashKey = _rms.CreateHashMessage(key,msg);
            await _hubContext.Clients.Group(idOfNode.ToString()).SendAsync("ReceiveMessage",new { msg,key});
        }

        public async void CheckForNotification(string connectionId,string username,IEnumerable<string> ids)
        {
            foreach(string nodeId in ids)
            {
                IEnumerable<string> keys = _rms.GetKeysSubscribers(nodeId);
                foreach(string key in keys)
                {
                    if (_rms.IsSetMember(key, username))
                    {
                        var keyOriginal = key.Replace(":"+_rms.SubPostfix, "");
                        var msg = _rms.GetDataForMessage(keyOriginal);
                        msg.PostId = int.Parse(nodeId);
                         _hubContext.Clients.Clients(connectionId).SendAsync("ReceiveMessage", new { msg, key=keyOriginal });

                    }
                }
            }
        }

        public void RecivedNotification(string key,string username)
        {
            // brisemo korisnika iz set-a, kad set ostane bez vrednosti on se automatski brise. 
            //Ako set ne postoji to znaci da su svi korsicni primili obavestenje
            //i mozemo da obrisemo poruku koju cuvamo kao hash
            _rms.RemoveItemFromSet(key, username);
            if (!_rms.SetExists(key))
            {
                _rms.RemoveHashMessage(key);
            }

        }
    }


}
