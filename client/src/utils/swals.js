import Swal from 'sweetalert2';
const OK = (title, text, btn = 'Ok') => {
	return Swal.fire({
		heightAuto: false,
		title: title,
		text: text,
		icon: 'success',
		confirmButtonColor: '#3085d6',
		confirmButtonText: btn,
	})
}
const WARNING = (title, text, btn = 'Ok') => {
	return Swal.fire({
		heightAuto: false,
		title: title,
		text: text,
		icon: 'warning',
		confirmButtonColor: '#3085d6',
		confirmButtonText: btn,
	})
}

export default { OK: OK, WARNING: WARNING }