uPubSub
=======

A micro-publish/subscribe library providing such revolutionary
functionality as "publish" and "subscribe", with no effort whatsoever to
recognise the concepts of "topics" or filtering. You won't find any
tokens here; it's all about functions and providing a quick and
lightweight way to decouple "stuff that happened" from "my reaction to
stuff that happened." The most advanced functionality this library has
is that you can subscribe to events at a "global" level, i.e. without
needing to know the event name. Crazy.

## Install it

    $ npm install --save upubsub

## Use it

```javascript
var uPubSub = require('upubsub'),
    upubsub = new uPubSub();

function handler(message) {
  console.log("Received message '" + message + "'");
}

upubsub.subscribe("foo", handler);
upubsub.publish("foo", "bar");
// outputs: "Received message 'bar'"
upubsub.unsubscribe("foo", handler);

function globalHandler(eventName, message) {
  console.log("Received event '" + eventName + "' with message '" + message + "'");
}

upubsub.subscribeGlobal(globalHandler);
upubsub.publish("foo", "bar");
// outputs: "Received event 'foo' with message 'bar'"
upubsub.unsubscribe(globalHandler);
```

## FAQ

- **Why isn't the class name CamelCase?**

  > It looked prettier this way

- **Is it async?**

  > Yes

- **It won't work in the browser!!?!**

  > Use [browserify](http://www.browserify.org)

- **When are you going to support topics?**

  > Never. Use [PubSubJS](https://github.com/mroderick/PubSubJS),
  > [RadioJS](http://radio.uxder.com) or [Arbiter](http://arbiterjs.com)

- **Why can't I switch over to synchronous events?**

  > You don't need to because you're firing events at a boundary and
  > wouldn't couple your own behaviour to your events. Would you?

- **What about Promises?**

  > This I've not given much thought to - I will give it due consideration
