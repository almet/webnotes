document.body.setAttribute("kinto-storage-url", "https://kinto.dev.mozaws.net/v1/")

var s = document.createElement('script');
s.src = chrome.extension.getURL('script.js');
s.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head || document.documentElement).appendChild(s);
