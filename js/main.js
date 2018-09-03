'use strict';

const API_URL = 'https://swapi.co/api/';

const toInt = value => parseInt(value, 10)

const sortData = (data, sortKey, sortDirection = 'ascending') => {
	const isDescending = sortDirection === 'descending';
	const sorted = data.sort((a, b) => {
		let sortKeyA = a[sortKey];
		let sortKeyB = b[sortKey];
		if (!isNaN(toInt(sortKeyA))) sortKeyA = toInt(sortKeyA);
		if (!isNaN(toInt(sortKeyB))) sortKeyB = toInt(sortKeyB);
		if (isDescending) return ~~(sortKeyA < sortKeyB); 
		return ~~(sortKeyA > sortKeyB);
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
				const selectedOption = e.target.selectedOptions[0];
				const sortKey = selectedOption.value;
				if (sortKey === 'null') return;
				const sortDirection = selectedOption.dataset.sortDirection;
				this.apiData[endpoint].results = sortData(this.apiData[endpoint].results, sortKey, sortDirection);
				this.currentSortKey = sortKey;
			}
		}
	}
};

const vueElements = Array.from(document.querySelectorAll('.vue-instance'));
vueElements.forEach(element => new Vue(initVue(element)));