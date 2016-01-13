if (window.storage == undefined)
  window.storage = {};

if (window.storage.sync == undefined)
  window.storage.sync = {};

const storageUrl = document.body.getAttribute("kinto-storage-url");

window.storage.sync.config = {
  url: storageUrl,
  type: "kinto"
};
