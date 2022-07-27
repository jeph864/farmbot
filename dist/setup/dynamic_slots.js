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
exports.slots = exports.Slots = void 0;
var api_1 = require("./api");
var api_2 = require("./api");
var SLOT_COLLECTION = "slots";
var Slots = /** @class */ (function () {
    function Slots() {
        var _this = this;
        this.init = function () {
            var slots = [];
            for (var i = 0; i < 6; i++) {
                var bay = Math.floor(i / 3);
                var slot_pos = {
                    x: _this.zero_locations[bay].x,
                    z: _this.zero_locations[bay].z,
                    y: _this.zero_locations[bay].y + ((i % 3) * 100)
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
                if (item.id == 0) {
                    item.type = "seeding";
                }
                if (item.id == 1) {
                    item.type = "watering";
                }
                return item;
            });
            return slots;
        };
        this.update = function (slot) {
            return _this.db.collection(_this.collection)
                .updateOne({ id: slot.id }, { $set: slot }, { upsert: true });
        };
        this.updateManySlots = function (slots) {
            var insert = function (s) {
                return Promise.all(s.map(function (slot) {
                    return _this.db.collection(_this.collection)
                        .updateOne({ id: slot.id }, { $set: slot });
                }));
            };
            slots = slots.filter(function (slot) {
                return typeof slot !== "undefined" || slot.type !== "";
            });
            return insert(slots);
        };
        this.insertInitSlots = function () {
            var slots = _this.init();
            return _this.db.collection(_this.collection)
                .insertMany(slots)
                .then(function (_) {
                return Promise.resolve(slots);
            });
        };
        this.findSlots = function () {
            return _this.db.collection(_this.collection)
                .find()
                .toArray()
                .then(function (res) {
                if (res.length > 0)
                    return Promise.resolve(res);
                else
                    return _this.insertInitSlots();
            });
        };
        this.retire = function () { };
        this.pick = function () {
        };
        this.getLatestSlot = function () {
        };
        this.move = function (slot_pos, speed) {
            if (speed === void 0) { speed = 100; }
            var dest = __assign({}, slot_pos);
            return _this.bot.moveAbsolute({ x: dest.x - _this.safe_dist_to_bay, y: dest.y, z: dest.z, speed: speed });
        };
        this.db = api_1.DBSetup.getDatabase();
        this.bot = api_2.Api.getBot();
        this.collection = SLOT_COLLECTION;
        this.zero_locations = [{ x: 60, y: 243, z: -357 }, { x: 60, y: 860, z: -357 }];
        this.safe_dist_to_bay = 169;
    }
    return Slots;
}());
exports.Slots = Slots;
exports.slots = new Slots();
