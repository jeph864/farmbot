"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = void 0;
var farmbot_1 = require("farmbot");
var api_1 = require("../setup/api");
var DELAYED_JOBS = "delayed_jobs";
var PLANT_COLLECTION = "plants";
var Job = /** @class */ (function () {
    function Job(bot, config) {
        if (config === void 0) { config = {}; }
        var _this_1 = this;
        this.getConfig = function () {
            return _this_1.config;
        };
        this.setConfig = function () { };
        this.getJobId = function () {
        };
        this.df_position = { x: 0, y: 0, z: 0 };
        this.df_working_area = {
            beg_pos: this.df_position,
            end_pos: this.df_position,
            length: 0,
            width: 0
        };
        //abstract  executeJob (job_id : number, callback) : void;
        this.minPos = function (pos1, pos2) {
            pos2;
            return pos1;
        };
        this.maxPos = function (pos1, pos2) {
            pos1;
            return pos2;
        };
        this.calculateSteps = function (job) {
            var pos = job.working_area.beg_pos;
            var length = job.working_area.length;
            var width = job.working_area.width;
            var locations = [];
            length = length + pos.x;
            width = width + pos.y;
            job.depth = Math.min(job.depth, _this_1.max_depth);
            var min_dist_to_borders = Math.floor(job.min_dist / 2);
            for (var i = pos.x + min_dist_to_borders; i <= length - min_dist_to_borders; i = i + job.min_dist) {
                for (var j = pos.y + min_dist_to_borders; j <= width - min_dist_to_borders; j = j + job.min_dist) {
                    var location_1 = { x: i, y: j, z: job.depth };
                    locations.push(location_1);
                }
            }
            console.log("Locations: " + locations.length);
            return _this_1.removeUnsafeLocations(locations);
        };
        this.removeUnsafeLocations = function (locations, radius) {
            if (radius === void 0) { radius = 0; }
            var isInVicinity = function (point, location, radius) {
                if (radius === void 0) { radius = 0; }
                return (point.x >= location.location.beg.x - radius && point.x <= location.location.end.x + radius) &&
                    (point.y >= location.location.beg.y - radius && point.y <= location.location.end.y + radius);
            };
            var isUnsafe = function (point, locations) {
                for (var _i = 0, locations_1 = locations; _i < locations_1.length; _i++) {
                    var loc = locations_1[_i];
                    if (isInVicinity(point, loc, radius)) {
                        return true;
                    }
                }
                return false;
            };
            return api_1.unsafe_locations.get()
                .then(function (results) {
                locations = locations.filter(function (item) {
                    return !isUnsafe(item, results);
                });
                return Promise.resolve(locations);
            });
        };
        this.executeJob = function (job_id, callback) {
            var started = new Date();
            var _this = _this_1;
            return _this.getAllJobs({ id: job_id }, function (e, d) {
                if (e) {
                    callback(e, null);
                }
                var ready_job = d[0];
                return api_1.slots_container.getRightSlot(_this.type_name)
                    .then(function (_) {
                    return _this.calculateSteps(ready_job);
                })
                    .then(function (steps) {
                    return _this.executeAllSteps(steps, ready_job.plant_type)
                        .then(function (_) {
                        return _this.updateLastRun(job_id, started)
                            .then(function (_) {
                            return _this.removeFromQueue(ready_job.id)
                                .then(function (data) {
                                data;
                                callback(null, "Finished running all job steps");
                            });
                        });
                    });
                })
                    .catch(function (err) {
                    throw err;
                });
            });
        };
        this.updateLastRun = function (job_id, date, interval) {
            if (interval === void 0) { interval = -1; }
            var lastFinished = new Date();
            if (interval == 0) {
                interval = 2;
            }
            var nextRun = _this_1.__addHours(interval, lastFinished);
            return _this_1.db.collection(_this_1.collection)
                .updateOne({ id: job_id }, { $set: { lastStarted: date, lastFinished: lastFinished, nextRunAt: nextRun } });
        };
        this.createJob = function (jobParams, callback) {
            var params = _this_1.initParams(jobParams);
            var job = params;
            var _this = _this_1;
            _this_1.db.collection(_this_1.collection)
                .countDocuments()
                .then(function (res) {
                _this.db.collection(_this.collection)
                    .find({ name: job.name }).toArray()
                    .then(function (data) {
                    if (res == 0 && data.length == 0)
                        res = 1;
                    else if (res > 0 && data.length == 0)
                        res = res + 1;
                    else if (data.length == 1)
                        res = data[0].id;
                    job.id = res;
                    _this.db.collection(_this.collection)
                        .insertOne(job)
                        .then(function (data) {
                        // @ts-ignore
                        if (data.acknowledged) {
                            callback(null, job);
                        }
                        else {
                            callback("NotAcknowledged", null);
                        }
                    })
                        .catch(function (err) {
                        // @ts-ignore
                        callback(err, null);
                    });
                }).catch(function (e) { return console.error(e); });
            });
        };
        this.updateJob = function (jobParams, callback, args) {
            if (args === void 0) { args = { update_after: true }; }
            var params = _this_1.initParams(jobParams);
            var job = params;
            var _this = _this_1;
            _this_1.getJobSeq(function (seq) {
                var _insert = false;
                var filter = {};
                if (job.id === -1 || typeof jobParams.id !== "number") {
                    job.id = seq.next_id;
                    _insert = true;
                }
                filter = { id: job.id };
                _this.db.collection(_this_1.collection)
                    .updateOne(filter, { $set: job }, { upsert: _insert })
                    .then(function (upres) {
                    _this.setJobSeq(_insert)
                        .then(function (_) {
                        var tmp_job = job;
                        if (upres.acknowledged && (upres.modifiedCount > 0 || upres.upsertedCount > 0)) {
                            //@ts-ignore
                            tmp_job.seeding_id = job.id;
                            tmp_job.id = -1;
                            tmp_job.from_seeding = true;
                            _this.afterUpdate(tmp_job, function (_, r) {
                                r;
                                callback(null, job);
                            }, tmp_job, args.update_after);
                        }
                        else {
                            callback(null, job);
                        }
                    });
                }).catch(function (e) { return callback(e, null); });
            });
        };
        this.getJobSeq = function (callback) {
            var _this = _this_1;
            return _this_1.db.collection(_this_1.collection_seq)
                .findOne({})
                .then(function (res) {
                var doc = { next_id: 0 };
                if (res) {
                    if (callback)
                        callback(res);
                }
                else
                    _this.db.collection(_this_1.collection_seq).insertOne(doc)
                        .then(function (_) { if (callback)
                        callback(doc); })
                        .catch(function (_) { if (callback)
                        callback(null); });
            }).catch(function (_) { if (callback)
                callback(null); });
        };
        this.setJobSeq = function (set) {
            if (set === void 0) { set = true; }
            return _this_1.db.collection(_this_1.collection_seq)
                .updateOne({}, { $inc: { next_id: set ? 1 : 0 } });
        };
        this.addToQueue = function (job_id, callback) {
            var _this = _this_1;
            return _this_1.db.collection(_this.delayed_jobs)
                .countDocuments()
                .then(function (pos) {
                _this.db.collection(_this.delayed_jobs)
                    .findOne({ job_id: job_id })
                    .then(function (job) {
                    if (job) {
                        if (pos == 0)
                            pos = 1;
                        pos = job.q_pos;
                    }
                    else {
                        if (pos == 0)
                            pos = 1;
                        else
                            pos = pos + 1;
                    }
                    return _this.db.collection(_this.delayed_jobs)
                        .updateOne({ job_id: job_id }, { $set: { job_id: job_id, q_pos: pos } }, { upsert: true })
                        .then(function (_) {
                        return _this.db.collection(_this.delayed_jobs)
                            .find()
                            .sort({ q_pos: 1 }).limit(1).toArray()
                            .then(function (data) {
                            callback(null, data);
                        }).catch(function (e) { return callback(e, null); });
                    });
                });
            });
        };
        this.removeFromQueue = function (job_id) {
            return Promise.resolve("Queue function  deprecated: " + job_id);
        };
        this.writePin = function (value, pin_id, mode) {
            if (value === void 0) { value = 1; }
            if (pin_id === void 0) { pin_id = _this_1.config.pin_id; }
            if (mode === void 0) { mode = 0; }
            var args = {
                pin_number: {
                    kind: "named_pin",
                    args: {
                        "pin_type": "Peripheral",
                        "pin_id": pin_id
                    }
                },
                "pin_value": value,
                "pin_mode": mode
            };
            // @ts-ignore
            return _this_1.bot.writePin({ pin_number: args.pin_number, pin_value: args.pin_value, pin_mode: args.pin_mode });
        };
        this.move = function (dest, speed) {
            return _this_1.bot.moveAbsolute({ x: dest.x, y: dest.y, z: dest.z, speed: speed });
        };
        this.markAs = function (args, body) {
            return _this_1.bot.send((0, farmbot_1.rpcRequest)([
                { kind: "update_resource", args: args, body: body }
            ]));
        };
        this.executeAllSteps = function (items, plant_type) { return __awaiter(_this_1, void 0, void 0, function () {
            var _this, results, _i, items_1, item, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _this = this;
                        results = [];
                        _i = 0, items_1 = items;
                        _a.label = 1;
                    case 1:
                        if (!(_i < items_1.length)) return [3 /*break*/, 4];
                        item = items_1[_i];
                        return [4 /*yield*/, _this.runStep(item, plant_type)
                                .then(function (ack) {
                                results.push(ack);
                            })];
                    case 2:
                        r = _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, results];
                }
            });
        }); };
        this.convertMl = function (duration) {
            return duration;
        };
        this.write = function (pin_number, value, pin_mode) {
            if (pin_mode === void 0) { pin_mode = 0; }
            var args = { pin_mode: pin_mode, pin_value: value, pin_number: pin_number };
            // @ts-ignore
            return _this_1.bot.writePin(args /*{pin_number: pin_number, pin_mode:0, pin_value: value}*/);
        };
        this.getJob = function (job_id) {
            return _this_1.db.collection(_this_1.collection)
                .findOne({ id: job_id });
        };
        this.getAllJobs = function (filter, callback) {
            return _this_1.db.collection(_this_1.collection)
                .find(filter).toArray().then(function (res) { return callback(null, res); })
                .catch(function (err) { return callback(err, null); });
        };
        this.getAll = function (filter) {
            if (filter === void 0) { filter = {}; }
            //console.log("Collection: ${this.collection}")
            return _this_1.db.collection(_this_1.collection)
                .find(filter).toArray();
        };
        this.delay = function (t) {
            return new Promise(function (resolve) { return setTimeout(resolve, t); });
        };
        this.__addHours = function (hours, date) {
            //@ts-ignore
            Date.prototype.addHours = function (h) {
                this.setTime(this.getTime() + (h * 60 * 60 * 1000));
                return this;
            };
            //@ts-ignore
            return date.addHours(hours);
        };
        this.getStatus = function () { };
        this.deleteJob = function () { };
        this.lock = function () { };
        this.unlock = function () { };
        this.getDelayedJobs = function (callback) {
            _this_1.db.collection(_this_1.delayed_jobs)
                .find().toArray().then(function (res) { return callback(null, res); })
                .catch(function (err) { return callback(err, null); });
        };
        this.update = function (filter, set, upsert) {
            if (filter === void 0) { filter = {}; }
            if (upsert === void 0) { upsert = false; }
            var _this = _this_1;
            return _this_1.db.collection(_this_1.collection)
                .updateOne(filter, { $set: set }, { upsert: upsert })
                .then(function (_) {
                return _this.db.collection(_this_1.collection)
                    .findOne(filter);
            });
        };
        this.updatePlant = function (plant) {
            return _this_1.db.collection(_this_1.plants)
                .updateOne({ $and: [{ x: plant.location.x }, { y: plant.location.y }, { z: plant.location.z }] }, { $set: plant }, { upsert: true });
        };
        this.bot = bot;
        this.config = config;
        this.db = api_1.DBSetup.getDatabase();
        this.collection = "";
        this.collection_seq = this.collection + "_seq";
        this.delayed_jobs = DELAYED_JOBS;
        this.plants = PLANT_COLLECTION;
        this.safe_height = 80;
        this.ground_level = -310;
        this.zlock = -327;
        this.max_depth = 25;
        this.type_name = "job";
        //initialize the seq collection
        this.getJobSeq(function (e) {
            if (e)
                console.log("Successfully initialized " + _this_1.collection_seq);
        });
    }
    Job.prototype.getAbsolutePlantPosition = function (pos) {
        var absolute_pos_z = this.ground_level - pos.z;
        if (absolute_pos_z <= this.zlock)
            pos.z = this.zlock + 1;
        else
            pos.z = absolute_pos_z;
        return pos;
    };
    return Job;
}());
exports.Job = Job;
;
