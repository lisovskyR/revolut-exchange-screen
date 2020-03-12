import {ExchangeStateType, reduce as exchangeReduce} from "./Exchange/reducer"
import {ExchangeActionTypes} from "./Exchange/types";

export interface IRootState {
   exchange: ExchangeStateType,
}

interface IReducers {
   exchange: (state: ExchangeStateType, action: ExchangeActionTypes) => ExchangeStateType
}

export const reducers: IReducers = {
   exchange: exchangeReduce,
};
