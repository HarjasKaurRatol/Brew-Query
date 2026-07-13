import levelsBg from './assets/images/page2.png';
import { PHASES } from './levelData';
import './Levels.css';

export default function Levels({ completedIds, onSelectChallenge, onBack }) {
  return (
    <div className="levels">
      <img className="levels-bg" src={levelsBg} alt="" />
      <div className="levels-overlay" />

      <div className="levels-panel">
        <div className="levels-header">
          <button className="levels-back btn-secondary" onClick={onBack}>&larr; Back</button>
          <h2 className="levels-title">Levels</h2>
        </div>

        {PHASES.map((phase) => (
          <section className="levels-phase" key={phase.id}>
            <h3 className="levels-phase-title">{phase.title}</h3>
            <p className="levels-phase-subtitle">{phase.subtitle}</p>
            <p className="levels-phase-desc">{phase.description}</p>

            <div className="levels-challenge-list">
              {phase.challenges.map((challenge) => {
                const done = completedIds.has(challenge.id);
                return (
                  <button
                    key={challenge.id}
                    className={`levels-challenge${done ? ' levels-challenge--done' : ''}`}
                    onClick={() => onSelectChallenge(challenge.id)}
                  >
                    <span className="levels-challenge-check">{done ? '✅' : '☕'}</span>
                    <span className="levels-challenge-name">{challenge.title}</span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
