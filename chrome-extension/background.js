console.log("Scraper: The background.js has been triggered!");

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    chrome.scripting
      .executeScript({
        target: { tabId: tab.id },
        files: ["content-scripts/scraper.js"],
      })
      .then(() => {
        console.log("Injected the scraper script.");
      })
      .catch((err) => console.log(err));

    // Trigger the content script using a custom message
    chrome.tabs.sendMessage(tabId, { action: "runScraper" });
  }
});
