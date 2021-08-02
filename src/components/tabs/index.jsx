import { useState } from 'react';
import { tabsConst } from '../../constants/tabs';
import './index.css';

function Tabs() {
  const [active, setActive] = useState(0);

  function clickHandle(e) {
    setActive(+e.currentTarget.attributes.num.value);
  }

  return (
    <menu className="menu">
      {tabsConst.tabs.map((tab, i) =>
        <li
          className={`${active === i ? "menu__item active" : "menu__item"}`}
          num={i}
          onClick={clickHandle}
        >
          {tab}
        </li>
      )}
    </menu>
  )
}

export default Tabs;
