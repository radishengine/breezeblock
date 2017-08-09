
requirejs.config({
  timeout: 0,
});

requirejs(['domReady!', 'gapi!auth2:client,drive-realtime'], function() {

  'use strict';
  
  var gapi = window.gapi;
  
  var CLIENT_ID = "908558406138-rmva8p8ubsjppi6fr7l9cks4mlpi4hs1.apps.googleusercontent.com";
  var DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
  ];
  var SCOPES = [
    'https://www.googleapis.com/auth/drive',
  ].join(' ');
  
  document.getElementById('sign-in-button').onclick = function() {
    gapi.auth2.getAuthInstance().signIn();
  };
  
  document.getElementById('sign-out-button').onclick = function() {
    gapi.auth2.getAuthInstance().signOut();
  };
  
  function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      document.body.classList.add('logged-in');
    }
    else {
      document.body.classList.remove('logged-in');
    }
  }
  
  function updateUser(user) {
    console.log(user.getId());
    var basicProfile = user.getBasicProfile();
    console.log(basicProfile.getId());
    console.log(basicProfile.getName());
    console.log(basicProfile.getGivenName());
    console.log(basicProfile.getFamilyName());
    console.log(basicProfile.getEmail());
  }
  
  function getFolderTree() {
    /*
    var gotAbout = gapi.client.drive.about.get({
      fields: [
        'user(displayName, photoLink, me, permissionId, emailAddress)',
        'storageQuota(limit, usage)',
        'maxUploadSize',
      ].join(', '),
    }).then(function(response) {
      return response.result;
    });
    */
    var gotRootId = gapi.client.drive.files.get({
      fileId: 'root',
      fields: 'id',
    }).then(function(response) {
      return response.result.id;
    });
    var gotFolders = gapi.client.drive.files.list({
      q: "mimeType='application/vnd.google-apps.folder'",
      orderBy: 'createdTime',
      fields: 'nextPageToken, files(id, name, parents)',
      pageSize: 1000,
    }).then(function(response) {
      var info = Object.create(null);
      response.result.files.forEach(function(folder) {
        info[folder.id] = {name:folder.name, parents:folder.parents||[]};
      });
      return info;
    });
    var gotFolderTree = Promise.all([
      gotRootId,
      gotFolders,
    ]).then(function(values) {
      var rootId = values[0],
          folders = values[1];
      var root = folders[rootId] = {name:'(ROOT)', parents:[]};
      for (var folderId in folders) {
        var folder = folders[folderId];
        if (folder.parents) {
          folder.parents.forEach(function(parentId) {
            var parent = folders[parentId];
            if (!parent) {
              console.warn('unknown parent id: ' + parentId);
              return;
            }
            parent.children = parent.children || [];
            parent.children.push(folderId);
          });
          delete folder.parents;
        }
      }
      return root;
    });
    return gotFolderTree;
  }
  
  function listZips() {
    var listElement = document.createElement('DIV');
    gapi.client.drive.files.list({
      pageSize: 1000,
      fields: [
        "nextPageToken",
        "files(id, name, parents, headRevisionId)",
      ].join(', '),
      orderBy: "modifiedTime desc",
      q: [
        "mimeType='application/zip'",
        "mimeType='application/x-zip-compressed'",
        "mimeType contains '+zip'",
      ].join(' or '),
    }).then(function(response) {
      response.result.files.forEach(function(file) {
        var div = document.createElement('DIV');
        var link = document.createElement('A');
        link.href = '#/' + file.id + '/';
        link.innerText = file.name;
        console.log(file.headRevisionId);
        div.appendChild(link);
        listElement.appendChild(div);
      });
    });
    document.body.appendChild(listElement);
  }
  
  gapi.client.init({
    discoveryDocs: DISCOVERY_DOCS,
    clientId: CLIENT_ID,
    scope: SCOPES,
  }).then(function() {
    document.body.classList.remove('loading');
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    gapi.auth2.getAuthInstance().currentUser.listen(updateUser);
    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    updateUser(gapi.auth2.getAuthInstance().currentUser.get());
    listZips();
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
