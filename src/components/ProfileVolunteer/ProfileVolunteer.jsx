import './ProfileVolunteer.scss';
import {
	Outlet,
	useLocation,
	useNavigate,
	useOutletContext,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Crumbs } from '../Crumbs/Crumbs';
import { Pushbutton } from '../Pushbutton/Pushbutton';
import ProfileData from '../ProfileData/ProfileData';
import cityImage from '../../images/city.png';
import { getUserInformation } from '../../utils/api/login';
import { getVolunteerInformation } from '../../utils/api/profile';
import volunteerImage from '../../images/avatar.png';
// import cardsProjectsArray from '../../utils/cardsProjectsArray';
import ProfileButtonsTabs from '../ProfileButtonsTabs/ProfileButtonsTabs';
import CardProject from '../CardProject/CardProject';
import Button from '../Button/Button';
import {
	getNextPrevProjectsMe,
	getProjectsMe,
} from '../../utils/api/organizer';
import { PROJECT_CARD_DISPLAY_LIMIT } from '../../utils/constants';

function ProfileVolunteer() {
	const [projectsMeVol, setProjectsMeVol] = useState([]);
	const [projectsNextUrl, setProjectsNextUrl] = useState(null);
	const [activeTab, setActiveTab] = useState('');

	const {
		currentUser,
		setCurrentUser,
		handleChangePasswordForm,
		cities,
		skills,
		projectCategories,
		setModal,
	} = useOutletContext();

	const navigate = useNavigate();
	const location = useLocation();

	const {
		firstName,
		lastName,
		secondName,
		email,
		city,
		phone,
		userSkills,
		photo,
		telegram,
	} = currentUser;

	const dataVolunteer = [
		{
			id: 0,
			title: 'Город:',
			subtitle: cities
				.filter((item) => city === Number(item.value))
				.map((item) => item.label)[0],
		},
		{
			id: 1,
			title: 'Контактные данные:',
			subtitle: [email, phone, telegram]
				.filter((item) => item !== '')
				.join(', '),
		},
		{
			id: 2,
			title: 'Навыки:',
			subtitle: userSkills
				? userSkills.map((item) => item.name).join(', ')
				: [],
		},
	];

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location.pathname]);

	const handleDislikedCard = (projectId) => {
		setProjectsMeVol((prevProjects) =>
			prevProjects.filter((project) => project.id !== projectId)
		);

		const excludedProjectQuery = `&exclude_project_id=${encodeURIComponent(
			projectId
		)}`;
		let filterQuery = `?limit=${1}&offset=${
			projectsMeVol.length - 1
		}${excludedProjectQuery}`;

		if (activeTab === 'favorites') {
			filterQuery += `&is_favorited=${encodeURIComponent(true)}`;
		}

		if (activeTab === 'active') {
			filterQuery += `&active=${encodeURIComponent(true)}`;
		}

		if (activeTab === 'completed') {
			filterQuery += `&completed=${encodeURIComponent(true)}`;
		}

		if (activeTab === 'canceled') {
			filterQuery += `&archive=${encodeURIComponent(true)}`;
		}

		getNextPrevProjectsMe(filterQuery)
			.then((data) => {
				setProjectsMeVol((prevProjects) => [...prevProjects, ...data.results]);
				setProjectsNextUrl(data.next);
			})
			.catch((err) => {
				console.log(`Ошибка: ${err}`);
			});
	};

	const handleClickNext = () => {
		if (projectsNextUrl) {
			let filterQuery = `?limit=${PROJECT_CARD_DISPLAY_LIMIT}&offset=${projectsMeVol.length}`;

			if (activeTab === 'favorites') {
				filterQuery += `&is_favorited=${encodeURIComponent(true)}`;
			}

			if (activeTab === 'active') {
				filterQuery += `&active=${encodeURIComponent(true)}`;
			}

			if (activeTab === 'completed') {
				filterQuery += `&completed=${encodeURIComponent(true)}`;
			}

			if (activeTab === 'canceled') {
				filterQuery += `&archive=${encodeURIComponent(true)}`;
			}

			getNextPrevProjectsMe(filterQuery)
				.then((data) => {
					setProjectsMeVol([...projectsMeVol, ...data.results]);
					setProjectsNextUrl(data.next);
				})
				.catch((err) => {
					console.log(`Ошибка: ${err}`);
				});

			getProjectsMe(filterQuery)
				.then((data) => {
					setProjectsMeVol([...projectsMeVol, ...data.results]);
					setProjectsNextUrl(data.next);
				})
				.catch((err) => {
					console.log(`Ошибка: ${err}`);
				});
		}
	};

	useEffect(() => {
		getUserInformation().then((user) => {
			if (user.role === 'volunteer') {
				getVolunteerInformation(user.id_organizer_or_volunteer).then(
					(volunteer) => {
						setCurrentUser({
							firstName: user.first_name,
							secondName: user.second_name,
							lastName: user.last_name,
							role: user.role,
							userId: user.id,
							email: user.email,
							id: user.id_organizer_or_volunteer,
							dateOfBirth: volunteer.date_of_birth,
							phone: volunteer.phone || '',
							photo: volunteer.photo || '',
							city: volunteer.city || 0,
							userSkills: volunteer.skills || null,
							telegram: volunteer.telegram || '',
						});
					}
				);
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location]);

	useEffect(() => {
		getProjectsMe(`?limit=${PROJECT_CARD_DISPLAY_LIMIT}`)
			.then((data) => {
				setProjectsNextUrl(data.next);
				setProjectsMeVol(data.results);
			})
			.catch((err) => {
				console.log(`Ошибка: ${err}`);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps,no-use-before-define
	}, [setProjectsNextUrl, setProjectsMeVol]);

	useEffect(() => {
		let filterQuery = `?limit=${PROJECT_CARD_DISPLAY_LIMIT}`;

		if (activeTab === 'favorites') {
			filterQuery += `&is_favorited=${encodeURIComponent(true)}`;
		}

		if (activeTab === 'active') {
			filterQuery += `&active=${encodeURIComponent(true)}`;
		}

		if (activeTab === 'completed') {
			filterQuery += `&completed=${encodeURIComponent(true)}`;
		}

		if (activeTab === 'canceled') {
			filterQuery += `&archive=${encodeURIComponent(true)}`;
		}

		getProjectsMe(filterQuery)
			.then((dataProjects) => {
				setProjectsNextUrl(dataProjects.next);
				setProjectsMeVol(dataProjects.results);
			})
			.catch((err) => {
				console.log(`Ошибка: ${err}`);
			});
	}, [activeTab, setActiveTab]);

	return location.pathname === '/profile/volunteer' ||
		location.pathname === '/profile/volunteer/' ? (
		<section className="profile">
			<div className="profile__container">
				<div className="profile__menu">
					<Crumbs />
				</div>
				<div className="profile__wrapper">
					<div className="profile__personal">
						<div className="profile__personal-container">
							<div className="profile__personal-label">
								<img
									className="profile__image"
									src={photo || volunteerImage}
									alt="Логотип организатора"
								/>
								<div className="profile__personal-btn">
									<Pushbutton
										label="Изменить пароль"
										color="#3F3F3F"
										size="large-var"
										minWidth="280px"
										backgroundColor="transparent"
										border="1px solid #A6C94F"
										onClick={() => handleChangePasswordForm()}
									/>
									<Pushbutton
										label="Редактировать профиль"
										color="#3F3F3F"
										size="large-var"
										minWidth="280px"
										backgroundColor="transparent"
										border="1px solid #A6C94F"
										onClick={() => navigate('edit-profile')}
									/>
								</div>
							</div>
							<div className="profile__name">
								<h2 className="profile__name-surname">
									{`${firstName} ${secondName} ${lastName}`}
								</h2>
							</div>
							{dataVolunteer.length > 0 && (
								<ProfileData dataArray={dataVolunteer} />
							)}
						</div>
					</div>
					<div className="profile__projects">
						<div className="profile__projects-container">
							<div className="profile__projects-label">
								<h2 className="profile__projects-title">Ваши проекты</h2>
							</div>
							<ProfileButtonsTabs
								activeTab={activeTab}
								setActiveTab={setActiveTab}
							/>
							{projectsMeVol.length > 0 ? (
								<div className="profile__projects-cards">
									{projectsMeVol.map((item) => (
										<CardProject
											key={item.id}
											cardProject={item}
											onCardDisliked={handleDislikedCard}
										/>
									))}
								</div>
							) : (
								<div className="profile__blank">
									<p className="profile__blank-title">
										Здесь будут отображаться ваши проекты
									</p>
									<div className="profile__blank-picture">
										<img
											className="profile__blank-image"
											src={cityImage}
											alt="город"
										/>
									</div>
								</div>
							)}
							{projectsMeVol.length >= 6 && projectsNextUrl && (
								<div className="projects__button">
									<Button
										className="projects__button-item"
										size="xs"
										onClick={() => handleClickNext()}
									>
										Показать еще
									</Button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	) : (
		<Outlet
			context={{
				currentUser,
				handleChangePasswordForm,
				cities,
				skills,
				projectCategories,
				setModal,
			}}
		/>
	);
}

export default ProfileVolunteer;
