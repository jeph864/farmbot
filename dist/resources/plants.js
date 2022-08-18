"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlantCoordinates = void 0;
var Resource = /** @class */ (function () {
    function Resource() {
    }
    return Resource;
}());
var PlantGroup = /** @class */ (function (_super) {
    __extends(PlantGroup, _super);
    function PlantGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PlantGroup;
}(Resource));
var PlantCoordinates = /** @class */ (function () {
    function PlantCoordinates(db) {
        var _this = this;
        this.save = function (location) {
            return _this.db.collection(_this.collection)
                .insertOne(location);
        };
        this.getALL = function () {
            return _this.db.collection(_this.collection)
                .find()
                .toArray();
        };
        this.db = db;
        this.collection = "plants_coordinates";
    }
    return PlantCoordinates;
}());
exports.PlantCoordinates = PlantCoordinates;
