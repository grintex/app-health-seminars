import HomePage from '../pages/home.f7.html';
import ViewerPage from '../pages/viewer.f7.html';
import NotFoundPage from '../pages/404.f7.html';

var routes = [
    {
        path: '/',
        component: HomePage,
    },

    {
        path: '/viewer/:activity/:step',
        component: ViewerPage,
        options: {
            context: {
                activity: '{{activity}}',
                step: '{{step}}',
            },
        },
        on: {
            pageInit: function (event, page) {
                console.log(page.route.params.activity, page.route.params.step);
            }
        }
    },

    {
        path: '(.*)',
        component: NotFoundPage,
    },
];

export default routes;
