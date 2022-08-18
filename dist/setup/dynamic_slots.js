"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slots = void 0;
var api_1 = require("./api");
var SLOT_COLLECTION = "slots";
var Slots = /** @class */ (function () {
    function Slots(database) {
        var _this_1 = this;
        this.init = function () {
            var slots = [];
            for (var i = 0; i < 6; i++) {
                var bay = Math.floor(i / 3);
                var slot_pos = {
                    x: _this_1.zero_locations[bay].x,
                    z: _this_1.zero_locations[bay].z,
                    y: _this_1.zero_locations[bay].y + ((i % 3) * 100)
                };
                var slot = {
                    id: i,
                    type: "",
                    location: slot_pos,
                    bay: bay
                };
                slots.push(slot);
            }
            slots.map(function (item, _) {
                if (item.id == 3) {
                    item.type = "seeding";
                }
                if (item.id == 4) {
                    item.type = "watering";
                }
                return item;
            });
            return slots;
        };
        this.update = function (slot) {
            return _this_1.db.collection(_this_1.collection)
                .updateOne({ id: slot.id }, { $set: slot }, { upsert: true });
        };
        this.updateManySlots = function (slots) {
            var insert = function (s) {
                return Promise.all(s.map(function (slot) {
                    return _this_1.db.collection(_this_1.collection)
                        .updateOne({ id: slot.id }, { $set: slot });
                }));
            };
            slots = slots.filter(function (slot) {
                return typeof slot !== "undefined" || slot.type !== "";
            });
            return insert(slots);
        };
        this.insertInitSlots = function () {
            var slots = _this_1.init();
            var extra = slots;
            var init_extra = {
                extra: {
                    latestSlot: -1
                }
            };
            extra.push(init_extra);
            return _this_1.db.collection(_this_1.collection)
                .insertMany(slots)
                .then(function (_) {
                return Promise.resolve(slots);
            });
        };
        this.findSlots = function () {
            return _this_1.db.collection(_this_1.collection)
                .find()
                .toArray()
                .then(function (res) {
                if (res.length > 0)
                    return Promise.resolve(res);
                else
                    return _this_1.insertInitSlots();
            });
        };
        this.retire = function (job_type, slot_id) {
            if (slot_id === void 0) { slot_id = -1; }
            var _this = _this_1;
            var filter;
            if (slot_id !== -1) {
                filter = { id: slot_id };
            }
            else
                filter = { type: job_type };
            return _this_1.db.collection(_this_1.collection)
                .find(filter)
                .toArray()
                .then(function (results) {
                if (results.length < 0)
                    return Promise.reject("No Slot with the given job type/ slot ID");
                //@ts-ignore
                var slot = results[0];
                if (slot.id == slot_id && job_type == slot.type)
                    return Promise.resolve(results);
                console.log("found the slot");
                console.log(slot);
                return _this.releaseSlot(slot);
            });
        };
        this.pick = function (job_type, slot_id) {
            if (slot_id === void 0) { slot_id = -1; }
            var _this = _this_1;
            var filter = { type: job_type };
            return _this_1.db.collection(_this_1.collection)
                .find(filter)
                .toArray()
                .then(function (results) {
                if (results.length < 0)
                    return Promise.reject("No Slot with the given job type");
                //@ts-ignore
                var slot = results[0];
                if (slot.id == slot_id)
                    return Promise.resolve(results);
                return _this.pickSlot(slot);
            });
        };
        this.getLatestSlot = function () {
            return _this_1.db.collection(_this_1.collection)
                .findOne({ extra: { $exists: true } })
                .then(function (res) {
                var slot = res.extra.latestSlot;
                return Promise.resolve(slot);
            });
        };
        this.releaseStep = function (slot_pos, speed) {
            if (speed === void 0) { speed = 100; }
            var dest = __assign({}, slot_pos);
            return _this_1.bot.moveAbsolute({ x: dest.x + _this_1.safe_dist_to_bay, y: dest.y, z: dest.z, speed: speed })
                .then(function (_) {
                return _this_1.bot.moveAbsolute({ x: dest.x, y: dest.y, z: dest.z, speed: speed });
            }).then(function (_) {
                return _this_1.bot.moveAbsolute({ x: dest.x, y: dest.y, z: dest.z + _this_1.safe_height, speed: speed });
            });
        };
        this.releaseSlot = function (slot) {
            var _this = _this_1;
            slot.free = false;
            console.log("releasing the slot");
            return _this_1.releaseStep(slot.location)
                .then(function (_) {
                return _this.db.collection(_this.collection)
                    .updateOne({ id: slot.id }, { $set: slot }, { upsert: false });
            }).then(function (_) {
                return _this.db.collection(_this.collection)
                    .updateOne({ extra: { $exists: true } }, { $set: { "extra.latestSlot": -1 } });
            });
        };
        this.pickSlot = function (slot) {
            var _this = _this_1;
            slot.free = true;
            return _this_1.pickupStep(slot.location)
                .then(function (_) {
                return _this.db.collection(_this.collection)
                    .updateOne({ id: slot.id }, { $set: slot }, { upsert: false });
            }).then(function (_) {
                return _this.db.collection(_this_1.collection)
                    .updateOne({ extra: { $exists: true } }, { $set: { "extra.latestSlot": slot.id } });
            });
        };
        this.pickupStep = function (slot_pos, speed) {
            if (speed === void 0) { speed = 100; }
            var dest = __assign({}, slot_pos);
            return _this_1.bot.moveAbsolute({ x: dest.x, y: dest.y, z: dest.z + _this_1.safe_height, speed: speed })
                .then(function (_) {
                return _this_1.bot.moveAbsolute({ x: dest.x, y: dest.y, z: dest.z, speed: speed });
            }).then(function (_) {
                return _this_1.bot.moveAbsolute({ x: dest.x + _this_1.safe_dist_to_bay, y: dest.y, z: dest.z, speed: speed });
            });
        };
        this.getRightSlot = function (job_type) {
            var _this = _this_1;
            return _this_1.getLatestSlot()
                .then(function (slot) {
                if (slot == -1) {
                    return _this.pick(job_type);
                }
                else {
                    return _this.retire(job_type, slot)
                        .then(function (_) {
                        return _this.pick(job_type, slot);
                    });
                }
            });
        };
        this.db = database;
        this.bot = api_1.Api.getBot();
        this.collection = SLOT_COLLECTION;
        this.zero_locations = [{ x: 60, y: 243, z: -237 }, { x: 60, y: 883, z: -237 }];
        this.safe_dist_to_bay = 109;
        this.safe_height = 50;
    }
    return Slots;
}());
exports.Slots = Slots;
