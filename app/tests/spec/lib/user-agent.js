/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(function (require, exports, module) {
  'use strict';

  const { assert } = require('chai');
  const UserAgent = require('lib/user-agent');

  describe('lib/user-agent', () => {
    it('returns the original correct interface', () => {
      const uap = new UserAgent();

      assert.ok(uap.browser);
      assert.ok(uap.os);
      assert.isFunction(uap.isAndroid);
      assert.isFunction(uap.isIos);
      assert.isFunction(uap.isFirefox);
    });

    describe('isAndroid', () => {
      it('returns `true` if on Android', () => {
        const androidUserAgentStrings = [
          // chrome
          'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) ' +
          'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.35 ' +
          'Mobile Safari/537.36',
          // fx
          'Mozilla/5.0 (Android 4.4; Tablet; rv:46.0) Gecko/46.0 Firefox/46.0',
          // opera
          'Opera/12.02 (Android 4.1; Linux; Opera Mobi/ADR-1111101157; U; ' +
          'en-US) Presto/2.9.201 Version/12.02'
        ];

        androidUserAgentStrings.forEach((userAgentString) => {
          const uap = new UserAgent(userAgentString);
          assert.isTrue(uap.isAndroid());
        });
      });

      it('returns `false` if not on Android', () => {
        const notAndroidUserAgentStrings = [
          // chrome desktop
          'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/55.0.2883.35 Safari/537.36',
          // fx desktop
          'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:46.0) Gecko/20100101 Firefox/46.0',
          // fx ios
          'Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) ' +
          'AppleWebKit/600.1.4 (KHTML, like Gecko) FxiOS/1.0 Mobile/12F69 Safari/600.1.4'
        ];

        notAndroidUserAgentStrings.forEach((userAgentString) => {
          const uap = new UserAgent(userAgentString);
          assert.isFalse(uap.isAndroid());
        });
      });
    });

    describe('isIos', () => {
      it('returns `true` if on iOS', () => {
        const iosUserAgentStrings = [
          // fx
          'Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) ' +
          'AppleWebKit/600.1.4 (KHTML, like Gecko) FxiOS/1.0 Mobile/12F69 Safari/600.1.4',
          // chrome
          'Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1 ' +
          '(KHTML, like Gecko) CriOS/55.0.2883.35 Mobile/13B143 Safari/601.1.46',
          // safari
          'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) ' +
          'AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B137 Safari/601.1'
        ];

        iosUserAgentStrings.forEach((userAgentString) => {
          const uap = new UserAgent(userAgentString);
          assert.isTrue(uap.isIos());
        });
      });

      it('returns `false` if not on iOS', () => {
        const notIosUserAgentStrings = [
          // chrome desktop
          'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/55.0.2883.35 Safari/537.36',
          // fx desktop
          'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:46.0) Gecko/20100101 Firefox/46.0',
          // fx android
          'Mozilla/5.0 (Android 4.4; Tablet; rv:46.0) Gecko/46.0 Firefox/46.0',
          // edge
          'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia ' +
          '640 XL LTE) AppleWebKit/537.36 (KHTML, like Gecko) ' +
          'Chrome/42.0.2311.135 Mobile Safari/537.36 Edge/12.10166'
        ];

        notIosUserAgentStrings.forEach((userAgentString) => {
          const uap = new UserAgent(userAgentString);
          assert.isFalse(uap.isIos());
        });
      });
    });

    describe('isFirefox', () => {
      it('returns `true` if in Firefox', () => {
        const firefoxUserAgentStrings = [
          // android
          'Mozilla/5.0 (Android 4.4; Tablet; rv:46.0) Gecko/46.0 Firefox/46.0',
          // ios
          'Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) ' +
          'AppleWebKit/600.1.4 (KHTML, like Gecko) FxiOS/1.0 Mobile/12F69 Safari/600.1.4',
          // linux
          'Mozilla/5.0 (X11; Linux x86_64; rv:46.0) Gecko/20100101 Firefox/46.0',
          // mac
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:46.0) Gecko/20100101 Firefox/46.0',
          // windows
          'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:46.0) Gecko/20100101 Firefox/46.0'
        ];

        firefoxUserAgentStrings.forEach((userAgentString) => {
          const uap = new UserAgent(userAgentString);
          assert.isTrue(uap.isFirefox());
        });
      });

      it('returns `false` if not in Firefox', () => {
        const notFirefoxUserAgentStrings = [
          // Chrome desktop
          'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/55.0.2883.35 Safari/537.36',
          // Edge
          'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia ' +
          '640 XL LTE) AppleWebKit/537.36 (KHTML, like Gecko) ' +
          'Chrome/42.0.2311.135 Mobile Safari/537.36 Edge/12.10166',
          // safari
          'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) ' +
          'AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B137 Safari/601.1'
        ];

        notFirefoxUserAgentStrings.forEach((userAgentString) => {
          const uap = new UserAgent(userAgentString);
          assert.isFalse(uap.isFirefox());
        });
      });
    });

    describe('isFirefoxAndroid', () => {
      it('returns `true` if it detects Fennec', () => {
        const fennecUserAgents = [
          'Mozilla/5.0 (Android 4.4; Mobile; rv:46.0) Gecko/46.0 Firefox/46.0',
          'Mozilla/5.0 (Android 4.4; Tablet; rv:46.0) Gecko/46.0 Firefox/46.0'
        ];

        fennecUserAgents.forEach((userAgentString) => {
          const uap = new UserAgent(userAgentString);
          assert.isTrue(uap.isFirefoxAndroid(), userAgentString);
        });
      });

      it('returns `false` if not Fennec', () => {
        const notFennecUserAgents = [
          // fx desktop
          'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:46.0) Gecko/20100101 Firefox/46.0',
          // Chrome desktop
          'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 ' +
              '(KHTML, like Gecko) Chrome/55.0.2883.35 Safari/537.36',
          // Edge
          'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia ' +
              '640 XL LTE) AppleWebKit/537.36 (KHTML, like Gecko) ' +
              'Chrome/42.0.2311.135 Mobile Safari/537.36 Edge/12.10166',
          // Chrome Android
          'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) ' +
              'AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19'
        ];

        notFennecUserAgents.forEach((userAgentString) => {
          const uap = new UserAgent(userAgentString);
          assert.isFalse(uap.isFirefoxAndroid(), userAgentString);
        });
      });
    });

    describe('isFirefoxIos', () => {
      it('returns `true` if it detects Fx on iOS', () => {
        const fxIosUserAgents = [
          'Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) ' +
              'AppleWebKit/600.1.4 (KHTML, like Gecko) FxiOS/1.0 Mobile/12F69 Safari/600.1.4'
        ];

        fxIosUserAgents.forEach((userAgentString) => {
          const uap = new UserAgent(userAgentString);
          assert.isTrue(uap.isFirefoxIos(), userAgentString);
        });
      });

      it('returns `false` if not Fx on iOS', () => {
        const notFxIosUserAgents = [
          // fx desktop
          'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:46.0) Gecko/20100101 Firefox/46.0',
          // fennec
          'Mozilla/5.0 (Android 4.4; Mobile; rv:46.0) Gecko/46.0 Firefox/46.0',
          'Mozilla/5.0 (Android 4.4; Tablet; rv:46.0) Gecko/46.0 Firefox/46.0',
          // Chrome desktop
          'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 ' +
              '(KHTML, like Gecko) Chrome/55.0.2883.35 Safari/537.36',
          // Edge
          'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia ' +
              '640 XL LTE) AppleWebKit/537.36 (KHTML, like Gecko) ' +
              'Chrome/42.0.2311.135 Mobile Safari/537.36 Edge/12.10166',
          // Chrome Android
          'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) ' +
              'AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19'
        ];

        notFxIosUserAgents.forEach((userAgentString) => {
          const uap = new UserAgent(userAgentString);
          assert.isFalse(uap.isFirefoxIos(), userAgentString);
        });
      });
    });

    describe('isFirefoxDesktop', () => {
      it('returns `true` if it detects Fx Desktop', () => {
        const fxDesktopUserAgents = [
          // windows
          'Mozilla/5.0 (Windows NT x.y; rv:10.0) Gecko/20100101 Firefox/10.0',
          'Mozilla/5.0 (Windows NT x.y; Win64; x64; rv:10.0) Gecko/20100101 Firefox/10.0',
          'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:46.0) Gecko/20100101 Firefox/46.0',
          // mac
          'Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:10.0) Gecko/20100101 Firefox/10.0',
          'Mozilla/5.0 (Macintosh; PPC Mac OS X x.y; rv:10.0) Gecko/20100101 Firefox/10.0',
          // linux
          'Mozilla/5.0 (X11; Linux i686; rv:10.0) Gecko/20100101 Firefox/10.0',
          'Mozilla/5.0 (X11; Linux x86_64; rv:10.0) Gecko/20100101 Firefox/10.0',
          'Mozilla/5.0 (X11; Linux i686 on x86_64; rv:10.0) Gecko/20100101 Firefox/10.0'
        ];

        fxDesktopUserAgents.forEach((userAgentString) => {
          const uap = new UserAgent(userAgentString);
          assert.isTrue(uap.isFirefoxDesktop(), userAgentString);
        });
      });

      it('returns `false` if not Fx Desktop', () => {
        const notFxDesktopUserAgents = [
          // fx ios
          'Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) ' +
              'AppleWebKit/600.1.4 (KHTML, like Gecko) FxiOS/1.0 Mobile/12F69 Safari/600.1.4',
          // fennec
          'Mozilla/5.0 (Android 4.4; Mobile; rv:46.0) Gecko/46.0 Firefox/46.0',
          'Mozilla/5.0 (Android 4.4; Tablet; rv:46.0) Gecko/46.0 Firefox/46.0',
          // Chrome desktop
          'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 ' +
              '(KHTML, like Gecko) Chrome/55.0.2883.35 Safari/537.36',
          // Edge
          'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia ' +
              '640 XL LTE) AppleWebKit/537.36 (KHTML, like Gecko) ' +
              'Chrome/42.0.2311.135 Mobile Safari/537.36 Edge/12.10166',
          // Chrome Android
          'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) ' +
              'AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19'
        ];

        notFxDesktopUserAgents.forEach((userAgentString) => {
          const uap = new UserAgent(userAgentString);
          assert.isFalse(uap.isFirefoxDesktop(), userAgentString);
        });
      });
    });

    describe('isMobileSafari', () => {
      it('returns `true` if it detects Mobile Safari', () => {
        const mobileSafariUserAgents = [
          // iPhone, iOS 10.1.1
          'Mozilla/5.0 (iPhone; CPU iPhone OS 10_1_1 like Mac OS X) ' +
          'AppleWebKit/602.2.14 (KHTML, like Gecko) Version/10.0 Mobile/14B100 Safari/602.1',
          // iPad, iOS 10.1.1
          'Mozilla/5.0 (iPad; CPU OS 10_1_1 like Mac OS X) AppleWebKit/602.2.14 (KHTML, like Gecko) ' +
          'Version/10.0 Mobile/14B100 Safari/602.1'
        ];

        mobileSafariUserAgents.forEach((userAgentString) => {
          const uap = new UserAgent(userAgentString);
          assert.isTrue(uap.isMobileSafari());
        });
      });

      it('returns `false` if not Mobile Safari', () => {
        const notMobileSafari = [
          // Chrome desktop
          'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/55.0.2883.35 Safari/537.36',
          // Edge
          'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia ' +
          '640 XL LTE) AppleWebKit/537.36 (KHTML, like Gecko) ' +
          'Chrome/42.0.2311.135 Mobile Safari/537.36 Edge/12.10166',
          // Chrome Android
          'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) ' +
          'AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19'
        ];

        notMobileSafari.forEach((userAgentString) => {
          const uap = new UserAgent(userAgentString);
          assert.isFalse(uap.isMobileSafari());
        });
      });

      describe('parseVersion', () => {
        it('returns expected major, minor, patch', () => {
          const toTest = {
            'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19': {
              major: 18,
              minor: 0,
              patch: 1025
            },

            'Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:10.0) Gecko/20100101 Firefox/10.0': {
              major: 10,
              minor: 0,
              patch: 0
            },

            'Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) FxiOS/6.1 Mobile/12F69 Safari/600.1.4': {
              major: 6,
              minor: 1,
              patch: 0
            }

          };

          for (const userAgentString in toTest) {
            testParseVersion(userAgentString);
          }

          function testParseVersion(userAgentString) {
            const uap = new UserAgent(userAgentString);
            const version = uap.parseVersion();
            const expected = toTest[userAgentString];
            assert.deepEqual(version, expected);
          }
        });
      });
    });
  });
});
