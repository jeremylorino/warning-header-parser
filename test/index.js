'use strict';

const {
  suite,
  describe,
  beforeEach,
  test,
  expect,
} = exports.lab = require('lab').script();
const {
  WarningHeader,
  ApiWarningHeader,
} = require('../');

suite('class WarningHeader', ()=>{
  suite('basic structure', ()=>{
    test('properties', ()=>{
      let warning = new WarningHeader();
      expect(warning).to.be.an.instanceof(WarningHeader);
      expect(warning).to.contain(['code', 'agent', 'text', 'date']);
    });
    
    test('methods', ()=>{
      let warning = new WarningHeader();
      expect(warning.toString()).to.equal(`[object WarningHeader]`);
      expect(warning.valid).to.exist();
      expect(warning.valid).to.be.false();
      expect(warning.toJSON).to.exist();
      expect(warning.toJSON()).to.equal({
        code: null,
        agent: null,
        text: null,
        date: null,
      });
    });
    
    test('static methods', ()=>{
      expect(WarningHeader.codes).to.exist();
      expect(WarningHeader.parseValue).to.exist();
    });
  });
  
  suite('parse header value', ()=>{
    suite('invalid', ()=>{
      test('no value', ()=>{
        let warning = WarningHeader.parseValue();
        expect(warning.valid).to.be.false();
        expect(warning.code).to.be.null();
        expect(warning.agent).to.be.null();
        expect(warning.text).to.be.null();
        expect(warning.date).to.be.null();
        expect(warning).to.equal({
          code: null,
          agent: null,
          text: null,
          date: null,
        });
      });
      
      test('empty value', ()=>{
        let warning = WarningHeader.parseValue('');
        expect(warning.valid).to.be.false();
        expect(warning.code).to.be.null();
        expect(warning.agent).to.be.null();
        expect(warning.text).to.be.null();
        expect(warning.date).to.be.null();
        expect(warning).to.equal({
          code: null,
          agent: null,
          text: null,
          date: null,
        });
      });
      
      suite('malformed value', ()=>{
        test('missing warn-agent', ()=>{
          let warning = WarningHeader.parseValue('110 "Response is Stale" "Sun, 06 Nov 1994 08:49:37 GMT"');
          expect(warning.valid).to.be.false();
          expect(warning.code).to.be.null();
          expect(warning.agent).to.be.null();
          expect(warning.text).to.be.null();
          expect(warning.date).to.be.null();
          expect(warning).to.equal({
            code: null,
            agent: null,
            text: null,
            date: null,
          });
        });
        
        test('missing warn-agent and warn-date', ()=>{
          let warning = WarningHeader.parseValue('110 "Response is Stale"');
          expect(warning.valid).to.be.false();
          expect(warning.code).to.be.null();
          expect(warning.agent).to.be.null();
          expect(warning.text).to.be.null();
          expect(warning.date).to.be.null();
          expect(warning).to.equal({
            code: null,
            agent: null,
            text: null,
            date: null,
          });
        });
        
        test('invalid warn-code', ()=>{
          let warning = WarningHeader.parseValue('11 - "Response is Stale"');
          expect(warning.valid).to.be.false();
          expect(warning.code).to.be.null();
          expect(warning.agent).to.be.null();
          expect(warning.text).to.be.null();
          expect(warning.date).to.be.null();
          expect(warning).to.equal({
            code: null,
            agent: null,
            text: null,
            date: null,
          });
        });
        
        test('missing warn-text', ()=>{
          let warning = WarningHeader.parseValue('110 -');
          expect(warning.valid).to.be.false();
          expect(warning.code).to.be.null();
          expect(warning.agent).to.be.null();
          expect(warning.text).to.be.null();
          expect(warning.date).to.be.null();
          expect(warning).to.equal({
            code: null,
            agent: null,
            text: null,
            date: null,
          });
        });
        
        test('invalid warn-text', ()=>{
          let warning = WarningHeader.parseValue('110 - Response is Stale');
          expect(warning.valid).to.be.false();
          expect(warning.code).to.be.null();
          expect(warning.agent).to.be.null();
          expect(warning.text).to.be.null();
          expect(warning.date).to.be.null();
          expect(warning).to.equal({
            code: null,
            agent: null,
            text: null,
            date: null,
          });
        });
      });
      
      // HTTP-Date format support https://tools.ietf.org/html/rfc7231#section-7.1.1.1
      test('warn-date', ()=>{
        let warning = WarningHeader.parseValue('110 - "Response is Stale" "GMT"');
        expect(warning.valid).to.be.false();
        expect(warning.code).to.be.a.number();
        expect(warning.agent).to.be.a.string();
        expect(warning.text).to.be.a.string();
        expect(warning.date).to.be.null();
        expect(warning).to.equal({
          code: 110,
          agent: '-',
          text: 'Response is Stale',
          date: null,
        });
      });
      test('non-compliant warn-date', ()=>{
        let warning = WarningHeader.parseValue('110 - "Response is Stale" "Sun Nov 06 1994 02:49:37 GMT-0600 (CST)"');
        expect(warning.valid).to.be.false();
        expect(warning.code).to.be.a.number();
        expect(warning.agent).to.be.a.string();
        expect(warning.text).to.be.a.string();
        expect(warning.date).to.be.null();
        expect(warning).to.equal({
          code: 110,
          agent: '-',
          text: 'Response is Stale',
          date: null,
        });
      });
      test('warn-agent and non-compliant warn-date', ()=>{
        let warning = WarningHeader.parseValue('110 google.com "Response is Stale" "Sun Nov 06 1994 02:49:37 GMT-0600 (CST)"');
        expect(warning.valid).to.be.false();
        expect(warning.code).to.be.a.number();
        expect(warning.agent).to.be.a.string();
        expect(warning.text).to.be.a.string();
        expect(warning.date).to.be.null();
        expect(warning).to.equal({
          code: 110,
          agent: 'google.com',
          text: 'Response is Stale',
          date: null,
        });
      });
    });
    
    suite('valid', ()=>{
      test('blank warn-agent without warn-date', ()=>{
        let warning = WarningHeader.parseValue('110 - "Response is Stale"');
        expect(warning.valid).to.be.true();
        expect(warning.code).to.be.a.number();
        expect(warning.agent).to.be.a.string();
        expect(warning.text).to.be.a.string();
        expect(warning.date).to.be.null();
        expect(warning).to.equal({
          code: 110,
          agent: '-',
          text: 'Response is Stale',
          date: null,
        });
      });
      
      test('blank warn-agent with warn-date', ()=>{
        let warning = WarningHeader.parseValue('110 - "Response is Stale" "Sun, 06 Nov 1994 08:49:37 GMT"');
        expect(warning.valid).to.be.true();
        expect(warning.code).to.be.a.number();
        expect(warning.agent).to.be.a.string();
        expect(warning.text).to.be.a.string();
        expect(warning.date).to.be.a.date();
        expect(warning).to.equal({
          code: 110,
          agent: '-',
          text: 'Response is Stale',
          date: new Date('Sun, 06 Nov 1994 08:49:37 GMT'),
        });
      });
      
      test('with warn-agent without warn-date', ()=>{
        let warning = WarningHeader.parseValue('110 google.com "Response is Stale"');
        expect(warning.valid).to.be.true();
        expect(warning.code).to.be.a.number();
        expect(warning.agent).to.be.a.string();
        expect(warning.text).to.be.a.string();
        expect(warning.date).to.be.null();
        expect(warning).to.equal({
          code: 110,
          agent: 'google.com',
          text: 'Response is Stale',
          date: null,
        });
      });
      
      test('with warn-agent and warn-date', ()=>{
        let warning = WarningHeader.parseValue('110 google.com "Response is Stale" "Sun, 06 Nov 1994 08:49:37 GMT"');
        expect(warning.valid).to.be.true();
        expect(warning.code).to.be.a.number();
        expect(warning.agent).to.be.a.string();
        expect(warning.text).to.be.a.string();
        expect(warning.date).to.be.a.date();
        expect(warning).to.equal({
          code: 110,
          agent: 'google.com',
          text: 'Response is Stale',
          date: new Date('Sun, 06 Nov 1994 08:49:37 GMT'),
        });
      });
    
      test('with warn-text as api warning', ()=>{
        let warning = WarningHeader.parseValue(`299 google.com "300, Deprecation, https://yoursite.com/details/300.json, 2017-12-12T23:28:18.508Z" "Wed, 21 Oct 2015 07:28:00 GMT"`);
        expect(warning.valid).to.be.true();
        expect(warning.code).to.be.a.number();
        expect(warning.agent).to.be.a.string();
        expect(warning.text).to.be.a.string();
        expect(warning.date).to.be.a.date();
        expect(warning).to.equal({
          code: 299,
          agent: 'google.com',
          text: '300, Deprecation, https://yoursite.com/details/300.json, 2017-12-12T23:28:18.508Z',
          date: new Date("Wed, 21 Oct 2015 07:28:00 GMT"),
        });
      });
    });
  });
});

suite('class ApiWarningHeader', ()=>{
  suite('basic structure', ()=>{
    test('properties', ()=>{
      let warning = new ApiWarningHeader();
      expect(warning).to.be.an.instanceof(WarningHeader);
      expect(warning).to.be.an.instanceof(ApiWarningHeader);
      expect(warning).to.contain(['code', 'agent', 'text', 'date', 'api']);
      expect(warning.api).to.contain(['code', 'text', 'detailUri', 'date']);
    });
    
    test('methods', ()=>{
      let warning = new ApiWarningHeader();
      expect(warning.toString()).to.equal(`[object ApiWarningHeader]`);
      expect(warning.valid).to.exist();
      expect(warning.valid).to.be.false();
      expect(warning.toJSON).to.exist();
      expect(warning.toJSON()).to.equal({
        code: null,
        agent: null,
        text: null,
        date: null,
        api: {
          code: null,
          text: null,
          detailUri: null,
          date: null,
        },
      });
    });
    
    test('static methods', ()=>{
      expect(ApiWarningHeader.codes).to.exist();
      expect(ApiWarningHeader.codes.API).to.exist();
      expect(ApiWarningHeader.parseValue).to.exist();
    });
  });
  
  suite('parse header value', ()=>{
    suite('invalid', ()=>{
      suite('parent class', ()=>{
        suite('malformed value', ()=>{
          test('missing warn-agent', ()=>{
            let warning = ApiWarningHeader.parseValue('110 "Response is Stale" "Sun, 06 Nov 1994 08:49:37 GMT"');
            expect(warning.valid).to.be.false();
            expect(warning.code).to.be.null();
            expect(warning.agent).to.be.null();
            expect(warning.text).to.be.null();
            expect(warning.date).to.be.null();
            expect(warning.toJSON()).to.equal({
              code: null,
              agent: null,
              text: null,
              date: null,
              api: {
                code: null,
                text: null,
                detailUri: null,
                date: null,
              },
            });
          });
          
          test('missing warn-agent and warn-date', ()=>{
            let warning = ApiWarningHeader.parseValue('110 "Response is Stale"');
            expect(warning.valid).to.be.false();
            expect(warning.code).to.be.null();
            expect(warning.agent).to.be.null();
            expect(warning.text).to.be.null();
            expect(warning.date).to.be.null();
            expect(warning.toJSON()).to.equal({
              code: null,
              agent: null,
              text: null,
              date: null,
              api: {
                code: null,
                text: null,
                detailUri: null,
                date: null,
              },
            });
          });
          
          test('invalid warn-code', ()=>{
            let warning = ApiWarningHeader.parseValue('11 - "Response is Stale"');
            expect(warning.valid).to.be.false();
            expect(warning.code).to.be.null();
            expect(warning.agent).to.be.null();
            expect(warning.text).to.be.null();
            expect(warning.date).to.be.null();
            expect(warning.toJSON()).to.equal({
              code: null,
              agent: null,
              text: null,
              date: null,
              api: {
                code: null,
                text: null,
                detailUri: null,
                date: null,
              },
            });
          });
          
          test('missing warn-text', ()=>{
            let warning = ApiWarningHeader.parseValue('110 -');
            expect(warning.valid).to.be.false();
            expect(warning.code).to.be.null();
            expect(warning.agent).to.be.null();
            expect(warning.text).to.be.null();
            expect(warning.date).to.be.null();
            expect(warning.toJSON()).to.equal({
              code: null,
              agent: null,
              text: null,
              date: null,
              api: {
                code: null,
                text: null,
                detailUri: null,
                date: null,
              },
            });
          });
          
          test('invalid warn-text', ()=>{
            let warning = ApiWarningHeader.parseValue('110 - Response is Stale');
            expect(warning.valid).to.be.false();
            expect(warning.code).to.be.null();
            expect(warning.agent).to.be.null();
            expect(warning.text).to.be.null();
            expect(warning.date).to.be.null();
            expect(warning.toJSON()).to.equal({
              code: null,
              agent: null,
              text: null,
              date: null,
              api: {
                code: null,
                text: null,
                detailUri: null,
                date: null,
              },
            });
          });
        });
        
        // HTTP-Date format support https://tools.ietf.org/html/rfc7231#section-7.1.1.1
        test('warn-date', ()=>{
          let warning = ApiWarningHeader.parseValue('110 - "Response is Stale" "GMT"');
          expect(warning.valid).to.be.false();
          expect(warning.code).to.be.a.number();
          expect(warning.agent).to.be.a.string();
          expect(warning.text).to.be.a.string();
          expect(warning.date).to.be.null();
          expect(warning).to.equal({
            code: 110,
            agent: '-',
            text: 'Response is Stale',
            date: null,
            api: {
              code: null,
              text: null,
              detailUri: null,
              date: null,
            },
          });
        });
        test('non-compliant warn-date', ()=>{
          let warning = ApiWarningHeader.parseValue('110 - "Response is Stale" "Sun Nov 06 1994 02:49:37 GMT-0600 (CST)"');
          expect(warning.valid).to.be.false();
          expect(warning.code).to.be.a.number();
          expect(warning.agent).to.be.a.string();
          expect(warning.text).to.be.a.string();
          expect(warning.date).to.be.null();
          expect(warning).to.equal({
            code: 110,
            agent: '-',
            text: 'Response is Stale',
            date: null,
            api: {
              code: null,
              text: null,
              detailUri: null,
              date: null,
            },
          });
        });
        test('warn-agent and non-compliant warn-date', ()=>{
          let warning = ApiWarningHeader.parseValue('110 google.com "Response is Stale" "Sun Nov 06 1994 02:49:37 GMT-0600 (CST)"');
          expect(warning.valid).to.be.false();
          expect(warning.code).to.be.a.number();
          expect(warning.agent).to.be.a.string();
          expect(warning.text).to.be.a.string();
          expect(warning.date).to.be.null();
          expect(warning).to.equal({
            code: 110,
            agent: 'google.com',
            text: 'Response is Stale',
            date: null,
            api: {
              code: null,
              text: null,
              detailUri: null,
              date: null,
            },
          });
        });
      });
      
      test('no value', ()=>{
        let warning = ApiWarningHeader.parseValue();
        expect(warning.valid).to.be.false();
        expect(warning.code).to.be.null();
        expect(warning.agent).to.be.null();
        expect(warning.text).to.be.null();
        expect(warning.date).to.be.null();
        expect(warning.toJSON()).to.equal({
          code: null,
          agent: null,
          text: null,
          date: null,
          api: {
            code: null,
            text: null,
            detailUri: null,
            date: null,
          },
        });
      });
      
      test('empty value', ()=>{
        let warning = ApiWarningHeader.parseValue('');
        expect(warning.valid).to.be.false();
        expect(warning.code).to.be.null();
        expect(warning.agent).to.be.null();
        expect(warning.text).to.be.null();
        expect(warning.date).to.be.null();
        expect(warning.toJSON()).to.equal({
          code: null,
          agent: null,
          text: null,
          date: null,
          api: {
            code: null,
            text: null,
            detailUri: null,
            date: null,
          },
        });
      });
      
      suite('malformed value', ()=>{
        test('api-warn-code', ()=>{
          let warning = ApiWarningHeader.parseValue(`299 google.com "30, Deprecation, https://yoursite.com/details/300.json, 2017-12-12T23:28:18.508Z" "Wed, 21 Oct 2015 07:28:00 GMT"`);
          expect(warning.valid).to.be.false();
          expect(warning.code).to.be.a.number();
          expect(warning.agent).to.be.a.string();
          expect(warning.text).to.be.a.string();
          expect(warning.date).to.be.a.date();
          expect(warning.toJSON()).to.equal({
            code: 299,
            agent: 'google.com',
            text: '30, Deprecation, https://yoursite.com/details/300.json, 2017-12-12T23:28:18.508Z',
            date: new Date("Wed, 21 Oct 2015 07:28:00 GMT"),
            api: {
              code: null,
              text: null,
              detailUri: null,
              date: null,
            },
          });
        });
        
        test('api-warn-text', ()=>{
          let warning = ApiWarningHeader.parseValue(`299 google.com "300, https://yoursite.com/details/300.json, 2017-12-12T23:28:18.508Z" "Wed, 21 Oct 2015 07:28:00 GMT"`);
          expect(warning.valid).to.be.false();
          expect(warning.code).to.be.a.number();
          expect(warning.agent).to.be.a.string();
          expect(warning.text).to.be.a.string();
          expect(warning.date).to.be.a.date();
          expect(warning.toJSON()).to.equal({
            code: 299,
            agent: 'google.com',
            text: '300, https://yoursite.com/details/300.json, 2017-12-12T23:28:18.508Z',
            date: new Date("Wed, 21 Oct 2015 07:28:00 GMT"),
            api: {
              code: null,
              text: null,
              detailUri: null,
              date: null,
            },
          });
        });
        
        test('api-warn-detail-uri', ()=>{
          let warning = ApiWarningHeader.parseValue(`299 google.com "300, Deprecation, , 2017-12-12T23:28:18.508Z" "Wed, 21 Oct 2015 07:28:00 GMT"`);
          expect(warning.valid).to.be.false();
          expect(warning.code).to.be.a.number();
          expect(warning.agent).to.be.a.string();
          expect(warning.text).to.be.a.string();
          expect(warning.date).to.be.a.date();
          expect(warning.toJSON()).to.equal({
            code: 299,
            agent: 'google.com',
            text: '300, Deprecation, , 2017-12-12T23:28:18.508Z',
            date: new Date("Wed, 21 Oct 2015 07:28:00 GMT"),
            api: {
              code: null,
              text: null,
              detailUri: null,
              date: null,
            },
          });
        });
      });
        
      test('non-compliant api-warn-date', ()=>{
        let warning = ApiWarningHeader.parseValue(`299 google.com "300, Deprecation, https://yoursite.com/details/300.json, Wed, 21 Oct 2015 07:28:00 GMT" "Wed, 21 Oct 2015 07:28:00 GMT"`);
        expect(warning.valid).to.be.false();
        expect(warning.code).to.be.a.number();
        expect(warning.agent).to.be.a.string();
        expect(warning.text).to.be.a.string();
        expect(warning.date).to.be.a.date();
        expect(warning.toJSON()).to.equal({
          code: 299,
          agent: 'google.com',
          text: '300, Deprecation, https://yoursite.com/details/300.json, Wed, 21 Oct 2015 07:28:00 GMT',
          date: new Date("Wed, 21 Oct 2015 07:28:00 GMT"),
          api: {
            code: null,
            text: null,
            detailUri: null,
            date: null,
          },
        });
      });
    });
    
    suite('valid', ()=>{
      test('api-warn-code 300', ()=>{
        let warning = ApiWarningHeader.parseValue(`299 google.com "300, Deprecation, https://yoursite.com/details/300.json, 2017-12-12T23:28:18.508Z" "Wed, 21 Oct 2015 07:28:00 GMT"`);
        expect(warning.valid).to.be.true();
        expect(warning.code).to.be.a.number();
        expect(warning.agent).to.be.a.string();
        expect(warning.text).to.be.a.string();
        expect(warning.date).to.be.a.date();
        expect(warning.toJSON()).to.equal({
          code: 299,
          agent: 'google.com',
          text: '300, Deprecation, https://yoursite.com/details/300.json, 2017-12-12T23:28:18.508Z',
          date: new Date("Wed, 21 Oct 2015 07:28:00 GMT"),
          api: {
            code: 300,
            text: 'Deprecation',
            detailUri: 'https://yoursite.com/details/300.json',
            date: new Date('2017-12-12T23:28:18.508Z'),
          },
        });
      });
      
      test('api-warn-code 400', ()=>{
        let warning = ApiWarningHeader.parseValue(`299 google.com "400, New Version Available, https://yoursite.com/details/400.json, 2017-12-12T23:28:18.508Z" "Wed, 21 Oct 2015 07:28:00 GMT"`);
        expect(warning.valid).to.be.true();
        expect(warning.code).to.be.a.number();
        expect(warning.agent).to.be.a.string();
        expect(warning.text).to.be.a.string();
        expect(warning.date).to.be.a.date();
        expect(warning.toJSON()).to.equal({
          code: 299,
          agent: 'google.com',
          text: '400, New Version Available, https://yoursite.com/details/400.json, 2017-12-12T23:28:18.508Z',
          date: new Date("Wed, 21 Oct 2015 07:28:00 GMT"),
          api: {
            code: 400,
            text: 'New Version Available',
            detailUri: 'https://yoursite.com/details/400.json',
            date: new Date('2017-12-12T23:28:18.508Z'),
          },
        });
      });
      
      test('api-warn-code 500', ()=>{
        let warning = ApiWarningHeader.parseValue(`299 google.com "500, Maintenance, https://yoursite.com/details/500.json, 2017-12-12T23:28:18.508Z" "Wed, 21 Oct 2015 07:28:00 GMT"`);
        expect(warning.valid).to.be.true();
        expect(warning.code).to.be.a.number();
        expect(warning.agent).to.be.a.string();
        expect(warning.text).to.be.a.string();
        expect(warning.date).to.be.a.date();
        expect(warning.toJSON()).to.equal({
          code: 299,
          agent: 'google.com',
          text: '500, Maintenance, https://yoursite.com/details/500.json, 2017-12-12T23:28:18.508Z',
          date: new Date("Wed, 21 Oct 2015 07:28:00 GMT"),
          api: {
            code: 500,
            text: 'Maintenance',
            detailUri: 'https://yoursite.com/details/500.json',
            date: new Date('2017-12-12T23:28:18.508Z'),
          },
        });
      });
    });
  });
});

// warning = WarningHeader.parseValue(`299 2001:1900:3001:11::3e "300, Deprecation, https://yoursite.com/details/300.json, 2017-12-12T23:28:18.508Z" "Wed, 21 Oct 2015 07:28:00 GMT"`);
// expect(warning).to.equal({
//   code: 299,
//   agent: '2001:1900:3001:11::3e/a',
//   text: '300, Deprecation, https://yoursite.com/details/300.json, 2017-12-12T23:28:18.508Z',
//   date: new Date('Wed, 21 Oct 2015 07:28:00 GMT'),
// });
// expect(warning.valid).to.be.true();

// warning = ApiWarningHeader.parseValue(`299 2001:1900:3001:11::3e/a "300, Deprecation, https://yoursite.com/details/300.json, 2017-12-12T23:28:18.508Z" "Wed, 21 Oct 2015 07:28:00 GMT"`);
// expect(warning).to.be.an.instanceof(ApiWarningHeader);
// expect(warning).to.equal({
//   code: 299,
//   agent: '2001:1900:3001:11::3e/a',
//   text: '300, Deprecation, https://yoursite.com/details/300.json, 2017-12-12T23:28:18.508Z',
//   date: new Date('Wed, 21 Oct 2015 07:28:00 GMT'),
//   api: {
//     code: '300',
//     text: 'Deprecation',
//     detailUri: 'https://yoursite.com/details/300.json',
//     date: new Date('2017-12-12T23:28:18.508Z'),
//   }
// });

