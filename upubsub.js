'use strict';

function uPubSub() {
  var registrations = {};
  var globalRegistrations = [];

  return {
    subscribe: function (type, func) {
      if (registrations[type] === undefined) {
        registrations[type] = [];
      }

      registrations[type].push(func);
    },

    subscribeGlobal: function (func) {
      globalRegistrations.push(func);
    },

    unsubscribe: function (type, func) {
      if (registrations[type] !== undefined) {
        for (var i = 0; i < registrations[type].length; i++) {
          if (registrations[type][i] === func) {
            registrations[type].splice(i, 1);
            return;
          }
        }
      }

      throw Error("Couldn't find subscription to remove");
    },

    unsubscribeGlobal: function (func) {
      for (var i = 0; i < globalRegistrations.length; i++) {
        if (globalRegistrations[i] === func) {
          globalRegistrations.splice(i, 1);
          return;
        }
      }

      throw Error("Couldn't find subscription to remove");
    },

    publish: function (type, message) {
      var i, args = [];
      for (i = 1; i < arguments.length; i++) {
        args.push(arguments[i]);
      }

      for (i = 0; i < globalRegistrations.length; i++) {
        process.nextTick(Object.bind.apply(globalRegistrations[i], [null, type].concat(args)));
      }

      if (registrations[type] === undefined) {
        return;
      }

      for (i = 0; i < registrations[type].length; i++) {
        process.nextTick(Object.bind.apply(registrations[type][i], [null].concat(args)));
      }
    },
  };
}

function Production() {
  var registrations = {},
      globalRegistrations = [];

  return {
    subscribe: function (type, func) {
      if (registrations[type] === undefined) {
        registrations[type] = [];
      }

      registrations[type].push(func);
    },

    unsubscribe: function (type, func) {
      for (var i = 0; i < registrations[type].length; i++) {
        if (registrations[type][i] === func) {
          registrations[type].splice(i, 1);
          if (registrations[type].length === 0) {
            registrations[type] = registrations[type][0];
          }
          return;
        }
      }

      throw Error("Couldn't find subscription to remove");
    },

    subscribeGlobal: function (func) {
      globalRegistrations.push(func);
    },

    unsubscribeGlobal: function (func) {
      for (var i = 0; i < globalRegistrations.length; i++) {
        if (globalRegistrations[i] === func) {
          globalRegistrations.splice(i, 1);
          return;
        }
      }

      throw Error("Couldn't find subscription to remove");
    },

    publish: function (type) {
      var i,
          listener,
          handler = registrations[type],
          argslen = arguments.length,
          registrationsLength = handler === undefined ? 0: handler.length,
          globalRegistrationsLength = globalRegistrations.length;

      for (i = 0; i < globalRegistrationsLength; i++) {
        listener = globalRegistrations[i];

        switch (argslen) {
          case 1:
            listener(type);
            return;
          case 2:
            listener(type, arguments[1]);
            return;
          case 3:
            listener(type, arguments[1], arguments[2]);
            return;
          case 4:
            listener(type, arguments[1], arguments[2], arguments[3]);
            return;
          case 5:
            listener(type, arguments[1], arguments[2], arguments[3], arguments[4]);
            return;
          case 6:
            listener(type, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
            return;
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
            var args = new Array(argslen - 1);
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
