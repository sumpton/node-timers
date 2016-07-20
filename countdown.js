'use strict';

const simple = require('./simple');

module.exports = function (options) {
    options = options || {};
    options.pollInterval = options.pollInterval || 250;
    options.startTime = options.startTime || 0;

    const timer = simple(options);
    const originalTimeFunc = timer.time;

    timer.time = function (newTime) {
        let timeLeft = options.startTime - originalTimeFunc.call(timer, newTime);
        if (timeLeft <= 0) timeLeft = 0;
        return timeLeft;
    };

    timer.on('poll', function (timeLeft) {
        if (!timeLeft) {
            timer
                .stop()
                .emit('done', timeLeft);
        }
    });

    return timer;
};
