import request from './request';
import {
	ENDPOINT_CITIES,
	ENDPOINT_SKILLS,
	ENDPOINT_USERS,
	ENDPOINT_VOLUNTEERS,
	ENDPOINT_ORGANIZATIONS,
	ENDPOINT_MEDIA,
	ENDPOINT_ACTIVATION_USER,
} from './endpoints';

const getCities = () => request(ENDPOINT_CITIES, 'GET');

const getSkills = () => request(ENDPOINT_SKILLS, 'GET');

const createUser = (userData) => request(ENDPOINT_USERS, 'POST', userData);

const createVolunteer = (volunteerData) =>
	request(ENDPOINT_VOLUNTEERS, 'POST', volunteerData);

const updateVolunteer = (volunteerId, updatedVolunteerData) =>
	request(`${ENDPOINT_VOLUNTEERS}${volunteerId}/`, 'PUT', updatedVolunteerData);

const createOrganization = (organizationData) =>
	request(ENDPOINT_ORGANIZATIONS, 'POST', organizationData);

const updateOrganization = (organizationId, updatedOrganizationData) =>
	request(
		`${ENDPOINT_ORGANIZATIONS}${organizationId}/`,
		'PUT',
		updatedOrganizationData
	);

const postPhoto = (formData) => request(ENDPOINT_MEDIA, 'POST', formData);

const activateUser = (data) => request(ENDPOINT_ACTIVATION_USER, 'POST', data);

export {
	getCities,
	getSkills,
	createUser,
	createVolunteer,
	updateVolunteer,
	createOrganization,
	updateOrganization,
	postPhoto,
	activateUser,
};