import isObject from 'lodash/isObject';
import defaults from 'lodash/defaults';
import every    from 'lodash/every';

/**
 * Link value to state.
 * 
 * @param  {String}   statePath
 * @param  {Object}   options
 * @param  {Function} callback
 * @return {Object}
 */
export function linkProp(_propPath, _options, _callback) {

    let propPath = _propPath,
        options  = _options,
        callback = _callback;
    
    if (typeof propPath == 'string') {
        propPath = propPath.split(/[\.\[\]]/g);
    }
    
    if (typeof options == 'function') {
        callback = options;
        options  = false;
    }

    return {
        value:         getValueFromProps(  this, propPath, options ),
        requestChange: requestChange.bind( this, propPath, options, callback )
    };
}

/**
 * Link input value to state.
 * 
 * @param  {String}   statePath
 * @param  {Object}   options
 * @param  {Function} callback
 * @return {Object}
 */
export function valueLinkToProp(_propPath, _options, _callback) {

    let propPath = _propPath,
        options  = _options,
        callback = _callback;
    
    if (typeof propPath == 'string') {
        propPath = propPath.split(/[\.\[\]]/g);
    }
    
    if (typeof options == 'function') {
        callback = options;
        options  = false;
    }

    return {
        value:         getValueFromProps(  this, propPath, options ),
        requestChange: requestChange.bind( this, propPath, options, callback ),
        onChange:      onChange.bind(      this, propPath, options, callback )
    };
}

/**
 * Link checkbox value to state.
 * 
 * @param  {String}   statePath
 * @param  {Object}   options
 * @param  {Function} callback
 * @return {Object}
 */
export function checkedLinkToProp(_propPath, _options, _callback) {

    let propPath = _propPath,
        options  = _options,
        callback = _callback;
    
    if (typeof propPath == 'string') {
        propPath = propPath.split(/[\.\[\]]/g);
    }
    
    if (typeof options == 'function') {
        callback = options;
        options  = false;
    }

    return {
        checked:       getValueFromProps(  this, propPath, options ),
        requestChange: requestChange.bind( this, propPath, options, callback ),
        onChange:      onChange.bind(      this, propPath, options, callback )
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
function requestChange(propsPath, _options, callback, value) {

    const options = defaults({}, _options, this.constructor.freezerLinkConfig, {
            storeEmptyStringAsNull: false,
            context: this.props
        }),
        { mutator } = options;

    if (typeof mutator == 'function') {
        value = mutator(value);
    }

    setValueToProps(propsPath, options, value);

    if (typeof callback == 'function') {
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
function onChange(propsPath, _options, callback, event) {

    let { type, value, checked } = event.target;

    if (type == 'checkbox' || type == 'radio') {
        value = checked;
    }

    const options = defaults({}, _options, this.constructor.freezerLinkConfig, {
            storeEmptyStringAsNull: false,
            context: this.props
        }),
        { mutator } = options;

    if (typeof mutator == 'function') {
        value = mutator(value);
    }

    setValueToProps(propsPath, options, value);

    if (typeof callback == 'function') {
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

    const options = defaults({}, _options, context.constructor.freezerLinkConfig, {
        storeEmptyStringAsNull: false,
        context: context.props
    });

    let value = options.context;
    
    const havePath = every(propsPath, (propsPathPart) => {

        if (!isObject(value) || !value.hasOwnProperty(propsPathPart)) {
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
function setValueToProps(_propsPath, options, value) {

    const propsPath = _propsPath.concat(),
        propName    = propsPath.pop();

    let updateContext = options.context;
    
    const havePath = every(propsPath, (propsPathPart) => {

        if (!isObject(updateContext) || !updateContext.hasOwnProperty(propsPathPart)) {
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