/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Settings, 
  Plus, 
  Trash2, 
  X, 
  Info, 
  Pause, 
  PlayCircle,
  Languages,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Language, QuestionItem, GameState, GameMode, Team } from './types';
import { TRANSLATIONS } from './translations';
import { QUESTIONS_BY_LANGUAGE_AND_GRADE } from './questions';

// --- Sound Utility ---
const playSound = (type: 'correct' | 'wrong' | 'move' | 'win') => {
  let audio: HTMLAudioElement | null = null;
  
  switch (type) {
    case 'correct':
      audio = new Audio('/dung.mp3');
      break;
    case 'wrong':
      audio = new Audio('/sai.mp3');
      break;
    case 'win':
      audio = new Audio('/dich.mp3');
      break;
    case 'move':
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const bufferSize = ctx.sampleRate * 0.2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, ctx.currentTime);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.05, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start();
      return;
  }

  if (audio) {
    audio.play().catch(err => console.log("Sound effect play failed:", err));
  }
};

// Flexible answer comparator
const isAnswerCorrect = (userAns: string, targetAns: string): boolean => {
  const cleanUser = userAns.trim().toLowerCase();
  const cleanTarget = targetAns.trim().toLowerCase();
  if (cleanUser === cleanTarget) return true;
  
  // Decimal comma vs period normalization
  const normUser = cleanUser.replace(',', '.').replace(/\s+/g, '');
  const normTarget = cleanTarget.replace(',', '.').replace(/\s+/g, '');
  if (normUser === normTarget) return true;
  
  // Check without trailing units
  if (cleanTarget.startsWith(cleanUser) && cleanUser.length >= 1) {
    const remaining = cleanTarget.slice(cleanUser.length).trim();
    if ([
      'giờ', 'phút', 'ngày', 'cm', 'xăng-ti-mét', 'mét', 'km', 'km/h', 'm/s', 'quả', 
      'chân', 'bi', 'con', 'kết quả', 'chữ số', 'đơn vị', 'days', 'hours', 'minutes', 
      'seconds', 'fruits', 'legs', 'xăng-ti-mét vuông', 'cm2'
    ].some(unit => remaining.startsWith(unit))) {
      return true;
    }
  }
  return false;
};

// --- Ox Sprite Component ---
const OxSprite = ({ team, label }: { team: Team, label?: string }) => {
  const imgSrc = team === 'A' ? '/nam.png' : '/nu.png';
  return (
    <div className="relative flex items-center" id={`ox-sprite-${team}`}>
      <motion.img
        src={imgSrc}
        alt={label || `Team ${team}`}
        referrerPolicy="no-referrer"
        className="w-28 sm:w-32 h-auto drop-shadow-2xl"
        animate={{ 
          y: [0, -6, 0],
          rotate: team === 'A' ? [-1, 1, -1] : [1, -1, 1]
        }}
        transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
      />
      <div className={`ml-2 px-3 py-0.5 rounded-full font-bold text-white shadow-lg text-lg ${team === 'A' ? 'bg-blue-600 border-2 border-white' : 'bg-red-600 border-2 border-white'}`}>
        {label || `Team ${team}`}
      </div>
    </div>
  );
};

export default function App() {
  // Language State
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('water_bull_race_lang');
    return (saved === 'en' || saved === 'vi') ? saved : 'vi';
  });

  const t = TRANSLATIONS[language];
  const gradeData = QUESTIONS_BY_LANGUAGE_AND_GRADE[language];

  // Initial grade and topic setup
  const initialGrade = Object.keys(gradeData)[0];
  const initialTopic = Object.keys(gradeData[initialGrade])[0];

  const [selectedGrade, setSelectedGrade] = useState(initialGrade);
  const [selectedTopic, setSelectedTopic] = useState(initialTopic);
  const [questionsList, setQuestionsList] = useState<QuestionItem[]>(gradeData[initialGrade][initialTopic]);
  const [usedIndices, setUsedIndices] = useState<number[]>([]);
  
  const [isTeacherMode, setIsTeacherMode] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');

  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [gameState, setGameState] = useState<GameState>('start');
  const [gameMode, setGameMode] = useState<GameMode>('multiplayer');
  const [selectedTeam, setSelectedTeam] = useState<Team>('A');
  const [score, setScore] = useState(0);
  const [countdownValue, setCountdownValue] = useState<number | string>(3);
  const [teamATurn, setTeamATurn] = useState(true);
  const [posA, setPosA] = useState(0);
  const [posB, setPosB] = useState(0);
  const [currentQ, setCurrentQ] = useState<QuestionItem>(questionsList[0] || { q: '', a: '' });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<{ text: string, type: 'success' | 'error' | null }>({ text: '', type: null });
  const [winner, setWinner] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [questionDuration, setQuestionDuration] = useState(0); // 0 means unlimited
  const [questionTimeLeft, setQuestionTimeLeft] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const WIN_POS = 80; 
  const stepSize = Math.max(10, 80 / Math.ceil(Math.max(questionsList.length, 1) / 1.5));

  // Language toggle handler
  const handleToggleLanguage = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem('water_bull_race_lang', newLang);
    
    // If in start mode, also sync grade and questions
    if (gameState === 'start') {
      const nextGradeData = QUESTIONS_BY_LANGUAGE_AND_GRADE[newLang];
      const grades = Object.keys(nextGradeData);
      const grade = grades[0];
      const topics = Object.keys(nextGradeData[grade]);
      const topic = topics[0];
      setSelectedGrade(grade);
      setSelectedTopic(topic);
      const list = nextGradeData[grade][topic];
      setQuestionsList(list);
      setCurrentQ(list[0]);
      setUsedIndices([]);
    }
  };

  // Sync questions when grade changes
  useEffect(() => {
    if (gameState === 'start') {
      const currentGradeData = QUESTIONS_BY_LANGUAGE_AND_GRADE[language];
      if (currentGradeData[selectedGrade]) {
        const topics = Object.keys(currentGradeData[selectedGrade]);
        const firstTopic = topics[0];
        setSelectedTopic(firstTopic);
        const newList = currentGradeData[selectedGrade][firstTopic];
        setQuestionsList(newList);
        if (newList && newList.length > 0) {
          setCurrentQ(newList[0]);
        }
        setUsedIndices([]);
      }
    }
  }, [selectedGrade, language, gameState]);

  // Update questions when topic changes
  const handleTopicChange = (topic: string) => {
    setSelectedTopic(topic);
    const currentGradeData = QUESTIONS_BY_LANGUAGE_AND_GRADE[language];
    if (currentGradeData[selectedGrade] && currentGradeData[selectedGrade][topic]) {
      const newList = currentGradeData[selectedGrade][topic];
      setQuestionsList(newList);
      if (newList && newList.length > 0) {
        setCurrentQ(newList[0]);
      }
      setUsedIndices([]);
    }
  };

  const endGame = useCallback((team: string) => {
    playSound('win');
    setWinner(team);
    setGameState('won');
  }, []);

  const nextQuestion = useCallback(() => {
    if (questionsList.length === 0) return;
    
    const availableIndices = questionsList.map((_, i) => i).filter(i => !usedIndices.includes(i));
    
    if (availableIndices.length === 0) {
      // All questions used! End game smoothly.
      if (gameMode === 'time-trial') {
        endGame(selectedTeam);
      } else {
        if (posA > posB) endGame('A');
        else if (posB > posA) endGame('B');
        else endGame('DRAW');
      }
      return;
    }

    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    setCurrentQ(questionsList[randomIndex]);
    setCurrentIndex(randomIndex);
    setInput('');
    setIsProcessing(false);
    if (questionDuration > 0) {
      setQuestionTimeLeft(questionDuration);
    }
  }, [questionsList, usedIndices, questionDuration, gameMode, selectedTeam, posA, posB, endGame]);

  const addQuestion = () => {
    if (!newQ.trim() || !newA.trim()) return;
    const updated = [...questionsList, { q: newQ, a: newA.trim() }];
    setQuestionsList(updated);
    setUsedIndices([]);
    setNewQ('');
    setNewA('');
  };

  const deleteQuestion = (index: number) => {
    const updated = questionsList.filter((_, i) => i !== index);
    setQuestionsList(updated);
    setUsedIndices([]);
  };

  const startGame = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.log("Audio play failed:", err));
    }
    startCountdown();
  };

  const startCountdown = () => {
    const countdownWords = ['mĭnh', "'bar", 'pêng'];
    setGameState('countdown');
    setCountdownValue(countdownWords[0]);
    
    let index = 0;
    const timer = setInterval(() => {
      index += 1;
      if (index < countdownWords.length) {
        setCountdownValue(countdownWords[index]);
      } else if (index === countdownWords.length) {
        setCountdownValue(t.startSignal);
      } else {
        clearInterval(timer);
        setGameState('playing');
        setPosA(0);
        setPosB(0);
        setTeamATurn(true);
        setWinner(null);
        setFeedback({ text: '', type: null });
        setUsedIndices([]);
        setScore(0);
        setElapsedTime(0);
        setQuestionTimeLeft(questionDuration);
        setIsProcessing(false);
        setIsPaused(false);
        
        if (questionsList.length > 0) {
          const randomIndex = Math.floor(Math.random() * questionsList.length);
          setCurrentQ(questionsList[randomIndex]);
          setCurrentIndex(randomIndex);
        }
        setInput('');
      }
    }, 1000);
  };

  // Timer for Challenge (Count up)
  useEffect(() => {
    if (gameState === 'playing' && gameMode === 'time-trial' && !isPaused) {
      const timer = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, gameMode, isPaused]);

  // Timer for Question (Per-question limit for 2P and AI only)
  useEffect(() => {
    if (gameState === 'playing' && gameMode !== 'time-trial' && questionDuration > 0 && !isPaused) {
      if (questionTimeLeft > 0) {
        const timer = setTimeout(() => setQuestionTimeLeft(questionTimeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        // Time's up
        playSound('wrong');
        setFeedback({ text: t.timeUpFeedback, type: 'error' });
        setUsedIndices(prev => [...prev, currentIndex]);
        
        setTimeout(() => {
          setFeedback({ text: '', type: null });
          nextQuestion();
          setTeamATurn(!teamATurn);
        }, 1200);
      }
    }
  }, [gameState, questionTimeLeft, isPaused, questionDuration, gameMode, teamATurn, currentIndex, t.timeUpFeedback, nextQuestion]);

  // AI Turn Logic
  useEffect(() => {
    if (gameState === 'playing' && gameMode === 'ai' && !teamATurn && !isPaused) {
      const aiThinkTime = 1500 + Math.random() * 2000;
      const timer = setTimeout(() => {
        const isCorrect = Math.random() < 0.7;
        
        if (isCorrect) {
          playSound('correct');
          setFeedback({ text: t.aiCorrectFeedback, type: 'success' });
          setUsedIndices(prev => [...prev, currentIndex]);
          
          const newPos = posB + stepSize;
          setPosB(newPos);
          playSound('move');
          
          if (newPos >= WIN_POS) {
            setTimeout(() => endGame('B'), 1000);
            return;
          }
          
          setTimeout(() => {
            setFeedback({ text: '', type: null });
            nextQuestion();
            setTeamATurn(true);
          }, 1200);
        } else {
          playSound('wrong');
          setFeedback({ text: t.aiWrongFeedback, type: 'error' });
          setUsedIndices(prev => [...prev, currentIndex]);
          setTimeout(() => {
            setFeedback({ text: '', type: null });
            nextQuestion();
            setTeamATurn(true);
          }, 1200);
        }
      }, aiThinkTime);
      return () => clearTimeout(timer);
    }
  }, [gameState, gameMode, teamATurn, currentIndex, posB, stepSize, t.aiCorrectFeedback, t.aiWrongFeedback, nextQuestion, endGame]);

  const handleAnswer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isProcessing || isPaused) return;
    if (gameMode === 'ai' && !teamATurn) return;

    setIsProcessing(true);
    const isCorrect = isAnswerCorrect(input, currentQ.a);

    if (isCorrect) {
      playSound('correct');
      setFeedback({ text: t.correctFeedback, type: 'success' });
      setUsedIndices(prev => [...prev, currentIndex]);
      setScore(prev => prev + 1);
      
      if (gameMode === 'time-trial') {
        const isTeamA = selectedTeam === 'A';
        const currentPos = isTeamA ? posA : posB;
        const newPos = currentPos + stepSize;
        
        if (isTeamA) setPosA(newPos);
        else setPosB(newPos);
        
        playSound('move');
        
        if (newPos >= WIN_POS) {
          setTimeout(() => endGame(selectedTeam), 800);
          return;
        }

        setTimeout(() => {
          setFeedback({ text: '', type: null });
          nextQuestion();
          setIsProcessing(false);
        }, 800);
      } else {
        if (teamATurn) {
          const newPos = posA + stepSize;
          setPosA(newPos);
          playSound('move');
          if (newPos >= WIN_POS) {
            endGame('A');
            setIsProcessing(false);
            return;
          }
        } else {
          const newPos = posB + stepSize;
          setPosB(newPos);
          playSound('move');
          if (newPos >= WIN_POS) {
            endGame('B');
            setIsProcessing(false);
            return;
          }
        }
        
        setTimeout(() => {
          setFeedback({ text: '', type: null });
          nextQuestion();
          setTeamATurn(!teamATurn);
          setIsProcessing(false);
        }, 1200);
      }

    } else {
      playSound('wrong');
      setUsedIndices(prev => [...prev, currentIndex]);
      
      if (gameMode === 'time-trial') {
        setFeedback({ text: t.wrongFeedbackNew, type: 'error' });
        setTimeout(() => {
          setFeedback({ text: '', type: null });
          nextQuestion();
          setIsProcessing(false);
        }, 1000);
      } else {
        setFeedback({ text: t.wrongFeedbackTurn, type: 'error' });
        setTimeout(() => {
          setFeedback({ text: '', type: null });
          nextQuestion();
          setTeamATurn(!teamATurn);
          setIsProcessing(false);
        }, 1200);
      }
    }
  };

  useEffect(() => {
    if (gameState === 'playing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState, teamATurn]);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (audioRef.current && audioRef.current.paused && !isMuted) {
        audioRef.current.play().catch(() => {});
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(err => console.log("Audio play failed:", err));
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  // Helper for team labels based on mode
  const getTeamLabel = (team: Team) => {
    if (gameMode === 'ai') {
      return team === 'A' ? t.you : t.computer;
    }
    if (gameMode === 'time-trial') {
      return selectedTeam === team ? t.player : (team === 'A' ? t.teamA : t.teamB);
    }
    return team === 'A' ? t.teamA : t.teamB;
  };

  const getWinnerTitle = () => {
    if (gameMode === 'time-trial') {
      return t.timeTrialWon(elapsedTime);
    }
    if (winner === 'DRAW') {
      return t.drawResult;
    }
    if (winner === 'A') {
      const name = gameMode === 'ai' ? t.you : t.teamA;
      return t.teamWon(name);
    }
    if (winner === 'B') {
      const name = gameMode === 'ai' ? t.computer : t.teamB;
      return t.teamWon(name);
    }
    return '';
  };

  return (
    <div className="h-screen max-h-screen bg-sky-100 font-sans overflow-hidden flex flex-col" id="app-root">
      <audio ref={audioRef} src="/nhacnen.mp3" loop />
      
      {/* Header */}
      <header className="bg-white/85 backdrop-blur-sm py-2 px-3 shadow-sm flex justify-between items-center z-10" id="game-header">
        <h1 className="text-base sm:text-lg font-bold text-orange-600 tracking-tight uppercase truncate mr-2" id="game-title">
          {t.headerTitle}
        </h1>

        <div className="flex gap-1.5 sm:gap-2 items-center flex-shrink-0">
          {/* Time Trial Live Timer */}
          {gameMode === 'time-trial' && gameState === 'playing' && (
            <div 
              id="time-trial-badge"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border-2 transition-all ${
                isPaused ? 'bg-gray-100 border-gray-400 opacity-60' : 'bg-orange-100 border-orange-500 animate-pulse'
              }`}
            >
              <span className={`${isPaused ? 'text-gray-500' : 'text-orange-600'} font-black text-xs sm:text-sm`}>
                {isPaused ? t.pausedBadge : `⏱️ ${elapsedTime} ${t.secondsSuffix}`}
              </span>
            </div>
          )}

          {/* Language Switcher */}
          <div className="flex bg-orange-50 p-0.5 rounded-full border border-orange-200 shadow-sm" id="lang-switcher">
            <button
              onClick={() => handleToggleLanguage('vi')}
              className={`px-2 py-0.5 rounded-full text-xs font-black transition-all ${
                language === 'vi' 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-orange-600'
              }`}
              title="Tiếng Việt"
            >
              VI
            </button>
            <button
              onClick={() => handleToggleLanguage('en')}
              className={`px-2 py-0.5 rounded-full text-xs font-black transition-all ${
                language === 'en' 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-orange-600'
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          {/* Audio Volume Controls */}
          <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1" id="volume-controls">
            <button 
              onClick={toggleMute}
              className="text-gray-500 hover:text-orange-600 transition-colors"
              title={isMuted ? t.musicOn : t.musicOff}
              id="mute-button"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume} 
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-14 h-1 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              id="volume-slider"
            />
          </div>

          {/* Info Modal Trigger */}
          <button 
            onClick={() => setIsIntroOpen(true)}
            className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
            title={t.introTooltip}
            id="intro-button"
          >
            <Info size={18} />
          </button>

          {/* Rules Modal Trigger */}
          <button 
            onClick={() => setIsRulesOpen(true)}
            className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
            title={t.rulesTooltip}
            id="rules-button"
          >
            <div className="w-4.5 h-4.5 flex items-center justify-center font-black border-2 border-current rounded-full text-[11px]">?</div>
          </button>

          {/* Teacher Mode Trigger */}
          <button 
            onClick={() => setIsTeacherMode(true)}
            className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
            title={t.teacherTooltip}
            id="teacher-mode-button"
          >
            <Settings size={18} />
          </button>

          {/* Pause Button in Header */}
          {gameState === 'playing' && (
            <button 
              onClick={() => setIsPaused(!isPaused)}
              className={`p-1.5 rounded-full transition-all flex items-center justify-center ${
                isPaused ? 'bg-green-500 text-white animate-pulse' : 'text-gray-500 hover:text-orange-600 hover:bg-orange-50'
              }`}
              title={isPaused ? t.resume : t.pause}
              id="pause-button"
            >
              {isPaused ? <PlayCircle size={18} /> : <Pause size={18} />}
            </button>
          )}

          {/* Turn Indicators for 2P / AI */}
          {gameMode !== 'time-trial' && gameState === 'playing' && (
            <div className="flex gap-1">
              <div className={`px-2.5 py-0.5 text-xs rounded-full font-bold transition-all ${
                teamATurn ? 'bg-blue-500 text-white scale-105 shadow-md' : 'bg-gray-200 text-gray-500'
              }`} id="turn-indicator-a">
                {gameMode === 'ai' ? t.you : t.teamA}
              </div>

              <div className={`px-2.5 py-0.5 text-xs rounded-full font-bold transition-all ${
                !teamATurn ? 'bg-red-500 text-white scale-105 shadow-md' : 'bg-gray-200 text-gray-500'
              }`} id="turn-indicator-b">
                {gameMode === 'ai' ? t.computer : t.teamB}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Game Area */}
      <main 
        className="flex-1 relative flex flex-col"
        id="main-stage"
        style={{
          backgroundImage: "url('/nen.png')", 
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* The Lake/Track */}
        <div className="flex-1 relative border-y-4 border-amber-800/20 bg-transparent">
          {/* Finish Line (Visual Gate) */}
          <div className="absolute right-[12%] top-0 bottom-0 w-1 bg-white/30 backdrop-blur-[2px] z-10" />

          {/* Oxen on Tracks */}
          <div className="absolute inset-0 flex flex-col justify-around py-8 px-[5%]">
            {/* Team A Ox */}
            <motion.div 
              animate={{ x: `${posA}%` }}
              transition={{ type: 'spring', stiffness: 40 }}
              className={`relative z-20 ${gameMode === 'time-trial' && selectedTeam === 'B' ? 'opacity-40 grayscale' : ''}`}
            >
              <OxSprite team="A" label={getTeamLabel('A')} />
            </motion.div>

            {/* Team B Ox */}
            <motion.div 
              animate={{ x: `${posB}%` }}
              transition={{ type: 'spring', stiffness: 40 }}
              className={`relative z-20 ${gameMode === 'time-trial' && selectedTeam === 'A' ? 'opacity-40 grayscale' : ''}`}
            >
              <OxSprite team="B" label={getTeamLabel('B')} />
            </motion.div>
          </div>

          {/* Referee Countdown Animation */}
          <AnimatePresence>
            {gameState === 'countdown' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[2px]"
                id="countdown-overlay"
              >
                <div className="flex flex-col items-center gap-4 translate-y-12">
                  {/* Speech Bubble */}
                  <motion.div
                    key={countdownValue}
                    initial={{ scale: 0, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    className="relative bg-white px-6 sm:px-8 py-3 sm:py-4 rounded-3xl shadow-2xl border-4 border-orange-500 flex items-center justify-center min-w-[200px] sm:min-w-[300px]"
                  >
                    <span className="text-3xl sm:text-5xl font-black text-orange-600 uppercase italic whitespace-nowrap">
                      {countdownValue}
                    </span>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border-r-4 border-b-4 border-orange-500 rotate-45" />
                  </motion.div>

                  <motion.img 
                    src="/trongtai.png" 
                    alt="Referee" 
                    className="w-40 sm:w-56 h-auto drop-shadow-2xl"
                    animate={{ 
                      y: [0, -5, 0],
                      scale: [1, 1.01, 1]
                    }}
                    transition={{ repeat: Infinity, duration: 0.4 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Rules Modal */}
          <AnimatePresence>
            {isRulesOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[1px] p-4"
                id="rules-modal"
              >
                <motion.div 
                  initial={{ scale: 0.9, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 10 }}
                  className="bg-white/95 rounded-3xl max-w-lg w-full p-6 shadow-2xl border-4 border-orange-500 relative overflow-y-auto max-h-[95%]"
                >
                  <button 
                    onClick={() => setIsRulesOpen(false)}
                    className="absolute top-3 right-3 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                    id="close-rules-btn"
                  >
                    <X size={20} />
                  </button>
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-orange-500" />
                  <h2 className="text-2xl font-black text-orange-600 mb-4 flex items-center gap-2 uppercase italic">
                    <Settings size={24} className="animate-spin-slow" /> {t.rulesTitle}
                  </h2>
                  
                  <ul className="space-y-3 text-gray-700 font-bold text-base">
                    {t.rules.map((rule, idx) => (
                      <li key={idx} className="flex gap-2">
                        <div className="min-w-[24px] h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs">
                          {idx + 1}
                        </div>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setIsRulesOpen(false)}
                    className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-lg font-black shadow-lg transition-colors uppercase tracking-widest"
                    id="understand-rules-btn"
                  >
                    {t.understood}
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Introduction Modal */}
          <AnimatePresence>
            {isIntroOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[1px] p-4"
                id="intro-modal"
              >
                <motion.div 
                  initial={{ scale: 0.9, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 10 }}
                  className="bg-white/95 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border-4 border-orange-500 relative overflow-y-auto max-h-[95%]"
                >
                  <button 
                    onClick={() => setIsIntroOpen(false)}
                    className="absolute top-3 right-3 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                    id="close-intro-btn"
                  >
                    <X size={20} />
                  </button>
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-orange-500" />
                  <h2 className="text-2xl font-black text-orange-600 mb-4 flex items-center gap-2 uppercase italic">
                    <Info size={24} /> {t.introTitle}
                  </h2>
                  
                  <div className="space-y-4 text-gray-700 font-medium text-sm sm:text-base leading-relaxed">
                    <p className="font-bold text-orange-700 text-lg">{t.introSubtitle}</p>
                    <p>{t.introP1}</p>
                    <p>{t.introP2}</p>
                  </div>

                  <button
                    onClick={() => setIsIntroOpen(false)}
                    className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-lg font-black shadow-lg transition-colors uppercase tracking-widest"
                    id="intro-confirm-btn"
                  >
                    {t.closeBtn}
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* UI Controls Area */}
        <div className="min-h-[180px] p-3 flex flex-col items-center justify-center gap-2 z-20" id="controls-panel">
          {gameState === 'start' && (
            <div className="flex flex-col items-center gap-3" id="start-screen-controls">
              {/* Game Mode Selector */}
              <div className="flex gap-2 bg-white/60 p-1 rounded-2xl border-2 border-orange-200 shadow-sm" id="mode-selector">
                <button 
                  onClick={() => setGameMode('multiplayer')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                    gameMode === 'multiplayer' ? 'bg-orange-500 text-white shadow-md scale-105' : 'text-gray-600 hover:bg-orange-50'
                  }`}
                  id="mode-multiplayer-btn"
                >
                  {t.mode2Players}
                </button>
                <button 
                  onClick={() => setGameMode('ai')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                    gameMode === 'ai' ? 'bg-orange-500 text-white shadow-md scale-105' : 'text-gray-600 hover:bg-orange-50'
                  }`}
                  id="mode-ai-btn"
                >
                  {t.modeAI}
                </button>
                <button 
                  onClick={() => setGameMode('time-trial')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                    gameMode === 'time-trial' ? 'bg-orange-500 text-white shadow-md scale-105' : 'text-gray-600 hover:bg-orange-50'
                  }`}
                  id="mode-timetrial-btn"
                >
                  {t.modeTimeTrial}
                </button>
              </div>

              {/* Time Trial Character Selection */}
              {gameMode === 'time-trial' && (
                <div className="flex flex-col items-center gap-2 mb-2" id="character-select">
                  <p className="text-xs font-black text-orange-700 uppercase tracking-widest">{t.chooseCharacter}</p>
                  <div className="flex gap-4 bg-white/40 p-2 rounded-3xl border-2 border-orange-200/50 backdrop-blur-sm">
                    <button 
                      onClick={() => setSelectedTeam('A')}
                      className={`relative p-2 rounded-2xl transition-all flex flex-col items-center gap-1 ${
                        selectedTeam === 'A' ? 'bg-blue-500 text-white shadow-xl scale-110 ring-4 ring-blue-200' : 'bg-white/60 text-blue-600 hover:bg-blue-50 opacity-70'
                      }`}
                      id="select-char-a"
                    >
                      <img src="/nam.png" alt="Team A" className="w-12 h-auto" referrerPolicy="no-referrer" />
                      <span className="text-[10px] font-black uppercase">{t.teamA}</span>
                      {selectedTeam === 'A' && (
                        <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-0.5 shadow-md">
                          <CheckCircle2 size={14} />
                        </div>
                      )}
                    </button>
                    <button 
                      onClick={() => setSelectedTeam('B')}
                      className={`relative p-2 rounded-2xl transition-all flex flex-col items-center gap-1 ${
                        selectedTeam === 'B' ? 'bg-red-500 text-white shadow-xl scale-110 ring-4 ring-red-200' : 'bg-white/60 text-red-600 hover:bg-red-50 opacity-70'
                      }`}
                      id="select-char-b"
                    >
                      <img src="/nu.png" alt="Team B" className="w-12 h-auto" referrerPolicy="no-referrer" />
                      <span className="text-[10px] font-black uppercase">{t.teamB}</span>
                      {selectedTeam === 'B' && (
                        <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-0.5 shadow-md">
                          <CheckCircle2 size={14} />
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Start Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-2.5 rounded-2xl text-xl font-black shadow-xl transition-all uppercase tracking-wider"
                id="start-game-button"
              >
                <Play size={24} fill="currentColor" />
                {t.startBtn}
              </motion.button>
            </div>
          )}

          {gameState === 'playing' && (
            <div className="w-full max-w-2xl flex flex-col items-center gap-2 px-4 relative" id="active-game-panel">
              {/* Pause Overlay */}
              <AnimatePresence>
                {isPaused && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-30 bg-white/40 backdrop-blur-[2px] rounded-3xl flex items-center justify-center"
                    id="pause-active-overlay"
                  >
                    <div className="bg-orange-500 text-white px-6 py-2 rounded-full font-black shadow-xl flex items-center gap-2 animate-bounce">
                      <Pause size={24} />
                      {t.pausedOverlay}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Question Text */}
              <div className="text-center flex flex-col items-center gap-2 w-full z-20">
                {gameMode === 'ai' && !teamATurn && (
                  <div className="flex items-center gap-2 text-orange-600 font-black animate-pulse bg-white/80 px-4 py-1 rounded-full border-2 border-orange-500 text-sm">
                    <Settings size={16} className="animate-spin" />
                    {t.aiThinking}
                  </div>
                )}
                
                <div className="p-3 w-full flex flex-col items-center justify-center min-h-[100px]" id="question-box">
                  <h2 className={`font-black text-gray-900 drop-shadow-sm leading-tight text-center break-words ${
                    (currentQ.q || '').length > 60 ? 'text-xl' : (currentQ.q || '').length > 40 ? 'text-2xl' : 'text-4xl'
                  }`}>
                    {(currentQ.q || '').trim().endsWith('?') ? currentQ.q : `${currentQ.q} = ?`}
                  </h2>
                  
                  {/* Per-question Timer Bar */}
                  {gameMode !== 'time-trial' && questionDuration > 0 && (
                    <div className="w-full max-w-xs mt-4 h-1.5 bg-gray-200 rounded-full overflow-hidden" id="timer-bar">
                      <motion.div 
                        initial={false}
                        animate={{ 
                          width: `${(questionTimeLeft / questionDuration) * 100}%`,
                          backgroundColor: questionTimeLeft < 3 ? '#ef4444' : '#f97316'
                        }}
                        className="h-full"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* User Answer Input Form */}
              <form onSubmit={handleAnswer} className="flex gap-2 w-full max-w-md" id="answer-form">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={(gameMode === 'ai' && !teamATurn) || isProcessing || isPaused}
                  placeholder={(gameMode === 'ai' && !teamATurn) || isProcessing || isPaused ? t.waitingPlaceholder : t.inputPlaceholder}
                  className="flex-1 text-xl p-1.5 border-2 border-white rounded-lg focus:border-orange-500 outline-none font-bold text-center bg-white/90 shadow-inner disabled:bg-gray-100 disabled:text-gray-400"
                  id="answer-input"
                />
                <button
                  type="submit"
                  disabled={(gameMode === 'ai' && !teamATurn) || isProcessing || isPaused}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-1.5 rounded-lg text-lg font-black shadow-md transition-colors disabled:bg-gray-400"
                  id="submit-answer-btn"
                >
                  {t.submitBtn}
                </button>
              </form>

              {/* Feedback Animation */}
              <AnimatePresence mode="wait">
                {feedback.type && (
                  <motion.div
                    key={feedback.text}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`flex items-center gap-2 text-base font-bold ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
                    id="feedback-message"
                  >
                    {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    {feedback.text}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Game Over / Won State */}
          {gameState === 'won' && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-2"
              id="game-over-panel"
            >
              <div className="flex flex-col items-center text-center">
                <div className="flex flex-col items-center gap-2 text-xl font-black text-orange-600">
                  <Trophy size={32} className="text-yellow-500" />
                  <span>{getWinnerTitle()}</span>
                </div>
                {gameMode === 'time-trial' && (
                  <p className="text-gray-600 font-bold text-sm mt-1">{t.correctCount(score)}</p>
                )}
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={startGame}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl text-sm font-black shadow-lg transition-colors"
                  id="play-again-btn"
                >
                  <RotateCcw size={16} />
                  {t.playAgain}
                </button>
                <button
                  onClick={() => setGameState('start')}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-black text-white px-5 py-2 rounded-xl text-sm font-black shadow-lg transition-colors"
                  id="main-menu-btn"
                >
                  <X size={16} />
                  {t.mainMenu}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Teacher Mode Modal */}
      <AnimatePresence>
        {isTeacherMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            id="teacher-modal"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="p-5 sm:p-6 border-b flex justify-between items-center bg-orange-50">
                <div className="flex items-center gap-3">
                  <Settings className="text-orange-600" />
                  <h2 className="text-xl sm:text-2xl font-black text-gray-800 uppercase tracking-tight">
                    {t.teacherTitle}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  {/* Language switch in Teacher Mode */}
                  <div className="flex bg-white p-0.5 rounded-full border border-orange-200 shadow-sm">
                    <button
                      onClick={() => handleToggleLanguage('vi')}
                      className={`px-2.5 py-1 rounded-full text-xs font-black transition-all ${
                        language === 'vi' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:text-orange-600'
                      }`}
                    >
                      Tiếng Việt
                    </button>
                    <button
                      onClick={() => handleToggleLanguage('en')}
                      className={`px-2.5 py-1 rounded-full text-xs font-black transition-all ${
                        language === 'en' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:text-orange-600'
                      }`}
                    >
                      English
                    </button>
                  </div>

                  <button 
                    onClick={() => setIsTeacherMode(false)} 
                    className="p-2 hover:bg-orange-100 rounded-full transition-colors"
                    id="close-teacher-modal"
                  >
                    <X size={22} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                {/* Grade and Topic Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-orange-50 p-4 rounded-2xl border-2 border-orange-100">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-orange-600 uppercase">{t.selectGrade}</label>
                    <select 
                      value={selectedGrade}
                      onChange={(e) => setSelectedGrade(e.target.value)}
                      className="w-full p-3 rounded-xl border-2 border-white bg-white shadow-sm font-bold outline-none focus:border-orange-500"
                      id="grade-select"
                    >
                      {Object.keys(gradeData).map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-orange-600 uppercase">{t.selectTopic}</label>
                    <select 
                      value={selectedTopic}
                      onChange={(e) => handleTopicChange(e.target.value)}
                      className="w-full p-3 rounded-xl border-2 border-white bg-white shadow-sm font-bold outline-none focus:border-orange-500"
                      id="topic-select"
                    >
                      {gradeData[selectedGrade] && Object.keys(gradeData[selectedGrade]).map(topic => (
                        <option key={topic} value={topic}>{topic}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <button 
                      onClick={() => handleTopicChange(selectedTopic)}
                      className="w-full bg-orange-100 text-orange-700 py-3 rounded-xl font-black hover:bg-orange-200 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm"
                      id="use-preset-btn"
                    >
                      <RotateCcw size={18} />
                      {t.usePresetBtn}
                    </button>
                  </div>
                  
                  {/* Time Setting */}
                  <div className="sm:col-span-2 space-y-3 pt-2 border-t border-orange-200">
                    <div className="space-y-1">
                      <label className="text-xs font-black text-orange-600 uppercase">{t.timeLimitLabel}</label>
                      <p className="text-[11px] text-gray-500 italic">{t.timeLimitHint}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-2 flex-1">
                          <input 
                            type="number"
                            min="0"
                            max="600"
                            value={questionDuration}
                            onChange={(e) => setQuestionDuration(parseInt(e.target.value) || 0)}
                            className={`w-full px-4 py-2.5 rounded-xl font-black text-lg outline-none transition-all ${
                              questionDuration > 0 ? 'bg-orange-500 text-white focus:ring-4 focus:ring-orange-200' : 'bg-gray-100 text-gray-400 focus:bg-white focus:ring-4 focus:ring-gray-100'
                            }`}
                            id="duration-input"
                          />
                          <span className="text-orange-600 font-black">{t.secondsUnit}</span>
                        </div>
                        {questionDuration > 0 && (
                          <button 
                            onClick={() => setQuestionDuration(0)}
                            className="bg-gray-200 text-gray-600 px-3 py-2.5 rounded-xl font-bold text-xs hover:bg-gray-300 transition-colors"
                            id="remove-duration-btn"
                          >
                            {t.removeLimitBtn}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add New Question */}
                <div className="bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-200" id="add-question-section">
                  <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">{t.addCustomTitle}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      placeholder={t.questionInputPlaceholder} 
                      value={newQ}
                      onChange={(e) => setNewQ(e.target.value)}
                      className="p-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 outline-none font-bold text-sm"
                      id="custom-q-input"
                    />
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder={t.answerInputPlaceholder} 
                        value={newA}
                        onChange={(e) => setNewA(e.target.value)}
                        className="flex-1 p-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 outline-none font-bold text-sm"
                        id="custom-a-input"
                      />
                      <button 
                        onClick={addQuestion}
                        className="bg-orange-500 text-white p-3 rounded-xl hover:bg-orange-600 transition-colors shadow-lg"
                        title="Thêm câu hỏi"
                        id="add-custom-q-btn"
                      >
                        <Plus size={24} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Question List */}
                <div className="space-y-2" id="questions-list-view">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-gray-500 uppercase">{t.questionsListTitle(questionsList.length)}</h3>
                    {questionsList.length > 0 && (
                      <button 
                        onClick={() => {
                          if (confirm(t.deleteAllConfirm)) {
                            setQuestionsList([]);
                            setUsedIndices([]);
                          }
                        }}
                        className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                        id="delete-all-btn"
                      >
                        <Trash2 size={14} />
                        {t.deleteAllBtn}
                      </button>
                    )}
                  </div>
                  {questionsList.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                      <p className="text-gray-400 font-bold italic text-sm">{t.noQuestionsMessage}</p>
                    </div>
                  ) : (
                    questionsList.map((q, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3.5 bg-white border-2 border-gray-100 rounded-2xl hover:border-orange-200 transition-colors group">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 font-mono text-xs w-6">{idx + 1}.</span>
                          <span className="font-bold text-gray-700 text-base">{q.q.trim().endsWith('?') ? q.q : `${q.q} = ?`}</span>
                          <span className="text-orange-600 font-black text-base">= {q.a}</span>
                        </div>
                        <button 
                          onClick={() => deleteQuestion(idx)}
                          className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          title="Xóa câu hỏi"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="p-5 border-t bg-gray-50 flex justify-end">
                <button 
                  onClick={() => setIsTeacherMode(false)}
                  className="bg-gray-800 text-white px-8 py-2.5 rounded-xl font-black shadow-lg hover:bg-black transition-colors"
                  id="done-teacher-btn"
                >
                  {t.doneBtn}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
