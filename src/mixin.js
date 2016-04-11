import Link from './lib';

export default {

    linkProp(propPath, options, callback) {
        return new Link(this, propPath, options, callback);
    }
};
