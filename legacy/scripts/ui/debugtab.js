/**
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'jquery', 'core/view', 'core/valuemodel', './valueview',
    './browser', './storage', './strings', './toast', './loadedimagesview',
    './browserinfoview'], function(extend, $, View, ValueModel, ValueView,
    Browser, Storage, Strings, Toast, LoadedImagesView, BrowserInfoView) {
  /**
   * represents a whole team tab
   *
   * TODO write a TabView superclass with common functions
   *
   * TODO isolate common tab-related function
   *
   * @param $tab
   *          the tab DOM element
   */
  function DebugTab($tab) {
    DebugTab.superconstructor.call(this, undefined, $tab);

    this.init();
  }
  extend(DebugTab, View);

  /**
   * initialize the tab functionality
   *
   * TODO maybe split it into multiple autodetected functions?
   */
  DebugTab.prototype.init = function() {
    var $container, value;

    /*
     * show browser info
     */
    $container = this.$view.find('.browser');
    this.browserNameView = new BrowserInfoView($container);

    /*
     * button: clear all
     */
    $container = this.$view.find('.register .delete');
    $container.click(function() {
      Storage.clear();
      Storage.store();
      new Toast(Strings.reset);
    });

    /*
     * images at pageload
     */
    $container = this.$view.find('.allimages');
    this.allImages = new LoadedImagesView($container);

    // TODO register teams
  };

  // FIXME CHEAP HACK AHEAD
  $(function($) {
    var $tab;

    $tab = $('#tabs > [data-tab="debug"]');
    if ($tab.length && $('#testmain').length === 0) {
      return new DebugTab($tab);
    }
  });

  return DebugTab;
});
