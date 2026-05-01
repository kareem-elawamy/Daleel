/**
 * Daleel AI – SignalR Chat Client
 * Loaded at the bottom of Index.cshtml via @section Scripts.
 * At this point the DOM is fully parsed, SignalR is already loaded,
 * so we initialize immediately without any event wrapper.
 */
(function () {
    'use strict';

    // ─── DOM refs ─────────────────────────────────────────────────────────────
    var messagesEl = document.getElementById('daleel-chat-messages');
    var form       = document.getElementById('daleel-chat-form');
    var input      = document.getElementById('daleel-chat-input');
    var sendBtn    = document.getElementById('daleel-chat-send');
    var chips      = document.querySelectorAll('.daleel-chat-chip');

    // Guard – only run if the chat widget exists on this page
    if (!messagesEl || !form || !input) return;

    // ─── State ────────────────────────────────────────────────────────────────
    var chatHistory   = [];
    var hubConnection = null;
    var isConnected   = false;
    var isTyping      = false;

    // ══════════════════════════════════════════════════════════════
    //  RENDER HELPERS
    // ══════════════════════════════════════════════════════════════

    function formatContent(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/`([^`]+)`/g, '<code style="background:rgba(0,0,0,.08);padding:1px 4px;border-radius:3px;font-size:12px">$1</code>')
            .replace(/\n/g, '<br>');
    }

    function scrollToBottom() {
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function setSendState(disabled) {
        if (sendBtn) sendBtn.disabled = !!disabled;
    }

    function appendMessage(role, content) {
        var isAI = (role === 'AI' || role === 'model');
        var wrapper = document.createElement('div');
        wrapper.style.cssText = 'display:flex;align-items:flex-end;gap:8px;margin-bottom:12px;' + (isAI ? '' : 'justify-content:flex-end;');

        if (isAI) {
            var avatar = document.createElement('div');
            avatar.style.cssText = 'flex-shrink:0;width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#00B2EC,#0a8fb8);display:flex;align-items:center;justify-content:center;margin-bottom:2px;box-shadow:0 1px 3px rgba(0,178,236,.3)';
            avatar.innerHTML = '<span class="material-symbols-outlined" style="color:#fff;font-size:14px;font-variation-settings:\'FILL\' 1">psychology</span>';
            wrapper.appendChild(avatar);
        }

        var bubble = document.createElement('div');
        bubble.style.cssText = [
            'max-width:85%',
            'font-size:14px',
            'line-height:1.6',
            'padding:10px 14px',
            'box-shadow:0 1px 2px rgba(0,0,0,.06)',
            isAI
                ? 'background:var(--chat-ai-bg,#f1f5f9);color:var(--chat-ai-text,#0f172a);border-radius:1rem 1rem 1rem .25rem;'
                : 'background:#00B2EC;color:#fff;border-radius:1rem 1rem .25rem 1rem;'
        ].join(';');

        bubble.innerHTML = formatContent(content);
        wrapper.appendChild(bubble);

        wrapper.style.opacity = '0';
        wrapper.style.transform = 'translateY(8px)';
        wrapper.style.transition = 'opacity .3s ease, transform .3s ease';
        messagesEl.appendChild(wrapper);

        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                wrapper.style.opacity = '1';
                wrapper.style.transform = 'translateY(0)';
            });
        });
        scrollToBottom();
    }

    function appendError(msg) {
        var el = document.createElement('p');
        el.style.cssText = 'text-align:center;font-size:11px;color:#f87171;padding:4px 0';
        el.textContent = msg;
        messagesEl.appendChild(el);
        scrollToBottom();
        setSendState(false);
    }

    function appendSystemNote(msg) {
        var el = document.createElement('p');
        el.style.cssText = 'text-align:center;font-size:10px;color:#94a3b8;padding:2px 0;font-style:italic';
        el.textContent = msg;
        messagesEl.appendChild(el);
        scrollToBottom();
    }

    function showTypingIndicator() {
        isTyping = true;
        var el = document.createElement('div');
        el.id = 'daleel-typing';
        el.style.cssText = 'display:flex;align-items:flex-end;gap:8px;margin-bottom:12px;';
        el.innerHTML =
            '<div style="flex-shrink:0;width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#00B2EC,#0a8fb8);display:flex;align-items:center;justify-content:center;margin-bottom:2px">' +
                '<span class="material-symbols-outlined" style="color:#fff;font-size:14px;font-variation-settings:\'FILL\' 1">psychology</span>' +
            '</div>' +
            '<div style="background:var(--chat-ai-bg,#f1f5f9);border-radius:1rem 1rem 1rem .25rem;padding:10px 14px;box-shadow:0 1px 2px rgba(0,0,0,.06)">' +
                '<div style="display:flex;gap:4px;align-items:center;height:16px">' +
                    '<span class="animate-bounce" style="width:6px;height:6px;border-radius:50%;background:#00B2EC;display:inline-block;animation-delay:0ms"></span>' +
                    '<span class="animate-bounce" style="width:6px;height:6px;border-radius:50%;background:#00B2EC;display:inline-block;animation-delay:150ms"></span>' +
                    '<span class="animate-bounce" style="width:6px;height:6px;border-radius:50%;background:#00B2EC;display:inline-block;animation-delay:300ms"></span>' +
                '</div>' +
            '</div>';
        messagesEl.appendChild(el);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        isTyping = false;
        var el = document.getElementById('daleel-typing');
        if (el) el.remove();
        setSendState(false);
    }

    function hideChips() {
        var c = document.getElementById('daleel-chat-chips');
        if (!c) return;
        c.style.transition = 'opacity .3s';
        c.style.opacity = '0';
        setTimeout(function () { c.style.display = 'none'; }, 300);
    }

    // ══════════════════════════════════════════════════════════════
    //  CORE SEND LOGIC
    // ══════════════════════════════════════════════════════════════

    function sendMessage(text) {
        text = (text || '').trim();
        if (!text || isTyping) return;

        input.value = '';
        appendMessage('user', text);
        chatHistory.push({ Role: 'user', Content: text });
        hideChips();
        showTypingIndicator();
        setSendState(true);

        var historySnapshot = chatHistory.slice(0, -1);

        if (isConnected && hubConnection) {
            hubConnection.invoke('SendMessage', text, 'AI', historySnapshot)
                .catch(function (err) {
                    removeTypingIndicator();
                    appendError('Failed to send. Please try again.');
                    console.error('[Daleel Chat]', err);
                });
        } else {
            // HTTP fallback
            fetch('/api/gemini/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, history: historySnapshot })
            })
            .then(function (res) { return res.json(); })
            .then(function (data) {
                removeTypingIndicator();
                var reply = data.reply || 'Sorry, I could not generate a response.';
                appendMessage('AI', reply);
                chatHistory.push({ Role: 'AI', Content: reply });
            })
            .catch(function () {
                removeTypingIndicator();
                appendError('Failed to reach the AI service. Please try again later.');
            });
        }
    }

    // ══════════════════════════════════════════════════════════════
    //  EVENT LISTENERS  (registered immediately, independent of SignalR)
    // ══════════════════════════════════════════════════════════════

    // Intercept form submit – prevent any navigation
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        e.stopPropagation();
        sendMessage(input.value);
        return false;
    });

    // Send button explicit click (belt-and-suspenders)
    if (sendBtn) {
        sendBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            sendMessage(input.value);
        });
    }

    // Enter key in input
    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input.value);
        }
    });

    // Quick-suggestion chips
    chips.forEach(function (chip) {
        chip.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            sendMessage(chip.dataset.query || chip.textContent);
        });
    });

    // ══════════════════════════════════════════════════════════════
    //  SIGNALR CONNECTION (optional enhancement – HTTP fallback always active)
    // ══════════════════════════════════════════════════════════════

    if (typeof signalR !== 'undefined') {
        hubConnection = new signalR.HubConnectionBuilder()
            .withUrl('/chathub')
            .withAutomaticReconnect([0, 2000, 5000, 10000])
            .configureLogging(signalR.LogLevel.Warning)
            .build();

        hubConnection.on('ReceiveMessage', function (msg) {
            removeTypingIndicator();
            appendMessage(msg.Role, msg.Content);
            chatHistory.push({ Role: msg.Role, Content: msg.Content });
        });

        hubConnection.on('ReceiveError', function (err) {
            removeTypingIndicator();
            appendError('An error occurred. Please try again.');
            console.error('[Daleel Chat] Hub error:', err);
        });

        hubConnection.onreconnecting(function () { isConnected = false; appendSystemNote('Reconnecting…'); });
        hubConnection.onreconnected(function ()  { isConnected = true;  appendSystemNote('Reconnected.'); });
        hubConnection.onclose(function ()        { isConnected = false; });

        hubConnection.start()
            .then(function ()  { isConnected = true; })
            .catch(function (e) { isConnected = false; console.warn('[Daleel Chat] Hub unavailable – HTTP fallback active.', e); });
    } else {
        console.warn('[Daleel Chat] SignalR not found – HTTP fallback active.');
    }

    // ══════════════════════════════════════════════════════════════
    //  WELCOME MESSAGE
    // ══════════════════════════════════════════════════════════════
    appendMessage('AI', 'Hello! I\'m **Daleel AI**, your strategic intelligence assistant. Ask me about global markets, trade corridors, supply chains, or economic outlooks. How can I help?');

}());
