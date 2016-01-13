if (window.storage == undefined)
  window.storage = {};

if (window.storage.sync == undefined)
  window.storage.sync = {};

window.storage.sync.config = {
  url: document.body.getAttribute("kinto-storage-url"),
  type: "kinto"
};
