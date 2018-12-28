/**
 * PopoutController
 *
 * @return PopoutController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['jquery', 'lib/extend', 'core/controller', 'ui/toast', 'ui/strings',
  'core/classview', 'ui/state', 'core/listener', 'timemachine/timemachine',
  'ui/fontsizeview'
], function ($, extend, Controller, Toast, Strings, ClassView,
  State, Listener, TimeMachine, FontSizeView) {
  var mainPopout, $fontsizeview, fontsizeview

  // TODO close a popout when its parent is removed from the DOM

  // TODO allow popouts to be moved to their own window

  // TODO close popout window when all popouts are closed? Or show a hint.

  // TODO destroy all popout views on mainPopout close

  mainPopout = undefined

  function isMainPopoutOpen () {
    return mainPopout && mainPopout.document
  }

  function closeMainPopout () {
    if (isMainPopoutOpen()) {
      fontsizeview.destroy()
      // TODO destroy all popout views!
      mainPopout.close()
    }
    mainPopout = undefined
  }

  Listener.bind(TimeMachine, 'unload', closeMainPopout)

  /**
   * close all popout on page leave
   */
  $(function ($) {
    $(window).on('beforeunload', closeMainPopout)
  })

  /**
   * Constructor
   */
  function PopoutController (view, cloneFunction) {
    PopoutController.superconstructor.call(this, view)

    this.cloneFunction = cloneFunction

    if (this.view.$popout) {
      this.view.$popout.click(this.popout.bind(this))
    }
    if (this.view.$close) {
      this.view.$close.click(this.close.bind(this))
    }
    if (this.view.$pageBreak) {
      this.view.$pageBreak.click(this.togglePageBreak.bind(this))
    }
  }
  extend(PopoutController, Controller)

  PopoutController.prototype.popout = function (e) {
    var $popoutView, stylepath, $style, $title, $body

    $popoutView = this.view.$popoutTemplate.clone()

    if (!isMainPopoutOpen()) {
      console.log('opening new popout')

      mainPopout = window.open('', '', 'location=0')
      $(mainPopout).on('beforeunload', closeMainPopout)

      $style = $('style')
      if ($style.length === 0) {
        stylepath = window.location.href.replace(/index.html[?#].*/,
          'style/main.css')
        $style = $('<link rel="stylesheet" href="' + stylepath + '">')
      } else {
        $style = $style.clone()
      }
      $title = $('title').clone()
      $(mainPopout.document.head).append($style).append($title)

      $body = $(mainPopout.document.body)
      $body.attr('id', 'app').addClass('popoutContainer')
      $body.data({
        maxWidthView: new ClassView(State.tabOptions.nameMaxWidth, $body,
          'maxwidth', 'nomaxwidth'),
        hideNamesView: new ClassView(State.tabOptions.showNames, $body,
          undefined, 'hidenames'),
        hideTeamNameView: new ClassView(State.tabOptions.showTeamName, $body,
          undefined, 'hideteamname'),
        showtableClassView: new ClassView(State.tabOptions.showMatchTables,
          $body, 'showmatchtable', 'showtable'),
        hidefinishedClassView: new ClassView(
          State.tabOptions.hideFinishedGroups, $body, 'hidefinished')
      })

      if (!$fontsizeview) {
        $fontsizeview = $('.fontsizeview').eq(1)
      }

      fontsizeview = new FontSizeView($fontsizeview, $body)
    } else {
      console.log('main popout already exists and is open')
    }

    $popoutView.addClass('primaryPopout')
    $(mainPopout.document.body).append($popoutView)
    this.cloneFunction.call(mainPopout, $popoutView)

    window.setTimeout(function () {
      if (!isMainPopoutOpen()) {
        Toast.once(Strings.popout_adblocked)
      }
    }, 500)

    e.preventDefault(true)
    return false
  }

  PopoutController.prototype.close = function (e) {
    console.log('close')

    this.view.destroy()

    e.preventDefault(true)
    return false
  }

  PopoutController.prototype.togglePageBreak = function (e) {
    this.view.pageBreakModel.set(!this.view.pageBreakModel.get())

    e.preventDefault(true)
    return false
  }

  return PopoutController
})
