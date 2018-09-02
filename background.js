chrome.runtime.onInstalled.addListener(() => {});

chrome.contextMenus.create({
  id: "my_id",
  title: "synonym",
  contexts: ["selection"]
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { word: info.selectionText },
      response => {
        null;
      }
    );
  });
});
