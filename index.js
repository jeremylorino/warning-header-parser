'use strict';

const warningHeaderRegex = /^(\d{3})\s([\[\]a-z0-9.@\-\/\:]*)\s\"(.+?)\"(?:\s\"(.+?)\")?$/;
const apiWarningHeaderRegex = /^(\d{3}),\s(.+?),\s(.+?),\s(.+?)$/;

class WarningHeader {
  constructor() {
    this.code = null;
    this.agent = null;
    this.message = null;
    this.date = null;
  }
  
  /**
   * Whether the parsed value is a valid Warning header.
   * 
   * @returns {Boolean}
   */
  get valid() {
    return Object.is(this, new this.constructor());
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
    let keys = Object.keys(warning);
    matches.reduce((obj, value, index)=>(obj[keys[index]] = value, obj), warning);
    
    return warning;
  }
}

module.exports.WarningHeader = WarningHeader;

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
    
    let matches = apiWarningHeaderRegex.exec(warning.message);
    matches = Array.isArray(matches) ? matches.splice(1) : [];
    
    let keys = Object.keys(warning.api);
    matches.reduce((obj, value, index)=>(obj[keys[index]] = value, obj), warning.api);
    
    return warning;
  }
}

module.exports.ApiWarningHeader = ApiWarningHeader;
