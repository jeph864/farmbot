"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.setup = void 0;
var dbConnect = require("../../utils/conn");
/*export class Setup{
  constructor() {
  }
  checkDatabase = () =>{
  };
  checkCollections = () => {};
  checkAPI = () => {};
  initializeUsers = () =>{};
  initializeSettings = () => {};
  initializeSchedulers = () => {};
}*/
function setup() {
    dbConnect.connect()
        .then(function (_) {
        return;
    }).catch(function (err) {
        console.error(err);
        process.exit();
    });
}
exports.setup = setup;
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
        this.saveSettings = function (settings) {
            return _this.db.collection(_this.settings_collection).
                updateOne({ id: 0 }, { $set: settings }, { upsert: true });
        };
        this.getSettings = function () {
            return _this.db.collection(_this.settings_collection)
                .findOne();
        };
        this.api = api;
        this.db = dbConnect.getDatabase();
        this.api_collection = "apiData";
        this.current_sess_user = user;
    }
    return Settings;
}());
exports.config = new Settings(null, 0);
