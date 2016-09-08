/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * A model to hold reject-unblock-code data
 */

define(function (require, exports, module) {
  'use strict';

  //const Validate = require('lib/validate');
  const VerificationInfo = require('./base');

  module.exports = VerificationInfo.extend({
    defaults: {
      unblockCodeId: null,
      uid: null
    },

    validation: {
      uid: () => true,
      unblockCodeId: () => true
    }
  });
});

