import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';

import strings from './strings';
import PurchaseStep3 from '../../../assets/img/purchase-steps-3.svg';

import { StepThree, StyledSVG } from '../../styles/styled_order_detail';
import { Btn } from '../../styles/styled_global';


const Step3 = ({ language }) => {
	const history = useHistory();
	const location = useLocation();
	const queryParams = queryString.parse(location.search);
	const s = strings[language];
	return (
		<StepThree>
			<h2 className="mb-1">{s.details}</h2>
			<StyledSVG className="mb-2" src={PurchaseStep3} />
			{
				(
					queryParams.status === 'completed' &&
					<div className="step__info">
						<i className="far fa-smile-beam step__icon"></i>
						<p>{s.successInfo}</p>
						<p>{s.successOrder} <span>{queryParams.order.padStart(4, 0)}</span></p>
					</div>
				)
				||
				(
					<div className="step__info">
						<i className="far fa-sad-tear step__icon"></i>
						<p>{s.err}</p>
						<p>{s.errText}</p>
						<p>{s.errInfo}</p>
					</div>
				)
			}
			<Btn className="btn btn-ppal mt-1" onClick={() => history.push('/')}>{s.btn}</Btn>
		</StepThree>
	)
}
export default Step3;