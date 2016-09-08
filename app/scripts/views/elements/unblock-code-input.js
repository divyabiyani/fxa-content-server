/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(function (require, exports, module) {
  'use strict';

  const AuthErrors = require('lib/auth-errors');

  return {
    match ($el) {
      return $el.attr('type') === 'number' && $el.hasClass('unblock-code');
    },

    validate () {
      const isRequired = typeof this.attr('required') !== 'undefined';
      const value = this.val();

      if (isRequired && ! value.length) {
        throw AuthErrors.toError('UNBLOCK_CODE_REQUIRED');
      } else if (value.length !== 6) {
        throw AuthErrors.toError('INVALID_UNBLOCK_CODE');
      }
    }
  };
});

