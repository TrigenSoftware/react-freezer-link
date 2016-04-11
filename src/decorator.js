import Link from './lib';

export default function decorator(target) {

    Object.defineProperty(target.prototype, 'linkProp', {
        value(propPath, options, callback) {
            return new Link(this, propPath, options, callback);
        }
    });
};
