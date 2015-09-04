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
  'lib/Blob',
  'lib/diff',
  'lib/extend',
  'lib/FileSaver',
  'lib/jquery',
  'lib/modernizr',
  'lib/typeahead',
  'core/absolutematrix',
  'core/antisymmetricmatrixmodel',
  'core/binningreferencelistmodel',
  'core/byeresult',
  'core/classview',
  'core/combinedreferencelistmodel',
  'core/controller',
  'core/correctionmodel',
  'core/correctionreferencemodel',
  'core/delegatematrix',
  'core/emitter',
  'core/indexedlistmodel',
  'core/indexedmodel',
  'core/lengthmodel',
  'core/listener',
  'core/listexclusionlistener',
  'core/listmodel',
  'core/listupdatelistener',
  'core/maplistmodel',
  'core/matchmodel',
  'core/matchreferencemodel',
  'core/matchresult',
  'core/matrixmodel',
  'core/model',
  'core/orderlistmodel',
  'core/positivematrix',
  'core/propertymodel',
  'core/rankingbuchholzcomponent',
  'core/rankingbuchholzlistener',
  'core/rankingbyelistener',
  'core/rankingcomponentindex',
  'core/rankingcomponent',
  'core/rankingdatalistenerindex',
  'core/rankingdatalistener',
  'core/rankingfinebuchholzcomponent',
  'core/rankingfinebuchholzlistener',
  'core/rankinggamematrixlistener',
  'core/rankingheadtoheadcomponent',
  'core/rankingheadtoheadmatrixlistener',
  'core/rankingidcomponent',
  'core/rankinglostpointscomponent',
  'core/rankinglostpointslistener',
  'core/rankingmapper',
  'core/rankingmodel',
  'core/rankingnumgamescomponent',
  'core/rankingnumgameslistener',
  'core/rankingpointscomponent',
  'core/rankingpointslistener',
  'core/rankingsaldocomponent',
  'core/rankingsaldolistener',
  'core/rankingsonneborncomponent',
  'core/rankingsonnebornlistener',
  'core/rankingtaccomponent',
  'core/rankingtaclistener',
  'core/rankingwinscomponent',
  'core/rankingwinslistener',
  'core/rankingwinsmatrixlistener',
  'core/readonlylistmodel',
  'core/referencelistmodel',
  'core/resultreferencemodel',
  'core/rle',
  'core/roundtournamentmodel',
  'core/selectionvaluemodel',
  'core/sortedreferencelistmodel',
  'core/statevaluemodel',
  'core/swisstournamentmodel',
  'core/symmetricmatrixmodel',
  'core/tabimageview',
  'core/tabmenucontroller',
  'core/tabmenuview',
  'core/tabmodel',
  'core/tournamentindex',
  'core/tournamentlistmodel',
  'core/tournamentmodel',
  'core/transposedifferencematrix',
  'core/transposesummatrix',
  'core/trianglematrixmodel',
  'core/type',
  'core/uniquelistmodel',
  'core/valuemodel',
  'core/vectormodel',
  'core/view',
  'backend/random',
  'ui/autocomplete',
  'ui/backgroundscripts/autosave',
  'ui/backgroundscripts/featuredetect',
  'ui/backgroundscripts/initviews',
  'ui/backgroundscripts/load',
  'ui/backgroundscripts/matchtoasts',
  'ui/backgroundscripts/online',
  'ui/backgroundscripts/print',
  'ui/backgroundscripts/reset',
  'ui/backgroundscripts/save',
  'ui/backgroundscripts/statetoasts',
  'ui/backgroundscripts/tabgamescheaphacklistener',
  'ui/backgroundscripts/tabhistorycheaphacklistener',
  'ui/backgroundscripts/tabnewcheaphacklistener',
  'ui/backgroundscripts/tabrankingcheaphacklistener',
  'ui/backgroundscripts/tournamenterrortoasts',
  'ui/binarytreemodel',
  'ui/boxcontroller',
  'ui/boxview',
  'ui/browserinfocontroller',
  'ui/browserinfoview',
  'ui/browser',
  'ui/checkboxcontroller',
  'ui/checkboxview',
  'ui/correctionview',
  'ui/csver',
  'ui/data/swissperms',
  'ui/debug',
  'ui/debugtab',
  'ui/fileloadcontroller',
  'ui/finishroundcontroller',
  'ui/fontsizecontroller',
  'ui/fontsizemodel',
  'ui/fontsizeview',
  'ui/gamestab',
  'ui/generictournamenthistoryview',
  'ui/generictournamentview',
  'ui/historytab',
  'ui/hometab',
  'ui/inputview',
  'ui/koline',
  'ui/legacyloadermodel',
  'ui/lengthview',
  'ui/listcleanuplistener',
  'ui/listclickcontroller',
  'ui/listcollectormodel',
  'ui/listview',
  'ui/loadedimagesview',
  'ui/matchcontroller',
  'ui/matchresultcontroller',
  'ui/matchresultview',
  'ui/matchtableview',
  'ui/matchview',
  'ui/newtab',
  'ui/newteamcontroller',
  'ui/newteamview',
  'ui/newtournamentcontroller',
  'ui/newtournamentview',
  'ui/options',
  'ui/playermodel',
  'ui/players',
  'ui/preregcloserview',
  'ui/progresstableview',
  'ui/rankingcomponentview',
  'ui/rankingordercontroller',
  'ui/rankingorderview',
  'ui/rankingtab',
  'ui/rankingview',
  'ui/registerteamscontroller',
  'ui/requiremodsshortcut',
  'ui/roundtournamentview',
  'ui/settingstab',
  'ui/splash',
  'ui/stateclassview',
  'ui/state',
  'ui/statemodel',
  'ui/state_new',
  'ui/staticviewloader',
  'ui/storage',
  'ui/storagesavecontroller',
  'ui/strings',
  'ui/swisstournamentcontroller',
  'ui/swisstournamentview',
  'ui/systemlistview',
  'ui/systemtablerowview',
  'ui/tabshandle',
  'ui/teammodel',
  'ui/teamnamecontroller',
  'ui/teamremovecontroller',
  'ui/teamsfileloadcontroller',
  'ui/teamsizecontroller',
  'ui/teamsizeview',
  'ui/teamstab',
  'ui/teamtableview',
  'ui/teamtoastslistener',
  'ui/teamview',
  'ui/templateview',
  'ui/textview',
  'ui/toast',
  'ui/tournamentcontroller',
  'ui/tournamenthistoryview',
  'ui/tournamentmatchesview',
  'ui/tournamentrankingview',
  'ui/tournamentview',
  'ui/tournamentviewpopulator',
  'ui/treenode',
  'ui/update',
  'ui/valueview'
], function(undefined) {
  return function(str) {
    var module = require.s.contexts._.defined[str];
    if (!module) {
      throw new Error('module "' + str +
        '" is undefined, not loaded or equals 0 in some way => ' + module);
    }
    return module;
  };
});
