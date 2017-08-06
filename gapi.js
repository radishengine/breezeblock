
define([], function() {
  
  'use strict';
  
  var gapi = window.gapi;
  
  return {
    load: function(name, parentRequire, onload, config) {
      gapi.load(name, {
        callback: onload,
        onerror: onload.onerror,
      });
    },
  };
  
});
