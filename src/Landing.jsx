import { useState } from 'react';
import landingButtonSvg from './assets/images/landing-button.svg';
import './Landing.css';

export default function Landing({ onNewGame }) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="landing">
      <video
        className="landing-video"
        src="/landing-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="landing-overlay" />

      <div className="landing-panel">
        <h1 className="landing-title">Brew &amp; Query</h1>
        <p className="landing-subtitle">Learn SQL, one order at a time.</p>

        <button
          className="landing-button landing-svg-button"
          style={{ backgroundImage: `url("${landingButtonSvg}")` }}
          onClick={onNewGame}
        >
          New Game
        </button>
        <button
          className="landing-button landing-svg-button"
          style={{ backgroundImage: `url("${landingButtonSvg}")` }}
          onClick={() => setShowSettings(true)}
        >
          Settings
        </button>
      </div>

      {showSettings && (
        <div
          className="settings-modal-backdrop"
          onClick={() => setShowSettings(false)}
        >
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Settings</h3>
            <p>Nothing to configure yet — check back soon.</p>
            <button className="btn-primary" onClick={() => setShowSettings(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
