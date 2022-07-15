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
exports.WateringJob = void 0;
var job_1 = require("./job");
var WATERING_COLLECTION = "watering_jobs";
var WATERING_COLLECTION_SEQ = "watering_jobs_seq";
var WateringJob = /** @class */ (function (_super) {
    __extends(WateringJob, _super);
    function WateringJob(bot, config) {
        if (config === void 0) { config = {}; }
        var _this_1 = _super.call(this, bot, config) || this;
        _this_1.default_params = {
            name: "Job 0",
            id: 0,
            depth: 0,
            min_dist: 0,
            amount: 0,
            height: 0,
            working_area: {
                beg_pos: { x: 0, y: 0, z: 0 },
                end_pos: { x: 0, y: 0, z: 0 },
                length: 0,
                width: 0
            },
            status: { running: false },
            next: (function (d) { return new Date(d.setDate(d.getDate() - 1)); })(new Date) //initialize with an expired date unless the user updates the date
        };
        // @ts-ignore
        _this_1.initParams = function (input) {
            input.working_area.length = input.working_area.end_pos.x - input.working_area.beg_pos.x;
            input.working_area.width = input.working_area.end_pos.y - input.working_area.beg_pos.y;
            input.working_area.beg_pos = Object.assign(_this_1.df_position, input.working_area.beg_pos);
            input.working_area.end_pos = Object.assign(_this_1.df_position, input.working_area.end_pos);
            return Object.assign(_this_1.default_params, input);
        };
        _this_1.runStep = function (dest) {
            return _this_1.doWatering(dest, 100);
        };
        _this_1.doWatering = function (dest, speed) {
            if (speed === void 0) { speed = 100; }
            var _this = _this_1;
            return _this_1.bot.moveAbsolute({ x: dest.x, y: dest.y, z: dest.z, speed: speed })
                .then(function (_) {
                return _this.writePin(1, _this.config.pin_id);
            }).then(function (_) {
                return _this.delay(5000);
            }).then(function (_) {
                return _this.writePin(0);
            });
        };
        _this_1.collection = WATERING_COLLECTION;
        _this_1.collection_seq = WATERING_COLLECTION_SEQ;
        _this_1.pin = 0;
        config.pin_id = 30536;
        return _this_1;
    }
    return WateringJob;
}(job_1.Job));
exports.WateringJob = WateringJob;
