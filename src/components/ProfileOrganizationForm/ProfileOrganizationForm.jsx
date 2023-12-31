import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { useOutletContext, useNavigate } from 'react-router-dom';

import { InputMask } from '@react-input/mask';
import { phoneMask } from '../../utils/inputsMasks/phoneMask';
import { ogrnMask } from '../../utils/inputsMasks/ogrnMask';

import './ProfileOrganizationForm.scss';

import Input from '../Input/Input';
import InputTextArea from '../InputTextArea/InputTextArea';
import InputGroup from '../InputGroup/InputGroup';
import UploadFile from '../UploadFile/UploadFile';
import ProfilePhoto from '../../images/fotoProfile_2.svg';

import { Pushbutton } from '../Pushbutton/Pushbutton';
import { ProfileOrganizationFormSchema } from '../../utils/validationSchemas/ProfileOrganizationFormSchema';
import { updateOrganization } from '../../utils/api/signupApi';
import SelectOption from '../SelectOption/SelectOption';

export default function ProfileOrganizationForm({ onSubmit, ...restProps }) {
	const navigate = useNavigate();
	const { currentUser, cities } = useOutletContext();
	const {
		firstName,
		lastName,
		secondName,
		about,
		city,
		phone,
		photo,
		ogrn,
		title,
		id,
	} = currentUser;

	const selectOptionsCity = cities
		.filter((item) => item.value === `${city}`)
		.map((item) => ({
			label: item.label,
			value: item.value,
		}));

	const getPhoneNumberMask = (phoneNumber) =>
		phoneNumber &&
		phoneNumber.startsWith('+7') &&
		phoneNumber.length === 12 &&
		phoneNumber.replace(
			/(\+\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/,
			'+7 ($2) $3-$4-$5'
		);

	const getOgrnMask = (ogrnNumber) =>
		ogrnNumber &&
		ogrnNumber.replace(
			/(\d{1})(\d{2})(\d{2})(\d{2})(\d{5})(\d{1})/,
			'$1-$2-$3-$4-$5-$6'
		);

	const phoneNumberMask = getPhoneNumberMask(phone);
	const getterOgrnMask = getOgrnMask(ogrn);

	const formik = useFormik({
		validateOnMount: true,
		validateOnChange: true,
		initialValues: {
			profile_organize_organization: title,
			profile_organize_about_organization: about,
			profile_organize_city: selectOptionsCity,
			profile_organize_firstname: firstName,
			profile_organize_secondname: secondName,
			profile_organize_lastname: lastName,
			profile_organize_phone: phoneNumberMask,
			profile_organize_ogrn: getterOgrnMask,
			profile_organize_photo: photo,
		},
		validationSchema: ProfileOrganizationFormSchema,
		onSubmit: async (values) => {
			// конверсия номера телефона из инпута в формат телефона на сервере
			const getDigitsOnly = (phoneNumber) => phoneNumber.replace(/\D/g, '');
			let formattedPhone = getDigitsOnly(values.profile_organize_phone);
			if (formattedPhone.startsWith('8')) {
				formattedPhone = `7${formattedPhone.slice(1)}`;
			}

			try {
				await updateOrganization(id, {
					contact_person: {
						email: values.organize_email,
						first_name: values.profile_organize_firstname,
						last_name: values.profile_organize_lastname,
						password: values.profile_organize_password,
						second_name: values.profile_organize_secondname,
					},
					title: values.profile_organize_organization,
					ogrn: values.profile_organize_ogrn.replace(/-/g, ''),
					phone:
						(formattedPhone.length > 1 && `+${formattedPhone}`) ||
						formattedPhone,
					about: values.profile_organize_about_organization || '' || undefined,
					photo: values.photo,
					city: values.profile_organize_city[0].value,
				});
				navigate('..');
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error('Failed to create user and/or organize:', error.message);
			}
		},
	});

	return (
		<form
			action="#"
			method="post"
			className="organize-signup-form"
			name="organize-auth-form"
			onSubmit={formik.handleSubmit}
			encType="multipart/form-data"
			{...restProps}
		>
			<div className="profile-organize-form__form-wrap">
				<div className="profile-organize-form__photo-wrap">
					<img
						className="profile-organize-form__photo"
						src={photo || ProfilePhoto}
						alt="Фотография пользователя"
					/>
					<div className="profile-organize-form__text-wrap">
						<p className="profile-organize-form__text">
							Загрузить новую фотографию*
						</p>
						<UploadFile
							id="photo"
							name="photo"
							label=""
							className="profile-organize-form__upload-file"
							type="file"
							value={formik.values.profile_organize_photo}
							setFieldValue={formik.setFieldValue}
						/>
					</div>
				</div>
				<div className="profile-organize-form__inputs-wrap">
					<InputGroup title="Общая информация">
						<Input
							id="profile_organize_organization"
							name="profile_organize_organization"
							label="Название организации"
							type="text"
							placeholder="ООО «Ромашка»"
							inputSize="small"
							error={formik.errors.profile_organize_organization}
							touched={formik.touched.profile_organize_organization}
							value={formik.values.profile_organize_organization}
							handleChange={formik.handleChange}
							submitCount={formik.submitCount}
							required
						/>
						<SelectOption
							id="profile_organize_city"
							name="profile_organize_city"
							label="Город"
							placeholder="Выберите город"
							width={400}
							options={cities}
							touched={formik.touched.profile_organize_city}
							value={formik.values.profile_organize_city}
							handleChange={(selectedOption) => {
								formik.setFieldValue('profile_organize_city', [
									{
										label: selectedOption.label,
										value: selectedOption.value,
									},
								]);
							}}
							required
						/>
					</InputGroup>
					<InputTextArea
						id="profile_organize_about_organization"
						name="profile_organize_about_organization"
						label="Об организации"
						placeholder="Расскажите коротко об организации"
						error={formik.errors.profile_organize_about_organization}
						touched={formik.touched.profile_organize_about_organization}
						value={formik.values.profile_organize_about_organization}
						handleChange={formik.handleChange}
						submitCount={formik.submitCount}
					/>

					<InputGroup title="Контактные данные представителя компании">
						<Input
							id="profile_organize_firstname"
							name="profile_organize_firstname"
							label="Имя"
							type="text"
							placeholder="Пётр"
							inputSize="small"
							error={formik.errors.profile_organize_firstname}
							touched={formik.touched.profile_organize_firstname}
							value={formik.values.profile_organize_firstname}
							handleChange={formik.handleChange}
							submitCount={formik.submitCount}
							autoсomplete="off"
							required
						/>
						<Input
							id="profile_organize_secondname"
							name="profile_organize_secondname"
							label="Отчество"
							type="text"
							placeholder="Сергеевич"
							inputSize="small"
							error={formik.errors.profile_organize_secondname}
							touched={formik.touched.profile_organize_secondname}
							value={formik.values.profile_organize_secondname}
							handleChange={formik.handleChange}
							submitCount={formik.submitCount}
							autoсomplete="off"
							required
						/>
						<Input
							id="profile_organize_lastname"
							name="profile_organize_lastname"
							label="Фамилия"
							type="text"
							placeholder="Иванов"
							inputSize="small"
							error={formik.errors.profile_organize_lastname}
							touched={formik.touched.profile_organize_lastname}
							value={formik.values.profile_organize_lastname}
							handleChange={formik.handleChange}
							submitCount={formik.submitCount}
							autoсomplete="off"
							required
						/>
						<InputMask
							component={Input}
							mask="+_ (___) ___-__-__"
							replacement={{ _: /\d/ }}
							modify={phoneMask}
							label="Телефон"
							type="text"
							placeholder="+7 977 000-00-00"
							inputSize="small"
							id="profile_organize_phone"
							name="profile_organize_phone"
							error={formik.errors.profile_organize_phone}
							touched={formik.touched.profile_organize_phone}
							value={formik.values.profile_organize_phone}
							handleChange={formik.handleChange}
							submitCount={formik.submitCount}
						/>
					</InputGroup>
					<InputGroup title="Дополнительная информация">
						<InputMask
							component={Input}
							mask="_-__-__-__-_____-_"
							replacement={{ _: /\d/ }}
							modify={ogrnMask}
							label="ОГРН"
							type="text"
							placeholder="1-02-66-05-60662-0"
							inputSize="small"
							id="profile_organize_ogrn"
							name="profile_organize_ogrn"
							error={formik.errors.profile_organize_ogrn}
							touched={formik.touched.profile_organize_ogrn}
							value={formik.values.profile_organize_ogrn}
							handleChange={formik.handleChange}
							submitCount={formik.submitCount}
							required
						/>
					</InputGroup>
					<div className="profile-organize-form__buttons">
						<div className="profile-organize-form__button">
							<Pushbutton
								label="Сохранить изменения"
								color="white"
								backgroundColor="#A6C94F"
								border="1px solid #A6C94F"
								minWidth="100%"
								size="pre-large"
								disabled={
									!formik.isValid ||
									formik.values.profile_organize_city === null
								}
								type="submit"
							/>
						</div>
						<div className="profile-organize-form__button">
							<Pushbutton
								primary
								color="#333333"
								label="Отменить изменения"
								size="pre-large"
								minWidth="100%"
								border="1px solid #A6C94F"
								type="button"
								onClick={() => {
									formik.handleReset();
									formik.resetForm({});
									navigate('..');
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</form>
	);
}

ProfileOrganizationForm.propTypes = {
	onSubmit: PropTypes.func,
};

ProfileOrganizationForm.defaultProps = {
	onSubmit: () => {},
};
