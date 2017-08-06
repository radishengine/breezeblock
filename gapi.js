
define(['//apis.google.com/js/api.js'], function() {
  
  'use strict';
  
  var gapi = window.gapi;
  
  return {
    module: gapi,
    load: function(name, parentRequire, onload, config) {
      gapi.load(name, {
        callback: onload,
        onerror: onload.onerror,
      });
    },
  };
  
});
