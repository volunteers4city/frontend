import { useEffect, useState } from 'react';
import './ProfileOrganization.scss';
import {
	Outlet,
	useLocation,
	useNavigate,
	useOutletContext,
} from 'react-router-dom';
import ProfileData from '../ProfileData/ProfileData';
import { Crumbs } from '../Crumbs/Crumbs';
import { Pushbutton } from '../Pushbutton/Pushbutton';
import CardProject from '../CardProject/CardProject';
import ProfileButtonsTabs from '../ProfileButtonsTabs/ProfileButtonsTabs';
import Button from '../Button/Button';
import cityImage from '../../images/city.png';
import organizationImage from '../../images/avatar.png';
import { getUserInformation } from '../../utils/api/login';
import { getOrganizationInformation } from '../../utils/api/profile';
import {
	getNextPrevProjectsMe,
	getProjectsMe,
} from '../../utils/api/organizer';
import { PROJECT_CARD_DISPLAY_LIMIT } from '../../utils/constants';
import { deleteCardProjectOrganization } from '../../utils/api/projects';

function ProfileOrganization() {
	const [projectsMe, setProjectsMe] = useState([]);
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
		about,
		email,
		city,
		phone,
		photo,
		title,
	} = currentUser;

	const dataOrganization = [
		{
			id: 0,
			title: 'Об организации',
			subtitle: about,
		},
		{
			id: 1,
			title: 'Город:',
			subtitle: cities
				.filter((item) => city === Number(item.value))
				.map((item) => item.label)[0],
		},
		{
			id: 2,
			title: 'Представитель организации:',
			subtitle: `${firstName} ${secondName} ${lastName}`,
		},
		{
			id: 3,
			title: 'Контактные данные:',
			subtitle: [email, phone].filter((item) => item !== '').join(', '),
		},
	];

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location.pathname]);

	const handleDislikedCard = (projectId) => {
		setProjectsMe((prevProjects) =>
			prevProjects.filter((project) => project.id !== projectId)
		);

		const excludedProjectQuery = `&exclude_project_id=${encodeURIComponent(
			projectId
		)}`;

		let filterQuery = `?limit=${1}&offset=${
			projectsMe.length - 1
		}${excludedProjectQuery}`;

		if (activeTab === 'favorites') {
			filterQuery += `&is_favorited=${encodeURIComponent(true)}`;
		}

		if (activeTab === 'active') {
			filterQuery += `&active=${encodeURIComponent(true)}`;
		}

		if (activeTab === 'draft') {
			filterQuery += `&draft=${encodeURIComponent(true)}`;
		}

		if (activeTab === 'moderation') {
			filterQuery += `&moderation=${encodeURIComponent(true)}`;
		}

		if (activeTab === 'completed') {
			filterQuery += `&completed=${encodeURIComponent(true)}`;
		}

		if (activeTab === 'archive') {
			filterQuery += `&archive=${encodeURIComponent(true)}`;
		}

		getNextPrevProjectsMe(filterQuery)
			.then((data) => {
				const filteredResults = data.results.filter(
					(project) => project.is_favorited
				);
				setProjectsMe((prevProjects) => [...prevProjects, ...filteredResults]);
				setProjectsNextUrl(data.next);
			})
			.catch((err) => {
				console.log(`Ошибка: ${err}`);
			});
	};

	function handleClickNext() {
		if (projectsNextUrl) {
			let filterQuery = `?limit=${PROJECT_CARD_DISPLAY_LIMIT}&offset=${projectsMe.length}`;

			if (activeTab === 'favorites') {
				filterQuery += `&is_favorited=${encodeURIComponent(true)}`;
			}

			if (activeTab === 'active') {
				filterQuery += `&active=${encodeURIComponent(true)}`;
			}

			if (activeTab === 'draft') {
				filterQuery += `&draft=${encodeURIComponent(true)}`;
			}

			if (activeTab === 'moderation') {
				filterQuery += `&moderation=${encodeURIComponent(true)}`;
			}

			if (activeTab === 'completed') {
				filterQuery += `&completed=${encodeURIComponent(true)}`;
			}

			if (activeTab === 'archive') {
				filterQuery += `&archive=${encodeURIComponent(true)}`;
			}

			getNextPrevProjectsMe(filterQuery)
				.then((data) => {
					setProjectsMe([...projectsMe, ...data.results]);
					setProjectsNextUrl(data.next);
				})
				.catch((err) => {
					console.log(`Ошибка: ${err}`);
				});

			getProjectsMe(filterQuery)
				.then((data) => {
					setProjectsMe([...projectsMe, ...data.results]);
					setProjectsNextUrl(data.next);
				})
				.catch((err) => {
					console.log(`Ошибка: ${err}`);
				});
		}
	}

	useEffect(() => {
		getUserInformation().then((user) => {
			if (user.role === 'organizer') {
				getOrganizationInformation(user.id_organizer_or_volunteer)
					.then((organizer) => {
						setCurrentUser({
							firstName: user.first_name,
							secondName: user.second_name,
							lastName: user.last_name,
							role: user.role,
							userId: user.id,
							email: user.email,
							id: user.id_organizer_or_volunteer,
							about: organizer.about || '',
							city: organizer.city,
							ogrn: organizer.ogrn,
							phone: organizer.phone,
							photo: organizer.photo || '',
							title: organizer.title,
						});
					})
					.catch((err) => console.error(err));
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location]);

	useEffect(() => {
		getProjectsMe(`?limit=${PROJECT_CARD_DISPLAY_LIMIT}`)
			.then((data) => {
				setProjectsNextUrl(data.next);
				setProjectsMe(data.results);
			})
			.catch((err) => {
				console.log(`Ошибка: ${err}`);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setProjectsNextUrl, setProjectsMe]);

	useEffect(() => {
		let filterQuery = `?limit=${PROJECT_CARD_DISPLAY_LIMIT}`;

		if (activeTab === 'favorites') {
			filterQuery += `&is_favorited=${encodeURIComponent(true)}`;
		}

		if (activeTab === 'active') {
			filterQuery += `&active=${encodeURIComponent(true)}`;
		}

		if (activeTab === 'draft') {
			filterQuery += `&draft=${encodeURIComponent(true)}`;
		}

		if (activeTab === 'moderation') {
			filterQuery += `&moderation=${encodeURIComponent(true)}`;
		}

		if (activeTab === 'completed') {
			filterQuery += `&completed=${encodeURIComponent(true)}`;
		}

		if (activeTab === 'archive') {
			filterQuery += `&archive=${encodeURIComponent(true)}`;
		}

		getProjectsMe(filterQuery)
			.then((data) => {
				setProjectsNextUrl(data.next);
				setProjectsMe(data.results);
			})
			.catch((err) => {
				console.log(`Ошибка: ${err}`);
			});
	}, [activeTab, setActiveTab, setProjectsMe, setProjectsNextUrl]);

	const deleteProjectCard = (projectId) => {
		deleteCardProjectOrganization(projectId)
			.then(() => {
				setProjectsMe((state) => state.filter((c) => c.id !== projectId));
				setModal({
					isOpen: true,
					type: 'deleteCardProject',
					state: 'success',
					title: '',
					typeStyle: 'deleteCardProject',
				});
			})
			.catch((err) => {
				if (Array.isArray(err)) {
					setModal({
						isOpen: true,
						type: 'error',
						state: 'info',
						title: 'Произошла ошибка',
						errorArray: err,
					});
				}
			});
	};

	const handleDeleteModal = (cardProject) => {
		setModal({
			isOpen: true,
			type: 'deleteCardProject',
			state: 'info',
			title: 'Удаление проекта',
			typeStyle: 'deleteCardProject',
			onSubmit: (event) => {
				event.preventDefault();
				deleteProjectCard(cardProject.id);
				setModal({
					isOpen: false,
				});
			},
		});
	};

	return location.pathname === '/profile/organizer' ||
		location.pathname === '/profile/organizer/' ? (
		<section className="profile-org">
			<div className="profile-org__container">
				<div className="profile-org__menu">
					<Crumbs />
				</div>
				<div className="profile-org__wrapper">
					<div className="profile-org__personal">
						<div className="profile-org__personal-container">
							<div className="profile-org__personal-label">
								<img
									className="profile-org__image"
									src={photo || organizationImage}
									alt="Логотип организатора"
								/>
								<div className="profile-org__personal-btn">
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
							<div className="profile-org__name">
								<h2 className="profile-org__name-surname">{title}</h2>
							</div>

							<ProfileData dataArray={dataOrganization} />
						</div>
					</div>
					<div className="profile-org__projects">
						<div className="profile-org__projects-container">
							<div className="profile-org__projects-label">
								<h2 className="profile-org__projects-title">Ваши проекты</h2>
								<div className="profile-org__projects-btn">
									<Pushbutton
										label="Добавить проект"
										color="white"
										size="large-var"
										minWidth="283px"
										backgroundColor="#A6C94F"
										border="none"
										onClick={() =>
											navigate('/profile/organizer/create-project')
										}
									/>
								</div>
							</div>

							<ProfileButtonsTabs
								activeTab={activeTab}
								setActiveTab={setActiveTab}
							/>

							{projectsMe.length > 0 ? (
								<div className="profile-org__projects-cards">
									{projectsMe.map((item) => (
										<CardProject
											cardProject={item}
											key={item.id}
											onCardDelete={handleDeleteModal}
											onCardDisliked={handleDislikedCard}
										/>
									))}
								</div>
							) : (
								<div className="profile-org__blank">
									<p className="profile-org__blank-title">
										Здесь будут отображаться ваши проекты
									</p>
									<div className="profile-org__blank-picture">
										<img
											className="profile-org__blank-image"
											src={cityImage}
											alt="город"
										/>
									</div>
								</div>
							)}
							{projectsMe.length >= 6 && projectsNextUrl && (
								<div className="profile-org__button">
									<Button
										className="profile-org__button-item"
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
			<Outlet
				context={{
					projectsMe,
				}}
			/>
		</section>
	) : (
		<Outlet
			context={{
				currentUser,
				setCurrentUser,
				handleChangePasswordForm,
				cities,
				skills,
				projectCategories,
				setModal,
				projectsMe,
			}}
		/>
	);
}

export default ProfileOrganization;
