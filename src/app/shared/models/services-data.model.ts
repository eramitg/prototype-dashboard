import { IBlock } from '@shared/models/blocks.model';

export interface IPouchdbData {
	transactions: IBlock[];
	secsSinceLast: number;
	secsSinceBegin: number;
	secsSinceLastInterval: any;
	secsSinceBeginInterval: any;
}
