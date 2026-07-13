import { useState } from 'react';
import { renderBold } from './renderBold';
import './LevelIntro.css';

const BOX_ART = {
  kiko: '/images/kiko-dialogue-box.png',
  mini: '/images/mini-dialogue-box.png',
};

export default function LevelIntro({ lines, onFinish, onBack }) {
  const [line, setLine] = useState(0);
  const isFirst = line === 0;
  const isLast = line === lines.length - 1;
  const current = lines[line];

  function handleNext() {
    if (isLast) {
      onFinish();
      return;
    }
    setLine((l) => l + 1);
  }

  function handlePrevious() {
    if (isFirst) return;
    setLine((l) => l - 1);
  }

  return (
    <div className="level-intro">
      <button className="level-intro-back btn-secondary" onClick={onBack}>&larr; Levels</button>

      <div className="level-intro-controls">
        <button className="level-intro-skip btn-secondary" onClick={onFinish}>
          Skip
        </button>
        <button
          className="level-intro-previous btn-secondary"
          onClick={handlePrevious}
          disabled={isFirst}
        >
          Previous
        </button>
        <button className="level-intro-next btn-primary" onClick={handleNext}>
          {isLast ? "Let's go!" : 'Next'}
        </button>
      </div>

      <div className="level-intro-scene">
        <img className="level-intro-bg" src="/images/query-desk.png" alt="" />

        <div className={`level-intro-box-wrap level-intro-box-wrap--${current.speaker}`}>
          <img className="level-intro-box-img" src={BOX_ART[current.speaker]} alt={current.speaker} />
          <div className="level-intro-text-area">
            <p className="level-intro-line">{renderBold(current.text)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
