/**
 * BrowserInfoView: display browser information
 *
 * @return BrowserInfoView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', 'ui/browser', 'ui/toast',
  'ui/browserinfocontroller', 'ui/update'], function (extend, View, Browser,
  Toast, BrowserInfoController, Update) {
  /**
   * Constructor
   */
  function BrowserInfoView ($view) {
    BrowserInfoView.superconstructor.call(this, undefined, $view)

    this.$name = this.$view.find('.name')
    this.$version = this.$view.find('.version')
    this.$online = this.$view.find('.online')
    this.$local = this.$view.find('.local')
    this.$cached = this.$view.find('.cached')

    this.controller = new BrowserInfoController(this)

    this.update()
  }
  extend(BrowserInfoView, View)

  BrowserInfoView.prototype.update = function () {
    Browser.update()

    this.$name.text(Browser.name)
    this.$version.text(Browser.version)
    this.$online.text(Browser.online)
    this.$local.text(Browser.local)
    this.$cached.text(Browser.cached)
  }

  BrowserInfoView.prototype.onupdate = function () {
    this.update()
    Update()
    Toast.once('update')
  }

  return BrowserInfoView
})
