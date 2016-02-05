import _ from 'lodash';

export function getValueFromState(propsPath, options) {
    return getValueFromObject(propsPath, options, this.props);
}

export function getValueFromObject(propsPath, options, valueObject) {

    var config = this.constructor.freezerLinkConfig;

    options = _.defaults({}, options, config, {
        storeEmptyStringAsNull: false,
        context: valueObject
    });
    
    var value = options.context;
    
    var havePath = _.all(propsPath, (propsPathPart) => {

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
}

export function onChange(propsPath, options, callback, value) {

    updateValueObject(propsPath, options, this.props, value);

    if (typeof callback == "function") {
        setTimeout(callback.bind(this, value));
    }
}

export function updateValueObject(propsPath, options, valueObject, value) {

    var config = this.constructor.freezerLinkConfig;

    options = _.defaults({}, options, config, {
        storeEmptyStringAsNull: false,
        context: valueObject
    });

    propsPath = propsPath.concat();
    
    var context  = options.context,
        propName = propsPath.pop();
    
    var havePath = _.all(propsPath, (propsPathPart) => {

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