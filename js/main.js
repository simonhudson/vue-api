'use strict';

const API_URL = 'https://swapi.co/api/';

const initVue = element => {
	const endpoint = element.dataset.endpoint;
	return {
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
				this.loadingMessage = `Loading /${endpoint}`;
				fetch(`${API_URL}${this.endpoint}`)
					.then(response => response.json())
					.then(data => {
						this.apiData[this.endpoint] = data;
						this.isLoading = false;
					})
					.catch(error => {
						this.isLoading = false;
						this.hasError = true;
						this.errorMessage = `Sorry, there's been a problem getting /${endpoint}`;
					});
			}
		}
	}
};

const vueElements = Array.from(document.querySelectorAll('.vue-instance'));
vueElements.forEach(element => new Vue(initVue(element)));