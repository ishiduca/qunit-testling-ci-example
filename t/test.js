;(function (global) {
    'use strict'
    var isBrowser = !! global.self
    var isWorker  = !! global.WorkerLocation
    var isNodeJS  = !! global.global

// setup
    var qunit = require('qunitjs')
    var qTap  = require('qunit-tap')
    var myMod = require('../index') /* '../' だとダメっぽい */

    ;(function qunit_setup () {
        qTap(qunit, function () {console.log.apply(console, arguments)})
        qunit.init()
        qunit.config.updateRate = 0

      // alias
        var t = qunit.assert
        t.is = t.strictEqual
        t.like = function (str, reg, mes) {
            t.ok(reg.test(str), mes)
        }
    })()

// tests
    if (isNodeJS) {
        myTests(qunit, myMod)
    } else {
        myTests(qunit, global.emitter)
    }

})(this.self || global)


function myTests (q, myMod) {
    'use strict'

    var ee = myMod

    q.module('module')
    q.test('load "ee"', function (t) {
        t.ok(ee)
    })
    q.test('eee = Object.create(ee).constructor()', function (t) {
        var timer = Object.create(ee).constructor()
        t.ok(timer)
        timer.on('beep', function (a, b) {
            t.is(a, 1)
            t.is(b, 2)
        })
        timer.emit('beep', 1, 2)
    })
}
