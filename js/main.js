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

const filterData = (data, query) => {
	const filtered = data.filter(item => item.name.includes(query));
	return filtered;
};

const DISPLAY_DATA = {
	people: [
		{ string: 'Name', value: 'name', isSortable: true, sortDirection: 'ascending' },
		{ string: 'Mass', value: 'mass', isSortable: true, sortDirection: 'descending' },
		{ string: 'Height', value: 'height', isSortable: true, sortDirection: 'descending'},
		{ string: 'Gender', value: 'gender', isSortable: true, sortDirection: 'ascending' }
	],
	films: [
		{ string: 'Title', value: 'title', isSortable: true, sortDirection: 'ascending' },
		{ string: 'Release date', value: 'release_date', isSortable: true, sortDirection: 'ascending' }
	]
};

const initVue = element => {
	const ENDPOINT = element.dataset.endpoint;
	return {
		el: `[data-endpoint=${ENDPOINT}]`,
		data: {
			apiData: {},
			currentSortDirection: DEFAULT_SORT_DIRECTION,
			currentSortKey: null,
			displayData: null,
			endpoint: ENDPOINT,
			errorMessage: null,
			hasError: true,
			hasNext: false,
			hasPrevious: false,
			isLoading: false,
			loadingMessage: null,
			sortOptions: null
		},
		methods: {
			setDisplayData() {
				this.displayData = DISPLAY_DATA[ENDPOINT];
			},
			setSortOptions() {
				this.sortOptions = this.displayData.filter(item => item.isSortable === true);
			},
			updateData(data) {
				this.apiData[ENDPOINT] = data;
				this.hasPrevious = !!this.apiData[ENDPOINT].previous;
				this.hasNext = !!this.apiData[ENDPOINT].next;
				this.isLoading = false;
				if (this.currentSortKey) this.apiData[ENDPOINT].results = sortData(this.apiData[ENDPOINT].results, this.currentSortKey, this.currentSortDirection);
			},
			appendData(data) {
				this.apiData[ENDPOINT].results = [...this.apiData[ENDPOINT].results, ...data.results];
			},
			getData(e, url = `${API_URL}${ENDPOINT}`, callback) {
				this.isLoading = true;
				this.loadingMessage = `Loading /${ENDPOINT}`;
				fetch(url)
					.then(response => response.json())
					.then(data => {
						this.setDisplayData();
						this.setSortOptions();
						if (callback) callback(data);
						else this.updateData(data);
					})
					.catch(error => {
						this.isLoading = false;
						this.hasError = true;	
						this.errorMessage = `Sorry, there's been a problem getting /${ENDPOINT}`;
						console.error(error);
					});
			},
			sort(e) {
				const selectedOption = e.target.selectedOptions[0];
				const sortKey = selectedOption.value;
				if (sortKey === 'null') return;
				const sortDirection = selectedOption.dataset.sortDirection || DEFAULT_SORT_DIRECTION;
				this.apiData[ENDPOINT].results = sortData(this.apiData[ENDPOINT].results, sortKey, sortDirection);
				this.currentSortKey = sortKey;
				this.currentSortDirection = sortDirection;
			},
			pagination(e, direction) {
				this.getData(e, this.apiData[ENDPOINT][direction]);
			},
			showMore(e) {
				this.getData(e, this.apiData[ENDPOINT].next, this.appendData);
			},
			filter(e) {
				console.log('--------------------');
				console.log(this.apiData[ENDPOINT].results);
				console.log('--------------------');
				this.apiData[ENDPOINT].results = filterData(this.apiData[ENDPOINT].results, e.target.value);
				console.log('--------------------');
				console.log(this.apiData[ENDPOINT].results);
				console.log('--------------------');
			}
		}
	}
};

const vueElements = Array.from(document.querySelectorAll('.vue-instance'));
vueElements.forEach(element => new Vue(initVue(element)));