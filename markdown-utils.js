// Minimal markdown parser for basic formatting
window.parseMarkdown = (markdown) => {
  if (!markdown) return '';
  
  let html = markdown;
  
  // Normalize line endings
  html = html.replace(/\r\n/g, '\n');
  html = html.replace(/\r/g, '\n');
  
  // Replace headers (before other inline formatting)
  html = html.replace(/^#{3}\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^#{2}\s+(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#{1}\s+(.+)$/gm, '<h1>$1</h1>');
  
  // Replace bullet points and create lists
  const listItems = [];
  let inList = false;
  
  html = html.split('\n').map(line => {
    const listMatch = line.match(/^\s*[-*+]\s+(.+)$/);
    if (listMatch) {
      if (!inList) {
        inList = true;
        listItems.length = 0;
      }
      listItems.push(listMatch[1]);
      return null; // Mark for removal
    } else if (inList && line.trim() === '') {
      inList = false;
      const list = '<ul>' + listItems.map(item => `<li>${item}</li>`).join('') + '</ul>';
      listItems.length = 0;
      return list;
    } else if (inList) {
      inList = false;
      const list = '<ul>' + listItems.map(item => `<li>${item}</li>`).join('') + '</ul>';
      listItems.length = 0;
      return list + '\n' + line;
    }
    return line;
  }).filter(line => line !== null).join('\n');
  
  // If we ended while still in a list
  if (inList && listItems.length > 0) {
    html += '\n' + '<ul>' + listItems.map(item => `<li>${item}</li>`).join('') + '</ul>';
  }
  
  // Replace inline code (before other inline formatting to prevent conflicts)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Replace bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Replace italic (after bold to prevent conflicts)
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Replace double line breaks with paragraphs
  html = html.replace(/\n\s*\n/g, '</p><p>');
  
  // Wrap content in paragraphs if not already wrapped
  if (!html.startsWith('<')) {
    html = '<p>' + html;
  }
  if (!html.endsWith('>')) {
    html = html + '</p>';
  }
  
  // Clean up empty paragraphs and normalize spacing
  html = html.replace(/<p>\s*<\/p>/g, '');
  html = html.replace(/(<\/[^>]+>)\s*<p>/g, '$1');
  html = html.replace(/<p>\s*(<[^/][^>]*>)/g, '$1');
  
  // Replace remaining single line breaks
  html = html.replace(/\n/g, '<br>');
  
  return html;
};

// Helper function to create styled container for markdown content
window.createMarkdownContainer = (markdownText) => {
  const container = document.createElement('div');
  container.className = 'markdown-content';
  container.innerHTML = window.parseMarkdown(markdownText);
  
  // Add basic styles
  const style = document.createElement('style');
  style.textContent = `
    .markdown-content {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.5;
      color: #333;
      padding: 1rem;
    }
    .markdown-content p {
      margin: 0.5em 0;
    }
    .markdown-content ul {
      padding-left: 20px;
      margin: 0.5em 0;
      list-style-type: disc;
    }
    .markdown-content li {
      margin: 0.25em 0;
      line-height: 1.5;
    }
    .markdown-content li::marker {
      color: #3b82f6;
    }
    .markdown-content code {
      background-color: #f5f5f5;
      padding: 2px 4px;
      border-radius: 3px;
      font-family: monospace;
      font-size: 0.9em;
    }
    .markdown-content h1, .markdown-content h2, .markdown-content h3 {
      margin-top: 1em;
      margin-bottom: 0.5em;
      font-weight: 600;
    }
    .markdown-content h1 {
      font-size: 1.5em;
      color: #1a365d;
    }
    .markdown-content h2 {
      font-size: 1.3em;
      color: #2d3748;
    }
    .markdown-content h3 {
      font-size: 1.1em;
      color: #4a5568;
    }
    .markdown-content strong {
      color: #1a365d;
      font-weight: 600;
    }
    .markdown-content em {
      color: #4a5568;
      font-style: italic;
    }
  `;
  document.head.appendChild(style);
  
  return container;
};
