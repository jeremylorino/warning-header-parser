"use strict";

const _ = require('lodash'),
  INTERNAL = Symbol('internal'),
  warningHeaderRegex = /^(\d{3})\s([\[\]a-z0-9.@\-\/\:]*)\s\"(.+?)\"(?:\s\"(.+?)\")?$/,
  { WarningCodes, isValidDate } = require('./common.js');

class WarningHeader {
  constructor() {
    this.code = null;
    this.agent = null;
    this.text = null;
    this.date = null;
  }

  get[Symbol.toStringTag]() {
    return this.constructor.name;
  }

  toJSON() {
    return _.toPlainObject(this);
  }

  /**
   * Whether the parsed value is a valid Warning header.
   * 
   * @returns {Boolean}
   */
  get valid() {
    return false === _.isEqual(this.toJSON(), new this.constructor().toJSON()) &&
      (_.isEmpty(this[INTERNAL].raw_date) || null !== this.date);
  }

  static get codes() {
    return WarningCodes;
  }

  /**
   * Tries to parse a String according to the Warning header format.
   * 
   * @param {String} headerValue - Warning header value.
   * @returns {WarningHeader}
   * 
   * @example
   * let warning = WarningHeader.parseValue(`112 - "network down" "Sat, 25 Aug 2012 23:34:45 GMT"`));
   * console.log(warning);
   * // WarningHeader {
   * //  code: '112',
   * //  agent: '-',
   * //  message: 'network down',
   * //  date: 'Sat, 25 Aug 2012 23:34:45 GMT'
   * // }
   */
  static parseValue(headerValue) {
    let matches = warningHeaderRegex.exec(headerValue);
    matches = Array.isArray(matches) ? matches.splice(1) : [];

    let warning = new this();
    warning[INTERNAL] = {
      rawValue: headerValue,
    };

    let keys = Object.keys(warning);
    matches.reduce((obj, value, index) => {
      let k = keys[index];
      switch (k) {
        case 'code':
          value = parseInt(value, 10);
          break;

        case 'date':
          obj[INTERNAL][`raw_${k}`] = value;

          if (isValidDate(value) && new Date(value).toUTCString() === value) {
            value = new Date(value);
          }
          else {
            value = null;
          }
          break;

        default:
          // code
      }
      obj[k] = value;
      return obj;
    }, warning);

    return warning;
  }
}

WarningHeader.INTERNAL = INTERNAL;

module.exports = WarningHeader;
