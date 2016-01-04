'use strict';

var _ = require('lodash');

var Lib = {

    getValueFromState: function(propsPath, options) {
        return Lib.getValueFromObject(propsPath, options, this.props);
    },
    
    getValueFromObject: function(propsPath, options, valueObject) {

        var config = this.constructor.deepLinkeStateConfig;

        options = _.defaults({}, options, config, {
            storeEmptyStringAsNull: false,
            context: valueObject
        });
        
        var value = options.context;
        
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
            storeEmptyStringAsNull: false,
            context: valueObject
        });

        propsPath = propsPath.concat();
        
        var context  = options.context,
            propName = propsPath.pop();
        
        var havePath = _.all(propsPath, function(propsPathPart) {

            if (!_.isObject(context) || !context.hasOwnProperty(propsPathPart)) {
                return false;
            }
            
            context = context[propsPathPart];
            
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
        
        return context.set(propName, value).now();
    }
};

module.exports = Lib;