import menuBg from './assets/images/page2.png';
import './Menu.css';

const NAV_ITEMS = [
  { key: 'levels', label: 'Levels', sublabel: 'Learn SQL' },
  { key: 'shop', label: 'Shop', sublabel: 'Customize' },
  { key: 'leaderboard', label: 'Leaderboard', sublabel: 'Top Brewers' },
  { key: 'profile', label: 'Profile', sublabel: 'Your Stats' },
];

export default function Menu({ onSelectLevels }) {
  function handleClick(key) {
    if (key === 'levels') onSelectLevels();
  }

  return (
    <div className="menu">
      <img className="menu-bg" src={menuBg} alt="" />
      <div className="menu-overlay" />

      <div className="menu-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`menu-nav-button menu-nav-button--${item.key}`}
            onClick={() => handleClick(item.key)}
          >
            <span className="menu-nav-icon-badge">
              <span className="menu-nav-icon" />
            </span>
            <span className="menu-nav-text">
              <span className="menu-nav-label">{item.label}</span>
              <span className="menu-nav-sublabel">{item.sublabel}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
