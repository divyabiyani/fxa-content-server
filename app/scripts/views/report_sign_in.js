/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(function (require, exports, module) {
  'use strict';

  const AuthErrors = require('lib/auth-errors');
  const FormView = require('views/form');
  const Template = require('stache!templates/report_sign_in');
  const VerificationInfo = require('models/verification/report-sign-in');

  const View = FormView.extend({
    className: 'report-sign-in',
    template: Template,

    initialize () {
      this._verificationInfo = new VerificationInfo(this.getSearchParams());
    },

    beforeRender () {
      const verificationInfo = this._verificationInfo;
      if (! verificationInfo.isValid()) {
        // One or more parameters fails validation. Abort and show an
        // error message before doing any more checks.
        this.logError(AuthErrors.toError('DAMAGED_REJECT_UNBLOCK_LINK'));
      }
    },

    submit () {
      const verificationInfo = this._verificationInfo;

      return verificationInfo.report(this.user)
        .then(() => {
          this.navigate('/signin_reported');
        });
    },

    context () {
      const verificationInfo = this._verificationInfo;

      const isLinkExpired = verificationInfo.isExpired();
      const isLinkDamaged = ! verificationInfo.isValid();
      const isLinkValid = ! isLinkExpired && ! isLinkDamaged;

      return {
        isLinkDamaged,
        isLinkExpired,
        isLinkValid
      };
    }
  });

  module.exports = View;
});

