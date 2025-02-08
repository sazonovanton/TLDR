document.addEventListener('DOMContentLoaded', function() {
  // Загружаем сохранённые настройки
  chrome.storage.sync.get(
    { baseUrl: '', apiKey: '', prompt: 'Summarize this in 3 bullet points...', model: 'o3-mini' },
    function(items) {
      document.getElementById('baseUrl').value = items.baseUrl;
      document.getElementById('apiKey').value = items.apiKey;
      document.getElementById('prompt').value = items.prompt;
      document.getElementById('model').value = items.model;
    }
  );

  // Обработка сохранения настроек
  document.getElementById('options-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const baseUrl = document.getElementById('baseUrl').value;
    const apiKey = document.getElementById('apiKey').value;
    const prompt = document.getElementById('prompt').value;
    const model = document.getElementById('model').value;
    chrome.storage.sync.set({ baseUrl, apiKey, prompt, model }, function() {
      alert('Settings saved');
    });
  });
});
