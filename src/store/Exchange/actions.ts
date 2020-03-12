import {
    LoadPocketsStartAction,
    LoadFxDataStartAction,
    ExchangeStartAction,
    LOAD_POCKETS_END,
    LOAD_FX_DATA_END,
    EXCHANGE_END,
    LOAD_POCKETS_START,
    LOAD_FX_DATA_START,
    EXCHANGE_START,
} from "./types"
import {takeLatest, call, put, all} from "redux-saga/effects";

/* WORKERS */

function* loadPockets(action: LoadPocketsStartAction) {
    const responseData = yield call(() => {
        return new Promise((resolve, reject) => {
            // only for demo
            resolve([
                {
                    currency: 'gbp',
                    value: 73.22,
                },
                {
                    currency: 'eur',
                    value: 22.89,
                },
                {
                    currency: 'usd',
                    value: 123.10,
                }
            ])
        })
    });
    yield put({type: LOAD_POCKETS_END, data: responseData});
}

function* loadFXData(action: LoadFxDataStartAction) {
    // const response = yield call(() => {
    //     return fetch("https://openexchangerates.org/api/latest.json?app_id=c35e8469e45c4db28288ad1d6c413d62")
    // });
    // if (response.status === 200) {
    //     let responseData = yield call(() => {
    //         return response.json()
    //     });
    //     yield put({type: LOAD_FX_DATA_END, data: responseData.rates})
    // }
    const responseData = yield call(() => {
        return new Promise((resolve, reject) => {
            // only for demo
            resolve({
                eur: 0.8947,
                gbp: 0.7938,
                rur: 74.0981,
            })
        })
    });
    yield put({type: LOAD_FX_DATA_END, data: responseData})
}

function* doExchange(action: ExchangeStartAction) {
    // only for demo
    window.alert('Exchange successful');
    yield put({type: EXCHANGE_END, fromCurrency: action.fromCurrency, toCurrency: action.toCurrency, fromValue: action.fromValue})
}

/* WATCHERS */

function* watchLoadPockets() {
    yield takeLatest(LOAD_POCKETS_START, loadPockets)
}

function* watchLoadFXData() {
    yield takeLatest(LOAD_FX_DATA_START, loadFXData)
}

function* watchDoExchange() {
    yield takeLatest(EXCHANGE_START, doExchange)
}

export default function* root() {
    yield all([
        watchLoadPockets(),
        watchLoadFXData(),
        watchDoExchange()
    ])
}
