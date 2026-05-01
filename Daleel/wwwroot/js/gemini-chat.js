/**
 * Daleel AI – SignalR Chat Client
 * Connects to /chathub, sends messages (with session history) to the
 * GeminiService, and renders AI or Human responses into the chat UI.
 */
(function () {
    'use strict';

    // ─── State ────────────────────────────────────────────────────────────────
    const chatHistory = [];   // { Role: 'user'|'AI', Content: string }
    let hubConnection = null;
    let isConnected = false;
    let isTyping = false;

    // ─── DOM refs ─────────────────────────────────────────────────────────────
    const messagesEl = document.getElementById('daleel-chat-messages');
    const form       = document.getElementById('daleel-chat-form');
    const input      = document.getElementById('daleel-chat-input');
    const sendBtn    = document.getElementById('daleel-chat-send');
    const chips      = document.querySelectorAll('.daleel-chat-chip');

    if (!messagesEl || !form || !input) return; // guard – not on this page

    // ─── Welcome message ──────────────────────────────────────────────────────
    appendMessage('AI', 'Hello! I\'m **Daleel AI**, your strategic intelligence assistant. Ask me about global markets, trade corridors, supply chains, or economic outlooks. How can I help?');

    // ─── Build SignalR connection ─────────────────────────────────────────────
    function buildConnection() {
        hubConnection = new signalR.HubConnectionBuilder()
            .withUrl('/chathub')
            .withAutomaticReconnect([0, 2000, 5000, 10000])
            .configureLogging(signalR.LogLevel.Warning)
            .build();

        hubConnection.on('ReceiveMessage', (msg) => {
            removeTypingIndicator();
            appendMessage(msg.Role, msg.Content);
            chatHistory.push({ Role: msg.Role, Content: msg.Content });
        });

        hubConnection.on('ReceiveError', (error) => {
            removeTypingIndicator();
            appendError('An error occurred. Please try again.');
            console.error('[Daleel Chat] Hub error:', error);
        });

        hubConnection.onreconnecting(() => {
            isConnected = false;
            appendSystemNote('Reconnecting…');
        });

        hubConnection.onreconnected(() => {
            isConnected = true;
            appendSystemNote('Reconnected.');
        });

        hubConnection.onclose(() => {
            isConnected = false;
        });
    }

    async function startConnection() {
        buildConnection();
        try {
            await hubConnection.start();
            isConnected = true;
        } catch (err) {
            console.warn('[Daleel Chat] SignalR failed to connect, will use HTTP fallback.', err);
            isConnected = false;
        }
    }

    startConnection();

    // ─── Form submission ──────────────────────────────────────────────────────
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text || isTyping) return;

        input.value = '';
        appendMessage('user', text);
        chatHistory.push({ Role: 'user', Content: text });
        hideChips();
        showTypingIndicator();
        setSendState(true);

        if (isConnected) {
            try {
                await hubConnection.invoke('SendMessage', text, 'AI', chatHistory.slice(0, -1));
            } catch (err) {
                removeTypingIndicator();
                appendError('Failed to send message. Please refresh and try again.');
                console.error('[Daleel Chat]', err);
                setSendState(false);
            }
        } else {
            // HTTP fallback – POST directly to Gemini via a simple API endpoint
            try {
                const res = await fetch('/api/gemini/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: text, history: chatHistory.slice(0, -1) })
                });
                const data = await res.json();
                removeTypingIndicator();
                const reply = data.reply || 'Sorry, I could not generate a response.';
                appendMessage('AI', reply);
                chatHistory.push({ Role: 'AI', Content: reply });
            } catch (err) {
                removeTypingIndicator();
                appendError('Failed to reach the AI service. Please try again later.');
            }
            setSendState(false);
        }
    });

    // ─── Quick-suggestion chips ───────────────────────────────────────────────
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const query = chip.dataset.query || chip.textContent.trim();
            input.value = query;
            form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        });
    });

    // ─── Render helpers ───────────────────────────────────────────────────────
    function appendMessage(role, content) {
        const isAI = role === 'AI' || role === 'model';
        const wrapper = document.createElement('div');
        wrapper.className = `flex items-end gap-2 mb-3 ${isAI ? '' : 'justify-end'}`;

        const bubble = document.createElement('div');
        bubble.className = isAI
            ? 'max-w-[85%] bg-slate-100 dark:bg-[#112240] text-brand-navy dark:text-white text-sm font-[\'Inter\'] rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm leading-relaxed'
            : 'max-w-[85%] bg-[#00B2EC] text-white text-sm font-[\'Inter\'] rounded-2xl rounded-br-sm px-4 py-3 shadow-sm leading-relaxed';

        // Basic markdown: bold, code, line breaks
        bubble.innerHTML = formatContent(content);

        if (isAI) {
            const avatar = document.createElement('div');
            avatar.className = 'shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-[#00B2EC] to-[#0a8fb8] flex items-center justify-center shadow mb-0.5';
            avatar.innerHTML = '<span class="material-symbols-outlined text-white text-[14px]" style="font-variation-settings: \'FILL\' 1;">psychology</span>';
            wrapper.appendChild(avatar);
            wrapper.appendChild(bubble);
        } else {
            wrapper.appendChild(bubble);
        }

        // Animate in
        wrapper.style.opacity = '0';
        wrapper.style.transform = 'translateY(8px)';
        messagesEl.appendChild(wrapper);
        requestAnimationFrame(() => {
            wrapper.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            wrapper.style.opacity = '1';
            wrapper.style.transform = 'translateY(0)';
        });

        scrollToBottom();
    }

    function appendError(msg) {
        const el = document.createElement('p');
        el.className = 'text-center text-[11px] text-red-400 py-1';
        el.textContent = msg;
        messagesEl.appendChild(el);
        scrollToBottom();
        setSendState(false);
    }

    function appendSystemNote(msg) {
        const el = document.createElement('p');
        el.className = 'text-center text-[10px] text-slate-400 py-1 italic';
        el.textContent = msg;
        messagesEl.appendChild(el);
        scrollToBottom();
    }

    function showTypingIndicator() {
        isTyping = true;
        const el = document.createElement('div');
        el.id = 'daleel-typing';
        el.className = 'flex items-end gap-2 mb-3';
        el.innerHTML = `
            <div class="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-[#00B2EC] to-[#0a8fb8] flex items-center justify-center shadow mb-0.5">
                <span class="material-symbols-outlined text-white text-[14px]" style="font-variation-settings: 'FILL' 1;">psychology</span>
            </div>
            <div class="bg-slate-100 dark:bg-[#112240] rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div class="flex gap-1 items-center h-4">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#00B2EC] animate-bounce" style="animation-delay:0ms"></span>
                    <span class="w-1.5 h-1.5 rounded-full bg-[#00B2EC] animate-bounce" style="animation-delay:150ms"></span>
                    <span class="w-1.5 h-1.5 rounded-full bg-[#00B2EC] animate-bounce" style="animation-delay:300ms"></span>
                </div>
            </div>`;
        messagesEl.appendChild(el);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        isTyping = false;
        const el = document.getElementById('daleel-typing');
        if (el) el.remove();
        setSendState(false);
    }

    function hideChips() {
        const chipsContainer = document.getElementById('daleel-chat-chips');
        if (chipsContainer) {
            chipsContainer.style.transition = 'opacity 0.3s';
            chipsContainer.style.opacity = '0';
            setTimeout(() => chipsContainer.style.display = 'none', 300);
        }
    }

    function setSendState(disabled) {
        if (sendBtn) sendBtn.disabled = disabled;
    }

    function scrollToBottom() {
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    /**
     * Minimal markdown formatting:
     * - **bold** → <strong>
     * - `code` → <code>
     * - Newlines → <br>
     */
    function formatContent(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/`([^`]+)`/g, '<code class="bg-black/10 dark:bg-white/10 px-1 rounded text-[12px]">$1</code>')
            .replace(/\n/g, '<br>');
    }

})();
