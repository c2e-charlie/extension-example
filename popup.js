document.addEventListener("DOMContentLoaded", () => {
  chrome.runtime.sendMessage("getUrls", (response) => {
    const urlList = document.getElementById("urlList");
    urlList.innerHTML = "";

    for (const [tabId, data] of Object.entries(response)) {
      const li = document.createElement("li");
      li.textContent = `${data.url} - Time spent: ${Math.round(
        data.timeSpent / 1000
      )} seconds`;
      urlList.appendChild(li);
    }
  });
});
