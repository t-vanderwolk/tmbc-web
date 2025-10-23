"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRole = exports.ROLES = void 0;
exports.ROLES = ['ADMIN', 'MENTOR', 'MEMBER'];
const isRole = (value) => {
    return !!value && exports.ROLES.includes(value);
};
exports.isRole = isRole;
