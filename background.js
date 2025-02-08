async function createOrUpdatePopup(tabId, summaryText) {
  function displayPopup(text) {
    const existingContent = document.getElementById('tldr-modal-content');
    if (existingContent) {
      existingContent.innerHTML = '<div class="markdown">' + text + '</div>';
      return;
    }
    const style = document.createElement('style');
    style.textContent = `
      @keyframes modalFadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      
      .tldr-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(4px);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: modalFadeIn 0.2s ease-out;
      }
      
      .tldr-modal {
        background: #ffffff;
        border-radius: 16px;
        max-width: min(800px, 80%);
        max-height: 80vh;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        border: 1px solid rgba(0, 0, 0, 0.1);
        position: relative;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .tldr-modal-content {
        flex: 1;
        overflow-y: auto;
        padding: 25px 25px 15px;
      }
      
      .tldr-modal-content::-webkit-scrollbar {
        width: 8px;
      }
      
      .tldr-modal-content::-webkit-scrollbar-track {
        background: transparent;
      }
      
      .tldr-modal-content::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 4px;
      }

      .tldr-modal-footer {
        padding: 15px 25px;
        background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(249,250,251,1) 15%);
        border-top: 1px solid rgba(0,0,0,0.05);
        display: flex;
        justify-content: center;
        position: relative;
      }
      
      .tldr-modal-footer::before {
        content: '';
        position: absolute;
        top: -20px;
        left: 0;
        right: 0;
        height: 20px;
        background: linear-gradient(to bottom, rgba(255,255,255,0), #fff);
        pointer-events: none;
      }
      
      @keyframes modalFadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.95); }
      }

      .tldr-modal-close {
        padding: 10px 32px;
        font-size: 14px;
        color: #fff;
        background: #3b82f6;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-weight: 500;
      }
      
      .tldr-modal-close:hover {
        background: #2563eb;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      }

      .tldr-modal-close::before {
        content: "ESC";
        font-size: 10px;
        padding: 3px 5px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        margin-right: 4px;
      }
      
      .markdown {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        white-space: pre-wrap;
        overflow-x: hidden;
        word-wrap: break-word;
        line-height: 1.6;
        margin: 0;
        padding: 15px 20px;
        color: #2c3e50;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 12px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
      }
      
      .markdown ul {
        padding-left: 25px;
        margin: 10px 0;
      }
      
      .markdown li {
        margin: 8px 0;
        position: relative;
      }
      
      .markdown li::marker {
        color: #3b82f6;
      }

      @keyframes softPulse {
        0% { opacity: 0.5; transform: scale(0.98); }
        50% { opacity: 1; transform: scale(1); }
        100% { opacity: 0.5; transform: scale(0.98); }
      }

      .loading-state {
        text-align: center;
        padding: 40px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: linear-gradient(135deg, #f0f9ff 0%, #e6f3ff 100%);
        border-radius: 12px;
      }

      .loading-text {
        font-size: 16px;
        font-weight: 500;
        color: #3b82f6;
        animation: softPulse 2s ease-in-out infinite;
        display: inline-block;
      }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.className = 'tldr-modal-overlay';
    overlay.id = 'tldr-modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'tldr-modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'tldr-modal-content';
    
    const content = document.createElement('div');
    content.id = 'tldr-modal-content';
    content.innerHTML = '<div class="markdown">' + text + '</div>';
    
    const footer = document.createElement('div');
    footer.className = 'tldr-modal-footer';
    
    const closeButton = document.createElement('button');
    closeButton.className = 'tldr-modal-close';
    closeButton.textContent = 'Close';
    
    // Function to close modal with animation
    const closeModal = () => {
      overlay.style.animation = 'modalFadeOut 0.2s ease-in forwards';
      setTimeout(() => {
        overlay.remove();
        style.remove();
      }, 200);
    };

    // Close on button click
    closeButton.onclick = closeModal;

    // Close on overlay click (if clicked directly on overlay)
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    };

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.getElementById('tldr-modal-overlay')) {
        closeModal();
      }
    });

    modalContent.appendChild(content);
    footer.appendChild(closeButton);
    modal.appendChild(modalContent);
    modal.appendChild(footer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  await chrome.scripting.executeScript({
    target: { tabId },
    function: displayPopup,
    args: [summaryText]
  });
}

async function summarizeText(text, tabId) {
  chrome.storage.sync.get(
    { baseUrl: 'https://api.openai.com/v1', apiKey: '', prompt: 'Summarize this text in 3 bullet points. Return plain HTML only, do not use code blocks.', model: 'o3-mini' },
    async (items) => {
      if (!items.baseUrl || !items.apiKey) {
        chrome.scripting.executeScript({
          target: { tabId },
          func: () => alert('Please set Base URL and API Key in the extension options.')
        });
        return;
      }

      await createOrUpdatePopup(tabId, '<div class="loading-state"><span class="loading-text">Preparing summary</span></div>');

      const payload = {
        model: items.model,
        store: true,
        messages: [
          {
            role: "system",
            content: items.prompt || "Summarize this in 3 bullet points:"
          },
          {
            role: "user",
            content: text
          }
        ]
      };

      try {
        const endpoint = items.baseUrl.endsWith('/chat/completions') ? items.baseUrl : items.baseUrl + '/chat/completions';
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + items.apiKey,
            'HTTP-Referer': 'https://github.com/sazonovanton/TLDR',
            'X-Title': 'TL;DR (Too Long; Didn\'t Read)'
          },
          body: JSON.stringify(payload)
        });
        let data;
        const rawText = await response.text();
        if(rawText.trim().startsWith("<")) {
          await createOrUpdatePopup(tabId, "API returned HTML response:\n" + rawText);
          return;
        }
        try {
          data = JSON.parse(rawText);
        } catch(parseError) {
          throw new Error("Invalid JSON response. " + rawText);
        }

        let summary = '';
        if (data && data.choices && data.choices.length > 0) {
          if (data.choices[0].message && data.choices[0].message.content) {
            summary = data.choices[0].message.content.trim();
          } else if (data.choices[0].text) {
            summary = data.choices[0].text.trim();
          }
        }
        if (!summary) {
          summary = rawText.trim() ? "Raw API response:\n" + rawText : "No summary returned.";
        }

        setTimeout(() => {
          createOrUpdatePopup(tabId, summary);
        }, 1000);
      } catch (error) {
        chrome.scripting.executeScript({
          target: { tabId },
          func: (errMsg) => alert('Error during summarization: ' + errMsg),
          args: [error.message]
        });
      }
    }
  );
}

chrome.contextMenus.create({
  id: 'summarize-selection',
  title: 'Summarize via TL;DR',
  contexts: ['selection']
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'summarize-selection' && info.selectionText && tab.id) {
    summarizeText(info.selectionText, tab.id);
  }
});

chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.body.innerText
    }, (results) => {
      if (chrome.runtime.lastError || !results || !results[0].result) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => alert('Failed to extract text from the page.')
        });
        return;
      }
      const pageText = results[0].result;
      summarizeText(pageText, tab.id);
    });
  }
});
