import { useState } from 'react';
import logo from '../../svg/logo.svg';
import Filter from '../filter';
import Tabs from '../tabs';
import './index.css';

function Main() {
  const [stops, setStops] = useState([2, 3, 4]);
  const [tab, setTab] = useState(0)

  return (
    <div className="page">
      <header className="header">
        <img src={logo} className="main-logo" alt="logo" />
      </header>
      <main className="content">
        <aside className="content__filter">
          <Filter currentStops={stops} setNewStops={setStops} />
        </aside>
        <article className="content__results">
          <header className="content__tabs">
            <Tabs currentTab={tab} setNewTab={setTab} />
          </header>
          <section className="content__tickets">
            {tab} {stops.toString()}
          </section>
        </article>
      </main>
    </div>
  );
}

export default Main;