import { useState, useEffect } from 'react';
import { createFreshDb, runQuery } from './db';
import { checkAnswer } from './compareResults';
import { getChallengeById, getNextChallengeId } from './levelData';
import DatabasePanel from './DatabasePanel';
import './Game.css';

export default function Game({ challengeId, onComplete, onBack, onSelectChallenge, onOpenLesson }) {
  const challenge = getChallengeById(challengeId);

  const [db, setDb] = useState(null);
  const [query, setQuery] = useState(challenge.starterQuery);
  const [result, setResult] = useState({ columns: [], rows: [], error: null });
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState(null);
  const [dbPanelOpen, setDbPanelOpen] = useState(false);
  const [dbVersion, setDbVersion] = useState(0);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setLoading(true);
    setDb(null);
    setQuery(challenge.starterQuery);
    setResult({ columns: [], rows: [], error: null });
    setFeedback(null);
    setInitError(null);
    setDbPanelOpen(false);
    setShowHint(false);

    createFreshDb()
      .then((database) => {
        setDb(database);
        setLoading(false);
        setDbVersion((v) => v + 1);
      })
      .catch((err) => {
        console.error('Failed to initialize SQL engine:', err);
        setInitError(err.message);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challengeId]);

  function handleRun() {
    if (!db) return;
    const res = runQuery(db, query);
    setResult(res);
    setDbVersion((v) => v + 1);

    if (res.error) {
      setFeedback(null);
      return;
    }

    const toCheck = challenge.type === 'mutate' ? runQuery(db, challenge.verifyQuery) : res;
    if (toCheck.error) {
      setResult(toCheck);
      setFeedback(null);
      return;
    }

    const isCorrect = checkAnswer(toCheck, challenge.expected);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) onComplete(challengeId);
  }

  function handleReset() {
    setQuery(challenge.starterQuery);
    setResult({ columns: [], rows: [], error: null });
    setFeedback(null);
  }

  const nextId = getNextChallengeId(challengeId);

  if (loading || initError) {
    return (
      <div className="game">
        <button className="scene-back btn-secondary" onClick={onBack}>&larr; Levels</button>
        <div className="game-scene">
          <img className="game-scene-img" src="/query-desk.png" alt="" />
          <div className="game-status-card">
            <p>{initError ? `Failed to load SQL engine: ${initError}` : 'Loading SQL engine…'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game">
      <button className="scene-back btn-secondary" onClick={onBack}>&larr; Levels</button>

      <div className="game-scene">
        <img className="game-scene-img" src="/query-desk.png" alt="" />

        <button
          className="scene-db-toggle"
          onClick={() => setDbPanelOpen(true)}
          aria-label="Open database viewer"
        />

        <div className="scene-blackboard">
          <h2 className="scene-blackboard-title">{challenge.title}</h2>
          <p className="scene-blackboard-prompt">{challenge.prompt}</p>
          {showHint ? (
            <p className="scene-blackboard-hint">💡 {challenge.hint}</p>
          ) : (
            <button className="scene-hint-toggle" onClick={() => setShowHint(true)}>
              💡 Show hint
            </button>
          )}
          <button className="scene-lesson-toggle" onClick={() => onOpenLesson(challengeId)}>
            📘 Lesson
          </button>
        </div>

        <div className="scene-monitor">
          <textarea
            className="scene-query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            spellCheck={false}
            placeholder="Type your query here..."
          />
        </div>
        <button className="scene-run-button" onClick={handleRun} aria-label="Run query" />
        <button className="scene-reset-button" onClick={handleReset} aria-label="Reset query" />

        <div className="scene-paper">
          <div className="scene-paper-scroll">
            {result.error && <p className="scene-error">Error: {result.error}</p>}

            {!result.error && result.rows.length > 0 && (
              <table className="scene-table">
                <thead>
                  <tr>
                    {result.columns.map((col, i) => (
                      <th key={`${col}-${i}`}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((val, j) => (
                        <td key={j}>{val === null ? 'NULL' : String(val)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {!result.error && result.rows.length === 0 && !feedback && (
              <p className="scene-paper-hint">Run a query to see output here.</p>
            )}

            {feedback === 'correct' && (
              <div className="scene-feedback scene-feedback--correct">
                <p>✅ Correct!</p>
                {nextId ? (
                  <button className="btn-primary" onClick={() => onSelectChallenge(nextId)}>
                    Next Challenge &rarr;
                  </button>
                ) : (
                  <button className="btn-primary" onClick={onBack}>
                    🎉 You finished every level!
                  </button>
                )}
              </div>
            )}
            {feedback === 'incorrect' && (
              <p className="scene-feedback scene-feedback--incorrect">❌ Not quite — try again.</p>
            )}
          </div>
        </div>
      </div>

      <DatabasePanel
        db={db}
        open={dbPanelOpen}
        onClose={() => setDbPanelOpen(false)}
        refreshToken={dbVersion}
        phaseId={challenge.phaseId}
      />
    </div>
  );
}
