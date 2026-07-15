import { PHASES, ALL_CHALLENGES } from './levelData';
import './Profile.css';

const TIER_THRESHOLDS = [
  { min: 23, tier: 'Master Barista' },
  { min: 15, tier: 'Head Brewer' },
  { min: 7, tier: 'Barista' },
  { min: 1, tier: 'Trainee' },
  { min: 0, tier: 'New Hire' },
];

function getTier(completedCount) {
  return TIER_THRESHOLDS.find((t) => completedCount >= t.min).tier;
}

export default function Profile({ completedIds, onBack }) {
  const totalCount = ALL_CHALLENGES.length;
  const doneCount = completedIds.size;
  const percent = Math.round((doneCount / totalCount) * 100);
  const tier = getTier(doneCount);

  return (
    <div className="profile">
      <img className="profile-bg" src={`${import.meta.env.BASE_URL}images/cafe-interior.png`} alt="" />
      <div className="profile-overlay" />

      <div className="profile-panel">
        <div className="profile-header">
          <button className="profile-back btn-secondary" onClick={onBack}>&larr; Back</button>
          <h2 className="profile-title">Profile</h2>
        </div>

        <div className="profile-card">
          <img className="profile-avatar" src={`${import.meta.env.BASE_URL}images/mini-standing.png`} alt="Mini" />
          <div className="profile-card-info">
            <span className="profile-name">Mini</span>
            <span className="profile-tier">{tier}</span>
          </div>
        </div>

        <div className="profile-summary">
          <div className="profile-stat">
            <span className="profile-stat-value">{doneCount}/{totalCount}</span>
            <span className="profile-stat-label">Levels Completed</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat-value">{percent}%</span>
            <span className="profile-stat-label">Overall Progress</span>
          </div>
        </div>

        <div className="profile-progress-bar">
          <div className="profile-progress-fill" style={{ width: `${percent}%` }} />
        </div>

        <h3 className="profile-section-title">Progress by Phase</h3>
        <div className="profile-phase-list">
          {PHASES.map((phase) => {
            const phaseDone = phase.challenges.filter((c) => completedIds.has(c.id)).length;
            const phaseTotal = phase.challenges.length;
            const phasePercent = Math.round((phaseDone / phaseTotal) * 100);
            const complete = phaseDone === phaseTotal;
            return (
              <div className="profile-phase" key={phase.id}>
                <div className="profile-phase-row">
                  <span className="profile-phase-name">{complete ? '✅ ' : ''}{phase.title}</span>
                  <span className="profile-phase-count">{phaseDone}/{phaseTotal}</span>
                </div>
                <div className="profile-phase-bar">
                  <div className="profile-phase-fill" style={{ width: `${phasePercent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
