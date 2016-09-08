/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(function (require, exports, module) {
  'use strict';

  const KeyCodes = require('lib/key-codes');

  const element = {
    match ($el) {
      return $el.attr('type') === 'number';
    },

    validate () {
      return true;
    },

    constrainInput (event) {
      function isKeyADigit(keyCode) {
        return (
          (keyCode >= KeyCodes.NUM_0 && keyCode <= KeyCodes.NUM_9) ||
          (keyCode >= KeyCodes.NUMPAD_0 && keyCode <= KeyCodes.NUMPAD_9)
        );
      }

      function isKeyASpecialCharacter (keyCode) {
        return (
          (keyCode === KeyCodes.ENTER) ||
          (keyCode === KeyCodes.BACKSPACE) ||
          (keyCode === KeyCodes.TAB) ||
          (keyCode === KeyCodes.LEFT_ARROW) ||
          (keyCode === KeyCodes.RIGHT_ARROW)
        );
      }

      if (isKeyADigit(event.which)) {
        const maxLengthAttr = this.attr('maxlength');
        const maxLength = maxLengthAttr ? parseInt(maxLengthAttr, 10) : Infinity;
        if (maxLength) {
          const val = this.val();
          if (val.length + 1 > maxLength) {
            event.preventDefault();
          }
        }
      } else if (! isKeyASpecialCharacter(event.which)) {
        event.preventDefault();
      }
    },

    upgrade () {
      this.on('keydown', element.constrainInput.bind(this));
      this.on('input', element.constrainInput.bind(this));
    }
  };

  module.exports = element;
});
