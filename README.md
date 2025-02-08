# TL:DR (Too Long; Didn't Read) - Chrome Extension

English | [Russian](README.ru.md)  

This extension allows you to quickly obtain a brief summary of any web page or selected text. It helps you quickly retrieve the main ideas and points from a long text by querying the OpenAI API (or an alternative service).

## Features

- **Toolbar Button:** Clicking extracts the entire page text and sends it for summarization.
- **Context Menu:** Allows summarizing selected text via right-click and choosing the "Summarize via AI" command.
- **API Integration:** Sending text for summarization using a predefined system prompt (default: "Summarize this in 3 bullet points..."). API requests are configurable through settings.
- **Extension Settings:** Settings page allows you to set:
  - Base URL for API
  - API Key
  - System prompt
  - Model (text input field, default: "o3-mini")

## File Structure

- **manifest.json** – Chrome extension manifest specifying permissions and attached scripts.
- **background.js** – Service worker handling extension button clicks and context menu, extracting text and sending API requests.
- **options.html** and **options.js** – Settings page allowing users to set extension parameters.
- **content_script.js** – Simple script loaded on all pages (can be used for additional functions).

## How to Install (manual)

1. Ensure you have Google Chrome installed.
2. Download all extension files (manifest.json, background.js, options.html, options.js, content_script.js, README.md) into one folder.
3. Open Google Chrome and go to the extensions page by entering `chrome://extensions/` in the address bar.
4. Enable "Developer mode" in the top right corner of the page.
5. Click the **"Load unpacked extension"** button and select the folder with extension files.
6. The extension will be installed and immediately available for use.

## Usage

- **To summarize an entire page:**
  - Click the extension icon in the toolbar. The entire page text will be extracted and sent for summarization.
- **To summarize selected text:**
  - Select the necessary text and right-click. Choose the "Summarize via AI" option.
- The summarization result will be displayed in a popup modal directly on the page.

## Configuration

Open the extension settings page:
- Fill in the "Base URL" field (e.g., `https://api.openai.com/v1/completions`).
- Enter your "API Key".
- Edit the "System Prompt" if necessary.
- Enter the model name in the "Model" text field (default: **o3-mini**).

Settings are saved when clicking the "Save Settings" button.