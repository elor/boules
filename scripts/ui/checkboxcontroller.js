/**
 * No Description
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

define(['jquery', 'lib/extend', 'core/controller'], function ($, extend, Controller) {
  /**
   * Constructor
   *
   * @param view
   *          a CheckboxView instance
   */
  function CheckboxController (view) {
    var model, $checkbox, $parent
    CheckboxController.superconstructor.call(this, view)

    model = this.model
    $checkbox = this.view.$view
    $parent = $checkbox.parent().filter('span')

    $parent.click(function (e) {
      if ($(e.target).prop('tagName') === 'SPAN') {
        $checkbox.click()
      }
    })

    /**
     * apply checkbox state to model state
     */
    $checkbox.change(function () {
      var viewvalue, modelvalue

      viewvalue = $checkbox.prop('checked')
      modelvalue = model.get()

      if (viewvalue !== modelvalue) {
        model.set(viewvalue)
      }
    })
  }
  extend(CheckboxController, Controller)

  return CheckboxController
})
