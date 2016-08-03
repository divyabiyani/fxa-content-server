/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(function (require, exports, module) {
  'use strict';

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

    events: {
      'click #resend': preventDefaultThen('resend')
    },

    getAccount () {
      return this.model.get('account');
    },

    submit () {
      const account = this.getAccount();
      const password = this.model.get('password');
      const unblockCode = this.getElementValue('#unblock_code');

      return this.signIn(account, password, unblockCode)
        .fail((err) => this.onSignInError(account, password, err));
    },

    context () {
      const email = this.getAccount().get('email');

      return {
        email
      };
    },

    onSignInError (account, password, err) {
      this.navigate('signin', {
        email: account.get('email'),
        error: err
      });
    },

    resend () {
      // a bit screwy, the ResendMixin was made to be used on FormViews. I'm
      // trying to avoid a FormView and instead do things the right way.
      return this.beforeSubmit()
        .then((shouldResend) => {
          if (! shouldResend) {
            return;
          }

          return this.getAccount().sendUnblockEmail()
            .then(() => this.displaySuccess());
        });
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
