console.log('Content script loaded for TL;DR extension.');

// Function to convert markdown text to HTML and display it
function displayMarkdownContent(markdownText, targetElement = null) {
  const container = window.createMarkdownContainer(markdownText);
  
  if (targetElement) {
    targetElement.appendChild(container);
  } else {
    // If no target specified, append to body
    document.body.appendChild(container);
  }
  
  return container;
}

// Export for use in other parts of the extension
window.displayMarkdownContent = displayMarkdownContent;
