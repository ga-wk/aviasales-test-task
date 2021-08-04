import { useState, useEffect } from 'react';
import { mainConst } from '../../constants/main';
import logo from '../../svg/logo.svg';
import Filter from '../filter';
import Tabs from '../tabs';
import Tickets from '../tickets';
import './index.css';

/**
 * Function for sending a get request
 * @param {String} url - Address "get" request
 * @param {Function} success - Function to be called on success
 * @param {Function} fail - Function to be called in case of failure
 */
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
  // Filter and sort parameters are stored in localStorage
  // If they are not in localStorage, then the standard parameters are selected
  const [stops, setStops] = useState(localStorage.getItem('stops').split(",").map(n => +n) ?? [0, 1, 2, 3, 4]);
  const [tab, setTab] = useState(+localStorage.getItem('tabs') ?? 0);

  const [searchId, setSearchId] = useState(undefined);
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTry, setIsTry] = useState(0);
  const [isError, setIsError] = useState(undefined);


  useEffect(() => {
    // Getting SearchId
    fetchDataGet(mainConst.urlGetSearchId, (data) => {
      setSearchId(data["searchId"]);
    }, (error) => {
      setIsError(error);
    });
  }, []);

  useEffect(() => {
    if (searchId) {
      // Receiving tickets
      fetchDataGet(mainConst.urlGetTickets + `?searchId=${searchId}`, (data) => {
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
          // loader taken from https://projects.lukehaas.me/css-loaders/ 
          <div className="loader">Loading...</div>
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
                    <Tickets currentTab={tab} currentStops={stops} dirtyTickets={tickets} />
                  </section>
                </article>
              </main>
            </div>
          )}
    </>
  );
}

export default Main;