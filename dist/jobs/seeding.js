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
exports.SeedingJob = exports.SEEDING_COLLECTION = void 0;
var job_1 = require("./job");
var watering_1 = require("./watering");
var queue_1 = require("./queue");
exports.SEEDING_COLLECTION = "seeding_jobs";
var SEEDING_COLLECTION_SEQ = "seeding_jobs_seq";
var SeedingJob = /** @class */ (function (_super) {
    __extends(SeedingJob, _super);
    function SeedingJob(bot, config) {
        if (config === void 0) { config = {}; }
        var _this_1 = _super.call(this, bot, config) || this;
        _this_1.getDefaultParams = function () {
            var df = {
                name: "Job 0",
                id: -1,
                depth: 0,
                min_dist: 0,
                plant_type: "radish",
                working_area: {
                    beg_pos: { x: 0, y: 0, z: 0 },
                    end_pos: { x: 0, y: 0, z: 0 },
                    length: 0,
                    width: 0
                },
                status: { running: false, active: false },
                nextRunAt: "yesterday",
                lastFinished: "never",
                lastStarted: "never",
                stage: "Not Planted",
                scheduled: false
            };
            return df;
        };
        // @ts-ignore
        _this_1.initParams = function (inputJob) {
            var pos = {
                x1: inputJob.working_area.beg_pos.x,
                y1: inputJob.working_area.beg_pos.y,
                x2: inputJob.working_area.end_pos.x,
                y2: inputJob.working_area.end_pos.y
            };
            var length, width;
            length = pos.x2 - pos.x1, width = pos.y2 - pos.y1;
            inputJob.working_area.beg_pos = Object.assign({ x: 0, y: 0, z: 0 }, inputJob.working_area.beg_pos);
            inputJob.working_area.end_pos = Object.assign({ x: 0, y: 0, z: 0 }, inputJob.working_area.end_pos);
            inputJob.working_area.width = width, inputJob.working_area.length = length;
            return Object.assign(_this_1.getDefaultParams(), inputJob);
        };
        _this_1.runStep = function (dest) {
            return _this_1.plantSeed(_this_1.tray_pos, dest, 100);
        };
        _this_1.plantSeed = function (bay_pos, dest, speed) {
            if (speed === void 0) { speed = 100; }
            var _this = _this_1;
            dest.z = dest.z + _this_1.ground_level;
            return _this.bot.moveAbsolute({ x: bay_pos.x, y: bay_pos.y, z: bay_pos.z + _this.safe_height, speed: speed })
                .then(function (_) {
                return _this.bot.moveAbsolute({ x: bay_pos.x, y: bay_pos.y, z: bay_pos.z, speed: speed });
            })
                .then(function (_) {
                console.log("Moved successfully to tray position: x: ".concat(bay_pos.x, ", y: ").concat(bay_pos.y, " , z: ").concat(bay_pos.z));
                return _this.bot.writePin({ pin_mode: 0, pin_number: _this.pin_number, pin_value: 1 });
            }).then(function (_) {
                console.log("Wrote to pin: 1");
                return _this.bot.moveAbsolute({ x: bay_pos.x, y: bay_pos.y, z: bay_pos.z + _this.safe_height, speed: speed });
            }) /*.then((_) =>{
              return _this.bot.moveAbsolute({x:bay_pos.x, y:bay_pos.y,z:bay_pos.z + _this.safe_height, speed:speed})
            })*/
                .then(function (_) {
                return _this.bot.moveAbsolute({ x: dest.x, y: dest.y, z: bay_pos.z + _this.safe_height, speed: speed });
            }).then(function (_) {
                return _this.bot.moveAbsolute({ x: dest.x, y: dest.y, z: dest.z, speed: speed });
            })
                .then(function (_) {
                console.log("Moved successfully to plant position ");
                return _this.bot.writePin({ pin_mode: 0, pin_number: _this.pin_number, pin_value: 0 });
            }).then(function (_) {
                console.log("Wrote to pin: 0");
                return _this.bot.moveAbsolute({ x: dest.x, y: dest.y, z: dest.z + _this.safe_height, speed: speed });
            }).then(function (_) {
                console.log({ x: dest.x, y: dest.y, z: dest.z + _this.safe_height, speed: speed });
            }).catch(function (e) {
                queue_1.EventQueue.busy = false;
                console.log(e);
            });
        };
        _this_1.afterUpdate = function (jobParams, callback, update) {
            if (update === void 0) { update = false; }
            callback(null, "No update");
            jobParams;
            update;
            //if(!update) callback(null, "No update");
            /*this.watering_job.updateJob(jobParams, (e, r) =>{
              callback(e,r);
            })*/
        };
        _this_1.collection = exports.SEEDING_COLLECTION;
        _this_1.tray_pos = { x: 990, y: 725, z: -468 };
        _this_1.collection_seq = SEEDING_COLLECTION_SEQ;
        _this_1.config.pin_id = 30538;
        _this_1.watering_job = new watering_1.WateringJob(bot);
        _this_1.pin_number = 9;
        return _this_1;
    }
    return SeedingJob;
}(job_1.Job));
exports.SeedingJob = SeedingJob;
