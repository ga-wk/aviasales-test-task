import logo from '../../svg/logo.svg';
import Tabs from '../tabs';
import './index.css';

function Main() {
  return (
    <div className="page">
      <header className="header">
        <img src={logo} className="main-logo" alt="logo" />
      </header>
      <main className="content">
        <article className="content__results">
          <header className="content__tabs">
            <Tabs />
          </header>
          <section className="content__tickets">

          </section>
        </article>
        <aside className="content__filter">

        </aside>
      </main>
    </div>
  );
}

export default Main;