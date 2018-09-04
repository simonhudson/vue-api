'use strict';

const API_URL = 'https://swapi.co/api/';
const DEFAULT_SORT_DIRECTION = 'ascending';

const toInt = value => parseInt(value, 10)

const sortData = (data, sortKey, sortDirection = DEFAULT_SORT_DIRECTION) => {
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
	const ENDPOINT = element.dataset.endpoint;
	return {
		el: `[data-endpoint=${ENDPOINT}]`,
		data: {
			apiData: {},
			currentSortKey: '',
			endpoint: ENDPOINT,
			errorMessage: '',
			hasError: true,
			isLoading: false,
			loadingMessage: '',
			hasPrevious: false,
			hasNext: false
		},
		methods: {
			getData(e, url = `${API_URL}${ENDPOINT}`) {
				this.isLoading = true;
				this.loadingMessage = `Loading /${ENDPOINT}`;
				this.apiData[ENDPOINT] = null;
				fetch(url)
					.then(response => response.json())
					.then(data => {
						this.apiData[ENDPOINT] = data;
						this.hasPrevious = !!this.apiData[ENDPOINT].previous;
						this.hasNext = !!this.apiData[ENDPOINT].next;
						this.isLoading = false;
					})
					.catch(error => {
						this.isLoading = false;
						this.hasError = true;
						this.errorMessage = `Sorry, there's been a problem getting /${ENDPOINT}`;
					});
			},
			sort(e) {
				const selectedOption = e.target.selectedOptions[0];
				const sortKey = selectedOption.value;
				if (sortKey === 'null') return;
				const sortDirection = selectedOption.dataset.sortDirection || DEFAULT_SORT_DIRECTION;
				this.apiData[ENDPOINT].results = sortData(this.apiData[ENDPOINT].results, sortKey, sortDirection);
				this.currentSortKey = sortKey;
			},
			pagination(e, direction) {
				this.getData(e, this.apiData[ENDPOINT][direction]);
			},
		}
	}
};

const vueElements = Array.from(document.querySelectorAll('.vue-instance'));
vueElements.forEach(element => new Vue(initVue(element)));