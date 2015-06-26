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
    pubsubProduction.publish('test', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
  })

  .add('EventEmitter2', function() {
    emitter2.emit('test', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
  })

  .add('uPubSub', function() {
    pubsub.publish('test', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
  })

  .on('cycle', function(event, bench) {
    console.log(String(event.target));
  })

  .on('complete', function() {
    console.log('\nFastest is ' + this.filter('fastest').pluck('name'));
  })

  .run(true);
