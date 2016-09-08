/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(function (require, exports, module) {
  'use strict';

  const assert = require('chai').assert;
  const Account = require('models/account');
  const Backbone = require('backbone');
  const BaseBroker = require('models/auth_brokers/base');
  const Metrics = require('lib/metrics');
  const p = require('lib/promise');
  const Relier = require('models/reliers/relier');
  const sinon = require('sinon');
  const View = require('views/sign_in_unblock');
  const WindowMock = require('../../mocks/window');

  describe('views/sign_in_unblock', () => {
    let account;
    let broker;
    let metrics;
    let model;
    let relier;
    let view;
    let windowMock;

    beforeEach(() => {
      metrics = new Metrics();
      model = new Backbone.Model();
      windowMock = new WindowMock();

      relier = new Relier({
        window: windowMock
      });

      broker = new BaseBroker({
        relier: relier,
        window: windowMock
      });

      account = new Account({
        email: 'a@a.com',
        uid: 'uid'
      });

      model.set({
        account: account
      });

      view = new View({
        broker: broker,
        canGoBack: true,
        metrics: metrics,
        model: model,
        relier: relier,
        viewName: 'sign-in-unblock',
        window: windowMock
      });

      return view.render()
        .then(() => $('#container').html(view.el));
    });

    afterEach(function () {
      metrics.destroy();

      view.remove();
      view.destroy();

      view = metrics = null;
    });

    describe('render', () => {
      it('renders the view', () => {
        assert.lengthOf($('#fxa-signin-unblock-header'), 1);
        assert.include(view.$('.verification-email-message').text(), 'a@a.com');
      });
    });

    describe('resend', () => {
      beforeEach(() => {
        sinon.stub(account, 'sendUnblockEmail', () => {
          return p();
        });

        return view.resend();
      });

      it('delegate to the account', () => {
        assert.isTrue(account.sendUnblockEmail.called);
      });
    });

    describe('submit', () => {
      describe('success', () => {
        it('delegates to the account, with the unblockCode', () => {
        });
      });
    });
  });
});
