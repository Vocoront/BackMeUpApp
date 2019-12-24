using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackMeUpApp.Hubs
{
    public class MessageHub:Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task AddGroups(string[] groups)
        {
            foreach(string i in groups)
            {
                await this.Groups.AddToGroupAsync(this.Context.ConnectionId, i);
            }
        }
    }
}
