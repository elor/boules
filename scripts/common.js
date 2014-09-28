/**
* common.js: loads EVERY require-js compatible file from this folder
* and configures requirejs to load the libraries as shims
* 
* This file is automatically generated by createcommon.sh
*/

require.config({
  shim : {
    'lib/modernizr' : {
      deps: ['lib/Blob'],
      exports: 'Modernizr'
    },
      'lib/Blob' : {
      exports : 'Blob'
    },
      'lib/typeahead' : {
//      deps: [ 'lib/jquery' ]
    },
    'lib/jsPlumb' : {
//      deps: ['lib/jquery'],
      exports: 'jsPlumb'
    },
    'lib/qunit' : {
      exports: 'QUnit',
      init: function() {
        QUnit.config.autoload = false;
        QUnit.config.autostart = false;
      }
    },
  },
});

define([
  "backend/blobber",
  "backend/buchholzranking",
  "backend/correction",
  "backend/finebuchholzranking",
  "backend/fullmatrix",
  "backend/game",
  "backend/halfmatrix",
  "backend/kotournament",
  "backend/map",
  "backend/matrix",
  "backend/nettoranking",
  "backend/options",
  "backend/random",
  "backend/ranking",
  "backend/result",
  "backend/rleblobber",
  "backend/swisstournament",
  "backend/tournament",
  "backend/vector",
  "lib/base64",
  "lib/FileSaver",
  "lib/implements",
  "lib/jsPlumb",
  "ui/alltabs",
  "ui/autocomplete",
  "ui/backgroundscripts",
  "ui/box",
  "ui/csver",
  "ui/debug",
  "ui/featuredetect",
  "ui/globalranking",
  "ui/history",
  "ui/online",
  "ui/options",
  "ui/opts",
  "ui/players",
  "ui/ranking",
  "ui/reset",
  "ui/shared",
  "ui/splash",
  "ui/state",
  "ui/storage",
  "ui/strings",
  "ui/tab_debug",
  "ui/tab_games",
  "ui/tab_history",
  "ui/tab",
  "ui/tab_new",
  "ui/tab_ranking",
  "ui/tab_settings",
  "ui/tabshandle",
  "ui/tabs",
  "ui/tab_teams",
  "ui/team",
  "ui/toast",
  "ui/tournaments",
  "ui/update"
]);

