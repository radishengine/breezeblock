
requirejs.config({
  timeout: 0,
});

requirejs(['domReady!', 'gapi!client:auth2'], function() {

  'use strict';
  
  var gapi = window.gapi;
  
  var CLIENT_ID = "908558406138-rmva8p8ubsjppi6fr7l9cks4mlpi4hs1.apps.googleusercontent.com";
  var DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
  ];
  var SCOPES = [
    'https://www.googleapis.com/auth/drive',
  ].join(' ');
  
  function clearActive() {
    var active = document.querySelectorAll('body > .active');
    for (var i = 0; i < active.length; i++) {
      active[i].classList.remove('active');
    }
  }
  
  function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      document.body.classList.add('logged-in');
    }
    else {
      clearActive();
      document.getElementById('login').classList.add('active');
      document.body.classList.remove('logged-in');
    }
  }
  
  gapi.client.init({
    discoveryDocs: DISCOVERY_DOCS,
    clientId: CLIENT_ID,
    scope: SCOPES,
  }).then(function() {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    document.getElementById('login-button').onclick = function handleAuthClick(event) {
      gapi.auth2.getAuthInstance().signIn();
    };
  });  
  
  /*
  var developerKey = 'AIzaSyD__sT53UZduSvg5E2rH6L8x-dPzimBV7k';
  var clientId = "908558406138-rmva8p8ubsjppi6fr7l9cks4mlpi4hs1.apps.googleusercontent.com";
  var appId = "908558406138";
  var scope = ['https://www.googleapis.com/auth/drive'];
  var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

  var authorizeButton = document.getElementById('authorize-button');
  var signoutButton = document.getElementById('signout-button');

  gapi.client.init({
    discoveryDocs: DISCOVERY_DOCS,
    clientId: clientId,
    scope: scope,
  }).then(function() {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  },
  function(reason) {
    console.error(reason);
  });

  function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      authorizeButton.style.display = 'none';
      signoutButton.style.display = 'block';
      listFiles();
    } else {
      authorizeButton.style.display = 'block';
      signoutButton.style.display = 'none';
    }
  }

  function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
  }

  function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
  }

  function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
  }

  function listFiles() {
    gapi.client.drive.files.list({
      'pageSize': 10,
      'fields': "nextPageToken, files(id, name)"
    }).then(function(response) {
      appendPre('Files:');
      var files = response.result.files;
      if (files && files.length > 0) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          appendPre(file.name + ' (' + file.id + ')');
        }
      } else {
        appendPre('No files found.');
      }
    });
  }
  
  */
  
});
