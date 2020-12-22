import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { StyledSidebarCart, StyledCloseBtn } from '../styles/styled_sidebar_cart';
import { Btn } from '../styles/styled_global';
import BigCloseButton from '../../assets/img/close-transparent.svg';
import Mini from '../product_card/mini';
import strings from './strings';

const CartSideBar = ({ language, order, show, closeCallback }) => {
	useEffect(() => {
		if (show) {
			document.body.style.overflow = 'hidden';
			document.body.style.paddingRight = '15px';
		}
		return () => {
			document.body.style.overflow = 'unset';
			document.body.style.paddingRight = '0px';
		};
	}, [show]);

	let subtotal = 0;

	return ReactDOM.createPortal(
		<StyledSidebarCart>
			<div className="cart__overlay" style={{ display: show ? 'block' : 'none' }} onClick={closeCallback} />
			<div className='modal' style={{ display: show ? 'block' : 'none' }}>
				<button title='Close' className='modal__close' onClick={closeCallback}>
					<StyledCloseBtn src={BigCloseButton} />
				</button>
				<h2 className='modal__title'>{strings[language].your_cart}</h2>
				{!!order.length && order.map(purchase => {
					subtotal = purchase.price * purchase.quantity + subtotal;
					return (
						<Mini productDetail={purchase} key={purchase.id} />
					)
				})}
				<hr />
				<div className='modal__subtotal'>
					<p>Subtotal:</p>
					<p>${subtotal.toFixed(2)}</p>
				</div>
				<Btn className='btn btn-ppal'>{strings[language].checkout}</Btn>
			</div>
		</StyledSidebarCart>,
		document.getElementById('cartModal')
	);
};

// CartSideBar.defaultProps = {
// 	order: [{
// 		id: 1,
// 		name: 'Final Fantasy VII Remake',
// 		price: 52.38,
// 		images: [
// 			{
// 				url: 'https://images.goodgam.es/WKE-gd3lr40/enlarge:1/plain/covers/17-final-fantasy-vii-remake-cover.jpg'
// 			}
// 		]
// 	},
// 	{
// 		id: 2,
// 		name: 'FIFA 21',
// 		price: 40.72,
// 		images: [
// 			{
// 				url: 'https://i.imgur.com/RKCvcWJ.jpg'
// 			}
// 		],
// 	}
// 	],
// 	show: false,
// 	closeCallback: false
// }

export default CartSideBar;