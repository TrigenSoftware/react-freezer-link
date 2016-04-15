import { linkProp, valueLinkToProp, checkedLinkToProp } from './lib';

export default function decorator(target) {
    Object.defineProperty(target.prototype, 'linkProp',          linkProp);
    Object.defineProperty(target.prototype, 'valueLinkToProp',   valueLinkToProp);
    Object.defineProperty(target.prototype, 'checkedLinkToProp', checkedLinkToProp);
};
