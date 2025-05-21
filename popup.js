document.getElementById('unblock-btn').addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      files: ['content.js']
    }, () => {
      document.getElementById('status').textContent = 'Copy/Paste Unblocked!';
    });
  });
});
