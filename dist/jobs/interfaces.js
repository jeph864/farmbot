"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventStatus = void 0;
var EventStatus;
(function (EventStatus) {
    EventStatus[EventStatus["Running"] = 0] = "Running";
    EventStatus[EventStatus["NotRunning"] = 1] = "NotRunning";
    EventStatus[EventStatus["Delayed"] = 2] = "Delayed";
    EventStatus[EventStatus["Scheduled"] = 3] = "Scheduled";
    EventStatus[EventStatus["Failed"] = 4] = "Failed";
})(EventStatus = exports.EventStatus || (exports.EventStatus = {}));
