'use strict';

var expect = require('chai').expect,
    uPubSub = require('../upubsub');

describe('The uPubSub class', function() {
  var upubsub;

  beforeEach(function () {
    upubsub = new uPubSub();
  });

  it('should allow subscription', function () {
    upubsub.subscribe('foo', function () {});
  });

  it('should allow unsubscription', function () {
    var called = false, f = function () {
      called = true;
    };

    upubsub.subscribe('foo', f);
    upubsub.unsubscribe('foo', f);

    upubsub.publish('foo');

    process.nextTick(function () {
      expect(called).to.be.false;
    });
  });

  it('should throw if unsubscribing from an event that has not been subscribed to', function () {
    expect(function () {
      upubsub.unsubscribe('bar', function () {});
    }).to.throw();
  });

  it('should emit events to subscribers', function (done) {
    var f = function () {
      done();
    };

    upubsub.subscribe('foo', f);
    upubsub.publish('foo');
  });

  it('should allow subscription to all events', function (done) {
    var f = function () {
      done();
    };

    upubsub.subscribeGlobal(f);
    upubsub.publish('foo');
  });

  it('should allow unsubscription for global subs', function () {
    var called = false, f = function () {
      called = true;
    };

    upubsub.subscribeGlobal(f);
    upubsub.unsubscribeGlobal(f);
    upubsub.publish('foo');

    process.nextTick(function () {
      expect(called).to.be.false;
    });
  });

  it('should throw if globally unsubscribing from an event that has not been subscribed to', function () {
    expect(function () {
      upubsub.unsubscribeGlobal(function () {});
    }).to.throw();
  });

  it('should receive message in normal events', function (done) {
    upubsub.subscribe("eventName", function (message) {
      expect(message).to.equal("foo");
      done();
    });

    upubsub.publish("eventName", "foo");
  });

  it('should receive event name and message in global events', function (done) {
    upubsub.subscribeGlobal(function (eventName, message) {
      expect(eventName).to.equal("eventName");
      expect(message).to.equal("foo");
      done();
    });

    upubsub.publish("eventName", "foo");
  });

  it('should redefine "this" in normal events', function (done) {
    var o = {
      handler: function (message) {
        expect(this).to.equal(o);
        done();
      }
    };

    upubsub.subscribe("eventName", o.handler, o);
    upubsub.publish("eventName", "foo");
  });

  it('should redefine "this" in global events', function (done) {
    var o = {
      handler: function (eventName, message) {
        expect(this).to.equal(o);
        done();
      }
    };

    upubsub.subscribeGlobal(o.handler, o);
    upubsub.publish("eventName", "foo");
  });
});
