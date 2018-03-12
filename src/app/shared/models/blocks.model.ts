export interface IBlock {
  _id: string;
  _rev: string;
  objectType: string;
  blockID: number;
  date_received: string;
  date_sent: string;
  previousBlockID: number;
  timestamp: string;
  creator: string;
  content: Array<Array<IBlockContent | string>>;
  tech_date_stored: string;
  generationID: string;
  id: number;
  isNew?: boolean;
}

export enum ETransactionType {
  'OBJECT_TYPE_BOT',
  'OBJECT_TYPE_TRANSACTION'
}

export enum EActivityType {
  carrier = 'carrier',
  producer = 'producer',
  warehouse = 'warehouse',
  shop = 'shop'
}

export enum EJobLevel {
  'producer',
  'variety',
  'carrier',
  'warehouse',
  'shop'
}

export interface IBlockContent {
  objectType: ETransactionType;
  originBot: {
    objectType: ETransactionType;
    emailReception: string;
    emailSending: string;
    emailSendingPort: string;
    IP: string;
    UDPListeningPort: string;
    UDPSendingPort: string;
    botID: string;
    status: boolean;
    date_creation: number;
    note: string;
    reads: string;
    writes: string;
    emmittedTransaction: string;
    validatedTransaction: number;
    network: string;
    tech_date_stored: string;
    _id: string;
    registrationNumber: string;
    publicKey: {
      type: string;
      data: number[];
    };
    activity: EActivityType;
    material: string;
    emmitedTransaction: number;
    entropy: string;
  };
  metadata_lastBlockID: string;
  content: {
    lotId: string;
    quantity: string;
    variety: string;
    gather_date: number;
    status: number;
  };
  creationDate: number;
  tech_date_stored: string;
  _id: string;
  id: string;
}

export class LotIdRegistry {
  constructor(public carrier: string = '', public warehouse: string = '') {}
}
