'use strict';
const assert = require('assert'),
  {
    WarningHeader,
    ApiWarningHeader,
  } = require('./');

let warning = WarningHeader.parseValue('199 agent "Error message" "2015-01-01"');
assert(warning instanceof WarningHeader, true);
assert.equal(Object.keys(warning).length, 4);
assert.deepEqual(warning, {
  code: '199',
  agent: 'agent',
  message: 'Error message',
  date: '2015-01-01'
});

// TODO: remove this test. format is not part of [RFC 7234 §5.5](https://tools.ietf.org/html/rfc7234#section-5.5)
// let warnings = WarningHeader.parseValue('199 agent "Error message" "2015", 299 agent2 "Error message 2 with \\" quote" "2016"');
// assert.equal(warnings.length, 2);
// assert.deepEqual(warnings[0], {code: '199', agent: 'agent', message: 'Error message', date: '2015'});
// assert.deepEqual(warnings[1], {code: '299', agent: 'agent2', message: 'Error message 2 with \\" quote', date: '2016'});

// HTTP-Date format support https://tools.ietf.org/html/rfc7231#section-7.1.1.1
let httpDate = WarningHeader.parseValue('199 agent "Error message" "Sun, 06 Nov 1994 08:49:37 GMT"');
assert.deepEqual(httpDate, {
  code: '199',
  agent: 'agent',
  message: 'Error message',
  date: 'Sun, 06 Nov 1994 08:49:37 GMT'
});

warning = WarningHeader.parseValue(`112 - "network down" "Sat, 25 Aug 2012 23:34:45 GMT"`);
assert.deepEqual(warning, {
  code: '112',
  agent: '-',
  message: 'network down',
  date: 'Sat, 25 Aug 2012 23:34:45 GMT'
});

warning = WarningHeader.parseValue(`299 google.com "300, Deprecation, https://yoursite.com/details/300.json, 2017-12-12T23:28:18.508Z" "Wed, 21 Oct 2015 07:28:00 GMT"`);
assert.deepEqual(warning, {
  code: '299',
  agent: 'google.com',
  message: '300, Deprecation, https://yoursite.com/details/300.json, 2017-12-12T23:28:18.508Z',
  date: 'Wed, 21 Oct 2015 07:28:00 GMT'
});

warning = WarningHeader.parseValue(`299 google.com:80 "300, Deprecation, https://yoursite.com/details/300.json, 2017-12-12T23:28:18.508Z" "Wed, 21 Oct 2015 07:28:00 GMT"`);
assert.deepEqual(warning, {
  code: '299',
  agent: 'google.com:80',
  message: '300, Deprecation, https://yoursite.com/details/300.json, 2017-12-12T23:28:18.508Z',
  date: "Wed, 21 Oct 2015 07:28:00 GMT"
});

warning = WarningHeader.parseValue(`299 2001:1900:3001:11::3e/a "300, Deprecation, https://yoursite.com/details/300.json, 2017-12-12T23:28:18.508Z" "Wed, 21 Oct 2015 07:28:00 GMT"`);
assert.deepEqual(warning, {
  code: '299',
  agent: '2001:1900:3001:11::3e/a',
  message: '300, Deprecation, https://yoursite.com/details/300.json, 2017-12-12T23:28:18.508Z',
  date: 'Wed, 21 Oct 2015 07:28:00 GMT'
});

// Returns an empty array for invalid headers
assert.equal(WarningHeader.parseValue().valid, false);
assert.equal(WarningHeader.parseValue('').valid, false);

warning = ApiWarningHeader.parseValue(`299 2001:1900:3001:11::3e/a "300, Deprecation, https://yoursite.com/details/300.json, 2017-12-12T23:28:18.508Z" "Wed, 21 Oct 2015 07:28:00 GMT"`);
assert.deepEqual(warning, {
  code: '299',
  agent: '2001:1900:3001:11::3e/a',
  message: '300, Deprecation, https://yoursite.com/details/300.json, 2017-12-12T23:28:18.508Z',
  date: 'Wed, 21 Oct 2015 07:28:00 GMT',
  api: {
    code: '300',
    text: 'Deprecation',
    detailUri: 'https://yoursite.com/details/300.json',
    date: '2017-12-12T23:28:18.508Z',
  }
});

console.log('complete');