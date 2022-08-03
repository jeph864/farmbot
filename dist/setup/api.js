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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = exports.DBSetup = exports.Api = exports.Users = exports.bot = exports.REAL_USER = exports.FAKE_USER = exports.slots_container = exports.event_queue = exports.watering_jobs = exports.seeding_jobs = exports.status_message = void 0;
var mongodb_1 = require("mongodb");
var axios_1 = __importDefault(require("axios"));
var farmbot_1 = require("farmbot");
var seeding_1 = require("../jobs/seeding");
var watering_1 = require("../jobs/watering");
var queue_1 = require("../jobs/queue");
var scheduler_1 = require("../jobs/scheduler");
var dynamic_slots_1 = require("./dynamic_slots");
var MONGO_URL = process.env.MONGO_URI;
var client = new mongodb_1.MongoClient(MONGO_URL);
var dbConnection;
exports.FAKE_USER = 0;
exports.REAL_USER = 1;
var users;
var CLIENT_USER_COLLECTION = "clientUser";
var API_DATA_COLLECTION = "apiData";
var SEQ_COLLECTION = "sequences";
var Users = /** @class */ (function () {
    function Users() {
        var _this = this;
        this.createClientUser = function (username, password, args) {
            return _this.db.collection(CLIENT_USER_COLLECTION)
                .findOneAndUpdate({ username: username }, {
                $set: {
                    "username": username,
                    "password": password,
                    "role": args.role
                },
            }, { upsert: true });
        };
        this.getClientUser = function (username) {
            return _this.db.collection('clientUser')
                .findOne({ "username": username });
        };
        this.saveApiDate = function (username, data) {
            return _this.getClientUser(username)
                .then(function (res) {
                return _this.db.collection(API_DATA_COLLECTION)
                    .updateOne({ username: res.username }, { $set: { username: res.username, data: data } }, { upsert: true });
            });
        };
        this.getApiData = function (username) {
            return _this.db.collection(API_DATA_COLLECTION)
                .findOne({ username: username })
                .then(function (r) {
                if (r) {
                    return Promise.resolve(r);
                }
                else {
                    return Promise.reject();
                }
            });
        };
        this.db = exports.DBSetup.getDatabase();
    }
    return Users;
}());
exports.Users = Users;
exports.Api = {
    connect: function (token) {
        exports.bot = new farmbot_1.Farmbot({ token: token });
        return exports.bot.connect()
            .then(function (result) {
            console.log("Successfully connected to the Farmbot");
            return Promise.resolve(result);
        }).catch(function (err) {
            console.error(err);
            process.exit();
        });
    },
    getBot: function () {
        return exports.bot;
    },
    token: function (email, password) {
        var config = {
            method: 'post',
            url: 'https://my.farm.bot/api/tokens',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                "user": {
                    "email": email,
                    "password": password
                }
            })
        };
        return (0, axios_1.default)(config);
    }
};
exports.DBSetup = {
    seq_collection: SEQ_COLLECTION,
    connect: function () {
        return client.connect()
            .then(function (db) {
            dbConnection = db.db("farmbot");
            console.log("Successfully connected to MongoDB");
        }).catch(function (err) {
            console.error(err);
            console.log("Exiting... Could not connect to the database");
            process.exit();
        });
    },
    getDatabase: function () {
        return dbConnection;
    },
    getSeq: function (callback) {
        var db = exports.DBSetup.getDatabase();
        // @ts-ignore
        var collection_seq = _this.seq_collection;
        return db.collection(collection_seq)
            .findOne({})
            .then(function (res) {
            var doc = { next_id: 0 };
            if (res) {
                if (callback)
                    callback(res);
            }
            else
                db.collection(collection_seq).insertOne(doc)
                    .then(function (_) { if (callback)
                    callback(doc); })
                    .catch(function (_) { if (callback)
                    callback(null); });
        }).catch(function (_) { if (callback)
            callback(null); });
    },
    setSeq: function (set) {
        if (set === void 0) { set = true; }
        var db = exports.DBSetup.getDatabase();
        // @ts-ignore
        var collection_seq = _this.seq_collection;
        return db.collection(collection_seq)
            .updateOne({}, { $inc: { next_id: set ? 1 : 0 } });
    }
};
function setup(args) {
    var _this = this;
    var initUsers = function (users) {
        if (!users) {
            users = new Users();
        }
        console.log("Initializing users");
        var user = [
            {
                username: "favier@rhrk.uni-kl.de",
                password: "mYfarm2021*"
            },
            {
                username: "doerr@cs.uni-kl.de",
                password: "mYfarm2022*"
            }
        ];
        return users.createClientUser(user[exports.FAKE_USER].username, user[exports.FAKE_USER].password, {})
            .then(function (_) {
            return users.createClientUser(user[exports.REAL_USER].username, user[exports.REAL_USER].password, {});
        }).then(function (_) {
            console.log("Users created successfully");
            console.log("Fetching API data ");
            exports.bot = exports.Api.getBot();
            return exports.Api.token(user[args.fallback_user].username, user[args.fallback_user].password);
        }).then(function (data) {
            console.log(data.data);
            return users.saveApiDate(args.username, data.data);
        }).then(function (_r) {
            console.log(_r);
            return users.getApiData(args.username);
        });
    };
    var database = exports.DBSetup.getDatabase();
    return exports.DBSetup.connect()
        .then(function (_) {
        users = new Users();
        return users.getApiData(args.username);
    })
        .catch(function (_) {
        console.log("Init: users");
        return initUsers(users);
    })
        .then(function (results) {
        return exports.Api.connect(results.data.token.encoded);
    })
        .then(function (_) {
        exports.bot = exports.Api.getBot();
        exports.bot.client.on('message', function (topic, payload, _) {
            if (topic == exports.bot.channel.status) {
                exports.status_message = JSON.parse(payload.toString()).location_data.position;
                //console.log(status_message)
            }
        });
        console.log("Initializing the Jobs");
        exports.seeding_jobs = new seeding_1.SeedingJob(exports.bot);
        exports.watering_jobs = new watering_1.WateringJob(exports.bot);
        //slots
        exports.slots_container = new dynamic_slots_1.Slots(exports.DBSetup.getDatabase());
        exports.event_queue = new queue_1.EventQueue(exports.bot);
        //schedulers
        var dbase = exports.DBSetup.getDatabase();
        var sch1 = new scheduler_1.Scheduler(database);
        var event_collector = (new scheduler_1.Scheduler(dbase)).getAgenda();
        event_collector.define("collectEvents", function (_) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exports.event_queue.collectEvents()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        event_collector.every("10 seconds", "collectEvents")
            .then(function (_) {
            return event_collector.start();
        }).then(function (_) { });
        var queue_executor = (new scheduler_1.Scheduler(dbase)).getAgenda();
        queue_executor.define("runQueuedJobs", function (_) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exports.event_queue.process()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        queue_executor.every("5 seconds", "runQueuedJobs")
            .then(function (_) {
            return queue_executor.start();
        }).then(function (_) { });
    });
}
exports.setup = setup;
