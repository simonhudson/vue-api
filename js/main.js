'use strict';

const API_URL = 'https://swapi.co/api/';

const defaultVueProps = endpoint => {
	return {
		self: this,
		el: `[data-endpoint=${endpoint}]`,
		data: {
			endpoint,
			apiData: {},
			isLoading: false,
			loadingMessage: '',
			hasError: true,
			errorMessage: ''
		},
		methods: {
			getData(e) {
				this.isLoading = true;
				const endpoint = this.endpoint;
				this.loadingMessage = `Loading /${endpoint}`;
				fetch(`${API_URL}${endpoint}`)
					.then(response => response.json())
					.then(data => this.handleResponse(data, endpoint))
					.catch(error => this.handleError(error, endpoint));
			},
			handleResponse(data, endpoint) {
				this.apiData[endpoint] = data;
				this.isLoading = false;
			},
			handleError(error, endpoint) {
				this.isLoading = false;
				this.hasError = true;
				this.errorMessage = `Sorry, there's been a problem getting /${endpoint}`;
			}
		}
	}
};

const vueInstances = Array.from(document.querySelectorAll('.vue-instance'));
vueInstances.forEach(instance => new Vue(defaultVueProps(instance.dataset.endpoint)));