import './index.css';
import { ticketsConst } from '../../constants/tickets';
import { useCallback, useEffect, useState } from 'react';

function Ticket({ ticket }) {
	if (!ticket) return <></>

	function getTime(date) {
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const time = `${hours / 10 < 1 ? `0${hours}` : hours}:${minutes / 10 < 1 ? `0${minutes}` : minutes}`;
		return time;
	}

	const stop = [];
	const originDestinationTime = [];
	const travelTime = []
	const tableRows = []

	for (let i = 0; i < 2; i++) {
		// Round trip time
		const sdate = new Date(ticket.segments[i].date)
		const sTime = getTime(sdate);
		const fdate = new Date(Date.parse(sdate) + ticket.segments[i].duration * 60 * 1000);
		const fTime = getTime(fdate);
		originDestinationTime.push({ sTime, fTime })

		// Travel time
		const minutes = ticket.segments[i].duration > 60 ?
			ticket.segments[i].duration % 60 :
			ticket.segments[i].duration;

		const hours = (ticket.segments[i].duration / 60).toFixed(0) > 24 ?
			(ticket.segments[i].duration / 60 % 24).toFixed(0) :
			(ticket.segments[i].duration / 60).toFixed(0);

		const days = (ticket.segments[i].duration / 60 / 24).toFixed(0) < 1 ?
			0 :
			(ticket.segments[i].duration / 60 / 24).toFixed(0);

		const tTime = `${days > 0 ? days + "д" : ""} ${hours}ч ${minutes}м`;
		travelTime.push(tTime);

		// Transplants
		stop.push(ticketsConst.stops[ticket.segments[i].stops.length]);

		tableRows.push(
			<>
				<thead className="ticket__title">
					<tr>
						<th>{ticket.segments[i].origin} - {ticket.segments[i].destination}</th>
						<th>В пути</th>
						<th>{stop[i]}</th>
					</tr>
				</thead>
				<tbody className="ticket__body">
					<tr>
						<td>{originDestinationTime[i].sTime} - {originDestinationTime[i].fTime}</td>
						<td>{travelTime[i]}</td>
						<td>{ticket.segments[i].stops.join()}</td>
					</tr>
				</tbody>
			</>
		)
	}

	return (
		<div className="ticket">
			<header className="ticket__header">
				<span className="ticket__price">
					{new Intl.NumberFormat('ru-RU').format(ticket.price)} Р
				</span>
				<img src={`//pics.avs.io/99/36/${ticket.carrier}.png`} alt={`Код авиакомпании ${ticket.carrier}`} />
			</header>

			<table className="ticket__table" cellPadding="4" cellSpacing="1">
				{tableRows.map(r => r)}
			</table>
		</div>
	)
}

function Tickets({ currentTab, currentStops, dirtyTickets }) {
	const [position, setPosition] = useState(0);
	const [ticketsEl, setTicketsEl] = useState([]);

	// The function of adding tickets to the page
	function addTickets(position, tickets) {
		const ticketsEl = [];
		for (let i = 0; i < 5; i++) {
			ticketsEl.push(
				<li className="tickets-list__item" key={position + i + "lit"}>
					<Ticket ticket={tickets[i]} />
				</li>
			);
		}

		if (position === 0) {
			setTicketsEl(ticketsEl);
			setPosition(5);
		} else {
			setTicketsEl(state => state.concat(ticketsEl));
			setPosition(state => state + 5);
		}
	}

	// Ticket dropout function
	const filterOut = useCallback((currentTab, currentStops, dirtyTickets) => {
		function average(array) {
			return array.reduce((a, b) => a + b) / array.length
		};

		function getMinAndAverage(arr) {
			return [Math.min.apply(null, arr), average(arr)]
		}
		
		// Filtered first
		let tickets = dirtyTickets
			.filter(t => t.segments.every(s => ~currentStops.indexOf(s.stops.length + 1)));

		// Then sorted
		if (currentStops.length > 0) {
			const allPrice = tickets.map(t => t.price);
			const [ticketsPriceMin, ticketsPriceAverage] = getMinAndAverage(allPrice);

			const allDuration = tickets.map(t => t.segments[0].duration);
			const [ticketsDurationMin, ticketsDurationAverage] = getMinAndAverage(allDuration);

			function getOptimal(a) {
				if (a.price > ticketsPriceMin
					&& a.price < ticketsPriceAverage
					&& a.segments[0].duration > ticketsDurationMin
					&& a.segments[0].duration < ticketsDurationAverage) {
					return 1;
				} else if (a.price < ticketsPriceMin
					&& a.price > ticketsPriceAverage
					&& a.segments[0].duration < ticketsDurationMin
					&& a.segments[0].duration > ticketsDurationAverage) {
					return -1;
				}
				return 0;
			}

			tickets = tickets.sort((a, b) => {
				switch (currentTab) {
					case 0:
						return a.price - b.price;
					case 1:
						return a.segments[0].duration - b.segments[0].duration;
					default:
						return getOptimal(a);
				}
			});
		}

		return tickets;
	}, [])

	const [tickets, setTickets] = useState(filterOut(currentTab, currentStops, dirtyTickets));

	useEffect(() => {
		setTickets(filterOut(currentTab, currentStops, dirtyTickets));
	}, [currentTab, currentStops, dirtyTickets, filterOut]);

	useEffect(() => {
		addTickets(0, tickets);
	}, [tickets]);

	return (
		<>
			<ul className="tickets-list">
				{ticketsEl}
			</ul>

			<button
				className="more-tickets"
				onClick={() => addTickets(position, tickets)}
			>
				Показать еще 5 билетов!
			</button>
		</>
	);
}

export default Tickets;
