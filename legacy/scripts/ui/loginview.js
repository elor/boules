/**
 * LoginView
 *
 * @return LoginView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', 'ui/valueview', 'ui/logincontroller',
    'core/classview', 'jquery'], function(extend, View, ValueView,
    LoginController, ClassView, $) {
  /**
   * Constructor
   */
  function LoginView(model, $view) {
    LoginView.superconstructor.call(this, model, $view);

    this.usernameView = new ValueView(this.model.username, this.$view
        .find('.username'));

    this.loginWindow = undefined;
    this.loginPollingTimeout = undefined;

    this.usernameView = new ValueView(this.model.username, this.$view
        .find('.username'));

    $(window).on('beforeunload', (function($) {
      this.closeLoginWindow();
    }).bind(this));

    this.controller = new LoginController(this);
  }
  extend(LoginView, View);

  LoginView.prototype.openLoginWindow = function() {
    this.closeLoginWindow();

    this.loginWindow = window.open('https://turniere.tuvero.de/login');

    if (this.loginWindow === undefined) {
      this.closeLoginWindow();
      this.model.username.set('popup-blocker');
    }
  };

  LoginView.prototype.loginPolling = function() {
    var timeout;

    if (this.loginPollingTimeout) {
      return;
    }

    timeout = this.loginPollingTimeout = window.setTimeout((function() {
      if (this.loginPollingTimeout !== timeout) {
        return;
      }
      this.loginPollingTimeout = undefined;

      this.model.login(false);
    }).bind(this), 500);
  };

  LoginView.prototype.closeLoginWindow = function() {
    if (!this.isLoginWindowOpen()) {
      return;
    }

    if (this.loginWindow) {
      this.loginWindow.close();
    }

    if (this.loginPollingTimeout !== undefined) {
      window.clearInterval(this.loginPollingTimeout);
      this.loginPollingInterval = undefined;
    }

    this.loginWindow = undefined;
  };

  LoginView.prototype.isLoginWindowOpen = function() {
    return !!this.loginWindow && !!this.loginWindow.parent;
  };

  LoginView.prototype.onlogincomplete = function() {
    this.closeLoginWindow();
  };

  LoginView.prototype.onloginfailure = function() {
  };

  LoginView.prototype.onloginstart = function(emitter, event, causedByUser) {
    if (causedByUser) {
      this.openLoginWindow();
      this.loginPolling();
    } else if (this.isLoginWindowOpen()) {
      this.loginPolling();
    }
  };

  return LoginView;
});
