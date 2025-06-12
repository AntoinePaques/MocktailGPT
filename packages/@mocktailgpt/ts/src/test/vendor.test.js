"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const vendorExtensions_1 = require("../src/vendorExtensions");
assert_1.default.strictEqual(vendorExtensions_1.VENDOR_EXTENSIONS.MODEL, "x-model");
console.log("vendor keys ok");
