'use strict';

function uPubSub() {
  this._registrations = {};
  this._global = [];
}

uPubSub.prototype.subscribe = function (name, func, context) {
  if (this._registrations[name] === undefined) {
    this._registrations[name] = [];
  }

  this._registrations[name].push({func: func, 'context': context});
};

uPubSub.prototype.subscribeGlobal = function (func, context) {
  this._global.push({func: func, 'context': context});
};

uPubSub.prototype.unsubscribe = function (name, func) {
  if (this._registrations[name] !== undefined) {
    for (var i = 0; i < this._registrations[name].length; i++) {
      if (this._registrations[name][i].func === func) {
        this._registrations[name].splice(i, 1);
        return;
      }
    }
  }

  throw new Error("Couldn't find subscription to remove");
};

uPubSub.prototype.unsubscribeGlobal = function (func) {
  for (var i = 0; i < this._global.length; i++) {
    if (this._global[i].func === func) {
      this._global.splice(i, 1);
      return;
    }
  }

  throw new Error("Couldn't find subscription to remove");
};

uPubSub.prototype.publish = function (name, message) {
  for (var i = 0; i < this._global.length; i++) {
    (function close(self, i) {
      process.nextTick(function () {
        self._global[i].func.call(self._global[i]['context'], name, message);
      }, 0);
    })(this, i);
  }

  if (this._registrations[name] === undefined) {
    return;
  }

  for (var i = 0; i < this._registrations[name].length; i++) {
    (function close(self, i) {
      process.nextTick(function () {
        self._registrations[name][i].func.call(self._registrations[name][i]['context'], message);
      }, 0);
    })(this, i);
  }
};

module.exports = uPubSub;
