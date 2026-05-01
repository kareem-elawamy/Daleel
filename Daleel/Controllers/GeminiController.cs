using Daleel.BAL.Models;
using Daleel.BAL.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Daleel.Controllers
{
    /// <summary>
    /// HTTP fallback endpoint for Gemini AI chat.
    /// Used when the SignalR connection is unavailable.
    /// </summary>
    [Route("api/gemini")]
    [ApiController]
    public class GeminiController : ControllerBase
    {
        private readonly IGeminiService _geminiService;

        public GeminiController(IGeminiService geminiService)
        {
            _geminiService = geminiService;
        }

        [HttpPost("chat")]
        public async Task<IActionResult> Chat([FromBody] ChatRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
                return BadRequest(new { error = "Message cannot be empty." });

            var reply = await _geminiService.GetChatResponseAsync(request.Message, request.History ?? new List<ChatMessageDto>());
            return Ok(new { reply });
        }
    }

    public class ChatRequest
    {
        public string Message { get; set; } = string.Empty;
        public List<ChatMessageDto>? History { get; set; }
    }
}
