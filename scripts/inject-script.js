chrome.storage.sync.get("kinto_server_url", function(object) {
  document.body.setAttribute("kinto-storage-url", object.kinto_server_url);

  var s = document.createElement('script');
  s.src = chrome.extension.getURL('scripts/inject-kinto.js');
  s.onload = function() {
    this.parentNode.removeChild(this);
  };
  (document.head || document.documentElement).appendChild(s);
});
