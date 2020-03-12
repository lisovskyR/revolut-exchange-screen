export const LOAD_POCKETS_START = "exchange.loadPocketsStart";
export const LOAD_POCKETS_END = "exchange.loadPocketsEnd";
export const LOAD_FX_DATA_START = "exchange.loadFXDataStart";
export const LOAD_FX_DATA_END = "exchange.loadFXDataEnd";
export const EXCHANGE_START = "exchange.start";
export const EXCHANGE_END = "exchange.end";

export type RatesType = {
	[key: string]: number,
}

export type PocketType = {
	currency: string,
	symbol: string,
	value: number,
}

export interface LoadPocketsStartAction {
	type: typeof LOAD_POCKETS_START,
}

export interface LoadPocketsEndAction {
	type: typeof LOAD_POCKETS_END,
	data: PocketType[],
}

export interface LoadFxDataStartAction {
	type: typeof LOAD_FX_DATA_START,
}

export interface LoadFxDataEndAction {
	type: typeof LOAD_FX_DATA_END,
	data: RatesType,
}

export interface ExchangeStartAction {
	type: typeof EXCHANGE_START,
	fromCurrency: string,
	toCurrency: string,
	fromValue: number,
}

// interface ExchangeEndAction {
// 	type: typeof EXCHANGE_END,
// 	pockets: PocketType[],
// }

// demo only
interface ExchangeEndAction {
	type: typeof EXCHANGE_END,
	fromCurrency: string,
	toCurrency: string,
	fromValue: number,
}

export type ExchangeActionTypes =
	LoadPocketsStartAction |
	LoadPocketsEndAction |
	LoadFxDataStartAction |
	LoadFxDataEndAction |
	ExchangeStartAction |
	ExchangeEndAction;

