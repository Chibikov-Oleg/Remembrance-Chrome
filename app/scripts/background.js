'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
	console.log('previousVersion', details.previousVersion);
});

var sendTextToRemembrance = function sendTextToRemembrance(text) {
	$.ajax({
		url: 'http://localhost:2033/api/words/',
		type: 'PUT',
		dataType: 'json',
		contentType: 'application/json',
		processData: false,
		data: JSON.stringify(text),
		error: function error(e) {
			if (!e.responseText) console.log('Remembrance is not launched.');else console.log(e.responseText);
		}
	});
};

chrome.webRequest.onBeforeRequest.addListener(function (details) {
	var parameter = details.url.split('/').pop();
	if (parameter) {
		console.log('Text to send to Remembrance: ' + parameter);
		sendTextToRemembrance(parameter);
	}
	chrome.tabs.remove(details.tabId);
	return {
		close: true,
		redirectUrl: 'javascript:'
	};
}, {
	urls: ['http://localhost:2033/api/words/*'],
	types: ['main_frame']
}, ['blocking']);

chrome.contextMenus.removeAll();

chrome.contextMenus.create({
	'title': 'Send to Remembrance',
	'contexts': ['selection'],
	'onclick': function onclick(e) {
		if (!e.selectionText) return;
		sendTextToRemembrance(e.selectionText);
	}
});