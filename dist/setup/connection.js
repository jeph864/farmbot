"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
var mongodb_1 = require("mongodb");
var MONGO_URL = process.env.MONGO_URI;
var client = new mongodb_1.MongoClient(MONGO_URL);
var dbConnection;
exports.DB = {
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
    }
};
