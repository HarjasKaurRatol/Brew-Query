import { useState } from 'react';
import { renderBold } from './renderBold';
import './Kiko.css';

const SCRIPT = [
  "Hiya! Welcome to Brew & Query!",
  "I'm Kiko, the barista around here — and today, you're my new trainee!",
  "Our little café runs on something special: every order that comes in is really just data, waiting for the right SQL query to bring it to life.",
  "Don't worry — you don't need to know anything yet! I'll teach you one recipe, er, query, at a time.",
  "Grab your apron, sharpen your SELECT statements, and let's start brewing! Ready?",
];

export default function Kiko({ onFinish }) {
  const [line, setLine] = useState(0);
  const isLast = line === SCRIPT.length - 1;

  function handleNext() {
    if (isLast) {
      onFinish();
      return;
    }
    setLine((l) => l + 1);
  }

  return (
    <div className="kiko-scene">
      <div className="kiko-frame">
        <img
          className="kiko-bg"
          src={`${import.meta.env.BASE_URL}images/kiko-dialogue.png`}
          alt="Kiko, the café barista"
        />

        <div className="kiko-controls">
          <button className="kiko-skip btn-secondary" onClick={onFinish}>
            Skip
          </button>
          <button className="kiko-next btn-primary" onClick={handleNext}>
            {isLast ? "Let's Go!" : 'Next'}
          </button>
        </div>

        <div className="kiko-dialogue">
          <p className="kiko-line">{renderBold(SCRIPT[line])}</p>
        </div>
      </div>
    </div>
  );
}
