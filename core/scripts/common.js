/**
 * common.js: loads each requirejs-compatible script file (except tests)
 *
 * This file is automatically generated as part of the build process.
 * Do not attempt manual changes
 *
 * @return Common
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define([
  'core/controller',
  'core/emitter',
  'core/gamesrankingcomponent',
  'core/idrankingcomponent',
  'core/indexedlistmodel',
  'core/indexedmodel',
  'core/listener',
  'core/listmodel',
  'core/model',
  'core/pointsrankingcomponent',
  'core/rankingcomponentindex',
  'core/rankingcomponent',
  'core/rankingmodel',
  'core/saldorankingcomponent',
  'core/valuemodel',
  'core/view',
  'core/winsrankingcomponent',
  'backend/blobber',
  'backend/buchholzranking',
  'backend/correction',
  'backend/finebuchholzranking',
  'backend/fullmatrix',
  'backend/game',
  'backend/halfmatrix',
  'backend/kotournament',
  'backend/map',
  'backend/matrix',
  'backend/nettoranking',
  'backend/options',
  'backend/random',
  'backend/ranking',
  'backend/result',
  'backend/rleblobber',
  'backend/swisstournament',
  'backend/tournament',
  'backend/vector',
  'lib/Blob',
  'lib/extend',
  'lib/FileSaver',
  'lib/implements',
  'lib/jquery',
  'lib/modernizr',
  'lib/typeahead',
  'ui/alltabs',
  'ui/autocomplete',
  'ui/backgroundscripts/reset',
  'ui/backgroundscripts/featuredetect',
  'ui/backgroundscripts/updatetab',
  'ui/backgroundscripts/tabnewcheaphacklistener',
  'ui/backgroundscripts/online',
  'ui/backgroundscripts/save',
  'ui/backgroundscripts/saveOnPlayerNameChange',
  'ui/backgroundscripts/print',
  'ui/backgroundscripts/taboptionclick',
  'ui/backgroundscripts/initviews',
  'ui/boxcontroller',
  'ui/boxview',
  'ui/checkboxcontroller',
  'ui/checkboxview',
  'ui/classview',
  'ui/csver',
  'ui/data/swissperms',
  'ui/debug',
  'ui/fontsizecontroller',
  'ui/fontsizemodel',
  'ui/fontsizeview',
  'ui/globalranking',
  'ui/history',
  'ui/inputview',
  'ui/koline',
  'ui/lengthview',
  'ui/listcleanuplistener',
  'ui/listclickcontroller',
  'ui/listcollectormodel',
  'ui/listview',
  'ui/newteamcontroller',
  'ui/newteamview',
  'ui/opts',
  'ui/playermodel',
  'ui/players',
  'ui/preregcloserview',
  'ui/ranking',
  'ui/savestate',
  'ui/shared',
  'ui/splash',
  'ui/state',
  'ui/statemodel',
  'ui/state_new',
  'ui/staticviewloader',
  'ui/storage',
  'ui/strings',
  'ui/tab_debug',
  'ui/tab_games',
  'ui/tab_history',
  'ui/tab',
  'ui/tablemodel',
  'ui/tableview',
  'ui/tab_new',
  'ui/taboptslistener',
  'ui/tab_ranking',
  'ui/tab_settings',
  'ui/tabshandle',
  'ui/tabs',
  'ui/team',
  'ui/teammodel',
  'ui/teamnamecontroller',
  'ui/teamremovecontroller',
  'ui/teamsfileloadcontroller',
  'ui/teamsizecontroller',
  'ui/teamsizeview',
  'ui/teamstab',
  'ui/teamtableview',
  'ui/teamview',
  'ui/templateview',
  'ui/textview',
  'ui/toast',
  'ui/tournaments',
  'ui/type',
  'ui/update',
  'ui/valueview'
], function(undefined) {
  return function(str) {
    return require.s.contexts._.defined[str];
  };
});
