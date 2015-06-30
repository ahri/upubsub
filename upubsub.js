'use strict';

function uPubSub() {
  var listeners = {};
  var globalListeners = [];

  return {
    subscribe: function (name, listener) {
      if (listeners[name] === undefined) {
        listeners[name] = [];
      }

      listeners[name].push(listener);
    },

    subscribeGlobal: function (listener) {
      globalListeners.push(listener);
    },

    unsubscribe: function (name, listener) {
      if (listeners[name] !== undefined) {
        for (var i = 0; i < listeners[name].length; i++) {
          if (listeners[name][i] === listener) {
            listeners[name].splice(i, 1);
            return;
          }
        }
      }

      throw Error("Couldn't find listener to remove");
    },

    unsubscribeGlobal: function (listener) {
      for (var i = 0; i < globalListeners.length; i++) {
        if (globalListeners[i] === listener) {
          globalListeners.splice(i, 1);
          return;
        }
      }

      throw Error("Couldn't find listener to remove");
    },

    publish: function (name, message) {
      var args = [].slice.call(arguments, 1);

      globalListeners.forEach(function (reg) {
        setTimeout(Object.bind.apply(reg, [null, name].concat(args)), 0);
      });

      if (listeners[name] === undefined) {
        return;
      }

      listeners[name].forEach(function (reg) {
        setTimeout(Object.bind.apply(reg, [null].concat(args)), 0);
      });
    },
  };
}

function Production() {
  var listeners = {},
      globalListeners = [];

  return {
    subscribe: function (name, listener) {
      if (listeners[name] === undefined) {
        listeners[name] = [];
      }

      listeners[name].push(listener);
    },

    subscribeGlobal: function (listener) {
      globalListeners.push(listener);
    },

    unsubscribe: function (name, listener) {
      if (listeners[name] !== undefined) {
        for (var i = 0; i < listeners[name].length; i++) {
          if (listeners[name][i] === listener) {
            listeners[name].splice(i, 1);
            return;
          }
        }
      }

      throw Error("Couldn't find listener to remove");
    },

    unsubscribeGlobal: function (listener) {
      for (var i = 0; i < globalListeners.length; i++) {
        if (globalListeners[i] === listener) {
          globalListeners.splice(i, 1);
          return;
        }
      }

      throw Error("Couldn't find listener to remove");
    },

    publish: function (name, message) {
      var i,
          listener,
          handler = listeners[name],
          argslen = arguments.length,
          registrationsLength = handler === undefined ? 0: handler.length,
          globalRegistrationsLength = globalListeners.length;

      for (i = 0; i < globalRegistrationsLength; i++) {
        listener = globalListeners[i];

        switch (argslen) {
          case 1:
            listener(name);
            break;
          case 2:
            listener(name, arguments[1]);
            break;
          case 3:
            listener(name, arguments[1], arguments[2]);
            break;
          case 4:
            listener(name, arguments[1], arguments[2], arguments[3]);
            break;
          case 5:
            listener(name, arguments[1], arguments[2], arguments[3], arguments[4]);
            break;
          case 6:
            listener(name, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
            break;
          default:
            listener.apply(null, arguments);
        }
      }

      for (i = 0; i < registrationsLength; i++) {
        listener = handler[i];

        switch (argslen) {
          case 1:
            listener();
            break;
          case 2:
            listener(arguments[1]);
            break;
          case 3:
            listener(arguments[1], arguments[2]);
            break;
          case 4:
            listener(arguments[1], arguments[2], arguments[3]);
            break;
          case 5:
            listener(arguments[1], arguments[2], arguments[3], arguments[4]);
            break;
          case 6:
            listener(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
            break;
          default:
            var args = Array(argslen - 1);
            for (i = 1; i < argslen; i++) {
              args[i - 1] = arguments[i];
            }

            listener.apply(null, args);
        }
      }
    }
  };
}

uPubSub.Production = Production;

module.exports = uPubSub;
