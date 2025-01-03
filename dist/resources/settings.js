"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
var api_1 = require("../setup/api");
function setup() {
    api_1.DBSetup.connect()
        .then(function (_) {
        return;
    }).catch(function (err) {
        console.error(err);
        process.exit();
    });
}
var Settings = /** @class */ (function () {
    function Settings(api, user) {
        var _this = this;
        this.initial_params = {
            device_id: 0,
            tray_pos: { x: 900, y: 725, z: -464 },
            safe_height: 30,
            ground_level: -486,
            watering: {
                pin_number: 8,
                pin_id: 30536
            },
            seeding: {
                pin_number: 9,
                pin_id: 30538
            },
            zlock: -460
        };
        this.getInitialSettings = function () {
            return _this.initial_params;
        };
        this.getDevice = function () {
            _this.db.collection(_this.api_collection)
                .findOne({ username: _this.current_sess_user })
                .then(function (res) {
                return res;
            });
        };
        this.saveSettings = function (settings) {
            return _this.db.collection(_this.settings_collection).
                updateOne({ id: 0 }, { $set: settings }, { upsert: true });
        };
        this.getSettings = function () {
            return _this.db.collection(_this.settings_collection)
                .findOne();
        };
        this.api = api;
        this.db = api_1.DBSetup.getDatabase();
        this.api_collection = "apiData";
        this.current_sess_user = user;
    }
    return Settings;
}());
exports.config = new Settings(null, 0);
