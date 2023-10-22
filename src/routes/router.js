import { createBrowserRouter } from 'react-router-dom';
import Signup from '../components/Signup/Signup';
import Main from '../components/Main/Main';
import App from '../components/App/App';
import ProfileVolunteer from '../components/ProfileVolunteer/ProfileVolunteer';
import Login from '../components/Login/Login';
import LoginSignIn from '../components/LoginSignIn/LoginSignIn';
import LoginPasswordRecovery from '../components/LoginPasswordRecovery/LoginPasswordRecovery';
import LoginPasswordReset from '../components/LoginPasswordReset/LoginPasswordReset';

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				index: true,
				element: <Main />,
			},

			{
				path: 'registration',
				element: <Signup />,
			},
			{
				path: 'login/',
				element: <Login />,
				children: [
					{
						index: true,
						element: <LoginSignIn />,
					},
					{
						path: 'password-recovery',
						element: <LoginPasswordRecovery />,
					},
					{
						path: 'password-reset',
						element: <LoginPasswordReset />,
					},
				],
			},
			{
				path: 'projects',
				// element: <Projects />,
			},
			{
				path: 'profile',
				element: <ProfileVolunteer />,
			},

			{
				path: '*',
				// element: <NotFoundPage />,
			},
		],
	},
]);

export default router;
