# Localizify React HOC Example

![](examples/react-hoc/demo.gif)

To work with React you need create two localizify helpers: [`LocalizifyConnector`](examples/react-hoc/localizify/LocalizifyConnector) and [`LocalizifyProvider`](examples/react-hoc/localizify/LocalizifyProvider). This files is not included to main library, so you can customize it as you want.

`LocalizifyProvider` exposes a translate(key, data) function and instance of Localizify that is passed through [react context](https://facebook.github.io/react/docs/context.html) to all children in the render tree it wraps. It's an HOC wrapper to quickly provide `childContextTypes` for a given component. You can just wrap your AppComponent:

```js
// app.js
import {LocalizifyProvider} from './localizify';

const App = LocalizifyProvider(() => (
    <div className="App">
        <YourAwesomeComponent />
    </div>
));

ReactDOM.render(<App />, document.getElementById('root'));
```

`LocalizifyConnector` - connector behaves similarly to connect() in that it will take a `context.t()` function from provided by `Localizify` and then pass it as a prop to the component you're intending to use.

```js
// your-awesome-component.js
import {LocalizifyConnector} from '../localizify';

const AwesomeComponent = props => {
    const { t } = props;
    return (<span>{t('hello world')}</span>);
};

export default LocalizifyConnector(AwesomeComponent);
```