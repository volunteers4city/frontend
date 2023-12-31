import { useOutletContext, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import SignIn from '../SignIn/SignIn';
import ImageComponent from '../ImageComponent/ImageComponent';
import entrance from '../../images/entrance.svg';
import './LoginSignIn.scss';

import { activateUser } from '../../utils/api/signupApi';

function LoginSignIn() {
	const { handleSignIn, isLoading, setModal, setIsLoading } =
		useOutletContext();
	const { uid, token } = useParams();

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				await activateUser({ uid, token });
				setModal({
					isOpen: true,
					type: 'email',
					state: 'success',
					title: 'E-mail подтвержден',
					onSubmit: (event) => {
						event.preventDefault();
						setModal({
							isOpen: false,
						});
					},
				});
			} catch (err) {
				if (Array.isArray(err)) {
					setModal({
						isOpen: true,
						type: 'error',
						state: 'info',
						title: 'Произошла ошибка',
						errorArray: err,
					});
				} else {
					console.error(err);
				}
			} finally {
				setIsLoading(false);
			}
		};
		if (uid && token) {
			fetchData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<main className="login-sign-in">
			<SignIn
				title="Войти"
				subtitle="в личный кабинет"
				buttonSubmitText={isLoading ? 'Вход...' : 'Войти'}
				onSignIn={handleSignIn}
			/>
			<ImageComponent
				src={entrance}
				type="entrance"
				altImage="Человек заходит в дверь"
			/>
		</main>
	);
}

export default LoginSignIn;
