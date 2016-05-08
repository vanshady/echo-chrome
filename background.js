
Firebase.enableLogging(true);
var f = new Firebase('https://amber-torch-1365.firebaseio.com/');

f.on('value', function (s) {
  if (s.val().command != "set"){
  data = s.val();
  if (s.val().command != "images") 
      f.set({"command": "set"});
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { data: data }, function (response) {
      if (response.type == "test") {
        console.log('test received');
      }
    });
  });
}
});
