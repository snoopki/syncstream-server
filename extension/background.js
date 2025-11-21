chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getTabId") {
        sendResponse({ tabId: sender.tab.id });
    }
});

chrome.tabs.onRemoved.addListener((tabId) => {
    const key = `room_${tabId}`;
    chrome.storage.local.remove(key);
});