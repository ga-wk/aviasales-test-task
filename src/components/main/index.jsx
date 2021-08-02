import logo from '../../svg/logo.svg';
import './index.css';

function Main() {
  return (
    <div className="page">
      <header className="header">
        <img src={logo} className="main-logo" alt="logo" />
      </header>
      <main className="content">
          <article className="results">
              <header className="tabs">

              </header>
              <section className="tickets">

              </section>
          </article>
          <aside className="filter">
            
          </aside>
      </main>
    </div>
  );
}

export default Main;