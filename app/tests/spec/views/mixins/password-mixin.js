/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(function (require, exports, module) {
  'use strict';

  const $ = require('jquery');
  const { assert } = require('chai');
  const AuthErrors = require('lib/auth-errors');
  const BaseView = require('views/base');
  const Cocktail = require('cocktail');
  const Metrics = require('lib/metrics');
  const Notifier = require('lib/channels/notifier');
  const PasswordMixin = require('views/mixins/password-mixin');
  const sinon = require('sinon');
  const TestHelpers = require('../../../lib/helpers');
  const TestTemplate = require('stache!templates/test_template');
  const WindowMock = require('../../../mocks/window');

  const PasswordView = BaseView.extend({
    template: TestTemplate
  });

  Cocktail.mixin(
    PasswordView,
    PasswordMixin
  );

  describe('views/mixins/password-mixin', function () {
    let metrics;
    let notifier;
    let view;
    let windowMock;

    beforeEach(function () {
      notifier = new Notifier();
      metrics = new Metrics({ notifier });
      windowMock = new WindowMock();

      view = new PasswordView({
        metrics: metrics,
        viewName: 'password-view',
        window: windowMock
      });

      return view.render();
    });

    describe('afterRender', function () {
      it('checks whether `show` should be added to each password element', () => {
        sinon.spy(view, '_shouldCreateShowPasswordLabel');

        view.afterRender();
        assert.equal(view._shouldCreateShowPasswordLabel.callCount, 4);

        // no show-password labels added w/o a password
        assert.lengthOf(view.$('.show-password-label'), 0);
      });
    });

    describe('onShowPasswordMouseDown', function () {
      it('shows the password', () => {
        sinon.spy(view, 'showPassword');

        const e = $.Event('keyup');
        e.target = view.$('#password');

        view.onShowPasswordMouseDown(e);

        assert.isTrue(view.showPassword.calledOnce);
      });
    });

    describe('show passwordHelper', () => {
      it('set warning opacity to 1 if any password length is less than 8', () => {
        view.$('#password').val('1234');
        view.$('#vpassword').val('12345678');
        view.$('#old_password').val('12345678');
        view.$('#new_password').val('12345678');
        const e = $.Event('keyup');
        e.target = view.$('#password');
        view.onPasswordChanged(e);
        assert.equal(view.$('.input-help').css('opacity'), '1');
        assert.equal(view.$('.input-help-forgot-pw').css('opacity'), '1');
      });
    });

    describe('hide passwordHelper', () => {
      it('set warning opacity to 0 if password length is greater than or equal to 8', () => {
        view.$('#password').val('12345678');
        view.$('#vpassword').val('12345678');
        view.$('#old_password').val('12345678');
        view.$('#new_password').val('123456789');
        const e = $.Event('keyup');
        e.target = view.$('#password');
        view.onPasswordChanged(e);
        assert.equal(view.$('.input-help').css('opacity'), '0');
        assert.equal(view.$('.input-help-forgot-pw').css('opacity'), '1');
      });
    });

    describe('show password visibility', () => {
      function testPasswordEntered (eventName) {
        it(`${eventName} with password adds show password label`, () => {
          const $passwordField = view.$('#password');
          $passwordField.val('asdf');

          let $showPasswordLabel = view.$('#password ~ .show-password-label');
          // label not added until event is triggered.
          assert.lengthOf($showPasswordLabel, 0);

          view.$('#password').trigger(eventName);

          $showPasswordLabel = view.$('#password ~ .show-password-label');
          assert.lengthOf($showPasswordLabel, 1);
        });
      }

      function testNoPasswordEntered (eventName) {
        it(`${eventName} without password does not show label`, () => {
          const $passwordField = view.$('#password');
          $passwordField.val('');
          view.$('#password').trigger(eventName);

          const $showPasswordLabel = view.$('#password ~ .show-password-label');
          assert.lengthOf($showPasswordLabel, 0);
        });
      }

      testNoPasswordEntered('change');
      testPasswordEntered('change');
      testNoPasswordEntered('keyup');
      testPasswordEntered('keyup');
    });

    describe('show/hide button behavior', () => {
      describe('without a password', () => {
        it('adds password when a password is entered, hides when none', () => {
          // password is initially empty
          assert.lengthOf(view.$('.show-password-label'), 0);

          // user types first character
          const $passwordField = view.$('#password');
          $passwordField.val('a');
          view.onPasswordChanged({ target: $passwordField.get(0) });

          assert.lengthOf(view.$('.show-password-label'), 1);
          assert.isFalse($passwordField.hasClass('empty'));

          // user deletes password
          $passwordField.val('');
          view.onPasswordChanged({ target: $passwordField.get(0) });

          // label not taken away, just hidden.
          assert.lengthOf(view.$('.show-password-label'), 1);
          assert.isTrue($passwordField.hasClass('empty'));


          // user re-enters first character
          $passwordField.val('b');
          view.onPasswordChanged({ target: $passwordField.get(0) });

          // label not re-added, just visible
          assert.lengthOf(view.$('.show-password-label'), 1);
          assert.isFalse(view.$('.password').hasClass('empty'));
        });
      });

      describe('with a password entered', () => {
        beforeEach(() => {
          // ensure the password field contains text
          const $passwordField = view.$('#password');
          $passwordField.val('asdf');
          view.onPasswordChanged({ target: $passwordField.get(0) });
        });

        it('works with mouse events', () => {
          view.$('#password ~ .show-password-label').trigger('mousedown');
          assert.equal(view.$('#password').attr('type'), 'text');

          $(windowMock).trigger('mouseup');

          assert.equal(view.$('#password').attr('type'), 'password');
        });

        it('works with touch events', () => {
          view.$('.show-password-label').trigger('touchstart');
          assert.equal(view.$('#password').attr('type'), 'text');

          $(windowMock).trigger('touchend');

          assert.equal(view.$('#password').attr('type'), 'password');
        });

        it('logs whether the password is shown or hidden', function () {
          view.$('.show-password-label').trigger('mousedown');
          assert.isTrue(TestHelpers.isEventLogged(metrics,
                            'password-view.password.visible'));
          // the password has not been hidden yet.
          assert.isFalse(TestHelpers.isEventLogged(metrics,
                            'password-view.password.hidden'));

          $(windowMock).trigger('mouseup');
          assert.isTrue(TestHelpers.isEventLogged(metrics,
                            'password-view.password.hidden'));
        });

        it('showPassword shows a password', () => {
          const $passwordEl = view.$('#password');
          $passwordEl.val('password');

          view.showPassword('#password');

          assert.equal($passwordEl.attr('type'), 'text');
          assert.equal($passwordEl.attr('autocapitalize'), 'off');
          assert.equal($passwordEl.attr('autocorrect'), 'off');

          // Ensure the show password state stays in sync
          const $showPasswordEl = $passwordEl.siblings('.show-password');
          assert.isTrue($showPasswordEl.is(':checked'));
        });

        it('hidePassword hides a visible password', () => {
          view.showPassword('#password');
          view.hidePassword('#password');

          const $passwordEl = view.$('#password');
          assert.equal($passwordEl.attr('autocomplete'), null);
          assert.equal($passwordEl.attr('autocapitalize'), null);
          assert.equal($passwordEl.attr('autocorrect'), null);

          // Ensure the show password state stays in sync
          const $showPasswordEl = $passwordEl.siblings('.show-password');
          assert.isFalse($showPasswordEl.is(':checked'));
        });

        it('getAffectedPasswordInputs - gets all affected inputs', function () {
          let targets = view.getAffectedPasswordInputs('#show-password');
          assert.equal(targets.length, 1);

          view.$('#show-password').data('synchronize-show', 'true');
          targets = view.getAffectedPasswordInputs('#show-password');
          assert.equal(targets.length, 2);
        });
      });
    });


    describe('hideVisiblePasswords', () => {
      it('sets all password fields to type `password`', () => {
        const $passwordEls = view.$('.password');

        assert.equal($passwordEls.length, 2);

        $passwordEls.each((index, el) => {
          view.showPassword(el);
          assert.equal(el.type, 'text');
        });

        view.hideVisiblePasswords();

        $passwordEls.each((i, el) => {
          assert.equal(el.type, 'password');
        });
      });
    });

    describe('submitStart event', () => {
      beforeEach(() => {
        sinon.spy(view, 'hideVisiblePasswords');
      });

      it('hides all visible passwords', () => {
        assert.equal(view.hideVisiblePasswords.callCount, 0);
        view.trigger('submitStart');
        assert.equal(view.hideVisiblePasswords.callCount, 1);
      });
    });

    describe('_logErrorConvertingPasswordType', () => {
      it('logs an error when password type cannot be converted', () => {
        const $mockEl = {
          attr () {
            return 'password';
          }
        };

        sinon.spy(view, 'logError');

        view._logErrorConvertingPasswordType($mockEl);

        assert.isTrue(view.logError.calledOnce);
        const err = view.logError.args[0][0];
        assert.isTrue(AuthErrors.is(err, 'CANNOT_CHANGE_INPUT_TYPE'));
        assert.equal(err.type, 'password');
      });
    });
  });
});
