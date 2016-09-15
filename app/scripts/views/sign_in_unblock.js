/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(function (require, exports, module) {
  'use strict';

  const Account = require('models/account');
  const AuthErrors = require('lib/auth-errors');
  const Cocktail = require('cocktail');
  const ExternalLinksMixin = require('views/mixins/external-links-mixin');
  const FormView = require('views/form');
  const preventDefaultThen = require('views/base').preventDefaultThen;
  const ResendMixin = require('views/mixins/resend-mixin');
  const ResumeTokenMixin = require('views/mixins/resume-token-mixin');
  const SignInMixin = require('views/mixins/signin-mixin');
  const Template = require('stache!templates/sign_in_unblock');

  const View = FormView.extend({
    template: Template,
    className: 'sign-in-unblock',

    getAccount () {
      return this.model.get('account') || new Account({ email: 'testuser@testuser.com' });
    },

    beforeRender () {
      return this._sendUnblockEmail();
    },

    context () {
      const email = this.getAccount().get('email');

      return {
        email
      };
    },

    submit () {
      const account = this.getAccount();
      const password = this.model.get('password');
      const unblockCode = this.getElementValue('#unblock_code');

      return this.signIn(account, password, unblockCode)
        .fail((err) => this.onSignInError(account, password, err));
    },

    onSignInError (account, password, err) {
      if (AuthErrors.is(err, 'INVALID_PASSWORD')) {
        // The user must go enter the correct password this time.
        this.navigate('signin', {
          email: account.get('email'),
          error: err
        });
      } else {
        // re-throw, it'll be displayed at a lower level.
        throw err;
      }
    },

    resend () {
      return this._sendUnblockEmail()
    },

    _sendUnblockEmail () {
      return this.getAccount().sendUnblockEmail();
    }
  });

  Cocktail.mixin(
    View,
    ExternalLinksMixin,
    ResendMixin,
    ResumeTokenMixin,
    SignInMixin
  );

  module.exports = View;
});
