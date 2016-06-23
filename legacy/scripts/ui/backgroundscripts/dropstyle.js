/**
 * Hotkeys for the font size. Hooks as directly as possible into the fontsize
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['jquery'], function($) {
  var DropStyle;

  DropStyle = undefined;
  $body = undefined;

  function initDrop($body) {
    $body.on('dragover', function(e) {
      $body.addClass('dragover');
      e.preventDefault();
      return false;
    });

    $body.on('dragleave drop', function(e) {
      $body.removeClass('dragover');
      e.preventDefault();
      return false;
    });
  }

  $(function($) {
    initDrop($('body'));
  });

  return DropStyle;
});
