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
	console.log('--------------------');
	console.log(instance.apiData);
	console.log('--------------------');
	instance.isLoading = false;
};

const handleError = (instance, error, endpoint) => {
	instance.isLoading = false;
	instance.hasError = true;
	instance.errorMessage = `Sorry, there's been a problem getting /${endpoint}`;
};

const films = new Vue({
	el: '#films',
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
});

const people = new Vue({
	el: '#people',
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
});

// const handleResponse = (instance, data, endpoint) => {
// 	instance.apiData[endpoint] = data;
// 	instance.isLoading = false;
// };
// 
// const handleError = (error, endpoint) => {
// 	instance.isLoading = false;
// 	instance.hasError = true;
// 	instance.errorMessage = `Sorry, there's been a problem getting /${endpoint}`;
// };
// 
// const fetchData = endpoint => {
// 
// 	fetch(`${apiUrl}${endpoint}`)
// 		.then(response => response.json())
// 		.then(data => handleResponse(data, endpoint))
// 		.catch(error => handleError(error, endpoint));
// };