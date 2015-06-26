'use strict';

var Benchmark = require('benchmark'),
    PubSub = require('../upubsub'),
    EventEmitter2 = require('eventemitter2').EventEmitter2;

var pubsub = PubSub();
pubsub.subscribeGlobal(function () {});

var pubsubProduction = PubSub.Production();
pubsubProduction.subscribeGlobal(function () {});

var emitter2 = new EventEmitter2();
emitter2.on('*', function () {});

new Benchmark.Suite()

  .add('uPubSub Production', function() {
    pubsubProduction.publish('test');
  })

  .add('EventEmitter2', function() {
    emitter2.emit('test');
  })

  .add('uPubSub', function() {
    pubsub.publish('test');
  })

  .on('cycle', function(event, bench) {
    console.log(String(event.target));
  })

  .on('complete', function() {
    console.log('\nFastest is ' + this.filter('fastest').pluck('name'));
  })

  .run(true);
