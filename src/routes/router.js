import { createBrowserRouter } from 'react-router-dom';
import Main from '../components/Main/Main';
import App from '../components/App/App';
import NotFound from '../components/NotFound/NotFound';

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
				// element: <Registration />,
			},
			{
				path: 'login',
				// element: <Login />,
			},
			{
				path: 'projects',
				// element: <Projects />,
			},
			{
				path: '*',
				element: <NotFound />,
			},
		],
	},
]);

export default router;
