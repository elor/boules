/**
 * TimeMachineView
 *
 * @return TimeMachineView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', 'ui/timemachinecommitview', 'ui/listview',
  'timemachine/timemachine', 'ui/timemachinenewtreecontroller'], function (
  extend, View, TimeMachineCommitView, ListView, TimeMachine,
  TimeMachineNewTreeController) {
  /**
   * Constructor
   */
  function TimeMachineView ($view) {
    TimeMachineView.superconstructor.call(this, undefined, $view)

    this.init()
  }
  extend(TimeMachineView, View)

  TimeMachineView.prototype.init = function () {
    var $container, $template
    /*
     * Time Machine Commits
     */
    $container = this.$view.find('.rootcommits')
    $template = $container.find('.timemachinecommitview.template')
    this.initCommits = new ListView(TimeMachine.roots, $container, $template,
      TimeMachineCommitView)

    /*
     * Time Machine New Tree
     */
    $container = this.$view.find('.newcommittree')
    this.newcommitTreeController = new TimeMachineNewTreeController(new View(
      undefined, $container))
  }

  return TimeMachineView
})
