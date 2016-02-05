import { getValueFromProp, onChange } from './lib';
import ReactLink from 'react/lib/ReactLink';

export default {

    linkProp(propPath, options, callback) {
        
        if (typeof propPath == "string") {
            propPath = propPath.split(/[\.\[\]]/g);
        }
        
        if (typeof options == "function") {
            callback = options;
            options = false;
        }
        
        var link = new ReactLink(
            getValueFromProp.call(this, propPath, options),
            onChange.bind(this, propPath, options, callback)
        );

        return link;
    }
};
