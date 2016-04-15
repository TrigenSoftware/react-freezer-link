import _ from 'lodash';

export function linkProp(_propPath, _options, _callback) {

    var propPath = _propPath,
        options  = _options,
        callback = _callback;
    
    if (typeof propPath == "string") {
        propPath = propPath.split(/[\.\[\]]/g);
    }
    
    if (typeof options == "function") {
        callback = options;
        options  = false;
    }

    return {
        value:         getValueFromProps(  this, propPath, options),
        requestChange: requestChange.bind( this, propPath, options, callback)
    };
}

export function valueLinkToProp(_propPath, _options, _callback) {

    var propPath = _propPath,
        options  = _options,
        callback = _callback;
    
    if (typeof propPath == "string") {
        propPath = propPath.split(/[\.\[\]]/g);
    }
    
    if (typeof options == "function") {
        callback = options;
        options  = false;
    }

    return {
        value:         getValueFromProps(  this, propPath, options),
        requestChange: requestChange.bind( this, propPath, options, callback),
        onChange:      onChange.bind(      this, propPath, options, callback)
    };
}

export function checkedLinkToProp(_propPath, _options, _callback) {

    var propPath = _propPath,
        options  = _options,
        callback = _callback;
    
    if (typeof propPath == "string") {
        propPath = propPath.split(/[\.\[\]]/g);
    }
    
    if (typeof options == "function") {
        callback = options;
        options  = false;
    }

    return {
        checked:       getValueFromProps(  this, propPath, options),
        requestChange: requestChange.bind( this, propPath, options, callback),
        onChange:      onChange.bind(      this, propPath, options, callback)
    };
}

/**
 * Request change function for `valueLink` property.
 * 
 * @param  {Array}    path to property
 * @param  {Object}   options
 * @param  {Function} callback
 * @param  {Object}   new value
 */
function requestChange(propsPath, options, callback, value) {

    setValueToProps(this, propsPath, options, value);

    if (typeof callback == "function") {
        setTimeout(callback.bind(this, value));
    }
}

/**
 * On change function for usage without `valueLink` property. (React v15)
 * 
 * @param  {Array}    path to property
 * @param  {Object}   options
 * @param  {Function} callback
 * @param  {Object}   DOM onChange event object
 */
function onChange(propsPath, options, callback, event) {

    var { type, value, checked } = event.target;

    if (type == "checkbox" || type == "radio") {
        value = checked;
    }

    setValueToProps(this, propsPath, options, value);

    if (typeof callback == "function") {
        setTimeout(callback.bind(this, value));
    }
}

/**
 * Get value from props of component.
 * 
 * @param  {Object} react component context
 * @param  {Array}  path to property
 * @param  {Object} options
 * @return {Object}
 */
function getValueFromProps(context, propsPath, _options) {

    var options = _.defaults({}, _options, context.constructor.freezerLinkConfig, {
            storeEmptyStringAsNull: false,
            context: context.props
        }),
        value = options.context;
    
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

/**
 * Set value to props of component.
 * 
 * @param  {Object} react component context
 * @param  {Array}  path to property
 * @param  {Object} options
 * @param  {Object} new value
 * @return {Object}
 */
function setValueToProps(context, _propsPath, _options, value) {

    var propsPath = _propsPath.concat(),
        propName  = propsPath.pop(),
        options   = _.defaults({}, _options, context.constructor.freezerLinkConfig, {
            storeEmptyStringAsNull: false,
            context: context.props
        }),
        updateContext = options.context;
    
    var havePath = _.all(propsPath, (propsPathPart) => {

        if (!_.isObject(updateContext) || !updateContext.hasOwnProperty(propsPathPart)) {
            return false;
        }
        
        updateContext = updateContext[propsPathPart];
        
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
    
    return updateContext.set(propName, value).now();
}