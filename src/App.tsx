import * as React from "react";
import 'styles/app.scss';
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css";
import ExchangeScreen from "containers/ExchangeScreen";

export class App extends React.Component {
	render() {
		return <ExchangeScreen />;
	}
}
