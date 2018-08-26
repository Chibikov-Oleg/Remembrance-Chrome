"use strict";

const url = "http://localhost:2053/api/words/";

chrome.runtime.onInstalled.addListener(details => {
  console.log("previousVersion", details.previousVersion);
});

function request(method, url, json) {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    const req = new XMLHttpRequest();
    req.open(method, url);
    req.setRequestHeader("Content-Type", "application/json");

    req.onload = function() {
      // This is called even on 404 etc so check the status
      if (req.status >= 200 && req.status < 300) {
        // Resolve the promise with the response text
        resolve(req.response);
      } else {
        // Otherwise reject with the response or status text which will hopefully be a meaningful
        // error
        reject(Error(req.responseText || req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function() {
      reject(Error());
    };

    // Make the request
    req.send(json);
  });
}

const sendTextToRemembrance = text => {
  request("PUT", url, JSON.stringify(text)).catch(function(e) {
    if (!e.message) alert("Remembrance is not launched.");
    else alert(e);
  });
};

const hideWindowAsync = () => {
  return new Promise(function(resolve) {
    chrome.windows.getCurrent(function(win) {
      chrome.windows.update(win.id, { state: "minimized" });
      resolve();
    });
  });
};

function removeTab(tabId) {
  return new Promise(function(resolve) {
    chrome.tabs.remove(tabId, resolve);
  });
}

chrome.webRequest.onBeforeRequest.addListener(
  async function(details) {
    const parameter = details.url.split("/").pop();
    if (parameter) {
      console.log("Text to send to Remembrance: " + parameter);
      sendTextToRemembrance(parameter);
    }
    await removeTab(details.tabId);
    await hideWindowAsync();
    return {
      cancel: true
    };
  },
  {
    urls: [url + "*"],
    types: ["main_frame"]
  },
  ["blocking"]
);

chrome.contextMenus.removeAll();

chrome.contextMenus.create({
  title: "Send to Remembrance",
  contexts: ["selection"],
  onclick: function(e) {
    if (!e.selectionText) return;
    sendTextToRemembrance(e.selectionText);
  }
});
