using BackMeUpApp.Services;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackMeUpApp.Hubs
{
    public class MessageHub:Hub
    {

        private readonly NotificationService _ns;
        public MessageHub(NotificationService ns)
        {
            _ns = ns;
        }
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public string GetConnectionId()
        {
            return Context.ConnectionId;
        }

        public async Task AddGroups(string[] groups)
        {
            foreach(string i in groups)
            {
                await this.Groups.AddToGroupAsync(this.Context.ConnectionId, i);
            }
        }
        
        public async Task RemoveFromGroup(string groupname)
        {
            await this.Groups.RemoveFromGroupAsync(this.Context.ConnectionId, groupname);
        }

        public async Task MessageRecived(string key,string username)
        {
            _ns.RecivedNotification(key, username);


        }
    }
}
