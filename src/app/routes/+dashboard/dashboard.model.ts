export interface IBotRecord {
	name: string;
	scheme?: string;
	series: IBotSeriesItem[];
}

export interface IBotSeriesItem {
	name: string;
	value: number;
	scheme?: string;
}
