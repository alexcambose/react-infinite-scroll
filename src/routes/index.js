import App from '../App';
import Demo from '../Demo';
import Basic from '../demo/Basic';
import Fetching from '../demo/Fetching';
import Auto from '../demo/Auto';
import Container from '../demo/Container';

export default [
  {
    path: '/',
    component: App,
    exact: true,
  },
  {
    path: '/demo',
    component: Demo,
    routes: [
      {
        path: '/basic',
        exact: true,
        component: Basic,
      },
      {
        path: '/fetching',
        exact: true,
        component: Fetching,
      },
      {
        path: '/auto',
        exact: true,
        component: Auto,
      },
      {
        path: '/container',
        exact: true,
        component: Container,
      },
    ],
  },
];
