import { useState } from 'react';
import Landing from './Landing';
import Kiko from './Kiko';
import Menu from './Menu';
import Levels from './Levels';
import Profile from './Profile';
import Game from './Game';
import LevelIntro from './LevelIntro';
import LessonExplanation from './LessonExplanation';
import { getChallengeById } from './levelData';

export default function App() {
  const [view, setView] = useState('landing');
  const [challengeId, setChallengeId] = useState(null);
  const [completedIds, setCompletedIds] = useState(new Set());

  function handleComplete(id) {
    setCompletedIds((prev) => new Set(prev).add(id));
  }

  function handleSelectChallenge(id) {
    setChallengeId(id);
    const challenge = getChallengeById(id);
    setView(challenge?.intro ? 'levelIntro' : 'game');
  }

  if (view === 'levelIntro' && challengeId) {
    const challenge = getChallengeById(challengeId);
    return (
      <LevelIntro
        lines={challenge.intro}
        onFinish={() => setView('game')}
        onBack={() => setView('levels')}
      />
    );
  }

  if (view === 'lesson' && challengeId) {
    const challenge = getChallengeById(challengeId);
    return (
      <LessonExplanation
        challenge={challenge}
        onBack={() => setView('game')}
      />
    );
  }

  if (view === 'game' && challengeId) {
    return (
      <Game
        challengeId={challengeId}
        onComplete={handleComplete}
        onBack={() => setView('levels')}
        onSelectChallenge={handleSelectChallenge}
        onOpenLesson={() => setView('lesson')}
      />
    );
  }

  if (view === 'levels') {
    return (
      <Levels
        completedIds={completedIds}
        onSelectChallenge={handleSelectChallenge}
        onBack={() => setView('menu')}
      />
    );
  }

  if (view === 'profile') {
    return <Profile completedIds={completedIds} onBack={() => setView('menu')} />;
  }

  if (view === 'menu') {
    return (
      <Menu
        onSelectLevels={() => setView('levels')}
        onSelectProfile={() => setView('profile')}
      />
    );
  }

  if (view === 'intro') {
    return <Kiko onFinish={() => setView('menu')} />;
  }

  return <Landing onNewGame={() => setView('intro')} />;
}
