"use strict";

const _ = require('lodash'),
  WarningHeader = require('./WarningHeader'),
  apiWarningHeaderRegex = /^(\d{3}),\s(.+?),\s(.+?),\s(\d{4}-\d{2}-\d{2}T\d{2}\:\d{2}\:\d{2}\.\d{3}Z)$/,
  { ApiWarningCodes, isValidDate } = require('./common.js');

class ApiWarningHeader extends WarningHeader {
  constructor() {
    super();

    this.api = {
      code: null,
      text: null,
      detailUri: null,
      date: null,
    };
  }

  /**
   * Whether the parsed value is a valid Api Warning header.
   * 
   * @returns {Boolean}
   */
  get valid() {
    return super.valid &&
      false === _.isEqual(this.toJSON().api, new this.constructor().toJSON().api) &&
      null !== this.api.date;
  }

  static get codes() {
    return {
      ...super.codes,
      API: ApiWarningCodes,
    };
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
    let warning = super.parseValue(headerValue);
    warning[WarningHeader.INTERNAL] = {
      api: {},
    };

    let matches = apiWarningHeaderRegex.exec(warning.text);
    matches = Array.isArray(matches) ? matches.splice(1) : [];

    let keys = Object.keys(warning.api);
    matches.reduce((obj, value, index) => {
      let k = keys[index];
      switch (k) {
        case 'code':
          value = parseInt(value, 10);
          break;

        case 'date':
          warning[WarningHeader.INTERNAL].api[`raw_${k}`] = value;

          if (isValidDate(value) && new Date(value).toJSON() === value) {
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
    }, warning.api);

    return warning;
  }
}

module.exports = ApiWarningHeader;
