var data;
var image;
var timer;
var synth = window.speechSynthesis;
var utterThis = new SpeechSynthesisUtterance("Sorry, I don't understand that request.");

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log("DATA: " + request.data);
    data = request.data.command;
    if (data == "images") image = request.data.images;
    sendResponse({ type: "test" });
    selectIntent(data);
  }
);

// for every action, excute some javascript
var intents = ["scroll_up", "scroll_down", "stop", "new_tab", "go_back", "go_forward", "click_link", "close_tab", "navigate", "look_up", "analyze_images"];

var analyzeImages = function () {
  console.log("Try to make call for get and analyze images");
  var images = document.getElementsByTagName('img');
  var srcList = [];
  for (var i in images) {
    console.log("this is an OG img mofos: " + images[i].src);
    srcList.push(images[i].src);
  }

  $.ajax({
    url: 'http://127.0.0.1:3000/',
    type: 'POST',
    data: {
      "imgArray": srcList
    },
    success: function (data) {
      console.log("images analysis works: " + data.images);
    }
  });

}


var scrollUp = function () {
  stop();
  console.log("I'm trying to scroll up");
  timer = setInterval(function () { window.scrollBy(0, -1) }, 8);
};

var scrollDown = function () {
  stop();
  console.log("I'm trying to scroll down");
  timer = setInterval(function () { window.scrollBy(0, 1) }, 8);
};

var stop = function () {
  clearInterval(timer);
}

var newTab = function () {
  console.log("I'm trying to scroll new tab");
  openinnewtab("http://www.google.com");
};

var goBack = function () {
  console.log("I'm trying to go back");
  window.history.back();
};

var goForward = function () {
  console.log("I'm trying to go forward");
  window.history.forward();
};

var clickLink = function () {
  console.log("I'm trying to click link");
  var query = "";
  if (data.result.resolvedQuery.indexOf(" about ") != -1) {
    console.log(data.result.resolvedQuery.split(" about ")[1]);
    organizeArray(data.result.resolvedQuery.split(" about ")[1]);
  }
  else if (data.result.resolvedQuery.indexOf(" on ") != -1) {
    organizeArray(data.result.resolvedQuery.split(" on ")[1])
  }
  else if (data.result.resolvedQuery.indexOf(" the ") != -1) {
    organizeArray(data.result.resolvedQuery.split(" the ")[1])
  }
  else if (data.result.resolvedQuery.indexOf(" where ") != -1) {
    organizeArray(data.result.resolvedQuery.split(" where ")[1])
  }
  else {
    console.log(data.result.resolvedQuery);
    organizeArray(data.result.resolvedQuery);
  }
};

var closeTab = function () {
  console.log("I'm trying to close tab");
  window.close();
};

var navigate = function () {
  console.log("I'm trying to navigate to a site")
  console.log(data);
  if (data.result.parameters.url.length > 0) {
    openWebsite(data.result.parameters.url);
  }
  else {
    openWebsite(data.result.parameters.any);
  }
};

var lookUp = function () {
  console.log("trying to look up");
  for (var term in data.result.parameters) {
    if (data.result.parameters[term].length > 0) {
      console.log(data.result.parameters[term]);
      window.location.href = "http://google.com/search?q=" + data.result.parameters[term];
    }
    else {
      if (data.result.resolvedQuery.indexOf(" for ") != -1)
        window.location.href = "http://google.com/search?q=" + data.result.resolvedQuery.split(" for ")[1];
      else if (data.result.resolvedQuery.indexOf(" about ") != -1)
        window.location.href = "http://google.com/search?q=" + data.result.resolvedQuery.split(" about ")[1];
      else if (data.result.resolvedQuery.indexOf(" search ") != -1)
        window.location.href = "http://google.com/search?q=" + data.result.resolvedQuery.split(" search ")[1];
      else if (data.result.resolvedQuery.indexOf(" look up ") != -1)
        window.location.href = "http://google.com/search?q=" + data.result.resolvedQuery.split(" look up ")[1];
      else
        console.log("sorry I couldn't hear that, could you say that again?");
    }
  }
}

function openinnewtab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}

<<<<<<< HEAD
var functions = [scrollUp, scrollDown, stop, newTab, goBack, goForward, clickLink, closeTab, navigate, lookUp, analyzeImages];
=======
var images = function() {
    synth.speak(new SpeechSynthesisUtterance("This image is about" + image));
}
var functions = [scrollUp, scrollDown, stop, newTab, goBack, goForward, clickLink, closeTab, navigate, lookUp,analyzeImages, images];
>>>>>>> efb378758b590fc2232fb4d58ca27b6adb6d623a

function selectIntent(data) {
  var foundFunction = false;
  for (var i = 0; i < intents.length; i++) {
    if (data == intents[i]) {
      foundFunction = true;
      functions[i]();
    }
  }
  if (foundFunction == false)
    synth.speak(utterThis);
}