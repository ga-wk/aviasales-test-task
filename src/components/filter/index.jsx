import './index.css';
import { filterConst } from '../../constants/filter';
import { useState } from 'react';

function Filter({ currentStops, setNewStops }) {
	const [stops, setStops] = useState(currentStops);

	// Filter item selection function
	function clickHandle(e) {
		const numStops = +e.currentTarget.attributes.num.value;
		let tmpStops = stops.slice();

		if (numStops === 0) {
			// If the item "Все" is active, then the rest of the items are also activated
			// If the item "Все" is activated again, then the rest of the items will become inactive
			if (~stops.indexOf(numStops)) {
				tmpStops = [];
			} else {
				tmpStops = [0, 1, 2, 3, 4];
			}
		} else if (~stops.indexOf(numStops)) {
			tmpStops.splice(stops.indexOf(numStops), 1);
		} else {
			tmpStops.push(numStops);
		}

		if (tmpStops.length === 4 && ~stops.indexOf(0)) {
			tmpStops.splice(stops.indexOf(0), 1);
		}

		if (tmpStops.length === 4) {
			tmpStops.push(0);
		}

		tmpStops = tmpStops.sort((a, b) => a - b);
		setStops(tmpStops);
		setNewStops(tmpStops);

		localStorage.setItem('stops', tmpStops);
	}

	return (
		<div className="filter">
			<p className="filter-title">
				{filterConst.title}
			</p>
			<ul className="filter-menu">
				{filterConst.stops.map((stop, i) =>
					<li
						className={~stops.indexOf(i) ? "filter-menu__item checked" : "filter-menu__item"}
						key={i}
					>
						<button
							className="filter-check"
							num={i}
							onClick={clickHandle}
						>
							{stop}
						</button>
					</li>
				)}
			</ul>
		</div>
	)
}

export default Filter;