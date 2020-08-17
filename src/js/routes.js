import HomePage from '../pages/home.f7.html';
import InfectedQuizPage from '../pages/infected-quiz.f7.html';
import RiskGroupQuizPage from '../pages/risk-group-quiz.f7.html';
import NotFoundPage from '../pages/404.f7.html';

var routes = [
    {
        path: '/',
        component: HomePage,
    },

    // Page with symptoms quiz
    {
        path: '/infected/:age/',
        component: InfectedQuizPage,
        options: {
            context: {
                age: '{{age}}',
            },
        },
    },

    {
        path: '/risk-group-quiz/:age/:symptoms',
        component: RiskGroupQuizPage,
        options: {
            context: {
                age: '{{age}}',
                symptoms: '{{symptoms}}'
            },
        },

        on: {
            pageInit: function (event, page) {
                console.log(page.route.params.age);
            }
        }
    },

    {
        path: '(.*)',
        component: NotFoundPage,
    },
];

export default routes;
