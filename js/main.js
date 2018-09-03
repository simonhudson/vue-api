'use strict';

const API_URL = 'https://swapi.co/api/';

const sortData = (data, sortKey) => {
	if (
		!data ||
		!sortKey ||
		!Array.isArray(data) ||
		!data.length ||
		!(data[0] instanceof Object) ||
		typeof sortKey !== 'string'
	)
		return data;

	const sorted = data.sort((a, b) => {
		return ~~(a[sortKey] > b[sortKey]);
	});
	return sorted;
};

const initVue = element => {
	const endpoint = element.dataset.endpoint;
	return {
		el: `[data-endpoint=${endpoint}]`,
		data: {
			apiData: {},
			currentSortKey: '',
			endpoint,
			errorMessage: '',
			hasError: true,
			isLoading: false,
			loadingMessage: ''
		},
		methods: {
			getData(e) {
				this.isLoading = true;
				this.apiData[endpoint] = null;
				this.loadingMessage = `Loading /${endpoint}`;
				fetch(`${API_URL}${endpoint}`)
					.then(response => response.json())
					.then(data => {
						this.apiData[endpoint] = data;
						this.isLoading = false;
					})
					.catch(error => {
						this.isLoading = false;
						this.hasError = true;
						this.errorMessage = `Sorry, there's been a problem getting /${endpoint}`;
					});
			},
			sort(e) {
				this.currentSortKey = e.target.selectedOptions[0].value;
				this.apiData[endpoint].results = sortData(this.apiData[endpoint].results, this.currentSortKey);
			}
		}
	}
};

const vueElements = Array.from(document.querySelectorAll('.vue-instance'));
vueElements.forEach(element => new Vue(initVue(element)));