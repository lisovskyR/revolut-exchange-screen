import * as React from "react";
import {connect} from "react-redux";
import Slider from "react-slick";
import {getPockets, getRates, isExchangeInPropgress} from "store/Exchange/reducer";
import {LOAD_FX_DATA_START, EXCHANGE_START, LOAD_POCKETS_START} from "store/Exchange/types";
import {PocketType, RatesType} from "store/Exchange/types";
import {IRootState} from "store/reducers";
import {Dispatch} from "redux";
import {ChangeEvent} from "react";
import {classes} from "typestyle";
import {Spinner} from "components/Spinner";
import {exchangeStyles} from "./ExchangeScreen.styles";
import {ImmutableArray, ImmutableObject} from "seamless-immutable";

interface IExchangeScreen {
    pockets: ImmutableArray<PocketType>,
    rates: ImmutableObject<RatesType>,
    exchangeInProgress: boolean,
    loadPockets: () => void,
    loadFxData: () => void,
    doExchange: (fromCurrency: string, fromValue: number, toCurrency: string) => void,
}

type FocusSideType = 'from' | 'to';

interface IExchangeScreenState {
    currencyFrom: string,
    valueFrom: string,
    valueTo: string,
    currencyTo: string,
    currentRate: number | null,
    fontSizeFrom: number,
    fontSizeTo: number,
    focusSide: FocusSideType,
}

const DEFAULT_FONT_SIZE = 42;
const MAX_INPUT_LENGTH = 10;

export class ExchangeScreen extends React.Component<IExchangeScreen> {
    private requestFXInterval: number | null = null;
    private sliderToRef: Slider = null;
    private contentRef: HTMLDivElement = null;

    public state: IExchangeScreenState = {
        currencyFrom: '',
        valueFrom: '',
        valueTo: '',
        currencyTo: '',
        currentRate: null,
        fontSizeFrom: DEFAULT_FONT_SIZE,
        fontSizeTo: DEFAULT_FONT_SIZE,
        focusSide: 'from',
    };

    public componentDidMount() {
        this.requestFXInterval = window.setInterval(() => {
            this.props.loadFxData()
        }, 10 * 1000);
        this.props.loadFxData();
        this.props.loadPockets();
    }

    public componentWillUnmount() {
        clearInterval(this.requestFXInterval);
    }

    public componentDidUpdate(prevProps: IExchangeScreen) {
        // do first calculate when all data is loaded and initial currency from/to has been set
        if (!prevProps.pockets && this.props.pockets) {
            this.setState({
                currencyFrom: this.props.pockets[0].currency,
                currencyTo: this.props.pockets[1].currency,
            }, () => this.props.rates && this.calculateRates())
        }
        if (prevProps.rates === null && this.props.rates !== null && this.state.currencyFrom) {
            this.calculateRates();
        }
        if (prevProps.exchangeInProgress && !this.props.exchangeInProgress) {
            this.setState({
                valueFrom: '',
            })
        }
    }

    private calculateRates() {
        const inUSD = this.pocketFrom.currency === "usd" ? 1 : (1 / this.props.rates[this.pocketFrom.currency]);
        const inConvert = inUSD * this.props.rates[this.pocketTo.currency];
        this.setState({
            currentRate: inConvert,
        })
    }

    private get isLoading(): boolean {
        return !this.props.pockets || !this.props.rates || !this.state.currentRate;
    }

    private get pocketFrom(): PocketType {
        return this.props.pockets.find(elem => elem.currency === this.state.currencyFrom);
    }

    private get pocketTo(): PocketType {
        return this.props.pockets.find(elem => elem.currency === this.state.currencyTo);
    }

    private calculateFontSize(str: string): number {
        const fieldWidth = (this.contentRef.offsetWidth - 48) / 2;
        return (fieldWidth / str.length * 1.3) > DEFAULT_FONT_SIZE
            ? DEFAULT_FONT_SIZE
            : fieldWidth / str.length * 1.3;
    }

    private inputFromChange = (event: ChangeEvent<HTMLInputElement>): void => {
        let newValue = event.target.value.includes("-") ? event.target.value.slice(2) : event.target.value;
        if (!/^\d*$|^\d*\.\d*$/.test(newValue)) {
            return;
        }
        // reset input when user has typed too much symbols
        if (newValue.length > MAX_INPUT_LENGTH) {
            newValue = '';
        }
        const inUSD = this.pocketFrom.currency === "usd" ? 1 : (1 / this.props.rates[this.pocketFrom.currency]);
        const inConvert = inUSD * this.props.rates[this.pocketTo.currency];
        const convertedValue = Number(newValue) * inConvert;
        const convertedValueText = convertedValue.toFixed(2);
        this.setState({
            valueFrom: newValue,
            valueTo: convertedValueText,
            currentRate: inConvert,
            fontSizeFrom: this.calculateFontSize(newValue),
            fontSizeTo: this.calculateFontSize(convertedValueText),
        })
    };

    private inputToChange = (event: ChangeEvent<HTMLInputElement>): void => {
        let newValue = event.target.value.includes("+") ? event.target.value.slice(2) : event.target.value;
        if (!/^\d*$|^\d*\.\d*$/.test(newValue)) {
            return;
        }
        // reset input when user has typed too much symbols
        if (newValue.length > MAX_INPUT_LENGTH) {
            newValue = '';
        }
        const inUSD = this.pocketTo.currency === "usd" ? 1 : (1 / this.props.rates[this.pocketTo.currency]);
        const inConvert = inUSD * this.props.rates[this.pocketFrom.currency];
        const convertedValue = Number(newValue) * inConvert;
        const convertedValueText = convertedValue.toFixed(2);
        this.setState({
            valueTo: newValue,
            valueFrom: convertedValueText,
            currentRate: inConvert,
            fontSizeTo: this.calculateFontSize(newValue),
            fontSizeFrom: this.calculateFontSize(convertedValueText),
        })
    };

    private changeFrom = (index: number): void => {
        const newCurrencyFrom = this.props.pockets[index].currency;
        let newCurrencyTo = this.state.currencyTo;
        if (newCurrencyTo === newCurrencyFrom) {
            let pocket = this.props.pockets.find(elem => {
                return elem.currency !== newCurrencyFrom
            });
            newCurrencyTo = pocket.currency;
            this.sliderToRef.slickGoTo(0);
        }
        this.setState({
            currencyFrom: newCurrencyFrom,
            currencyTo: newCurrencyTo
        }, this.calculateRates);
    };

    private changeTo = (index: number): void => {
        let pocketsWithoutFrom: PocketType[] = [];
        this.props.pockets.forEach(elem => {
            if (elem.currency !== this.state.currencyFrom) {
                pocketsWithoutFrom.push(elem)
            }
        });
        this.setState({
            currencyTo: pocketsWithoutFrom[index].currency
        }, this.calculateRates);
    };

    private exchangeClick = (): void => {
        if (this.pocketFrom.value < Number(this.state.valueFrom)) {
            window.alert("You don't have enough money on your pocket");
            return;
        }
        this.props.doExchange(this.state.currencyFrom, Number(this.state.valueFrom), this.state.currencyTo);
    };

    private get header(): React.ReactNode {
        const {currentRate, valueFrom} = this.state;
        return (
            <div className={exchangeStyles.header}>
                <div className={exchangeStyles.headerButton}>
                    Cancel
                </div>
                <div className={exchangeStyles.exchangeRate}>
                    <div>
                        {this.pocketFrom.symbol}1 = {this.pocketFrom.symbol}{currentRate.toFixed(2)}
                        <span className={exchangeStyles.smallText}>{currentRate.toFixed(4).substr(-2)}</span>
                    </div>
                </div>
                <div
                    className={classes(exchangeStyles.headerButton, !valueFrom && exchangeStyles.headerButtonDisabled)}
                    onClick={() => valueFrom && this.exchangeClick()}
                >
                    Exchange
                </div>
            </div>
        )
    }

    private fromSideClick() {
        this.setState({
            focusSide: 'from',
        })
    }

    private toSideClick() {
        this.setState({
            focusSide: 'to',
        })
    }

    private get content(): React.ReactNode {
        return (
            <div className={exchangeStyles.content} ref={el => this.contentRef = el}>
                <div className={exchangeStyles.contentInner} onClick={() => this.fromSideClick()}>
                    <Slider
                        className={exchangeStyles.slider}
                        dots={true}
                        arrows={false}
                        speed={500}
                        infinite={false}
                        afterChange={index => this.changeFrom(index)}
                    >
                        {this.props.pockets.map(elem => {
                            return (
                                <div key={elem.currency} className={exchangeStyles.sliderInner}>
                                    <div className={exchangeStyles.sliderRow}>
                                        <div className={exchangeStyles.column}>
                                            <div className={exchangeStyles.currencyName}>
                                                {elem.currency.toUpperCase()}
                                            </div>
                                        </div>
                                        <div className={exchangeStyles.column}>
                                            <div className={exchangeStyles.currencyValueWrapper}>
                                                <input
                                                    className={classes(
                                                        exchangeStyles.valueInput,
                                                        (this.state.focusSide === 'from'
                                                            && elem.currency === this.state.currencyFrom
                                                        ) && exchangeStyles.valueInputAnimation
                                                    )}
                                                    onChange={this.inputFromChange}
                                                    style={{fontSize: this.state.fontSizeFrom}}
                                                    value={this.state.valueFrom ? `- ${this.state.valueFrom}` : ""}
                                                    autoFocus={this.state.focusSide === 'from'
                                                        && elem.currency === this.state.currencyFrom
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={exchangeStyles.column}>
                                        <div className={exchangeStyles.sliderRow}>
                                            <div className={exchangeStyles.currencyCurrentValue}>
                                                You have {elem.value}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </Slider>
                </div>
                <div
                    className={classes(exchangeStyles.contentInner, exchangeStyles.contentInnerTo)}
                    onClick={() => this.toSideClick()}
                >
                    <Slider
                        ref={el => this.sliderToRef = el}
                        className={exchangeStyles.slider}
                        dots={true}
                        arrows={false}
                        speed={500}
                        infinite={false}
                        afterChange={index => this.changeTo(index)}
                    >
                        {this.props.pockets.map(elem => {
                            if (this.state.currencyFrom === elem.currency) {
                                return null
                            }
                            return (
                                <div key={elem.currency} className={exchangeStyles.sliderInner}>
                                    <div className={exchangeStyles.sliderRow}>
                                        <div className={exchangeStyles.column}>
                                            <div className={exchangeStyles.currencyName}>
                                                {elem.currency.toUpperCase()}
                                            </div>
                                        </div>
                                        <div className={exchangeStyles.column}>
                                            <div className={exchangeStyles.currencyValueWrapper}>
                                                <input
                                                    className={classes(
                                                        exchangeStyles.valueInput,
                                                        (this.state.focusSide === 'to'
                                                            && elem.currency === this.state.currencyTo
                                                        ) && exchangeStyles.valueInputAnimation
                                                    )}
                                                    style={{fontSize: this.state.fontSizeTo}}
                                                    value={this.state.valueTo ? `+ ${this.state.valueTo}` : ""}
                                                    onChange={this.inputToChange}
                                                    autoFocus={this.state.focusSide === 'to'
                                                        && elem.currency === this.state.currencyTo
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={exchangeStyles.sliderRow}>
                                        <div className={exchangeStyles.currencyCurrentValue}>
                                            You have {elem.value}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </Slider>
                </div>
            </div>
        )
    }

    private get page(): React.ReactNode {
        if (this.isLoading) {
            return (
                <div className={exchangeStyles.spinnerWrapper}>
                    <Spinner />
                </div>
            )
        }
        return (
            <>
                {this.header}
                {this.content}
            </>
        )
    }

    public render() {
        return (
            <div className={exchangeStyles.exchangeScreen}>
                {this.page}
            </div>
        )
    }
}

function mapStateToProps(state: IRootState) {
    return {
        pockets: getPockets(state),
        rates: getRates(state),
        exchangeInProgress: isExchangeInPropgress(state)
    }
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        loadPockets: () => dispatch({type: LOAD_POCKETS_START}),
        loadFxData: () => dispatch({type: LOAD_FX_DATA_START}),
        doExchange: (fromCurrency: string, fromValue: number, toCurrency: string) =>
            dispatch({type: EXCHANGE_START, fromCurrency, fromValue, toCurrency})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeScreen)

