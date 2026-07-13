import './LessonExplanation.css';

export default function LessonExplanation({ challenge, onBack }) {
  return (
    <div className="lesson-explanation">
      <button className="lesson-back btn-secondary" onClick={onBack}>&larr; Back to Challenge</button>

      <div className="lesson-scene">
        <img className="lesson-bg" src={`${import.meta.env.BASE_URL}images/lesson-explanation.png`} alt="" />

        <div className="lesson-board">
          <h2 className="lesson-board-title">{challenge.title}</h2>
          {challenge.lesson.map((paragraph, i) => (
            <p className="lesson-board-text" key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
