import {
    PocketType,
    RatesType,
    ExchangeActionTypes,
    LOAD_POCKETS_END,
    LOAD_FX_DATA_END,
    EXCHANGE_START,
    EXCHANGE_END,
} from './types';
import * as SeamlessImmutable from "seamless-immutable";
import {IRootState} from "store/reducers";
import {from} from "seamless-immutable";

export interface IExchangeState {
    pockets: PocketType[],
    rates: RatesType | null,
    exchangeInProgress: boolean,
}
export type ExchangeStateType = SeamlessImmutable.Immutable<IExchangeState>;

const initialState: ExchangeStateType = SeamlessImmutable({
    pockets: null,
    rates: null,
    exchangeInProgress: false
});

export const reduce = (state: ExchangeStateType = initialState, action: ExchangeActionTypes): ExchangeStateType =>  {
    switch (action.type) {
        case LOAD_POCKETS_END:
            return state.merge({
                pockets: action.data,
            });
        case LOAD_FX_DATA_END:
            return state.merge({
                rates: action.data,
            });
        case EXCHANGE_START:
            return state.merge({
                exchangeInProgress: true,
            });
        case EXCHANGE_END:
            // demo only
            const pockets = state.pockets.asMutable({deep: true});
            const fromPocket = pockets.find(elem => elem.currency === action.fromCurrency);
            const toPocket = pockets.find(elem => elem.currency === action.toCurrency);
            fromPocket.value -= action.fromValue;
            const inUsd = (1 / state.rates[action.fromCurrency]) * action.fromValue;
            const newValue = toPocket.value + (state.rates[action.toCurrency] * inUsd);
            toPocket.value = Number(newValue.toFixed(2));
            return state.merge({
                exchangeInProgress: false,
                pockets: pockets,
            });
            // return state.merge({
            //     exchangeInProgress: false,
            //     pockets: action.pockets,
            // });
        default:
            return state
    }
};

export function getPockets(state: IRootState) {
    return state.exchange.pockets
}

export function getRates(state: IRootState) {
    return state.exchange.rates
}

export function isExchangeInPropgress(state: IRootState) {
    return state.exchange.exchangeInProgress
}
