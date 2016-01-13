if (document.storage == undefined)
  document.storage = {sync: {}};

document.storage.sync.config = {
  url: "https://kinto.dev.mozaws.net/v1/",
  type: "kinto"
};
