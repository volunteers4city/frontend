import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';

import './VolunteerSignupForm.scss';

import Input from '../Input/Input';
import UploadFile from '../UploadFile/UploadFile';
import InputGroup from '../InputGroup/InputGroup';
import { Pushbutton } from '../Pushbutton/Pushbutton';
import {
	// createUser,
	createVolunteer,
	fetchSkills,
	fetchCities,
} from '../../utils/api/signupApi';
import SelectOption from '../SelectOption/SelectOption';
// import citiesArray from '../../utils/citiesArray';
// import skillsArray from '../../utils/skillsArray';

export default function VolunteerSignupForm({ onSubmit, ...restProps }) {
	const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
	const [cities, setCities] = useState([]);
	const [skills, setSkills] = useState([]);

	// const [selectedFile, setSelectedFile] = React.useState(null);

	const handleCheckboxClick = () => {
		setIsCheckboxChecked(!isCheckboxChecked);
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const citiesResponse = await fetchCities();
				const skillsResponse = await fetchSkills();

				const citiesData = citiesResponse.map((item) => ({
					label: item.name,
					value: item.id.toString(),
				}));

				const skillsData = skillsResponse.map((item) => ({
					label: item.name,
					value: item.id.toString(),
				}));

				setCities(citiesData);
				setSkills(skillsData);
			} catch (error) {
				console.error('Ошибка при загрузке данных:', error);
			}
		};

		fetchData();
	}, []);

	const VolunteerSignupFormSchema = Yup.object({
		firstname: Yup.string()
			.min(2, 'Длина поля от 2 до 40 символов')
			.max(40, 'Длина поля от 2 до 40 символов')
			.matches(/^[А-Яа-яЁё\s-]+$/, 'Введите имя кириллицей')
			.required('Поле обязательно для заполнения'),
		secondname: Yup.string()
			.min(2, 'Длина поля от 2 до 40 символов')
			.max(40, 'Длина поля от 2 до 40 символов')
			.matches(/^[А-Яа-яЁё\s-]+$/, 'Введите фамилию кириллицей')
			.required('Поле обязательно для заполнения'),
		thirdname: Yup.string()
			.min(2, 'Длина поля от 2 до 40 символов')
			.max(40, 'Длина поля от 2 до 40 символов')
			.matches(/^[А-Яа-яЁё\s-]+$/, 'Введите отчество кириллицей')
			.required('Поле обязательно для заполнения'),
		birthday: Yup.string()
			.min(10, 'Введите корректную дату')
			.max(10, 'Введите корректную дату')
			.matches(
				/^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/,
				'Для регистрации вам должно быть не менее 18 лет'
			)
			.test('age', 'Вам должно быть 18 лет или старше', (value) => {
				const birthdate = moment(value, 'DD.MM.YYYY');
				const today = moment();
				return today.diff(birthdate, 'years') >= 18;
			})
			.required('Поле обязательно для заполнения'),
		phone: Yup.string()
			.matches(
				/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
				'Введите корректный телефон'
			)
			.required('Поле обязательно для заполнения'),
		email: Yup.string()
			.required('Поле обязательно для заполнения')
			.min(5, 'Длина поля от 5 до 256 символов')
			.max(256, 'Длина поля от 5 до 256 символов')
			.matches(
				/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
				'Проверьте правильность email адреса'
			),
		telegram: Yup.string()
			.min(5, 'Длина поля от 5 до 32 символов')
			.max(32, 'Длина поля от 5 до 32 символов')
			.matches(/^@[а-яА-ЯёЁ_a-zA-Z]{4,32}$/, 'Введите корректный username')
			.required('Поле обязательно для заполнения'),
		password: Yup.string()
			.required('Поле обязательно для заполнения')
			.min(8, 'Длина поля от 8 до 20 символов')
			.max(20, 'Длина поля от 8 до 20 символов')
			.matches(
				/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
				'Пароль должен содержать латинские и кириллические буквы, цифры и спецсимволы'
			)
			.oneOf([Yup.ref('confirm_password'), null], 'Пароли не совпадают'),
		confirm_password: Yup.string()
			.required('Поле обязательно для заполнения')
			.min(8, 'Длина поля от 8 до 20 символов')
			.max(20, 'Длина поля от 8 до 20 символов')
			.matches(
				/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
				'Пароль должен содержать латинские и кириллические буквы, цифры и спецсимволы'
			)
			.oneOf([Yup.ref('password'), null], 'Пароли не совпадают'),
	});

	const formik = useFormik({
		validateOnMount: true,
		validateOnChange: true,
		initialValues: {
			firstname: '',
			secondname: '',
			thirdname: '',
			birthday: '',
			phone: '',
			email: '',
			telegram: '',
			password: '',
			confirm_password: '',
			photo: '',
			skills: [],
			city: null,
		},
		validationSchema: VolunteerSignupFormSchema,
		onSubmit: async (values) => {
			// функция для конверсии даты из инпута в формат даты на сервере
			const formattedDateOfBirth = moment(values.birthday, 'DD.MM.YYYY').format(
				'YYYY-MM-DD'
			);
			// функция для конверсии номера телефона из инпута в формат телефона на сервере
			const getDigitsOnly = (phoneNumber) => phoneNumber.replace(/\D/g, '');
			const formattedPhone = `+${getDigitsOnly(values.phone)}`;

			try {
				await createVolunteer({
					user: {
						first_name: values.firstname,
						second_name: values.secondname,
						last_name: values.thirdname,
						email: values.email,
						password: values.password,
						re_password: values.confirm_password,
					},
					telegram: values.telegram,
					photo: values.photo || null || '' || undefined,
					date_of_birth: formattedDateOfBirth,
					phone: formattedPhone || '',
					skills: values.skills || [],
					city: values.city || [] || null || '',
				});
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error('Failed to create user and/or volunteer:', error.message);
			}
		},
	});

	return (
		<form
			action="#"
			method="post"
			className="volunteer-signup-form"
			name="volunteer-auth-form"
			onSubmit={formik.handleSubmit}
			encType="multipart/form-data"
			{...restProps}
		>
			<InputGroup title="Общая информация">
				<Input
					name="firstname"
					label="Имя"
					type="text"
					placeholder="Пётр"
					inputSize="small"
					error={formik.errors.firstname}
					touched={formik.touched.firstname}
					value={formik.values.firstname}
					handleChange={formik.handleChange}
					submitCount={formik.submitCount}
					autoсomplete="off"
					required
				/>
				<Input
					name="secondname"
					label="Фамилия"
					type="text"
					placeholder="Иванов"
					inputSize="small"
					error={formik.errors.secondname}
					touched={formik.touched.secondname}
					value={formik.values.secondname}
					handleChange={formik.handleChange}
					submitCount={formik.submitCount}
					required
				/>
				<Input
					name="thirdname"
					type="text"
					label="Отчество"
					placeholder="Сергеевич"
					inputSize="small"
					error={formik.errors.thirdname}
					touched={formik.touched.thirdname}
					value={formik.values.thirdname}
					handleChange={formik.handleChange}
					submitCount={formik.submitCount}
					autoсomplete="off"
					required
				/>
				<Input
					name="birthday"
					label="Дата рождения"
					type="text-date"
					placeholder="01.02.2010"
					inputSize="small"
					error={formik.errors.birthday}
					touched={formik.touched.birthday}
					value={formik.values.birthday}
					handleChange={formik.handleChange}
					submitCount={formik.submitCount}
					autoсomplete="off"
					required
				/>
			</InputGroup>
			<InputGroup title="Контактные данные">
				<Input
					name="phone"
					label="Телефон"
					type="phone"
					placeholder="+7 977 000-00-00"
					inputSize="small"
					error={formik.errors.phone}
					touched={formik.touched.phone}
					value={formik.values.phone}
					handleChange={formik.handleChange}
					submitCount={formik.submitCount}
					autoсomplete="off"
				/>
				<Input
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
					name="telegram"
					label="Telegram"
					type="text"
					placeholder="@name"
					inputSize="small"
					error={formik.errors.telegram}
					touched={formik.touched.telegram}
					value={formik.values.telegram}
					handleChange={formik.handleChange}
					submitCount={formik.submitCount}
					autoсomplete="off"
					required
				/>
			</InputGroup>
			<InputGroup title="Пароль">
				<Input
					name="password"
					label="Пароль"
					type="password"
					placeholder=""
					inputSize="small"
					error={formik.errors.password}
					touched={formik.touched.password}
					value={formik.values.password}
					handleChange={formik.handleChange}
					submitCount={formik.submitCount}
					autoсomplete="off"
					required
				/>
				<Input
					name="confirm_password"
					label="Повтор пароля"
					type="password"
					placeholder=""
					inputSize="small"
					error={formik.errors.confirm_password}
					touched={formik.touched.confirm_password}
					value={formik.values.confirm_password}
					handleChange={formik.handleChange}
					submitCount={formik.submitCount}
					autoсomplete="off"
					required
				/>
			</InputGroup>
			<InputGroup title="Фото">
				<UploadFile
					name="photo"
					label=""
					type="file"
					inputSize="photo"
					value={formik.values.confirm_password}
					// setSelectedFile={setSelectedFile}
				/>
			</InputGroup>
			<InputGroup title="Дополнительная информация">
				<SelectOption
					name="skills"
					label="Навыки"
					placeholder="Выберите навыки"
					width={280}
					options={skills}
					isMulti
					value={formik.values.skills}
					touched={formik.touched.skills}
					handleChange={(selectedOption) => {
						const selectedValues = selectedOption.map((option) => option.value);
						formik.setFieldValue('skills', selectedValues);
					}}
				/>
				<SelectOption
					name="city"
					label="Город"
					placeholder="Выберите город"
					width={280}
					options={cities}
					touched={formik.touched.city}
					value={formik.values.city}
					handleChange={(selectedOption) => {
						formik.setFieldValue('city', Number(selectedOption.value));
					}}
				/>
			</InputGroup>
			<div className=" volunteer-signup-form__text-content">
				<Pushbutton
					label="Зарегистрироваться"
					color="white"
					size="medium"
					disabled={!formik.isValid || !isCheckboxChecked}
					type="submit"
				/>
				<p className="volunteer-signup-form__text">
					Нажимая кнопку «Отправить данные», я подтверждаю, что мне исполнилось
					18 лет, и соглашаюсь с Политикой конфиденциальности
				</p>
				<label
					htmlFor="volunteer-signup-form-checkbox"
					className="volunteer-signup-form__text"
				>
					<input
						id="volunteer-signup-form-checkbox"
						name="volunteer-signup-form"
						type="checkbox"
						className="volunteer-signup-form__checkbox"
						onClick={handleCheckboxClick}
					/>
					Даю согласие на обработку моих персональных данных
				</label>
			</div>
		</form>
	);
}

VolunteerSignupForm.propTypes = {
	onSubmit: PropTypes.func,
};

VolunteerSignupForm.defaultProps = {
	onSubmit: () => {},
};