import React, { useState, useEffect } from 'react'
import { addSerial, clearErrorSerial } from '../../../../redux/actions/products_actions';
import { Btn, FormStyled } from '../../../styles/styled_global'
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import strings from './strings';

const AdminProductStockForm = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const history = useHistory();
	const language = useSelector(state => state.globalReducer.language);
	const s = strings[language];
	const error = useSelector(state => state.productsReducer.serials.error);
	const serials = useSelector(state => state.productsReducer.serials.list);

	let [serial, setSerial] = useState('');
	let [success, setSuccess] = useState(false);

	const handleInput = (ev) => {
		ev.persist();
		setSerial(ev.target.value);
	}

	const handleSubmit = (ev) => {
		ev.preventDefault();
		let serialArray = serial.split('\n').map(s => s.trim());
		serialArray = [...new Set(serialArray)];
		if (serialArray.every(ser => ser.length === 20)) {
			dispatch(addSerial({ productId: id, serials: serialArray }));
			setSerial('');
			setSuccess(true);
		}
	}

	useEffect(() => {
		if (success) history.push(`/admin/product/${id}/stock`)
	}, [serials, id, history, success])

	useEffect(() => {
		error && Swal.fire({
			heightAuto: false,
			title: s.alertTitle,
			text: `${s.alertTitle} ${error.value}`,
			icon: 'warning',
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: s.alertButton,
		}).then(() => {
			dispatch(clearErrorSerial())
		})
	}, [error, dispatch, s.alertButton, s.alertTitle])

	return (
		<>
			<h1 className="admin-h1">{s.title}</h1>
			<p style={{ marginBottom: '2em' }}>{s.desc}</p>
			<FormStyled onSubmit={handleSubmit} method="POST" autoComplete="off">
				<label>
					<span>Serials:</span>
					<textarea type='text' name='serial' value={serial} onChange={handleInput} required>
					</textarea>
				</label>
				<Btn type='submit' className="btn-ppal">{s.addButton}</Btn>
			</FormStyled>
		</>
	)
}

export default AdminProductStockForm
