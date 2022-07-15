"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobQueue = void 0;
var JobQueue = /** @class */ (function () {
    function JobQueue() {
        var _this = this;
        this.add = function (job) {
            _this.queue.push(job);
        };
        this.remove = function (job) {
            job;
        };
        this.queue = [];
    }
    return JobQueue;
}());
exports.JobQueue = JobQueue;
