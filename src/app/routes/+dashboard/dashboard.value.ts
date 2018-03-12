import { IBotRecord, IBotSeriesItem } from './dashboard.model';

export const BOT_RECORDS: IBotRecord[] = [{
	name: 'BOT1', scheme: '#00b19d', series: [{
		name: '0s', value: 0
	}, {
		name: '1s', value: 0
	}]
}, {
	name: 'BOT2', scheme: '#f76397', series: [{
		name: '0s', value: 0
	}, {
		name: '1s', value: 0
	}]
}, {
	name: 'BOT3', scheme: '#ffaa00', series: [{
		name: '0s', value: 0
	}, {
		name: '1s', value: 0
	}]
}, {
	name: 'BOT4', scheme: '#ffaa88', series: [{
		name: '0s', value: 0
	}, {
		name: '1s', value: 0
	}]
}];

export const ALL_RECORD: IBotRecord = {
	name: 'All', series: [{
		name: '0s', value: 100
	}, {
		name: '1s', value: 100
	}]
};

export const BOT_COUNTS: IBotSeriesItem[] = [{
	name: 'BOT1', value: 0, scheme: '#00b19d'
}, {
	name: 'BOT2', value: 0, scheme: '#f76397'
}, {
	name: 'BOT3', value: 0, scheme: '#ffaa00'
}, {
	name: 'BOT4', value: 0, scheme: '#ffaa88'
}];
