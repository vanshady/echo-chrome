
Firebase.enableLogging(true);
var f = new Firebase('https://amber-torch-1365.firebaseio.com/');

f.on('value', function (s) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { data: s.val().command }, function (response) {
      if (response.type == "test") {
        console.log('test received');
      }
      f.set({"command": "set"});
    });
  });
});
