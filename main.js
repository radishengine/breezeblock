
requirejs.config({
  timeout: 0,
});

requirejs(['domReady!'], function() {

  'use strict';
  
  var developerKey = 'AIzaSyD__sT53UZduSvg5E2rH6L8x-dPzimBV7k';
  var clientId = "908558406138-rmva8p8ubsjppi6fr7l9cks4mlpi4hs1.apps.googleusercontent.com";
  var appId = "908558406138";
  var scope = ['https://www.googleapis.com/auth/drive'];

  var pickerApiLoaded = false;
  function getOauthToken() {
    var oauthToken; // = localStorage.getItem('google_oauth_token');
    if (oauthToken) {
      return Promise.resolve(oauthToken);
    }
    return new Promise(function(resolve, reject) {
      gapi.auth.authorize({
          'client_id': clientId,
          'scope': scope,
          'immediate': false,
        },
        function handleAuthResult(authResult) {
          if (!authResult || authResult.error) {
            reject('auth error');
            return;
          }
          var oauthToken = authResult.access_token;
          //localStorage.setItem('google_oauth_token', oauthToken);
          resolve(oauthToken);
        });
    });
  }

  gapi.load('auth:picker', function() {
    pickerApiLoaded = true;
  });

  document.getElementById('pick_button').onclick = function createPicker() {
    if (!pickerApiLoaded) return;
    getOauthToken().then(function(oauthToken) {
      var view = new google.picker.DocsView();
      view.setMimeTypes("application/zip");
      view.setMode(google.picker.DocsViewMode.LIST);
      view.setIncludeFolders(true);
      view.setOwnedByMe(true);
      var ulview = new google.picker.DocsUploadView();
      ulview.setIncludeFolders(true);
      var picker = new google.picker.PickerBuilder()
          .setTitle('Please select a Breezeblock project file')
          .enableFeature(google.picker.Feature.MINE_ONLY)
          .setAppId(appId)
          .setOAuthToken(oauthToken)
          .addView(view)
          .addView(ulview)
          .setDeveloperKey(developerKey)
          .setCallback(pickerCallback)
          .build();
       picker.setVisible(true);
    });
  };

  function pickerCallback(data) {
    if (data.action == google.picker.Action.PICKED) {
      var fileId = data.docs[0].id;
      console.log(fileId, oauthToken);
    }
  }

  document.getElementById('new_button').onclick = function createNew() {
    var title = document.getElementById('new_name');
    title = title.value || title.placeholder;
    console.log(title);
    if (!pickerApiLoaded) return;
    getOauthToken().then(function(oauthToken) {
      var view = new google.picker.DocsView(google.picker.ViewId.FOLDERS);
      view.setIncludeFolders(true);
      view.setSelectFolderEnabled(true);
      view.setMode(google.picker.DocsViewMode.LIST);
      var picker = new google.picker.PickerBuilder()
          .setTitle('Please choose a location to save the new project')
          .enableFeature(google.picker.Feature.MINE_ONLY)
          .setAppId(appId)
          .setOAuthToken(oauthToken)
          .addView(view)
          .setDeveloperKey(developerKey)
          .setCallback(newCallback)
          .build();
       picker.setVisible(true);
    });
  };

  function newCallback(data) {
    if (data.action == google.picker.Action.PICKED) {
      var folderId = data.docs[0].id;
      console.log(folderId);
    }
  }

});
