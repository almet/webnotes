var browser = browser || chrome;
function saveOptions(e) {
  e.preventDefault();
  browser.storage.local.set({
    kinto_url: document.querySelector('#kinto_url').value,
    kinto_bucket: document.querySelector('#kinto_bucket').value,
    kinto_collection: document.querySelector('#kinto_collection').value,
    kinto_secret: document.querySelector('#kinto_secret').value,
    sanitizer_options: JSON.parse(document.querySelector('#sanitizer_options').value)
  });
}

function onError(error) {
  console.log(`Error: ${error}`);
}

function restoreOptions() {
  var keys = ['kinto_url', 'kinto_bucket', 'kinto_collection', 'kinto_secret',
              'sanitizer_options'];
  browser.storage.local.get(keys).then((result) => {
      document.querySelector('#kinto_url').value = result.kinto_url || 'https://kinto.notmyidea.org/v1';
      document.querySelector('#kinto_bucket').value = result.kinto_bucket || 'webnotesapp';

      // By default, the collection name is random.
      let randomCollection = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
      document.querySelector('#kinto_collection').value = result.kinto_collection || randomCollection;

      // By default, generate a random string for the kinto secret;
      // It's not easy to remember,but safer than a fixed default.
      let randomSecret = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
      document.querySelector('#kinto_secret').value = result.kinto_secret || randomSecret;

      // Store the sanitizer options so the user can configure its behavior.
      var defaultOptions = {
        ALLOWED_TAGS: ['em', 'a', 'strong', 'i', 'b', 'cite', 'abbr', 'acronym',
                         'address', 'br', 'dd', 'dl', 'dt', 'ol', 'ul', 'li', 'p', 'pre',
                         'q', 's', 'small', 'sub', 'tt', 'u'],
        FORBID_ATTR: ['style', 'onclick', 'onmouseover']
      }
      document.querySelector('#sanitizer_options').value = JSON.stringify(result.sanitizer_options) || JSON.stringify(defaultOptions);
  }, onError);
}

function initializeStorage(e) {
    e.preventDefault();
    browser.storage.local.get(['kinto_url', 'kinto_bucket', 'kinto_collection', 'kinto_secret']).then((result) => {
        var authorization =  'Basic ' + btoa(`notes:${result.kinto_secret}`);
        var bucket_url = `${result.kinto_url}/buckets/${result.kinto_bucket}`;
        var collection_url = `${bucket_url}/collections/${result.kinto_collection}`
        var records_url = `${collection_url}/records`;

        var headers = {
            'Accept':        'application/json',
            'Content-Type':  'application/json',
            'Authorization': authorization
        };
        var isPublic = JSON.stringify({permissions: {read: ['system.Everyone']}});

        fetch(collection_url, {method: 'PUT', headers: headers, body: isPublic})
            .then((resp) => {
                if (resp.ok) {
                    document.querySelector('#initializeStorage').textContent += ' [OK]';
                }
            });

    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('form').addEventListener('submit', saveOptions);
document.querySelector('#initializeStorage').addEventListener('click', initializeStorage);

function updateStoreForm(modal, settings) {
    if (!settings) {
        settings = {};
    }
    modal.find('#kinto_url').value = settings.kinto_url || 'https://kinto.notmyidea.org/v1';
    modal.find('#kinto_bucket').value = settings.kinto_bucket || 'webnotesapp';

    // By default, the collection name is random.
    let randomCollection = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
    modal.find('#kinto_collection').value = settings.kinto_collection || randomCollection;

    // By default, generate a random string for the kinto secret;
    // It's not easy to remember,but safer than a fixed default.
    let randomSecret = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
    modal.find('#kinto_secret').value = settings.kinto_secret || randomSecret;
    $('#kinto_collection').focus(); // Doesn't seem to work !
}

function saveStoreInfo(modal, id) {
    // If no ID is given, generate a new random one.
    var creation = false;
    if (!id) {
        var id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
        creation = true;
    }
    var storeKey = `store_${id}`;
    var values = {};
    values[storeKey] = {
        id: id,
        kinto_url: modal.find('#kinto_url').value,
        kinto_bucket: modal.find('#kinto_bucket').value,
        kinto_collection: modal.find('#kinto_collection').value,
        kinto_secret: modal.find('#kinto_secret').value
    }
    if (creation == true) {
        browser.storage.local.set(values).then(() => {
            browser.storage.local.get('stores').then(({stores}) => {
                if (!stores) {
                    stores = [];
                }
                stores.push(id);
                browser.storage.local.set({'stores': stores}).then(() => {
                    modal.modal('hide');
                    displayStores();
                });
            })
        });
    }
}

$('#storeSettingsModal').on('show.bs.modal', function (event) {
  var modal = $(this);
  var button = $(event.relatedTarget) // Button that triggered the modal
  if (button.data('action') == 'create') {
      updateStoreForm(modal);
      modal.find('.modal-title').text('Configure your new store.');
      modal.find('.save')[0].onclick = () => { saveStoreInfo(modal) };
  } else {
      var storeId = `store_${button.data('id')}` ;
      browser.storage.local.get(storeId).then((results) => {
          modal.find('.modal-title').text(`Configuration for ${results[storeId].kinto_collection}`);
          updateStoreForm(modal, results[storeId]);
          modal.find('.save')[0].onclick = () => { saveStoreInfo(modal, button.data('id')); }
      });
  }
});

function getCollectionURL(store) {
    console.log(store);
    var {kinto_url, kinto_bucket, kinto_collection} = store;
    return `${kinto_url}/${kinto_bucket}/${kinto_collection}`;
}

function renderStore(store) {
    var tpl = document.getElementById('store-item-tpl');
    var div = tpl.content.cloneNode(true);
    div.querySelector('.id').textContent = getCollectionURL(store);
    div.querySelector('button').setAttribute('data-id', store.id);
    return div;
}

function displayStores() {
    // XX reset stores.
    browser.storage.local.get('stores').then(({stores}) => {
        if (stores) {
            browser.storage.local.get(stores.map((key) => `store_${key}`)).then((results) => {
                var container = document.getElementById('stores');
                for (var id in results) {
                    container.appendChild(renderStore(results[id]));
                }
            });
        }
    });
}

displayStores();
