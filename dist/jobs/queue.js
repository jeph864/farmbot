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
exports.EventQueue = void 0;
var interfaces_1 = require("./interfaces");
var seeding_1 = require("./seeding");
var watering_1 = require("./watering");
var events_1 = require("events");
var dbConnect = require("../../utils/conn");
var EVENT_COLLECTION = "events";
var EVENT_COLLECTION_SEQ = "events_seq";
var PLANTS_COLLECTION = "plant";
var EventQueue = /** @class */ (function () {
    function EventQueue(bot) {
        var _this_1 = this;
        this.add = function (event, args) {
            if (args === void 0) { args = { single_event: false }; }
            var _this = _this_1;
            var additional = args;
            return _this_1.getEventSeq(function (seq) {
                var _insert = false;
                if (event.event_id === undefined || typeof event.event_id !== "number") {
                    event.event_id = seq.next_id;
                    _insert = true;
                }
                if (event.status === undefined) {
                    event.status = interfaces_1.EventStatus.NotRunning;
                }
                var filter = { event_id: event.event_id };
                if (args.single_event === true && typeof event.job_id === "number") { // @ts-ignore
                    filter = { job_id: event.job_id };
                }
                //check if the event is scheduled
                return _this.db.collection(_this_1.collection)
                    .findOne({ $and: [{ job_id: event.job_id }, { event_id: event.event_id }] })
                    .then(function (r) {
                    if (r && args.single_event) {
                        return Promise.resolve("Empty");
                    }
                    else
                        return _this.db.collection(_this_1.collection)
                            .updateOne(filter, { $set: event }, { upsert: true })
                            .then(function (_) {
                            return _this.setEventSeq(_insert);
                        });
                });
            });
        };
        this.remove = function (event) {
            var event_id = -1;
            if (typeof event === "number")
                event_id = event;
            //@ts-ignore
            else if (event.hasOwnProperty('event_id'))
                event_id = event.event_id;
            else
                return Promise.reject("Event ".concat(event, " is not valid"));
            return _this_1.db.collection(_this_1.collection)
                .deleteOne({ event_id: event_id });
        };
        this.getEventSeq = function (callback) {
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
        this.setEventSeq = function (set) {
            if (set === void 0) { set = true; }
            return _this_1.db.collection(_this_1.collection_seq)
                .updateOne({}, { $inc: { next_id: set ? 1 : 0 } });
        };
        this.runReadyEvents = function () {
            var ready_events = [];
            var _future_ = "now";
            var filter = { time: "now", status: interfaces_1.EventStatus.NotRunning };
            var _this = _this_1;
            return _this_1.db.collection(_this_1.collection).find(filter)
                .toArray()
                .then(function (data) {
                if (data.length > 0)
                    console.log(data.length + " Jobs are ready");
                //return _this.runQueue(data);
                return _this.runNext(data);
            });
        };
        this.runSingleEvent = function (event) {
            var handler;
            handler = _this_1.watering;
            var _this = _this_1;
            if (event.type === "seeding")
                handler = _this_1.seeding;
            if (handler === undefined || handler === null) {
                return Promise.reject("Handler is empty");
            }
            else if (event.type === "watering")
                handler = _this_1.watering;
            event.status = interfaces_1.EventStatus.Running;
            EventQueue.busy = true;
            return _this_1.add(event)
                .then(function (_) {
                console.log("started executing jobs");
                return handler.executeJob(event.job_id, function (err, res) {
                    console.log("Finished running job steps");
                    var event_status = { job_id: event.job_id, type: event.type, status: "failed" };
                    if (err)
                        event_status.status = "failed";
                    if (res)
                        event_status.status = "completed";
                    _this.event_emitter.emit('status', event_status);
                    EventQueue.busy = false; // release the lock
                    // @ts-ignore
                    return _this.remove(event.event_id);
                });
            })
                .then(function () {
                return Promise.resolve(event.event_id);
            });
        };
        this.runQueue = function (events) { return __awaiter(_this_1, void 0, void 0, function () {
            var _this, results, _i, events_2, event_1, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _this = this;
                        results = [];
                        _i = 0, events_2 = events;
                        _a.label = 1;
                    case 1:
                        if (!(_i < events_2.length)) return [3 /*break*/, 4];
                        event_1 = events_2[_i];
                        return [4 /*yield*/, _this.runSingleEvent(event_1)
                                .then(function (_) {
                                console.log("Finished running a single event from the queue");
                            }).catch(function (err) {
                                console.error(err);
                            })];
                    case 2:
                        r = _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.runNext = function (events) {
            var event;
            if (EventQueue.busy) {
                console.log("Queue busy");
                return Promise.resolve("Job queued");
            }
            if (events.length > 0) {
                event = events[0];
                return _this_1.runSingleEvent(event);
            }
            else {
                return Promise.resolve();
            }
        };
        this.collectEvents = function (reschedule) {
            if (reschedule === void 0) { reschedule = false; }
            var addJobsToEventsQueue = function (res, type, handler) { return __awaiter(_this_1, void 0, void 0, function () {
                var _loop_1, this_1, _i, res_1, item;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _loop_1 = function (item) {
                                var event_2;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            event_2 = {
                                                name: item.name,
                                                job_id: item.id,
                                                type: type,
                                                time: item.nextRunAt
                                            };
                                            return [4 /*yield*/, this_1.add(event_2, { single_event: true }).then(function (_) {
                                                    item.scheduled = true;
                                                    if (handler)
                                                        return handler.updateJob(item, function (e, s) {
                                                            if (s)
                                                                console.log("Job's schedule updated");
                                                            if (e)
                                                                console.error("Failed to update the scheduling of the job updated");
                                                        }, false);
                                                })];
                                        case 1:
                                            _b.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            };
                            this_1 = this;
                            _i = 0, res_1 = res;
                            _a.label = 1;
                        case 1:
                            if (!(_i < res_1.length)) return [3 /*break*/, 4];
                            item = res_1[_i];
                            return [5 /*yield**/, _loop_1(item)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, Promise.resolve("Added Jobs to the Queue :  " + res.length)];
                    }
                });
            }); };
            //First clean the event queue: if the Queue is not busy but the there are events marked as running: renew them
            //collect the ready watering jobs and submit them
            var now = new Date();
            var next_10 = new Date(now.getTime() + _this_1.interval);
            reschedule;
            //console.log({ nextRunAt: { '$gt': new Date(now), '$lt': new Date(next_10)}})
            //console.log( {$and: [{ nextRunAt: { '$gt': new Date(now), '$lt': new Date(next_10)}}, {"status.active": true}]})
            var ready_filter = [
                { nextRunAt: 'now' },
                { $and: [{ nextRunAt: { '$gt': new Date(now), '$lt': new Date(next_10) } }] }
            ];
            _this_1.db.collection(watering_1.WATERING_COLLECTION)
                .find({
                $or: ready_filter
            }).toArray()
                .then(function (res) {
                return addJobsToEventsQueue(res, "watering", _this_1.watering);
            })
                .then(function (_) {
                return _this_1.db.collection(seeding_1.SEEDING_COLLECTION)
                    .find({ $or: ready_filter }).toArray();
            }).then(function (res) {
                return addJobsToEventsQueue(res, "seeding", _this_1.seeding);
            });
        };
        this.getScheduledEvents = function () {
            return _this_1.db.collection(_this_1.collection)
                .find({})
                .toArray();
        };
        this.process = function () {
            return _this_1.runReadyEvents();
        };
        this.getEventEmitter = function () {
            return _this_1.event_emitter;
        };
        this.queue = [];
        this.db = dbConnect.getDatabase();
        this.collection = EVENT_COLLECTION;
        this.collection_seq = EVENT_COLLECTION_SEQ;
        this.seeding = new seeding_1.SeedingJob(bot);
        this.watering = new watering_1.WateringJob(bot);
        this.event_emitter = new events_1.EventEmitter();
        this.interval = 100000;
        console.log("Successfully initialized the event queue and locks system");
    }
    EventQueue.busy = false;
    return EventQueue;
}());
exports.EventQueue = EventQueue;
