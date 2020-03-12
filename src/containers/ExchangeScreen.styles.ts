import {keyframes, stylesheet} from "typestyle";
import background from 'assets/images/background.png';

const blinkingBorderAnimation = keyframes({
	'0%': {
		borderColor: 'transparent',
	},
	'50%': {
		borderColor: 'white',
	},
	'100%': {
		borderColor: 'transparent',
	}
});

export const exchangeStyles = stylesheet({
	exchangeScreen: {
		// desktop view
		maxWidth: 350,
		maxHeight: 700,
		width: '100%',
		height: '100%',
		display: 'flex',
		flexFlow: 'column',
		backgroundImage: `url(${background})`,
		backgroundSize: 'cover',
	},
	spinnerWrapper: {
		width: '100%',
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	header: {
		padding: '1rem',
		display: 'flex',
		justifyContent: 'space-between',
	},
	headerButton: {
		cursor: 'pointer',
		padding: '5px 0',
	},
	headerButtonDisabled: {
		color: '#c0c0c0',
	},
	exchangeRate: {
		border: '1px solid rgba(255, 255, 255, 0.5)',
		borderRadius: 5,
		background: 'rgba(0, 0, 0, 0.2)',
		padding: '5px 10px',
	},
	smallText: {
		fontSize: 13,
	},
	content: {
		display: 'flex',
		flexFlow: 'column',
		flexGrow: 1,
	},
	contentInner: {
		flexGrow: 0.5,
		display: 'flex',
		flexFlow: 'column',
		$nest: {
			'.slick-list': {
				flexGrow: 1,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
			}
		}
	},
	contentInnerTo: {
		background: 'rgba(0, 0, 0, 0.2)',
		clipPath: 'polygon(50% 7.07%, 55% 0, 100% 0, 100% 100%, 0 100%, 0 0, 45% 0)',
	},
	slider: {
		width: '100%',
		height: '100%',
		display: 'flex',
		flexFlow: 'column',
		$nest: {
			'.slick-dots': {
				display: 'block',
				position: 'absolute',
				bottom: '1rem !important',
				$nest: {
					'button::before': {
						color: '#fff !important',
						fontSize: 8,
					}
				}
			}
		}
	},
	sliderInner: {
		outline: 'none',
	},
	column: {
		width: '50%',
		display: 'flex',
		flexWrap: 'wrap',
		$nest: {
			'> div': {
				width: '100%',
			}
		}
	},
	currencyValueWrapper: {
		display: 'flex',
		alignItems: 'center',
	},
	valueInput: {
		outline: 'none',
		border: 0,
		background: 'transparent',
		width: '100%',
		fontSize: '3rem',
		textAlign: 'right',
		color: 'transparent',
		textShadow: '0 0 0 white',
	},
	valueInputAnimation: {
		borderRight: '3px solid #fff',
		animationName: blinkingBorderAnimation,
		animationDuration: '1.5s',
		animationIterationCount: 'infinite',
		animationTimingFunction: 'ease-in-out',
	},
	sliderRow: {
		padding: '0 24px',
		display: 'flex',
	},
	currencyName: {
		fontSize: '3rem',
	},
	currencyCurrentValue: {
		marginTop: '1rem',
		fontSize: '1rem',
	},
	currencyToValue: {
		width: '100%',
		whiteSpace: 'nowrap',
		textAlign: 'right',
		fontSize: '3rem',
	},
});
