'use strict';

const apiUrl = 'https://swapi.co/api/';

const getData = (instance, e) => {
	instance.isLoading = true;
	const endpoint = e.target.dataset.endpoint;
	instance.loadingMessage = `Loading...`;
	fetch(`${apiUrl}${endpoint}`)
		.then(response => response.json())
		.then(data => handleResponse(instance, data, endpoint))
		.catch(error => handleError(instance, error, endpoint));
};

const handleResponse = (instance, data, endpoint) => {
	instance.apiData[endpoint] = data;
	instance.isLoading = false;
};

const handleError = (instance, error, endpoint) => {
	instance.isLoading = false;
	instance.hasError = true;
	instance.errorMessage = `Sorry, there's been a problem getting /${endpoint}`;
};

const defaultVueProps = (selector) => {
	return {
		el: selector,
		data: {
			apiData: {},
			isLoading: false,
			loadingMessage: '',
			hasError: true,
			errorMessage: ''
		},
		methods: {
			getData(e) {
				getData(this, e);
			}
		}
	}
};

const films = new Vue(defaultVueProps('#films'));
const people = new Vue(defaultVueProps('#people'));