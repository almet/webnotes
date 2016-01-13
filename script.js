if (window.storage == undefined)
  window.storage = {sync: {}};

window.storage.sync.config = {
  url: document.body.getAttribute("kinto-storage-url"),
  type: "kinto"
};
