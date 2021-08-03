import { useState, useEffect } from 'react';
import { mainConst } from '../../constants/main';
import logo from '../../svg/logo.svg';
import Filter from '../filter';
import Tabs from '../tabs';
import './index.css';

async function fetchDataGet(url, success, fail) {
  try {
    const response = await fetch(url);
    const json = await response.json();
    success(json);
  } catch (error) {
    fail(error);
  }
}

function Main() {
  const [stops, setStops] = useState([2, 3, 4]);
  const [tab, setTab] = useState(0);

  const [searchId, setSearchId] = useState(undefined);
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTry, setIsTry] = useState(0);
  const [isError, setIsError] = useState(undefined);

  useEffect(() => {
    fetchDataGet(mainConst.getSearchId, (data) => {
      setSearchId(data["searchId"]);
    }, (error) => {
      setIsError(error);
    });
  }, []);

  useEffect(() => {
    if (searchId) {
      fetchDataGet(mainConst.getTickets + `?searchId=${searchId}`, (data) => {
        console.log(data);
        if (data) {
          setTickets(state => state.concat(data["tickets"]));
          if (!data["stop"]) {
            setIsTry(state => state + 1);
          }
          setIsLoading(data["stop"]);
        }
      }, (error) => {
        console.error(error);
        setIsTry(state => state + 1);
      });
    }
  }, [searchId, isTry]);

  return (
    <>
      {isError ? <div>Ошибка {isError}</div>
        : !isLoading ? (
          <div>Загрузка</div>
        ) :
          (
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
                    {tab} {stops.toString()} {tickets.toString()}
                  </section>
                </article>
              </main>
            </div>
          )}
    </>
  );
}

export default Main;