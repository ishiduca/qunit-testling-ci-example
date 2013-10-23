;(function (global) {
    'use strict'
    var isBrowser = !! global.self
    var isWorker  = !! global.WorkerLocation
    var isNodeJS  = !! global.global

    var emitter = {
        constructor: function constructor () {
            this.listeners = {}
            return this
        }
      , emit: function () {
            var flg  = false
            var args = Array.prototype.slice.apply(arguments)
            var listeners = this.listeners[ args.shift() ] || []
            for (var i = 0, len = listeners.length; i < len; i++) {
                typeof listeners[i] === 'function' && (flg = true)
                    && listeners[i].apply(null, args)
            }
            return flg
        }
      , on: function (name, cb) {
            this.listeners[name] || (this.listeners[name] = []).push(cb)
            return this
        }
      , once: function (name, cb) {
            var me = this
            var _remove = function () {
                cb.apply(null, arguments)
                me.off(name, _remove)
            }

            this.on(name, _remove)
            return this
        }
      , off: function (name, cb) {
            this.listeners[name] && (this.listeners[name][ this.listeners[name].indexOf(cb) ] = null)
            return this
        }
    }


    if (isNodeJS) {
        module.exports = emitter
        module.exports.constructor.prototype = emitter
    } else {
        global.emitter = emitter
    }

})(this.self || global)
