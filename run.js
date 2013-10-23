var args = phantom.args

if (args.length < 1 || args.length > 2) {
    console.log('usage: phantomjs run.js URL [tmeout]')
    phantom.exit(1)
}

var url     = args[0]
var timeout = args[1] ? parseInt(args[1], 10) : 5001

var page = require('webpage').create()

var fails = []
var oks   = []

page.onConsoleMessage = function (msg) {
    console.log(msg)

    if (/^not ok /.test(msg)) fails.push(msg)
    if (/^ok /.test(msg))     oks.push(msg)

    if (/^1\.\.\d+$/.test(msg)) phantom.exit(!! fails.length)
}

page.open(url, function (status) {
    if (status !== 'success') {
        console.log('unable to access network')
        return phantom.exit(1)
    }

    setTimeout(function () {
        console.log('timeout')
        phantom.exit(0)
    }, timeout)
})
