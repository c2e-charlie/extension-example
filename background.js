let urls = {};
let activeTabId = null;
let activeStartTime = null;

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  if (activeTabId && activeStartTime) {
    const duration = (Date.now() - activeStartTime) / 1000; // 초 단위로 변환
    console.log(`Tab ${activeTabId} duration: ${duration.toFixed(2)} seconds`);
    urls[activeTabId].timeSpent += duration;
    console.log(
      `Updated URL: ${urls[activeTabId].url}, Total time spent: ${urls[
        activeTabId
      ].timeSpent.toFixed(2)} seconds`
    );
  }
  activeTabId = activeInfo.tabId;
  const tab = await chrome.tabs.get(activeTabId);
  activeStartTime = Date.now();

  if (!urls[activeTabId]) {
    urls[activeTabId] = { url: tab.url, timeSpent: 0 };
    console.log(`Tracking new tab: ${activeTabId}, URL: ${tab.url}`);
  } else {
    urls[activeTabId].url = tab.url;
    console.log(`Updated tab: ${activeTabId}, URL: ${tab.url}`);
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === activeTabId && changeInfo.url) {
    if (activeStartTime) {
      const duration = (Date.now() - activeStartTime) / 1000; // 초 단위로 변환
      console.log(
        `Tab ${activeTabId} duration: ${duration.toFixed(2)} seconds`
      );
      urls[activeTabId].timeSpent += duration;
      console.log(
        `Updated URL: ${urls[activeTabId].url}, Total time spent: ${urls[
          activeTabId
        ].timeSpent.toFixed(2)} seconds`
      );
    }
    activeStartTime = Date.now();
    urls[activeTabId].url = changeInfo.url;
    console.log(`Tab ${activeTabId} updated URL: ${changeInfo.url}`);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "getUrls") {
    sendResponse(urls);
  }
});
