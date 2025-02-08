async function createOrUpdatePopup(tabId, summaryText) {
  function displayPopup(text) {
    const existingContent = document.getElementById('tldr-modal-content');
    if (existingContent) {
      existingContent.innerHTML = '<div class="markdown">' + text + '</div>';
      return;
    }
    const style = document.createElement('style');
    style.textContent = `
      .tldr-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .tldr-modal {
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        max-width: 80%;
        max-height: 80%;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      }
      .tldr-modal-close {
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 16px;
        line-height: 1;
        cursor: pointer;
      }
      .markdown {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        white-space: pre-wrap;
        overflow-x: hidden;
        word-wrap: break-word;
        line-height: 1.5;
        margin: 0;
        padding: 10px;
        background: #f8f8f8;
        border-radius: 4px;
      }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.className = 'tldr-modal-overlay';
    overlay.id = 'tldr-modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'tldr-modal';

    const closeButton = document.createElement('div');
    closeButton.className = 'tldr-modal-close';
    closeButton.textContent = '❌';
    closeButton.onclick = () => {
      overlay.remove();
      style.remove();
    };

    const content = document.createElement('div');
    content.id = 'tldr-modal-content';
    content.innerHTML = '<div class="markdown">' + text + '</div>';

    modal.appendChild(closeButton);
    modal.appendChild(content);
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
    { baseUrl: '', apiKey: '', prompt: 'Summarize this text in 3 bullet points. Return plain HTML only, do not use code blocks.', model: 'o3-mini' },
    async (items) => {
      if (!items.baseUrl || !items.apiKey) {
        chrome.scripting.executeScript({
          target: { tabId },
          func: () => alert('Please set Base URL and API Key in the extension options.')
        });
        return;
      }

      await createOrUpdatePopup(tabId, "Summarizing... please wait");

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
            'Authorization': 'Bearer ' + items.apiKey
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
        }, 1500);
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
  title: 'Summarize via AI',
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
