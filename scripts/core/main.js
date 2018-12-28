/**
 * Shared main file. loads the shared config and modules and manages the program
 * startup and splash screen. A complete rewrite is necessary.
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

require(['core/config', 'core/common'], function () {
  /**
   * error callback function
   *
   * @param err
   *          an object containing the type and position of the error
   *
   */
  function notifyAboutLoadError (err) {
    console.log(err)

    var $ = require('jquery')

    $(function ($) {
      var $splash

      // Splash.setState(), but without splash being loaded
      $('body').addClass('splash')
      $splash = $('#splash')
      $splash.removeClass()
      $splash.addClass('loaderror')
      $('#tabs').hide()
    })
  }

  function Main () {
    // FIXME reduce to one var statement. This function is too long anyhow
    var Splash, Toast, Strings, StateLoader
    var TeamToastsListener

    var $ = require('jquery')

    Splash = require('ui/splash')
    Toast = require('ui/toast')
    Strings = require('ui/strings')
    StateLoader = require('ui/stateloader')
    TeamToastsListener = require('ui/teamtoastslistener')

    // actual initializations are started after any other module has
    // been set
    // up, hence the jquery function.
    $(function () {
      if (!Splash.valid) {
        console.error('Splash screen indicates browser incompatibilities')
        return
      }

      Splash.loading()

      // using a timeout to let the browser update the splashtext
      setTimeout(function () {
        var loaded

        try {
          try {
            loaded = StateLoader.loadLatest()
          } catch (e) {
            console.error(e.stack)
            Toast.init()
            Splash.error()
            return
          }

          if (loaded) {
            Toast.once(Strings.loaded)
          } else {
            Toast.once(Strings.newtournament)
          }

          TeamToastsListener.init()

          Splash.update()

          setTimeout(function () {
            try {
              Toast.init()
              Splash.hide()
            } catch (er) {
              notifyAboutLoadError(er)
            }
          }, 10)
        } catch (err) {
          console.error('StateLoader.loadLatest() error caught')
          console.error(err)
          Splash.error()
        }
      }, 1)
      // } catch (e) {
      // notifyAboutLoadError(e);
      // }
    })
  }

  Main()
})
