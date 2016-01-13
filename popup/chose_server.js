var kintoForm = document.getElementById('kinto-form');
kintoForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const kintoURL = document.getElementById('kinto-url').value;
  const settings = {
    'server_url': kintoURL,
    'type': 'kinto'
  };
  chrome.storage.sync.set({'kinto_server_url': kintoURL}, function() {
    document.getElementById('status').innerHTML = "Done!";
  });
});
