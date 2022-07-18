"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scheduler = exports.FMEventEmitter = void 0;
var events = require("events");
var agenda_1 = require("agenda");
var FMEventEmitter = /** @class */ (function (_super) {
    __extends(FMEventEmitter, _super);
    function FMEventEmitter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return FMEventEmitter;
}(events.EventEmitter));
exports.FMEventEmitter = FMEventEmitter;
var Scheduler = /** @class */ (function () {
    function Scheduler(client) {
        var _this = this;
        this.start = function () {
            return _this.agenda.start();
        };
        this.getAgenda = function () {
            return _this.agenda;
        };
        this.define = function (jobname, _a, handler) {
            var options = _a[0];
            return _this.agenda.define(jobname, options, handler);
        };
        // @ts-ignore
        this.agenda = new agenda_1.Agenda({ mongo: client })
            .processEvery('5 seconds')
            .maxConcurrency(1)
            .lockLimit(0)
            .defaultLockLifetime(10000)
            .sort({ nextRunAt: 1, priority: -1 });
        this.client = client;
    }
    ;
    return Scheduler;
}());
exports.Scheduler = Scheduler;
