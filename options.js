var browser = browser || chrome;
function saveOptions(e) {
  e.preventDefault();
  browser.storage.local.set({
    kinto_url: document.querySelector("#kinto_url").value,
    kinto_bucket: document.querySelector("#kinto_bucket").value,
    kinto_collection: document.querySelector("#kinto_collection").value,
    kinto_secret: document.querySelector("#kinto_secret").value,
    sanitizer_options: JSON.parse(document.querySelector("#sanitizer_options").value)
  });
}

function onError(error) {
  console.log(`Error: ${error}`);
}

function restoreOptions() {
  var keys = ["kinto_url", "kinto_bucket", "kinto_collection", "kinto_secret",
              "sanitizer_options"];
  browser.storage.local.get(keys).then((result) => {
      document.querySelector("#kinto_url").value = result.kinto_url || "https://kinto.notmyidea.org/v1";
      document.querySelector("#kinto_bucket").value = result.kinto_bucket || "webnotesapp";

      // By default, the collection name is random.
      let randomCollection = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
      document.querySelector("#kinto_collection").value = result.kinto_collection || randomCollection;

      // By default, generate a random string for the kinto secret;
      // It's not easy to remember,but safer than a fixed default.
      let randomSecret = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
      document.querySelector("#kinto_secret").value = result.kinto_secret || randomSecret;

      // Store the sanitizer options so the user can configure its behavior.
      var defaultOptions = {
        ALLOWED_TAGS: ['em', 'a', 'strong', 'i', 'b', 'cite', 'abbr', 'acronym',
                         'address', 'br', 'dd', 'dl', 'dt', 'ol', 'ul', 'li', 'p', 'pre',
                         'q', 's', 'small', 'sub', 'tt', 'u'],
        FORBID_ATTR: ['style', 'onclick', 'onmouseover']
      }
      document.querySelector("#sanitizer_options").value = JSON.stringify(result.sanitizer_options) || JSON.stringify(defaultOptions);
  }, onError);
}

function initializeStorage(e) {
    e.preventDefault();
    browser.storage.local.get(["kinto_url", "kinto_bucket", "kinto_collection", "kinto_secret"]).then((result) => {
        var authorization =  "Basic " + btoa(`notes:${result.kinto_secret}`);
        var bucket_url = `${result.kinto_url}/buckets/${result.kinto_bucket}`;
        var collection_url = `${bucket_url}/collections/${result.kinto_collection}`
        var records_url = `${collection_url}/records`;

        var headers = {
            "Accept":        "application/json",
            "Content-Type":  "application/json",
            "Authorization": authorization
        };
        var isPublic = JSON.stringify({permissions: {read: ["system.Everyone"]}});

        fetch(collection_url, {method: "PUT", headers: headers, body: isPublic})
            .then((resp) => {
                if (resp.ok) {
                    document.querySelector("#initializeStorage").textContent += " [OK]";
                }
            });

    });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
document.querySelector("#initializeStorage").addEventListener("click", initializeStorage);
