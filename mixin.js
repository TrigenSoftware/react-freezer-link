'use strict';

var ReactLink = require('react/lib/ReactLink'),
    Lib       = require('./lib');

module.exports = {

    linkProp: function(statePath, options, callback) {
        
        if (typeof statePath == "string") {
            statePath = statePath.split(/[\.\[\]]/g);
        }
        
        if (typeof options == "function") {
            callback = options;
            options = false;
        }
        
        var link = new ReactLink(
            Lib.getValueFromState.call(this, statePath, options),
            Lib.onChange.bind(this, statePath, options, callback)
        );

        return link;
    }
};
