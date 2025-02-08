document.addEventListener('DOMContentLoaded', function() {
  // Load saved settings
  chrome.storage.sync.get(
    {
      baseUrl: 'https://api.openai.com/v1',
      apiKey: '',
      prompt: 'Summarize this text in 3 key points. Format each point as a proper Markdown.',
      model: 'o3-mini',
      temperature: '0.8',
      top_p: '1.0',
      top_k: '0',
      frequency_penalty: '0',
      presence_penalty: '0',
      repetition_penalty: '0',
      max_tokens: null
    },
    function(items) {
      document.getElementById('baseUrl').value = items.baseUrl;
      document.getElementById('apiKey').value = items.apiKey;
      document.getElementById('prompt').value = items.prompt;
      document.getElementById('model').value = items.model;
      document.getElementById('temperature').value = items.temperature;
      document.getElementById('top_p').value = items.top_p;
      document.getElementById('top_k').value = items.top_k;
      document.getElementById('frequency_penalty').value = items.frequency_penalty;
      document.getElementById('presence_penalty').value = items.presence_penalty;
      document.getElementById('repetition_penalty').value = items.repetition_penalty;
      document.getElementById('max_tokens').value = items.max_tokens;
    }
  );

  // Handle API key visibility toggle
  const toggleVisibilityBtn = document.querySelector('.toggle-visibility');
  const apiKeyInput = document.getElementById('apiKey');

  toggleVisibilityBtn.addEventListener('click', function() {
    const isPassword = apiKeyInput.type === 'password';
    apiKeyInput.type = isPassword ? 'text' : 'password';
    toggleVisibilityBtn.textContent = isPassword ? '🔒' : '👁️';
    toggleVisibilityBtn.title = isPassword ? 'Hide API key' : 'Show API key';
  });

  // Handle settings save
  document.getElementById('options-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const baseUrl = document.getElementById('baseUrl').value;
    const apiKey = document.getElementById('apiKey').value;
    const prompt = document.getElementById('prompt').value;
    const model = document.getElementById('model').value;
    const temperature = document.getElementById('temperature').value;
    const top_p = document.getElementById('top_p').value;
    const top_k = document.getElementById('top_k').value;
    const frequency_penalty = document.getElementById('frequency_penalty').value;
    const presence_penalty = document.getElementById('presence_penalty').value;
    const repetition_penalty = document.getElementById('repetition_penalty').value;
    const max_tokens = document.getElementById('max_tokens').value;

    chrome.storage.sync.set({ baseUrl, apiKey, prompt, model, temperature, top_p, top_k, frequency_penalty, presence_penalty, repetition_penalty, max_tokens }, function() {
      // Show success message
      const successMessage = document.getElementById('success-message');
      successMessage.classList.add('show');
      
      // Hide message after 3 seconds
      setTimeout(() => {
        successMessage.classList.remove('show');
      }, 3000);
    });
  });

  // Add input animations
  const inputs = document.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', function() {
      this.parentElement.classList.remove('focused');
    });
  });

  // Handle reset buttons for advanced settings
  document.querySelectorAll('.reset-button').forEach(button => {
    button.addEventListener('click', function() {
      const defaultValue = this.dataset.default;
      const inputId = this.parentElement.getAttribute('for');
      const input = document.getElementById(inputId);
      input.value = defaultValue;
    });
  });
});
