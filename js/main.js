'use strict';

const apiUrl = 'https://swapi.co/api/';

const app = new Vue({
	el: '#app',
	data: {
		apiData: {},
		isLoading: false,
		loadingMessage: '',
		hasError: true,
		errorMessage: ''
	},
	methods: {
		getData(e) {
			this.isLoading = true;
			const endpoint = e.target.dataset.endpoint;
			this.loadingMessage = `Loading /${endpoint}`;
			fetchData(endpoint);
		}
	}
});

const handleResponse = (data, endpoint) => {
	app.apiData[endpoint] = data;
	app.isLoading = false;
};

const handleError = (error, endpoint) => {
	app.isLoading = false;
	app.hasError = true;
	app.errorMessage = `Sorry, there's been a problem getting /${endpoint}`;
};

const fetchData = endpoint => {
	
	fetch(`${apiUrl}${endpoint}`)
		.then(response => response.json())
		.then(data => handleResponse(data, endpoint))
		.catch(error => handleError(error, endpoint));
};