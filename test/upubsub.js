'use strict';

var expect = require('chai').expect,
    uPubSub = require('../upubsub');

[
  {
    name: "uPubSub",
    constructor: uPubSub,
  },
  {
    name: "uPubSub.Production",
    constructor: uPubSub.Production,
  },
].forEach(function (type) {

  describe(type.name, function() {
    var upubsub;

    beforeEach(function () {
      upubsub = type.constructor();
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
        expect(called).to.be.false();
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

    it('should emit events to multiple subscribers', function (done) {
      upubsub.subscribe('foo', function () {});
      upubsub.subscribe('foo', function () { done(); });

      upubsub.publish('foo');
    });

    it('should no nothing if an event type is emitted for which there are no listeners', function () {
      upubsub.publish("no listeners for this one");
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
        expect(called).to.be.false();
      });
    });

    it('should throw if globally unsubscribing from an event that has not been subscribed to', function () {
      expect(function () {
        upubsub.unsubscribeGlobal(function () {});
      }).to.throw();
    });

    it('should receive message in normal events', function (done) {
      upubsub.subscribe("eventType", function (message) {
        expect(message).to.equal("foo");
        done();
      });

      upubsub.publish("eventType", "foo");
    });

    it('should receive multiple args in normal events', function (done) {
      upubsub.subscribe("event0", function () {
        expect(arguments.length).to.equal(0);
      });

      upubsub.subscribe("event1", function (a1) {
        expect(arguments.length).to.equal(1);
        expect(a1).to.equal(1);
      });

      upubsub.subscribe("event2", function (a1, a2) {
        expect(arguments.length).to.equal(2);
        expect(a1).to.equal(1);
        expect(a2).to.equal(2);
      });

      upubsub.subscribe("event3", function (a1, a2, a3) {
        expect(arguments.length).to.equal(3);
        expect(a1).to.equal(1);
        expect(a2).to.equal(2);
        expect(a3).to.equal(3);
      });

      upubsub.subscribe("event4", function (a1, a2, a3, a4) {
        expect(arguments.length).to.equal(4);
        expect(a1).to.equal(1);
        expect(a2).to.equal(2);
        expect(a3).to.equal(3);
        expect(a4).to.equal(4);
      });

      upubsub.subscribe("event5", function (a1, a2, a3, a4, a5) {
        expect(arguments.length).to.equal(5);
        expect(a1).to.equal(1);
        expect(a2).to.equal(2);
        expect(a3).to.equal(3);
        expect(a4).to.equal(4);
        expect(a5).to.equal(5);
      });

      upubsub.subscribe("event10", function (a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
        expect(arguments.length).to.equal(10);
        expect(a1).to.equal(1);
        expect(a2).to.equal(2);
        expect(a3).to.equal(3);
        expect(a4).to.equal(4);
        expect(a5).to.equal(5);
        expect(a6).to.equal(6);
        expect(a7).to.equal(7);
        expect(a8).to.equal(8);
        expect(a9).to.equal(9);
        expect(a10).to.equal(10);

        done();
      });

      upubsub.publish("event0");
      upubsub.publish("event1", 1);
      upubsub.publish("event2", 1, 2);
      upubsub.publish("event3", 1, 2, 3);
      upubsub.publish("event4", 1, 2, 3, 4);
      upubsub.publish("event5", 1, 2, 3, 4, 5);
      upubsub.publish("event10", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
    });

    it('should receive event type and message in global events', function (done) {
      upubsub.subscribeGlobal(function (eventType, message) {
        expect(eventType).to.equal("eventType");
        expect(message).to.equal("foo");
        done();
      });

      upubsub.publish("eventType", "foo");
    });

    it('should receive event type and multiple args in global events', function (done) {
      upubsub.subscribeGlobal(function (type, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
        switch (type) {
          case "type0":
            expect(arguments.length).to.equal(1);
            break;
          case "type1":
            expect(arguments.length).to.equal(2);
            expect(a1).to.equal(1);
            break;
          case "type2":
            expect(arguments.length).to.equal(3);
            expect(a1).to.equal(1);
            expect(a2).to.equal(2);
            break;
          case "type3":
            expect(arguments.length).to.equal(4);
            expect(a1).to.equal(1);
            expect(a2).to.equal(2);
            expect(a3).to.equal(3);
            break;
          case "type4":
            expect(arguments.length).to.equal(5);
            expect(a1).to.equal(1);
            expect(a2).to.equal(2);
            expect(a3).to.equal(3);
            expect(a4).to.equal(4);
            break;
          case "type5":
            expect(arguments.length).to.equal(6);
            expect(a1).to.equal(1);
            expect(a2).to.equal(2);
            expect(a3).to.equal(3);
            expect(a4).to.equal(4);
            expect(a5).to.equal(5);
            break;
          case "type10":
            expect(arguments.length).to.equal(11);
            expect(a1).to.equal(1);
            expect(a2).to.equal(2);
            expect(a3).to.equal(3);
            expect(a4).to.equal(4);
            expect(a5).to.equal(5);
            expect(a6).to.equal(6);
            expect(a7).to.equal(7);
            expect(a8).to.equal(8);
            expect(a9).to.equal(9);
            expect(a10).to.equal(10);

            done();
            break;
          default:
            throw Error("Unexpected event type: " + type);
        }
      });

      upubsub.publish("type0");
      upubsub.publish("type1", 1);
      upubsub.publish("type2", 1, 2);
      upubsub.publish("type3", 1, 2, 3);
      upubsub.publish("type4", 1, 2, 3, 4);
      upubsub.publish("type5", 1, 2, 3, 4, 5);
      upubsub.publish("type10", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
    });

    it('should subscribe without receiving previously-published events', function (done) {
      upubsub.publish("foo");

      upubsub.subscribe("foo", function () {
        throw Error("Shouldn't get here");
      });

      upubsub.subscribe("bar", function () {
        done();
      });

      upubsub.publish("bar");
    });
  });
});

describe('with its async nature', function () {
  it('should publish events async', function (done) {
    var upubsub = uPubSub(), check = 123;

    upubsub.subscribe("test", function () {
      check = 456;
      done();
    });

    upubsub.publish("test");
    expect(check).to.equal(123);
  });
});
