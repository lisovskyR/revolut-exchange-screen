import {all} from "redux-saga/effects";
import exchangeSaga from "./Exchange/actions"

export default function* rootSaga() {
    yield all([
        exchangeSaga()
    ])
}
