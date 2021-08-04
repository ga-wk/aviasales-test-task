import { useState } from 'react';
import { tabsConst } from '../../constants/tabs';
import './index.css';

function Tabs({ currentTab, setNewTab }) {
  const [active, setActive] = useState(currentTab);

  function clickHandle(e) {
    const numTab = +e.currentTarget.attributes.num.value;
    setActive(numTab);
    setNewTab(state => {
      state = numTab;
      return state
    });

    localStorage.setItem('tabs', numTab);
  }

  return (
    <menu className="menu">
      {tabsConst.tabs.map((tab, i) =>
        <button
          className={`${active === i ? "menu__item active" : "menu__item"}`}
          num={i}
          onClick={clickHandle}
          key={i}
        >
          {tab}
        </button>
      )}
    </menu>
  )
}

export default Tabs;
