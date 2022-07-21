"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
var dbConnect = require("../../utils/conn");
var Settings = /** @class */ (function () {
    function Settings(api, user) {
        var _this = this;
        this.initial_params = {
            device_id: 0,
            tray_pos: { x: 900, y: 600, z: -468 },
            safe_height: 30,
            ground_level: -486,
            watering: {
                pin_number: 8,
                pin_id: 30536
            },
            seeding: {
                pin_number: 9,
                pin_id: 30538
            }
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
        this.api = api;
        this.db = dbConnect.getDatabase();
        this.api_collection = "apiData";
        this.current_sess_user = user;
    }
    return Settings;
}());
exports.config = new Settings(null, 0);