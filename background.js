// Function to create the context menu
function setupContextMenu() {
  chrome.contextMenus.create({
    id: "izy-zap-open",
    title: 'Abrir com Izy Zap',
    contexts: ["selection"]
  });
}

// Setup the menu when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "izy-zap-open") {
    const selectedText = info.selectionText;
    if (selectedText) {
      // Basic cleaning: remove non-digit characters
      // This assumes the selected text is mostly a phone number.
      const phoneNumber = selectedText.replace(/\D/g, '');

      if (phoneNumber) {
        // For now, we'll use a default country code.
        // A more advanced implementation could involve checking storage for a user-set default.
        const countryCode = "55";
        const url = `https://wa.me/${countryCode}${phoneNumber}`;

        chrome.tabs.create({ url: url });
      }
    }
  }
});
