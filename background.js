// Function to create the context menu
function setupContextMenu() {
  // Using chrome.contextMenus.create without checking for existence
  // is fine inside onInstalled, as it runs only once.
  chrome.contextMenus.create({
    id: "izy-zap-open",
    title: 'Abrir com Izy Zap',
    contexts: ["selection"]
  });
}

// Setup the menu when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "izy-zap-open") {
    const selectedText = info.selectionText;
    if (selectedText) {
      const phoneNumber = selectedText.replace(/\D/g, '');

      if (phoneNumber) {
        // Fetch the last used numeric DDI from storage
        chrome.storage.local.get(['lastNumericDDI'], function(result) {
          // Use the stored code, or fallback to '55' if not present
          const countryCode = result.lastNumericDDI || '55';

          const url = `https://web.whatsapp.com/send/?phone=${countryCode}${phoneNumber}`;

          chrome.tabs.query({ url: "https://web.whatsapp.com/*" }, (tabs) => {
            if (tabs && tabs.length > 0) {
              const tab = tabs[0];
              chrome.tabs.update(tab.id, { url: url, active: true });
              chrome.windows.update(tab.windowId, { focused: true });
            } else {
              chrome.tabs.create({ url: url });
            }
          });
        });
      }
    }
  }
});
