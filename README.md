[![NPM](https://nodei.co/npm/react-freezer-link.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/react-freezer-link/)

# react-freezer-link
A React mixin for linking form fields to a deep structure of data within the component's prop which provided by Freezer.

# Description

This mixin is a substitute for the standard React mixin React.addons.LinkedStateMixin. While the standard mixin only allows you to link a form field to a key directly within the component's state, this mixin allows you to link a form field to a key deeper in the component's prop object which provided by Freezer.

# Getting Started

To install from npm, run:

```npm install --save react-freezer-link```

Then include the mixin in the component that will use it:

```js
import FreezerLinkMixin from 'react-freezer-link';

...

var MyComponent = React.createClass({
	mixins: [FreezerLinkMixin],
	
	...
});
```

or

```js
import FreezerLinkDecorator from 'react-freezer-link/lib/decorator';

...

@FreezerLinkDecorator
class MyComponent extends React.Component {
	...
}
```

# Usage Examples #

Link a text field to ```this.props.data.user.name```:
```jsx
<input type="text" valueLink={this.linkProp('data.user.name')} />
```

Link a text field to ```this.props.data.user.name```, translating an empty string in the text field to null in the state and vice-versa:
```jsx
<input type="text" valueLink={this.linkProp('data.user.name', {storeEmptyStringAsNull: true})} />
```

In both cases above you can add callback:
```jsx
<input type="text" valueLink={this.linkProp('data.user.name', (newVale) => {...})} />
<input type="text" valueLink={this.linkProp('data.user.name', {storeEmptyStringAsNull: true}, (newVale) => {...})} />
```

Furthermore you can set context:
```jsx
items.map(user => (
	<input type="text" valueLink={this.linkProp('name', {context: user})} />
))
```

Also you can define global configs:
```js
MyComponent.freezerLinkConfig = {
	storeEmptyStringAsNull: true
};
```

