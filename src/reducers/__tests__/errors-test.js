/* eslint-env jest */
/* eslint global-require: 0 */

jest.dontMock('../errors');

var Immutable = require('immutable');

describe('errors', function() {
  var errors = require('../errors');

  describe('unknown action', function() {
    var action = {type: 'BOGUS'};

    it('should return previous state', function() {
      var stateIn = new Immutable.Map();
      expect(errors(stateIn, action)).toBe(stateIn);
    });
  });

  [
    'CURRENT_PROJECT_LOADED_FROM_STORAGE',
    'CURRENT_PROJECT_CHANGED',
  ].forEach(function(actionType) {
    describe(actionType, function() {
      var action = {
        type: 'CURRENT_PROJECT_LOADED_FROM_STORAGE',
        payload: {},
      };

      it('should clear errors', function() {
        var stateIn = Immutable.fromJS({
          html: [{}],
          css: [{}],
          javascript: [{}],
        });

        expect(errors(stateIn, action).get('html').size).toBe(0);
      });
    });
  });

  describe('VALIDATING_SOURCE', function() {
    var action = {
      type: 'VALIDATING_SOURCE',
      payload: {language: 'javascript'},
    };

    it('should provide map from undefined state', function() {
      expect(Immutable.Map.isMap(errors(undefined, action))).toBeTruthy();
    });

    it('should remove errors', function() {
      var stateIn = Immutable.fromJS({html: [], css: [], javascript: []});
      expect(errors(stateIn, action).get('javascript').size).toBe(0);
    });
  });

  describe('VALIDATED_SOURCE', function() {
    var error = {};

    var action = {
      type: 'VALIDATED_SOURCE',
      payload: {
        language: 'javascript',
        errors: [error],
      },
    };

    it('should set errors where there were none', function() {
      var stateIn = Immutable.fromJS({html: [], css: []});
      expect(Immutable.is(
        errors(stateIn, action).get('javascript').get(0),
        Immutable.fromJS(error)
      )).toBeTruthy();
    });
  });
});