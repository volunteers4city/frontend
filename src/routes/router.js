import { Link, createHashRouter } from 'react-router-dom';
import Signup from '../components/Signup/Signup';
import Main from '../components/Main/Main';
import App from '../components/App/App';
import Profile from '../components/Profile/Profile';
import Login from '../components/Login/Login';
import LoginSignIn from '../components/LoginSignIn/LoginSignIn';
import LoginPasswordRecovery from '../components/LoginPasswordRecovery/LoginPasswordRecovery';
import LoginPasswordReset from '../components/LoginPasswordReset/LoginPasswordReset';
import NotFound from '../components/NotFound/NotFound';
import Project from '../components/Project/Project';
import {
	ProtectedRouteElementForUnauthorized,
	ProtectedRouteElementForAuthorized,
	ProtectedRouteElementForAuthorizedVolunteer,
	ProtectedRouteElementForAuthorizedOrganizer,
} from './ProtectedRoute';
import './router.scss';
import VolunteerSignupForm from '../components/VolunteerSignupForm/VolunteerSignupForm';
import OrganizerSignupForm from '../components/OrganizerSignupForm/OrganizerSignupForm';
import ProfileVolunteer from '../components/ProfileVolunteer/ProfileVolunteer';
import ProfileVolunteerEdit from '../components/ProfileVolunteerEdit/ProfileVolunteerEdit';
import ProfileOrganization from '../components/ProfileOrganization/ProfileOrganization';
import ProfileOrganizationEdit from '../components/ProfileOrganizationEdit/ProfileOrganizationEdit';
import Projects from '../components/Projects/Projects';
import Incomes from '../components/Incomes/Incomes';
import PageProject from '../components/PageProject/PageProject';
import ProjectView from '../components/ProjectView/ProjectView';
import Stub from '../components/Stub/Stub';

import { getProjectById } from '../utils/api/organizer';

const router = createHashRouter([
	{
		path: '/',
		element: <App />,
		handle: {
			crumb: () => (
				<Link to="/" className="router__link router__link_mane">
					Главная
				</Link>
			),
		},
		children: [
			{
				index: true,
				element: <Main />,
			},
			{
				path: 'registration',
				element: (
					<ProtectedRouteElementForAuthorized>
						<Signup />
					</ProtectedRouteElementForAuthorized>
				),
				children: [
					{
						path: 'volunteer',
						element: <VolunteerSignupForm />,
						handle: {
							crumb: () => (
								<Link to="/registration/volunteer" className="router__link">
									Регистрация волонтёра
								</Link>
							),
						},
					},
					{
						path: 'organizer',
						element: <OrganizerSignupForm />,
						handle: {
							crumb: () => (
								<Link to="/registration/organizer" className="router__link">
									Регистрация организатора
								</Link>
							),
						},
					},
				],
			},
			{
				path: 'login',
				element: (
					<ProtectedRouteElementForAuthorized>
						<Login />
					</ProtectedRouteElementForAuthorized>
				),
				handle: {
					crumb: () => (
						<Link to="/login" className="router__link">
							Вход
						</Link>
					),
				},
				children: [
					{
						index: true,
						element: <LoginSignIn />,
					},
					{
						path: 'password-recovery',
						element: <LoginPasswordRecovery />,
						handle: {
							crumb: () => (
								<Link to="/login/password-recovery" className="router__link">
									Восстановление
								</Link>
							),
						},
					},
					{
						path: 'password-activate/:uid/:token',
						element: <LoginSignIn />,
					},
					{
						path: 'password-reset/:uid/:token',
						element: <LoginPasswordReset />,
					},
				],
			},
			{
				id: Projects,
				path: 'projects',
				element: <Projects />,
				handle: {
					crumb: () => (
						<Link to="/projects" className="router__link">
							Проекты
						</Link>
					),
				},
			},

			{
				id: 'project',
				path: 'projects/:idProject',
				element: <PageProject />,
				loader: ({ params }) => getProjectById(params.idProject),
				errorElement: <NotFound />,
				handle: {
					crumb: (match) => (
						<>
							<Link to="/projects" className="router__link router__link_arrow">
								Проекты
							</Link>
							<Link to={match.path} className="router__link">
								Проект «{match?.data?.name}»
							</Link>
						</>
					),
				},
				children: [
					{
						index: true,
						element: <ProjectView />,
					},
					{
						path: 'incomes',
						element: (
							<ProtectedRouteElementForAuthorizedOrganizer>
								<Incomes status="application_submitted" />
							</ProtectedRouteElementForAuthorizedOrganizer>
						),
						handle: {
							crumb: (match) => (
								<Link to={match.path} className="router__link">
									Заявки
								</Link>
							),
						},
					},
					{
						path: 'participants',
						element: (
							<ProtectedRouteElementForAuthorizedOrganizer>
								<Incomes status="accepted" />
							</ProtectedRouteElementForAuthorizedOrganizer>
						),
						handle: {
							crumb: (match) => (
								<Link to={match.path} className="router__link">
									Участники проекта
								</Link>
							),
						},
					},
				],
			},

			{
				path: 'profile',
				element: (
					<ProtectedRouteElementForUnauthorized>
						<Profile />
					</ProtectedRouteElementForUnauthorized>
				),
				children: [
					{
						path: 'volunteer',
						element: (
							<ProtectedRouteElementForAuthorizedVolunteer>
								<ProfileVolunteer />
							</ProtectedRouteElementForAuthorizedVolunteer>
						),
						handle: {
							crumb: () => (
								<Link to="/profile/volunteer" className="router__link">
									Личный кабинет волонтёра
								</Link>
							),
						},
						children: [
							{
								path: 'edit-profile',
								element: <ProfileVolunteerEdit />,
								handle: {
									crumb: () => (
										<Link
											to="/profile/volunteer/edit-profile"
											className="router__link"
										>
											Редактирование профиля
										</Link>
									),
								},
							},
						],
					},
					{
						path: 'organizer',
						element: (
							<ProtectedRouteElementForAuthorizedOrganizer>
								<ProfileOrganization />
							</ProtectedRouteElementForAuthorizedOrganizer>
						),
						handle: {
							crumb: () => (
								<Link to="/profile/organizer" className="router__link">
									Личный кабинет организатора
								</Link>
							),
						},
						children: [
							{
								path: 'edit-profile',
								element: <ProfileOrganizationEdit />,
								handle: {
									crumb: () => (
										<Link
											to="/profile/organizer/edit-profile"
											className="router__link"
										>
											Редактирование профиля
										</Link>
									),
								},
							},
							{
								path: 'create-project',
								element: <Project />,
								handle: {
									crumb: () => (
										<Link
											to="/profile/organizer/create-project"
											className="router__link"
										>
											Новый проект
										</Link>
									),
								},
							},
							{
								path: 'edit-project/:IdProject',
								element: <Stub text="Тут будет редактироваться проект" />,
								handle: {
									crumb: () => (
										<Link
											to="/profile/organizer/edit-project/:idProject"
											className="router__link"
										>
											Редактировать проект
										</Link>
									),
								},
							},
						],
					},
				],
			},
			{
				path: '*',
				element: <NotFound />,
			},
		],
	},
]);

export default router;
