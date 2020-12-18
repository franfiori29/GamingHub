import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import StarRatings from "react-star-ratings";

import { Btn } from '../../styles/styled_global';
import { GameDetail, StyledSVG } from '../../styles/styled_product';

import cart from '../../../assets/img/cart.svg'
import joystick from '../../../assets/img/joystick.svg'
import { IMAGE_NOT_FOUND } from '../../../utils/constants';

import strings from './strings.js'

export const ProductDetail = ({ product }) => {
	const [quantity, setQuantity] = useState(1);
	const language = useSelector(state => state.globalReducer.language);
	const [currentImg, setCurrentImg] = useState(0);

	function handleImage() {
		if (currentImg >= product.images.length - 1) {
			setCurrentImg(0);
		} else {
			setCurrentImg(prev => prev + 1)
		}
	};

	function handleQuantityChange(amount) {
		// Amount equals +1 or -1 
		const newValue = quantity + amount;
		if (newValue <= product.stock && newValue >= 1 && newValue <= 99) {
			setQuantity((prev) => prev + amount);
		}
	};

	return (
		<GameDetail>
			<div className="game__img">
				<img src={product.images[currentImg] ? product.images[currentImg].url
					: IMAGE_NOT_FOUND} onClick={handleImage} alt={`${product.name}`} />
			</div>
			<div className="game__info">
				<h1 className="game__title">{product.name}</h1>
				<ul className="game__categories">
					{product.categories.map(category => (
						<li key={category.id} className="game__category">{category[`name_${language}`].toUpperCase()}</li>
					))}
				</ul>
				<div className="game__container-price-score">
					<p className="game__price">${product.price}</p>
					<span className="game__star-container">
						<StarRatings
							rating={product.score}
							starRatedColor="var(--clr-dark)"
							starDimension="1.5em"
							starSpacing="0"
						/>
					</span>
				</div>
				<p className="game__description">{product[`description_${language}`]}</p>
				{product.stock ?
					<>
						<div className="game__quantity">
							<span>{strings[language].amount}</span>
							<button className="game__quantitybutton" onClick={() => handleQuantityChange(-1)}>-</button>
							<span className="game__quantityvalue">{quantity}</span>
							<button className="game__quantitybutton" onClick={() => handleQuantityChange(1)}>+</button>
							<span>{quantity > 1 ? strings[language].units : strings[language].unit}</span>
						</div>
						<p className="game__stock">Stock: {product.stock}</p>
					</>
					:
					null}
				<div className="game__purchase-container">
					{product.stock ?
						<div className="game__buttons">
							<Btn className="btn-ppal btn-img">
								{strings[language].buy_now}
								<StyledSVG src={joystick} />
							</Btn>
							<Btn className="btn-sec btn-img">
								{strings[language].add_to_cart}
								<StyledSVG src={cart} />
							</Btn>
						</div>
						:
						<span>Sin stock</span>
					}
					<img className="game__payment-methods-icons" src="https://d31dn7nfpuwjnm.cloudfront.net/images/valoraciones/0033/3717/Que_tarjetas_acepta_Mercado_Pago.jpg?1552322626" alt="Medios de Pago" />
				</div>
			</div>
		</GameDetail>
	)
}
