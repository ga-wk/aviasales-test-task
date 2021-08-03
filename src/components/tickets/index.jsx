import './index.css';
import { ticketsConst } from '../../constants/tickets';
import { useEffect, useState } from 'react';

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
		//Время туда-обратно
		const sdate = new Date(ticket.segments[i].date)
		const sTime = getTime(sdate);
		const fdate = new Date(Date.parse(sdate) + ticket.segments[i].duration * 60 * 1000);
		const fTime = getTime(fdate);
		originDestinationTime.push({ sTime, fTime })

		//Время в пути
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

		//Пересадки
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
	const [position, setPosition] = useState(5);
	const tickets = dirtyTickets.filter(t => ~currentStops.indexOf(t.segments[0].stops.length + 1) && ~currentStops.indexOf(t.segments[1].stops.length + 1))
		.sort((a, b) => {
			switch (currentTab) {
				case 0:
					return a.price - b.price;
				case 1:
					return a.segments[0].duration - b.segments[0].duration;
				default:
					break;
			}
		});

	function addMoreTickets() {
		const ticketsEl = [];
		for (let i = 0; i < 5; i++) {
			ticketsEl.push(
				<li className="tickets-list__item" key={position + i}>
					<Ticket ticket={tickets[i]} />
				</li>
			);
		}

		setTicketsEl(state => state.concat(ticketsEl));

		setPosition(state => state + 10)
	}

	const startTicketsEl = [];
	for (let i = 0; i < 5; i++) {
		startTicketsEl.push(
			<li className="tickets-list__item" key={i}>
				<Ticket ticket={tickets[i]} />
			</li>
		);
	}

	const [ticketsEl, setTicketsEl] = useState(startTicketsEl);

	useEffect(() => {
		const startTicketsEl = [];
		for (let i = 0; i < 5; i++) {
			startTicketsEl.push(
				<li className="tickets-list__item" key={i}>
					<Ticket ticket={tickets[i]} />
				</li>
			);
		}
		setTicketsEl(startTicketsEl);
	}, [currentTab, currentStops]);

	return (
		<>
			<ul className="tickets-list">
				{ticketsEl}
			</ul>

			<button
				className="more-tickets"
				onClick={addMoreTickets}
			>
				Показать еще 5 билетов!
			</button>
		</>
	);
}

export default Tickets;
