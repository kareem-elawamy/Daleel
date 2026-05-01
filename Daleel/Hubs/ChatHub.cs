using Daleel.BAL.Models;
using Daleel.BAL.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Daleel.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IGeminiService _geminiService;

        public ChatHub(IGeminiService geminiService)
        {
            _geminiService = geminiService;
        }

        public async Task SendMessage(string message, string mode, List<ChatMessageDto> history)
        {
            if (string.IsNullOrWhiteSpace(message))
                return;

            if (mode == "Human")
            {
                await Clients.All.SendAsync("ReceiveMessage", new { Role = "User", Content = message, Timestamp = DateTime.UtcNow });
            }
            else
            {
                try
                {
                    var aiResponse = await _geminiService.GetChatResponseAsync(message, history);
                    await Clients.Caller.SendAsync("ReceiveMessage", new { Role = "AI", Content = aiResponse, Timestamp = DateTime.UtcNow });
                }
                catch (Exception ex)
                {
                    await Clients.Caller.SendAsync("ReceiveError", ex.Message);
                }
            }
        }
    }
}
