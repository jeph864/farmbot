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
exports.SeedingJob = void 0;
var job_1 = require("./job");
var SEEDING_COLLECTION = "seeding_jobs";
var SEEDING_COLLECTION_SEQ = "seeding_jobs_seq";
var SeedingJob = /** @class */ (function (_super) {
    __extends(SeedingJob, _super);
    function SeedingJob(bot, config) {
        if (config === void 0) { config = {}; }
        var _this_1 = _super.call(this, bot, config) || this;
        _this_1.default_params = {
            name: "Job 0",
            id: 0,
            depth: 0,
            min_dist: 0,
            plant_type: "radish",
            working_area: _this_1.df_working_area,
            status: { running: false }
        };
        // @ts-ignore
        _this_1.initParams = function (inputJob) {
            inputJob.working_area.length = inputJob.working_area.end_pos.x - inputJob.working_area.beg_pos.x;
            inputJob.working_area.width = inputJob.working_area.end_pos.y - inputJob.working_area.beg_pos.y;
            inputJob.working_area.beg_pos = Object.assign(_this_1.df_position, inputJob.working_area.beg_pos);
            inputJob.working_area.end_pos = Object.assign(_this_1.df_position, inputJob.working_area.end_pos);
            return Object.assign(_this_1.default_params, inputJob);
        };
        _this_1.runStep = function (dest) {
            return _this_1.plantSeed(_this_1.tray_pos, dest, 100);
        };
        _this_1.plantSeed = function (bay_pos, dest, speed) {
            if (speed === void 0) { speed = 100; }
            var _this = _this_1;
            return _this_1.bot.moveAbsolute({ x: bay_pos.x, y: bay_pos.y, z: bay_pos.z, speed: speed })
                .then(function (_) {
                console.log("Moved successfully to bay position");
                return _this.writePin(1);
            }).then(function (_) {
                console.log("Wrote to pin: 1");
                return _this.bot.moveAbsolute({ x: dest.x, y: dest.y, z: dest.z, speed: speed });
            }).then(function (_) {
                console.log("Moved successfully to plant position ");
                return _this.writePin(0);
            }).then(function (_) {
                console.log("Wrote to pin: 0");
                return _this.bot.moveAbsolute({ x: dest.x, y: dest.y, z: dest.z, speed: speed });
            });
        };
        _this_1.collection = SEEDING_COLLECTION;
        _this_1.tray_pos = { x: 10, y: 10, z: 0 };
        _this_1.collection_seq = SEEDING_COLLECTION_SEQ;
        _this_1.config.pin_id = 30538;
        return _this_1;
    }
    return SeedingJob;
}(job_1.Job));
exports.SeedingJob = SeedingJob;
