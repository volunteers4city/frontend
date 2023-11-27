import { useState } from 'react';
import PropTypes from 'prop-types';
import { InputMask } from '@react-input/mask';
import { useFormik } from 'formik';
import Input from '../Input/Input';
import InputTextArea from '../InputTextArea/InputTextArea';
import InputGroup from '../InputGroup/InputGroup';
import { IncomeFormSchema } from '../../utils/validationSchemas/IncomeFormSchema';
import { phoneMask } from '../../utils/inputsMasks/phoneMask';
import Button from '../Button/Button';
import ProjectIncome from '../../classes/ProjectIncome';
import PopupWindow from '../PopupWindow/PopupWindow';
import './FormIncome.scss';

function FormIncome({ currentUser, onSubmit, projectId }) {
	const [popup, setPopup] = useState({ isOpen: false });
	const openPopup = (text, type, errorArray = []) => {
		setPopup({
			text,
			type,
			isOpen: true,
			errorArray,
		});
		setTimeout(() => {
			setPopup({
				isOpen: false,
			});
		}, 3000);
	};

	const formik = useFormik({
		validateOnMount: true,
		validateOnChange: true,
		initialValues: {
			phone: currentUser.phone,
			email: currentUser.email,
			telegram: currentUser.telegram,
			letter: '',
		},
		validationSchema: IncomeFormSchema,
		onSubmit: () => {
			ProjectIncome.createNew(formik.values, currentUser.id, projectId)
				.then(() => onSubmit())
				.catch((e) => openPopup(e, 'error'));
		},
	});

	return (
		<form className="form-income" onSubmit={formik.handleSubmit}>
			<InputGroup title="Контактные данные">
				<InputMask
					component={Input}
					mask="+7 (___) ___-__-__"
					replacement={{ _: /\d/ }}
					modify={phoneMask}
					id="phone"
					name="phone"
					label="Телефон"
					type="text"
					placeholder="+7 977 000-00-00"
					inputSize="small"
					value={formik.values.phone}
					handleChange={formik.handleChange}
					error={formik.errors.phone}
					touched={formik.touched.phone}
				/>
				<Input
					id="email"
					name="email"
					label="E-mail"
					type="email"
					placeholder="example@email.ru"
					inputSize="small"
					error={formik.errors.email}
					touched={formik.touched.email}
					value={formik.values.email}
					handleChange={formik.handleChange}
					submitCount={formik.submitCount}
					autoсomplete="off"
					required
				/>
				<Input
					id="telegram"
					name="telegram"
					label="Telegram"
					type="text"
					placeholder="@name"
					inputSize="small"
					error={formik.errors.telegram}
					touched={formik.touched.telegram}
					value={
						formik.values.telegram && !formik.values.telegram.startsWith('@')
							? `@${formik.values.telegram}`
							: formik.values.telegram
					}
					handleChange={formik.handleChange}
					submitCount={formik.submitCount}
					autoсomplete="off"
				/>
			</InputGroup>

			<InputGroup title="Сопроводительное письмо">{}</InputGroup>
			<InputTextArea
				name="letter"
				placeholder="Расскажите немного о себе, какие задачи вы бы хотели выполнять, кем хотели бы быть"
				value={formik.values.letter}
				handleChange={formik.handleChange}
			/>
			<Button type="submit" className="form-income__submit">
				Подать заявку на участие в проекте
			</Button>

			{popup?.isOpen && <PopupWindow {...popup} />}
		</form>
	);
}
FormIncome.propTypes = {
	currentUser: PropTypes.shape({
		id: PropTypes.number,
		phone: PropTypes.string,
		email: PropTypes.string,
		telegram: PropTypes.string,
	}).isRequired,
	onSubmit: PropTypes.func.isRequired,
	projectId: PropTypes.number.isRequired,
};
export default FormIncome;
