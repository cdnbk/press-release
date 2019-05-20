export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/user/login' },
      //press
      {
        path: '/press',
        icon: 'table',
        name: 'press',
        routes: [
          {
            path: '/press/press-list',
            name: 'presslist',
            component: './List/PressList',
          },
          {
            path: '/press/editor',
            name: 'editor',
            component: './Editor/GGEditor/Editor',
          },
          {
            path: '/press/Editpress',
            component: './Editor/GGEditor/Editpress',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
