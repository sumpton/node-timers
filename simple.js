'use strict';

const EventEmitter = require('events').EventEmitter;

module.exports = function (options) {
    options = options || {};

    let time;
    let cumulative = 0;
    let interval;
    const timer = new EventEmitter();

    const startPolling = function () {
        if (options.pollInterval) {
            interval = setInterval(
                function () {
                    timer.emit('poll', timer.time());
                },
                options.pollInterval
            );
        }
    };

    const stopPolling = function () {
        clearInterval(interval);
    };

    timer.start = function () {
        time = new Date();
        startPolling();
        this.emit('start');
        return this;
    };

    timer.stop = function () {
        cumulative = this.time();
        time = undefined;
        stopPolling();
        this.emit('stop');
        return this;
    };

    timer.reset = function () {
        time = undefined;
        cumulative = 0;
        stopPolling();
        this.emit('reset');
        return this;
    };

    timer.time = function (newTime) {
        if (typeof newTime === 'number') {
            cumulative = newTime;
        }

        let total = cumulative;
        if (this.state() === 'on') {
            total += new Date().getTime() - time.getTime();
        }
        return total;
    };

    timer.state = function () {
        if (!time) {
            return cumulative ? 'stopped' : 'clean';
        }
        return 'on';
    };

    return timer;
};
