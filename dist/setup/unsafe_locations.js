"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnsafeLocation = void 0;
var api_1 = require("./api");
var COLLECTION = "unsafe_locations";
var UnsafeLocation = /** @class */ (function () {
    function UnsafeLocation(config) {
        var _this_1 = this;
        this.save = function (location) {
            var _this = _this_1;
            var _insert = false;
            return _this_1.getSeq()
                .then(function (next) {
                var next_id = next.next_id;
                var filter = {};
                if (location.id === -1 || typeof location.id !== "number") {
                    location.id = next_id;
                    _insert = true;
                }
                location.id = next_id;
                return _this.db.collection(_this_1.collection)
                    .updateOne({ id: next_id }, { $set: location }, { upsert: _insert });
            }).then(function (_) {
                return _this.setSeq(_insert);
            });
        };
        this.get = function (filter) {
            if (filter === void 0) { filter = {}; }
            return _this_1.db.collection(_this_1.collection)
                .find(filter)
                .toArray();
        };
        this.getSeq = function () {
            // @ts-ignore
            var collection_seq = _this_1.seq_collection;
            return _this_1.db.collection(collection_seq)
                .findOne({})
                .then(function (res) {
                var doc = { next_id: 0 };
                if (res) {
                    doc.next_id = res.next_id;
                    return Promise.resolve(doc);
                }
                else
                    return _this_1.db.collection(collection_seq).insertOne(doc)
                        .then(function (_) {
                        return Promise.resolve(doc);
                    });
            });
        };
        this.delete = function (id) {
            return _this_1.db.collection(_this_1.collection)
                .deleteOne({ id: id });
        };
        this.setSeq = function (set) {
            if (set === void 0) { set = true; }
            var db = api_1.DBSetup.getDatabase();
            // @ts-ignore
            var collection_seq = _this_1.seq_collection;
            return db.collection(collection_seq)
                .updateOne({}, { $inc: { next_id: set ? 1 : 0 } });
        };
        this.config = config;
        this.ground_level = config.ground_level;
        this.db = config.db;
        this.collection = COLLECTION;
        this.db_setup = api_1.DBSetup;
        this.seq_collection = 'unsafe_seq';
    }
    return UnsafeLocation;
}());
exports.UnsafeLocation = UnsafeLocation;
