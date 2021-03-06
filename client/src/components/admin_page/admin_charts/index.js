import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios';
import { Line, Doughnut } from 'react-chartjs-2';
import { Flex, StyledChart } from '../../styles/styled_global';
import strings from './strings';
import { BEARER, QUERY_FUNCTION } from '../../../redux/constants';
const { REACT_APP_API } = process.env;


const AdminCharts = () => {
	const theme = useSelector(state => state.globalReducer.theme);
	const language = useSelector(state => state.globalReducer.language);
	const s = strings[language];

	const [sales, setSales] = useState([]);
	const [salesCount, setSalesCount] = useState([]);
	const [salesDays, setSalesDays] = useState([]);

	const [guestSales, setGuestSales] = useState(0)
	const [userSales, setUserSales] = useState(0)

	const [monthlyEarning, setMonthlyEarning] = useState(0)

	useEffect(() => {
		let isMounted = true;

		const promiseSales = axios.get(`${REACT_APP_API}/charts/sales${QUERY_FUNCTION({ date: new Date().toISOString() })}`, BEARER())
		const promiseUser = axios.get(`${REACT_APP_API}/charts/user${QUERY_FUNCTION({ date: new Date() })}`, BEARER())
		const promiseEarnings = axios.get(`${REACT_APP_API}/charts/earnings${QUERY_FUNCTION({ date: new Date() })}`, BEARER())

		Promise.all([promiseSales, promiseUser, promiseEarnings])
			.then(dataArray => {
				if (isMounted) {
					setSales(dataArray[0].data);
					setGuestSales(dataArray[1].data.guestSales)
					setUserSales(dataArray[1].data.userSales)
					setMonthlyEarning(dataArray[2].data)
				}
			})

		return () => { isMounted = false };
	}, []);

	const previousDays = function (num) {
		const today = new Date();
		let array = [];
		for (let i = 0; i < num; i++) {
			array.push(new Date(today.getTime() - (86400000 * i)));
		}
		return array;
	}

	useEffect(() => {
		if (sales.length > 0) {

			const lastSevenDays = previousDays(7);
			lastSevenDays.forEach((day, i) => {
				const fullDayOne = `${day.getDate()}/${day.getMonth() + 1}`;
				const found = sales.find(sale => {
					let saleDate = sale.date.slice(0, 10).split('-')
					return new Date(saleDate[0], saleDate[1] - 1, saleDate[2]).toDateString() === new Date(day).toDateString()
				})
				if (found === undefined) setSalesCount(prev => ['0', ...prev]);
				else setSalesCount(prev => [found.count, ...prev]);
				setSalesDays(prev => [fullDayOne, ...prev]);
			});


		}
	}, [sales])
	return (
		<>
			<h1 className="admin-h1">{s.title}</h1>


			<section className="mb-2">
				<h2 className="skinny-title">{s.monthlyEarning} ${monthlyEarning.toFixed(2)}</h2>
			</section>
			<Flex justify='space-between'>
				<StyledChart className="chart-container">
					<h2 className="skinny-title">{s.userSales}</h2>
					<Doughnut
						data={{
							labels: [s.guest, s.user],
							datasets: [{
								label: s.userSales,
								data: [guestSales, userSales],
								backgroundColor: ['#5d72f7', '#d95df7'],
								borderColor: '#1B1A1F',
								color: 'red',
								borderWidth: 1,
							}]
						}}
						options={{
							responsive: true,
							legend: {
								labels: {
									fontColor: theme === 'light' ? '#666' : '#EEE',
								}
							}
						}}
					/>
				</StyledChart>
				<StyledChart className="chart-container">
					<h2 className="skinny-title">{s.weeklySales}</h2>
					<Line
						data={{
							labels: salesDays,
							datasets: [{
								label: s.dailySales,
								data: salesCount,
								backgroundColor: 'transparent',
								borderColor: '#9b5df7',
								borderWidth: 2,
								lineTension: 0,
							}]
						}}
						options={{
							responsive: true,
							legend: {
								labels: {
									fontColor: theme === 'light' ? '#666' : '#EEE',
								}
							},
							scales: {
								yAxes: [{
									ticks: {
										stepSize: 1,
										beginAtZero: true
									}
								}]
							}
						}}
					/>
				</StyledChart>
			</Flex>
		</>
	)
}

export default AdminCharts;
