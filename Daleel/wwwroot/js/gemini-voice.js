/**
 * Daleel AI – Voice Chat (Stub / Placeholder)
 * 
 * This file is a placeholder for the Gemini Live Voice integration.
 * The voice button (#daleel-voice-btn) is wired here to show a
 * user-friendly "coming soon" tooltip until the voice feature is enabled.
 *
 * To activate full voice chat, replace this file with the Gemini
 * Live WebSocket implementation using ephemeral tokens from /api/gemini/token.
 */
(function () {
    'use strict';

    const voiceBtn    = document.getElementById('daleel-voice-btn');
    const voiceStatus = document.getElementById('daleel-voice-status');

    if (!voiceBtn) return;

    voiceBtn.addEventListener('click', () => {
        if (voiceStatus) {
            voiceStatus.textContent = 'Voice chat coming soon…';
            voiceStatus.style.opacity = '1';
            setTimeout(() => {
                voiceStatus.style.opacity = '0';
            }, 3000);
        }
    });
})();
