'use strict';

var _ = require('lodash');

var Lib = {

    getValueFromState: function(propsPath, options) {
        return Lib.getValueFromObject(propsPath, options, this.props);
    },
    
    getValueFromObject: function(propsPath, options, valueObject) {

        var config = this.constructor.deepLinkeStateConfig;

        options = _.defaults({}, options, config, {
            storeEmptyStringAsNull: false
        });
        
        var value = valueObject;
        
        var havePath = _.all(propsPath, function(propsPathPart) {

            if (!_.isObject(value) || !value.hasOwnProperty(propsPathPart)) {
                return false;
            }
            
            value = value[propsPathPart];
            
            return true;
        });
        
        if (!havePath) {
            value = null;
        }
        
        if (options.storeEmptyStringAsNull) {

            if (value === null) {
                value = '';
            }
        }
        
        return value;
    },

    onChange: function(propsPath, options, callback, value) {

        Lib.updateValueObject(propsPath, options, this.props, value);

        if (typeof callback == "function") {
            setTimeout(callback.bind(this, value));
        }
    },

    updateValueObject: function(propsPath, options, valueObject, value) {

        var config = this.constructor.deepLinkeStateConfig;

        options = _.defaults({}, options, config, {
            storeEmptyStringAsNull: false
        });

        propsPath = propsPath.concat();
        
        var propName = propsPath.pop();
        
        var havePath = _.all(propsPath, function(propsPathPart) {

            if (!_.isObject(valueObject) || !valueObject.hasOwnProperty(propsPathPart)) {
                return false;
            }
            
            valueObject = valueObject[propsPathPart];
            
            return true;
        });
        
        if (!havePath) {
            return;
        }
        
        if (options.storeEmptyStringAsNull) {

            if (value === null) {
                value = '';
            }
        }
        
        return valueObject.set(propName, value).now();
    }
};

module.exports = Lib;