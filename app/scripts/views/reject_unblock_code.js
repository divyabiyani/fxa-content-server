/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(function (require, exports, module) {
  'use strict';

  const AuthErrors = require('lib/auth-errors');
  const BaseView = require('views/base');
  const Template = require('stache!templates/reject_unblock_code');
  const Url = require('lib/url');
  const VerificationInfo = require('models/verification/reject-unblock-code');

  const View = BaseView.extend({
    className: 'reject-unblock-code',
    template: Template,

    initialize (options = {}) {
      const searchParams = Url.searchParams(this.window.location.search);
      this._verificationInfo = new VerificationInfo(searchParams);
    },

    beforeRender () {
      const verificationInfo = this._verificationInfo;
      if (! verificationInfo.isValid()) {
        // One or more parameters fails validation. Abort and show an
        // error message before doing any more checks.
        this.logError(AuthErrors.toError('DAMAGED_REJECT_UNBLOCK_LINK'));
        return;
      }

      const unblockCodeId = verificationInfo.get('unblockCodeId');
      const uid = verificationInfo.get('uid');
      const account = this.user.initAccount({ uid });
      /*
      return account.rejectUnblockCode(unblockCode)
        .fail((err) => this._error = err);
        */
    },

    afterRender () {
    },

    context () {
      const verificationInfo = this._verificationInfo;
      const isLinkExpired = verificationInfo.isExpired();
      const doesLinkValidate = verificationInfo.isValid();

      return {
        error: this._error,
        isLinkDamaged: ! doesLinkValidate,
        isLinkExpired: isLinkExpired,
        isReported: doesLinkValidate && ! isLinkExpired && ! this._error
      };
    }
  });

  module.exports = View;
});

