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
exports.WateringJob = exports.WATERING_COLLECTION = void 0;
var job_1 = require("./job");
var queue_1 = require("./queue");
exports.WATERING_COLLECTION = "watering_jobs";
var WATERING_COLLECTION_SEQ = "watering_jobs_seq";
var WateringJob = /** @class */ (function (_super) {
    __extends(WateringJob, _super);
    function WateringJob(bot, config) {
        if (config === void 0) { config = {}; }
        var _this_1 = _super.call(this, bot, config) || this;
        _this_1.getDefaultParams = function () {
            var df = {
                name: "Job 0",
                id: 0,
                depth: 0,
                min_dist: 0,
                amount: 0,
                height: 0,
                seeding_id: -1,
                from_seeding: false,
                scheduled: false,
                lastStarted: "never",
                lastFinished: "never",
                interval: -1,
                working_area: {
                    beg_pos: { x: 0, y: 0, z: 0 },
                    end_pos: { x: 0, y: 0, z: 0 },
                    length: 0,
                    width: 0
                },
                status: { running: false },
                next: (function (d) { return new Date(d.setDate(d.getDate() - 1)); })(new Date) //initialize with an expired date unless the user updates the date
            };
            return df;
        };
        _this_1.calculateSteps = function (job) {
            var pos = job.working_area.beg_pos;
            var length = job.working_area.length;
            var width = job.working_area.width;
            var locations = [];
            length = length + pos.x;
            width = width + pos.y;
            if (_this_1.safe_height > job.height)
                job.height = _this_1.safe_height;
            var height = job.height + _this_1.ground_level;
            var min_dist_to_borders = Math.floor(job.min_dist / 2);
            for (var i = pos.x + min_dist_to_borders; i <= length - min_dist_to_borders; i = i + job.min_dist) {
                for (var j = pos.y + min_dist_to_borders; j <= width - min_dist_to_borders; j = j + job.min_dist) {
                    var location_1 = { x: i, y: j, z: height };
                    locations.push(location_1);
                }
            }
            var distance = function (coor1, coor2) {
                var x = coor2.x - coor1.x;
                var y = coor2.y - coor1.y;
                return Math.sqrt((x * x) + (y * y));
            };
            var sortByDistance = function (locations, point) {
                var sorter = function (a, b) { return distance(a, point) - distance(b, point); };
                locations.sort(sorter);
            };
            // let status = await getStatus();
            sortByDistance(locations, { x: 350, y: 350 });
            //sortByDistance(locations, {x: 50, y: 40});
            console.log(locations);
            return _this_1.removeUnsafeLocations(locations);
        };
        // @ts-ignore
        _this_1.initParams = function (input) {
            input.working_area.length = input.working_area.end_pos.x - input.working_area.beg_pos.x;
            input.working_area.width = input.working_area.end_pos.y - input.working_area.beg_pos.y;
            input.working_area.beg_pos = Object.assign({ x: 0, y: 0, z: 0 }, input.working_area.beg_pos);
            input.working_area.end_pos = Object.assign({ x: 0, y: 0, z: 0 }, input.working_area.end_pos);
            return Object.assign(_this_1.getDefaultParams(), input);
        };
        _this_1.runStep = function (dest) {
            return _this_1.doWatering(dest, 100);
        };
        _this_1.doWatering = function (dest, speed) {
            if (speed === void 0) { speed = 100; }
            var _this = _this_1;
            return _this_1.bot.moveAbsolute({ x: dest.x, y: dest.y, z: dest.z, speed: speed })
                .then(function (_) {
                return _this.bot.writePin({ pin_mode: 0, pin_number: _this.pin_number, pin_value: 1 });
            }).then(function (_) {
                return _this.delay(5000);
            }).then(function (_) {
                return _this.bot.writePin({ pin_mode: 0, pin_number: _this.pin_number, pin_value: 0 });
            }).catch(function (e) {
                console.log(e);
                queue_1.EventQueue.busy = false;
            });
        };
        _this_1.afterUpdate = function (_, callback, data, update) {
            if (data === void 0) { data = null; }
            if (update === void 0) { update = false; }
            //if(!update) callback(data);
            update = update;
            callback(data);
        };
        _this_1.updateJob = function (jobParams, callback) {
            if (typeof jobParams.seeding_id !== undefined) {
                return _this_1.db.collection("seeding_jobs")
                    .findOne({ id: jobParams.seeding_id })
                    .then(function (result) {
                    if (result) {
                        var watering = result;
                        watering.nextRunAt = new Date(jobParams.nextRunAt);
                        watering.amount = jobParams.amount;
                        watering.interval = jobParams.interval;
                        watering.height = jobParams.height;
                        watering.seeding_id = jobParams.seeding_id;
                        //@ts-ignore
                        var params = _this_1.initParams(watering);
                        var job_2 = params;
                        var _this_2 = _this_1;
                        return _this_1.getJobSeq(function (seq) {
                            var _insert = false;
                            var filter = {};
                            if ((job_2.id == -1 && typeof job_2.from_seeding == "boolean" && job_2.from_seeding) || (job_2.id === -1 && !job_2.from_seeding) || typeof jobParams.id !== "number") {
                                job_2.id = seq.next_id;
                                _insert = true;
                            }
                            filter = { id: job_2.id };
                            if (job_2.seeding_id !== -1) {
                                filter = { seeding_id: job_2.seeding_id };
                                _insert = true;
                            }
                            return _this_2.db.collection(_this_1.collection)
                                .findOne(filter)
                                .then(function (results) {
                                if (results && results.seeding_id > -1) {
                                    job_2.id = results.id;
                                    filter = { id: results.id };
                                }
                                else {
                                }
                                return _this_2.db.collection(_this_1.collection)
                                    .updateOne(filter, { $set: job_2 }, { upsert: _insert })
                                    .then(function (_) {
                                    _this_2.setJobSeq(_insert)
                                        .then(function (_) {
                                        //@ts-ignore
                                        jobParams.seeding_id = job_2.id;
                                        callback(null, job_2);
                                    });
                                }).catch(function (e) { return callback(e, null); });
                            })
                                .catch(function (e) { console.error(e); });
                        });
                    }
                }).catch(function (e) { return console.error(e); });
            }
            else {
                return Promise.reject("No seeding ID was given foe the job");
            }
        };
        _this_1.collection = exports.WATERING_COLLECTION;
        _this_1.collection_seq = WATERING_COLLECTION_SEQ;
        _this_1.pin_number = 8;
        config.pin_id = 30536;
        _this_1.type_name = "watering";
        return _this_1;
    }
    return WateringJob;
}(job_1.Job));
exports.WateringJob = WateringJob;
