document.addEventListener('DOMContentLoaded', function() {
  // Load saved settings
  chrome.storage.sync.get(
    { baseUrl: '', apiKey: '', prompt: 'Summarize this text in 3 bullet points. Return plain HTML only, do not use code blocks.', model: 'o3-mini' },
    function(items) {
      document.getElementById('baseUrl').value = items.baseUrl;
      document.getElementById('apiKey').value = items.apiKey;
      document.getElementById('prompt').value = items.prompt;
      document.getElementById('model').value = items.model;
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

    chrome.storage.sync.set({ baseUrl, apiKey, prompt, model }, function() {
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
});
