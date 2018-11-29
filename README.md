# react-boilerplate
Boilerpate

| Features       
| -------------
| [**ES2017 Javascript**](https://babeljs.io/docs/plugins/preset-es2017/)
| [**React**](https://reactjs.org/)
| [**React router**](https://reacttraining.com/react-router/)
| [**React router redux**](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-redux)
| [**Redux**](https://redux.js.org/)
| [**Eslint**](https://eslint.org/)
| [**Webpack**](https://webpack.js.org/)
| [**Sass**](https://sass-lang.com/)


## Installation
[Clone](https://git-scm.com/docs/git-clone) or download this repository.
```bash
cd react-boilerplate && npm install
```

## Usage
`npm run build` - Builds in *development* mode

`npm run build:prod` - Builds in *production* mode

`npm run watch` - Watches and builds in *development* mode

`npm run serve` - Starts *webpack-dev-server*

`npm run analize` - Builds in *development* mode and opens [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) report file

`npm run analize:prod` - Builds in *production* mode and opens [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) report file

## Other notes
#### Defining routes
This boilerplate offers a clear and simple way of writing code and because of this I decided that the current way of defining routes using *react router* it's a bit ambiguous and not scalable (including a `<Route />` component in each component). All the routes are specified in `routes/index.js` and are rendered using a **recursive** function (so that it can also handle infinite nesting) just like other frameworks like [Angular](https://angular.io/guide/router#configuration), [Vue](https://router.vuejs.org/en/essentials/nested-routes.html).

```jst
//...component imports...

// example component, nested routes are rendered inside the parent component with children
const SomeComponent = ({ children }) => (
    <div>
        Hello
        {children}
    </div>
);

export default [
    {
        path: '/',
        component: SomeComponent,
        routes: [
            {
                path: 'home',
                component: SomeComponent,
                routes: [
                    {
                        path: 'stats',
                        component: SomeOtherOtherComponent
                    },
                ],
            },
            {
                path: 'user',
                component: SomeComponent,
                routes: [
                    {
                        path: 'profile',
                        component: SomeOtherOtherComponent
                    },
                ],
            },
        ],
    },
];

```
