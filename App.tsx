
import React, { useState, useEffect } from 'react';
import { 
  fetchGlobalQuestions, fetchAllUsers, fetchUserData, saveUserData, 
  saveGlobalQuestions, updateUserProfile, createNewUser, renameUser
} from './services/firebase';
import { Question, User, UserData, QuizHistoryItem, QuizSession, UserProfile, Answer } from './types';
import { 
  LayoutDashboard, PlayCircle, AlertTriangle, History, Trophy, 
  Settings, Edit3, Users as UsersIcon, LogOut, ChevronRight, X, 
  Wifi, WifiOff, Save, Trash2, Plus, RefreshCw, Menu, 
  Lock, Eye, EyeOff, UserPlus, Search, UserCheck, Shield, Ban, Heart, Palette, Download,
  SkipForward, CheckCircle, XCircle, Lightbulb, HelpCircle, Shuffle, Edit, Check,
  Home, LifeBuoy, RotateCcw
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

// --- THEME CONFIGURATION ---

const THEMES: Record<string, any> = {
    // BASIC
    'basic-indigo': {
        label: 'Indigo', type: 'basic', color: '#4f46e5',
        sidebar: 'bg-indigo-950', sidebarText: 'text-indigo-100',
        primary: 'bg-indigo-600', primaryHover: 'hover:bg-indigo-700', primaryText: 'text-indigo-600',
        lightBg: 'bg-indigo-50', border: 'border-indigo-200',
        navActive: 'bg-indigo-600 text-white', navInactive: 'text-indigo-300 hover:bg-white/5 hover:text-white'
    },
    'basic-emerald': {
        label: 'Emerald', type: 'basic', color: '#10b981',
        sidebar: 'bg-emerald-900', sidebarText: 'text-emerald-100',
        primary: 'bg-emerald-600', primaryHover: 'hover:bg-emerald-700', primaryText: 'text-emerald-600',
        lightBg: 'bg-emerald-50', border: 'border-emerald-200',
        navActive: 'bg-emerald-600 text-white', navInactive: 'text-emerald-300 hover:bg-white/5 hover:text-white'
    },
    'basic-slate': {
        label: 'Slate', type: 'basic', color: '#475569',
        sidebar: 'bg-slate-900', sidebarText: 'text-slate-100',
        primary: 'bg-slate-600', primaryHover: 'hover:bg-slate-700', primaryText: 'text-slate-600',
        lightBg: 'bg-slate-100', border: 'border-slate-200',
        navActive: 'bg-slate-600 text-white', navInactive: 'text-slate-400 hover:bg-white/5 hover:text-white'
    },
    'basic-crimson': {
        label: 'Crimson', type: 'basic', color: '#dc2626',
        sidebar: 'bg-red-950', sidebarText: 'text-red-100',
        primary: 'bg-red-600', primaryHover: 'hover:bg-red-700', primaryText: 'text-red-600',
        lightBg: 'bg-red-50', border: 'border-red-200',
        navActive: 'bg-red-600 text-white', navInactive: 'text-red-300 hover:bg-white/5 hover:text-white'
    },
    'basic-ocean': {
        label: 'Ocean', type: 'basic', color: '#1d4ed8',
        sidebar: 'bg-blue-950', sidebarText: 'text-blue-100',
        primary: 'bg-blue-700', primaryHover: 'hover:bg-blue-800', primaryText: 'text-blue-700',
        lightBg: 'bg-blue-50', border: 'border-blue-200',
        navActive: 'bg-blue-700 text-white', navInactive: 'text-blue-300 hover:bg-white/5 hover:text-white'
    },
    'basic-obsidian': {
        label: 'Obsidian', type: 'basic', color: '#171717',
        sidebar: 'bg-neutral-950', sidebarText: 'text-neutral-200',
        primary: 'bg-neutral-800', primaryHover: 'hover:bg-neutral-900', primaryText: 'text-neutral-800',
        lightBg: 'bg-neutral-100', border: 'border-neutral-200',
        navActive: 'bg-neutral-800 text-white', navInactive: 'text-neutral-500 hover:bg-white/5 hover:text-white'
    },
    'basic-amber': {
        label: 'Amber', type: 'basic', color: '#d97706',
        sidebar: 'bg-stone-900', sidebarText: 'text-amber-100',
        primary: 'bg-amber-600', primaryHover: 'hover:bg-amber-700', primaryText: 'text-amber-700',
        lightBg: 'bg-amber-50', border: 'border-amber-200',
        navActive: 'bg-amber-600 text-white', navInactive: 'text-amber-200 hover:bg-white/5 hover:text-white'
    },

    // PASTEL
    'pastel-rose': {
        label: 'Rose', type: 'pastel', color: '#fda4af',
        sidebar: 'bg-rose-100', sidebarText: 'text-rose-950',
        primary: 'bg-rose-400', primaryHover: 'hover:bg-rose-500', primaryText: 'text-rose-600',
        lightBg: 'bg-rose-50', border: 'border-rose-200',
        navActive: 'bg-rose-300 text-rose-950 font-bold border border-rose-400 shadow-sm', 
        navInactive: 'text-rose-700 hover:bg-rose-200/50'
    },
    'pastel-sky': {
        label: 'Sky', type: 'pastel', color: '#7dd3fc',
        sidebar: 'bg-sky-100', sidebarText: 'text-sky-950',
        primary: 'bg-sky-400', primaryHover: 'hover:bg-sky-500', primaryText: 'text-sky-600',
        lightBg: 'bg-sky-50', border: 'border-sky-200',
        navActive: 'bg-sky-300 text-sky-950 font-bold border border-sky-400 shadow-sm', 
        navInactive: 'text-sky-700 hover:bg-sky-200/50'
    },
    'pastel-violet': {
        label: 'Lilac', type: 'pastel', color: '#c4b5fd',
        sidebar: 'bg-violet-100', sidebarText: 'text-violet-950',
        primary: 'bg-violet-400', primaryHover: 'hover:bg-violet-500', primaryText: 'text-violet-600',
        lightBg: 'bg-violet-50', border: 'border-violet-200',
        navActive: 'bg-violet-300 text-violet-950 font-bold border border-violet-400 shadow-sm', 
        navInactive: 'text-violet-700 hover:bg-violet-200/50'
    },
    'pastel-mint': {
        label: 'Mint', type: 'pastel', color: '#6ee7b7',
        sidebar: 'bg-emerald-50', sidebarText: 'text-emerald-950',
        primary: 'bg-emerald-400', primaryHover: 'hover:bg-emerald-500', primaryText: 'text-emerald-600',
        lightBg: 'bg-emerald-50/50', border: 'border-emerald-200',
        navActive: 'bg-emerald-300 text-emerald-950 font-bold border border-emerald-400 shadow-sm', 
        navInactive: 'text-emerald-700 hover:bg-emerald-100'
    },
    'pastel-peach': {
        label: 'Peach', type: 'pastel', color: '#fdba74',
        sidebar: 'bg-orange-50', sidebarText: 'text-orange-950',
        primary: 'bg-orange-400', primaryHover: 'hover:bg-orange-500', primaryText: 'text-orange-600',
        lightBg: 'bg-orange-50/50', border: 'border-orange-200',
        navActive: 'bg-orange-300 text-orange-950 font-bold border border-orange-400 shadow-sm', 
        navInactive: 'text-orange-700 hover:bg-orange-100'
    },
    'pastel-lemon': {
        label: 'Lemon', type: 'pastel', color: '#fcd34d',
        sidebar: 'bg-yellow-50', sidebarText: 'text-yellow-950',
        primary: 'bg-yellow-400', primaryHover: 'hover:bg-yellow-500', primaryText: 'text-yellow-700',
        lightBg: 'bg-yellow-50/50', border: 'border-yellow-200',
        navActive: 'bg-yellow-300 text-yellow-950 font-bold border border-yellow-400 shadow-sm', 
        navInactive: 'text-yellow-700 hover:bg-yellow-100'
    },
    'pastel-periwinkle': {
        label: 'Peri', type: 'pastel', color: '#a5b4fc',
        sidebar: 'bg-indigo-50', sidebarText: 'text-indigo-950',
        primary: 'bg-indigo-400', primaryHover: 'hover:bg-indigo-500', primaryText: 'text-indigo-600',
        lightBg: 'bg-indigo-50/50', border: 'border-indigo-200',
        navActive: 'bg-indigo-300 text-indigo-950 font-bold border border-indigo-400 shadow-sm', 
        navInactive: 'text-indigo-700 hover:bg-indigo-100'
    },

    // NEON
    'neon-cyan': {
        label: 'Cyber', type: 'neon', color: '#06b6d4',
        sidebar: 'bg-slate-950', sidebarText: 'text-cyan-400',
        primary: 'bg-cyan-500', primaryHover: 'hover:bg-cyan-400', primaryText: 'text-cyan-600',
        lightBg: 'bg-slate-50', border: 'border-cyan-500',
        navActive: 'bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.6)]', 
        navInactive: 'text-cyan-600/70 hover:text-cyan-300 hover:bg-cyan-950/50'
    },
    'neon-lime': {
        label: 'Toxic', type: 'neon', color: '#84cc16',
        sidebar: 'bg-black', sidebarText: 'text-lime-400',
        primary: 'bg-lime-500', primaryHover: 'hover:bg-lime-400', primaryText: 'text-lime-600',
        lightBg: 'bg-stone-50', border: 'border-lime-500',
        navActive: 'bg-lime-500 text-black font-bold shadow-[0_0_15px_rgba(132,204,22,0.6)]', 
        navInactive: 'text-lime-600/70 hover:text-lime-300 hover:bg-lime-900/50'
    },
    'neon-fuchsia': {
        label: 'Synth', type: 'neon', color: '#d946ef',
        sidebar: 'bg-gray-950', sidebarText: 'text-fuchsia-400',
        primary: 'bg-fuchsia-500', primaryHover: 'hover:bg-fuchsia-400', primaryText: 'text-fuchsia-600',
        lightBg: 'bg-fuchsia-50', border: 'border-fuchsia-500',
        navActive: 'bg-fuchsia-500 text-white font-bold shadow-[0_0_15px_rgba(217,70,239,0.6)]', 
        navInactive: 'text-fuchsia-600/70 hover:text-fuchsia-300 hover:bg-fuchsia-900/50'
    },
    'neon-matrix': {
        label: 'Matrix', type: 'neon', color: '#22c55e',
        sidebar: 'bg-black', sidebarText: 'text-green-400',
        primary: 'bg-green-600', primaryHover: 'hover:bg-green-500', primaryText: 'text-green-600',
        lightBg: 'bg-gray-50', border: 'border-green-500',
        navActive: 'bg-green-600 text-black font-bold shadow-[0_0_15px_rgba(34,197,94,0.6)]',
        navInactive: 'text-green-600/70 hover:text-green-300 hover:bg-green-900/50'
    },
    'neon-inferno': {
        label: 'Inferno', type: 'neon', color: '#ef4444',
        sidebar: 'bg-gray-950', sidebarText: 'text-red-500',
        primary: 'bg-red-600', primaryHover: 'hover:bg-red-500', primaryText: 'text-red-600',
        lightBg: 'bg-stone-50', border: 'border-red-500',
        navActive: 'bg-red-600 text-white font-bold shadow-[0_0_15px_rgba(239,68,68,0.6)]',
        navInactive: 'text-red-600/70 hover:text-red-400 hover:bg-red-900/50'
    },
    'neon-plasma': {
        label: 'Plasma', type: 'neon', color: '#8b5cf6',
        sidebar: 'bg-slate-950', sidebarText: 'text-violet-400',
        primary: 'bg-violet-600', primaryHover: 'hover:bg-violet-500', primaryText: 'text-violet-600',
        lightBg: 'bg-slate-50', border: 'border-violet-500',
        navActive: 'bg-violet-600 text-white font-bold shadow-[0_0_15px_rgba(139,92,246,0.6)]',
        navInactive: 'text-violet-600/70 hover:text-violet-400 hover:bg-violet-900/50'
    },
    'neon-voltage': {
        label: 'Voltage', type: 'neon', color: '#eab308',
        sidebar: 'bg-slate-950', sidebarText: 'text-yellow-400',
        primary: 'bg-yellow-500', primaryHover: 'hover:bg-yellow-400', primaryText: 'text-yellow-600',
        lightBg: 'bg-yellow-50', border: 'border-yellow-500',
        navActive: 'bg-yellow-500 text-black font-bold shadow-[0_0_15px_rgba(234,179,8,0.6)]',
        navInactive: 'text-yellow-600/70 hover:text-yellow-300 hover:bg-yellow-900/50'
    }
};

type ThemeKey = keyof typeof THEMES;

// --- HELPER FUNCTIONS ---

const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// --- COMPONENTS ---

const LoginScreen = ({ onLogin }: { onLogin: (u: User) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) return setError("Παρακαλώ συμπληρώστε όλα τα πεδία");
    setLoading(true);
    setError('');

    try {
      const users = await fetchAllUsers();
      const target = users[username];

      if (target) {
          if (target.suspended) {
              setError("Ο λογαριασμός έχει ανασταλεί. Επικοινωνήστε με τον διαχειριστή.");
          } else if (target.password === password) {
              onLogin({ username, ...target });
          } else {
              setError("Λάθος όνομα χρήστη ή κωδικός");
          }
      } else {
        setError("Λάθος όνομα χρήστη ή κωδικός");
      }
    } catch (e) {
      setError("Σφάλμα σύνδεσης");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-indigo-950 z-50 flex flex-col items-center justify-center text-white p-4">
      <div className="text-5xl mb-3">⚡️</div>
      <h1 className="text-xl font-bold mb-2">Ενεργειακές Τεχνολογίες</h1>
      <p className="text-indigo-200 mb-6 text-sm">Συνδεθείτε για να ξεκινήσετε</p>
      
      <div className="bg-white text-gray-800 p-5 rounded-2xl w-full max-w-xs flex flex-col gap-3 shadow-xl">
        <input 
          className="p-2.5 border-2 border-gray-200 rounded-lg text-center text-base focus:outline-none focus:border-indigo-500 transition-colors bg-white text-gray-900 placeholder-gray-400"
          placeholder="Όνομα Χρήστη"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <div className="relative w-full">
            <input 
              type={showPassword ? "text" : "password"}
              className="w-full p-2.5 border-2 border-gray-200 rounded-lg text-center text-base focus:outline-none focus:border-indigo-500 transition-colors bg-white text-gray-900 placeholder-gray-400"
              value={password}
              placeholder="Κωδικός Πρόσβασης"
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                tabIndex={-1}
            >
                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
        </div>

        <button 
          onClick={handleLogin}
          disabled={loading}
          className="bg-indigo-600 text-white p-2.5 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 transition-transform active:scale-95 text-sm"
        >
          {loading ? 'Έλεγχος...' : 'Είσοδος'}
        </button>
        {error && <div className="text-red-500 text-center text-xs font-medium">{error}</div>}
      </div>
    </div>
  );
};

const LandingView = ({ 
    user, userData, onStartQuiz, theme, onViewChange 
}: { 
    user: User, userData: UserData, onStartQuiz: () => void, theme: ThemeKey, onViewChange: (v: any) => void 
}) => {
    const styles = THEMES[theme] || THEMES['basic-indigo'];
    
    return (
        <div className="animate-slide-up space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-800">Γεια σου, {user.username}! 👋</h1>
                <p className="text-gray-500 text-sm">Καλωσήρθες στο Quiz ET.</p>
            </div>

            {/* Active Session Card */}
            {userData.session && userData.session.type !== 'mistakes' && (
                <div className={`${styles.lightBg} border-2 ${styles.border} p-5 rounded-2xl flex items-center justify-between shadow-sm`}>
                    <div>
                        <h3 className={`font-bold ${styles.primaryText} text-lg mb-1`}>Συνέχιση Τεστ</h3>
                        <p className="text-xs text-gray-600 font-medium">
                            Ερώτηση {userData.session.index + 1} από {userData.session.questions.length} • Σκορ: {userData.session.score}
                        </p>
                    </div>
                    <button 
                        onClick={() => onViewChange('quiz')}
                        className={`${styles.primary} text-white p-3 rounded-full shadow-lg ${styles.primaryHover} transition-transform active:scale-95`}
                    >
                        <PlayCircle size={28} />
                    </button>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                {/* Quick Stats */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-1">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Best Score</div>
                    <div className="text-2xl font-black text-gray-800">{user.bestScore}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-1">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Quizzes</div>
                    <div className="text-2xl font-black text-gray-800">{user.totalQuizzes}</div>
                </div>
                
                {/* Mistakes Card */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between gap-2 relative overflow-hidden group">
                    <div>
                        <div className="flex justify-between items-start">
                            <div className="text-xs font-bold text-orange-500 uppercase tracking-wider flex items-center gap-1">
                                <AlertTriangle size={12}/> Λαθη
                            </div>
                        </div>
                        <div className="text-2xl font-black text-gray-800 mt-1">{userData.mistakes.length}</div>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12 text-orange-500">
                        <AlertTriangle size={80} />
                    </div>
                </div>

                {/* SOS Card */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between gap-2 relative overflow-hidden">
                    <div>
                        <div className="text-xs font-bold text-red-500 uppercase tracking-wider flex items-center gap-1">
                            <LifeBuoy size={12}/> SOS
                        </div>
                        <div className="text-2xl font-black text-gray-800 mt-1">{userData.favorites?.length || 0}</div>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12 text-red-500">
                        <LifeBuoy size={80} />
                    </div>
                </div>
            </div>

            <button 
                onClick={onStartQuiz} 
                className={`w-full py-4 rounded-xl font-bold text-white ${styles.primary} shadow-lg shadow-indigo-200/50 flex items-center justify-center gap-3 ${styles.primaryHover} transition-all`}
            >
                <LayoutDashboard size={20}/> Ξεκινήστε Νέο Τεστ
            </button>
        </div>
    );
};

const QuizView = ({ 
  questions, onFinish, session, onPause, onToggleFavorite, favorites, theme, shuffleEnabled
}: { 
  questions: Question[], 
  onFinish: (score: number, total: number, mistakes: number[]) => void,
  session: QuizSession | null,
  onPause: (sess: QuizSession) => void,
  onToggleFavorite: (id: number) => void,
  favorites: number[],
  theme: ThemeKey,
  shuffleEnabled: boolean
}) => {
  // Correctly initialize from session questions if resuming, ensuring skipped questions are preserved
  const [quizQuestions, setQuizQuestions] = useState<Question[]>(session?.questions || questions);
  const [currentIndex, setCurrentIndex] = useState(session?.index || 0);
  const [score, setScore] = useState(session?.score || 0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]); 
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mistakes, setMistakes] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [currentAnswers, setCurrentAnswers] = useState<Answer[]>([]);
  
  const styles = THEMES[theme] || THEMES['basic-indigo'];
  const currentQ = quizQuestions[currentIndex];
  const isFav = favorites.includes(currentQ.id);

  useEffect(() => {
    setShowHint(false);
    setSelectedAnswers([]);
    setIsSubmitted(false);
    
    // Handle Shuffling
    let ans = [...quizQuestions[currentIndex].answers];
    if (shuffleEnabled) {
        // Simple Shuffle
        ans = ans
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
    }
    setCurrentAnswers(ans);

  }, [currentIndex, quizQuestions, shuffleEnabled]);

  const handleSelect = (idx: number) => {
    if (isSubmitted) return;
    if (selectedAnswers.includes(idx)) {
      setSelectedAnswers(selectedAnswers.filter(i => i !== idx));
    } else {
      setSelectedAnswers([...selectedAnswers, idx]); 
    }
  };

  const handleSubmit = () => {
    // Calculate based on currentAnswers (which may be shuffled)
    const correctIndices = currentAnswers
      .map((a, i) => a.correct ? i : -1)
      .filter(i => i !== -1);
    
    const isCorrect = 
      selectedAnswers.length === correctIndices.length && 
      selectedAnswers.every(i => correctIndices.includes(i));

    if (isCorrect) {
      setScore(s => s + 1);
    } else {
      setMistakes(prev => [...prev, currentQ.id]);
    }
    setIsSubmitted(true);
  };

  const handleSkip = () => {
      // Move the current question to the end of the queue
      setQuizQuestions(prev => [...prev, quizQuestions[currentIndex]]);
      // Move to next index immediately (effectively showing the next question)
      // We don't increment mistakes here as the user will answer it later
      setCurrentIndex(i => i + 1);
  };

  const handleNext = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      onFinish(score, quizQuestions.length, mistakes);
    }
  };

  const progress = Math.round(((currentIndex) / quizQuestions.length) * 100);

  return (
    <div className="animate-slide-up max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-1">
        <div className="text-xs font-bold text-gray-500">ΕΡΩΤΗΣΗ {currentIndex + 1} / {quizQuestions.length}</div>
        <div className={`text-base font-bold ${styles.primaryText}`}>Score: {score}</div>
      </div>

      <div className="flex justify-end gap-2 mb-3">
          <button 
            onClick={() => onToggleFavorite(currentQ.id)}
            className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${isFav ? 'text-red-500' : 'text-gray-400'}`}
            title="Προσθήκη στα SOS"
          >
            <LifeBuoy fill={isFav ? "currentColor" : "none"} size={18} />
          </button>
          <button 
            onClick={() => onPause({ questions: quizQuestions, index: currentIndex, score, type: session?.type || 'all' })}
            className={`${styles.primaryText} ${styles.lightBg} px-2 py-1 rounded-lg text-xs font-medium`}
          >
            ⏸ Παύση
          </button>
      </div>
      
      <div className="w-full h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
        <div 
          className={`h-full ${styles.primary} transition-all duration-500 ease-out opacity-80`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 leading-snug">
        {currentQ.question}
      </h2>

      {showHint && (
          <div className="mb-4 bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-lg text-amber-900 text-sm animate-slide-up flex gap-2">
              <Lightbulb size={18} className="shrink-0 text-amber-600" />
              <div className="font-medium leading-relaxed">
                  {currentQ.hint ? currentQ.hint : "Δεν υπάρχει διαθέσιμη βοήθεια για αυτή την ερώτηση."}
              </div>
          </div>
      )}

      <div className="space-y-2 mb-6">
        {currentAnswers.map((ans, idx) => {
          const isSelected = selectedAnswers.includes(idx);
          const isCorrect = ans.correct;
          
          let containerClass = "w-full p-3 text-left rounded-xl border-2 font-medium transition-all flex items-center justify-between group relative text-sm md:text-base ";
          
          if (isSubmitted) {
            if (isCorrect && isSelected) {
                containerClass += "bg-emerald-500 border-emerald-500 text-white shadow-lg";
            } else if (isCorrect && !isSelected) {
                containerClass += "bg-emerald-50 border-emerald-500 text-emerald-700";
            } else if (!isCorrect && isSelected) {
                containerClass += "bg-red-500 border-red-500 text-white shadow-lg";
            } else {
                containerClass += "bg-gray-50 border-gray-100 text-gray-400 opacity-60";
            }
          } else {
            if (isSelected) {
                containerClass += `${styles.primary} border-transparent text-white shadow-md -translate-y-0.5`;
            } else {
                containerClass += `bg-white border-gray-200 text-gray-700 hover:border-current hover:${styles.primaryText} hover:${styles.lightBg} active:scale-[0.99]`;
            }
          }

          return (
            <button key={idx} onClick={() => handleSelect(idx)} disabled={isSubmitted} className={containerClass}>
              <span className="flex-1 leading-tight">{ans.text}</span>
              {isSubmitted && (
                  <div className="ml-2 shrink-0">
                      {isCorrect && isSelected && <CheckCircle size={20} className="text-white" />}
                      {isCorrect && !isSelected && <CheckCircle size={20} className="text-emerald-600" />}
                      {!isCorrect && isSelected && <XCircle size={20} className="text-white" />}
                  </div>
              )}
              {!isSubmitted && (
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-white bg-white/20' : 'border-gray-300 group-hover:border-current'}`}>
                     {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2 mt-4">
        {!isSubmitted ? (
          <>
            <button 
                onClick={() => setShowHint(!showHint)}
                className={`px-3 py-2.5 rounded-xl font-bold border-2 transition-all ${showHint ? 'bg-amber-100 border-amber-300 text-amber-700' : 'bg-white border-amber-200 text-amber-500 hover:bg-amber-50'}`}
                title="Εμφάνιση βοήθειας"
            >
                <Lightbulb size={22} fill={showHint ? "currentColor" : "none"} />
            </button>
            <button 
                onClick={handleSkip}
                className="px-4 py-2.5 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                title="Παράλειψη (θα ερωτηθεί ξανά στο τέλος)"
            >
                <SkipForward size={22} />
            </button>
            <button 
                onClick={handleSubmit} 
                disabled={selectedAnswers.length === 0}
                className={`flex-1 ${styles.primary} text-white py-2.5 rounded-xl font-bold ${styles.primaryHover} disabled:opacity-50 disabled:hover:${styles.primary} transition-colors shadow-md flex justify-center items-center gap-2 text-sm`}
            >
                Υποβολή
            </button>
          </>
        ) : (
          <button 
            onClick={handleNext}
            className={`flex-1 ${styles.primary} text-white py-2.5 rounded-xl font-bold ${styles.primaryHover} transition-colors shadow-md flex items-center justify-center gap-2 text-sm`}
          >
            Επόμενη <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

const ResultsView = ({ 
  score, total, onRestart, theme, onViewChange
}: { 
  score: number, total: number, onRestart: (type: 'all' | 'mistakes' | 'favorites') => void, theme: ThemeKey, onViewChange: (v: any) => void
}) => {
  const percent = Math.round((score / total) * 100);
  const styles = THEMES[theme] || THEMES['basic-indigo'];
  
  return (
    <div className="text-center animate-slide-up py-6">
      <div className={`inline-flex items-center justify-center w-20 h-20 ${styles.lightBg} rounded-full mb-4 text-3xl`}>
        {percent >= 80 ? '🏆' : percent >= 50 ? '👍' : '📚'}
      </div>
      <h2 className="text-xl font-bold mb-2 text-gray-800">Ολοκλήρωση Τεστ</h2>
      <p className={`text-3xl font-black ${styles.primaryText} mb-6`}>{score} / {total} <span className="text-base text-gray-500 font-medium">({percent}%)</span></p>
      
      <div className="flex flex-col gap-2 max-w-xs mx-auto">
        <button onClick={() => onRestart('all')} className={`${styles.primary} text-white py-2.5 rounded-xl font-bold ${styles.primaryHover} shadow-md text-sm`}>
          Επανάληψη Τεστ
        </button>
        <button onClick={() => onRestart('mistakes')} className="bg-amber-500 text-white py-2.5 rounded-xl font-bold hover:bg-amber-600 shadow-md text-sm">
          Εξάσκηση Λαθών
        </button>
        <button onClick={() => onViewChange('landing')} className="bg-gray-100 text-gray-600 py-2.5 rounded-xl font-bold hover:bg-gray-200 shadow-sm text-sm mt-2">
          Επιστροφή στην Αρχική
        </button>
      </div>
    </div>
  );
};

const EditorView = ({ 
  allQuestions, onSave 
}: { 
  allQuestions: Question[], onSave: (qs: Question[]) => void 
}) => {
  const [questions, setQuestions] = useState<Question[]>(allQuestions);
  const [saving, setSaving] = useState(false);

  const handleUpdate = (idx: number, field: string, value: any) => {
    const copy = [...questions];
    copy[idx] = { ...copy[idx], [field]: value };
    setQuestions(copy);
  };

  const handleAnswerUpdate = (qIdx: number, aIdx: number, field: string, value: any) => {
    const copy = [...questions];
    copy[qIdx].answers[aIdx] = { ...copy[qIdx].answers[aIdx], [field]: value };
    setQuestions(copy);
  };

  const addAnswer = (qIdx: number) => {
    const copy = [...questions];
    copy[qIdx].answers.push({ text: '', correct: false });
    setQuestions(copy);
  };

  const removeAnswer = (qIdx: number, aIdx: number) => {
    const copy = [...questions];
    copy[qIdx].answers = copy[qIdx].answers.filter((_, i) => i !== aIdx);
    setQuestions(copy);
  };

  const addNewQuestion = () => {
    const maxId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) : 0;
    setQuestions([...questions, { id: maxId + 1, question: '', hint: '', answers: [{ text: '', correct: false }] }]);
  };

  const deleteQuestion = (id: number) => {
    if (confirm('Διαγραφή ερώτησης;')) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(questions);
      alert('Saved!');
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-slide-up">
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-white p-3 z-10 shadow-sm rounded-xl">
        <h2 className="text-lg font-bold">Επεξεργασία</h2>
        <div className="flex gap-2">
            <button onClick={addNewQuestion} className="bg-indigo-100 text-indigo-700 p-2 rounded-lg font-bold hover:bg-indigo-200"><Plus size={18}/></button>
            <button onClick={handleSave} className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-600 flex items-center gap-2 text-sm">
                {saving ? <RefreshCw className="animate-spin" size={16}/> : <Save size={16}/>} Save
            </button>
        </div>
      </div>
      <div className="space-y-4">
        {questions.map((q, qIdx) => (
          <div key={q.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-500 text-xs">#</span>
                    <input 
                        type="number" 
                        value={q.id} 
                        onChange={e => handleUpdate(qIdx, 'id', parseInt(e.target.value))}
                        className="w-14 border rounded p-1 font-mono bg-white text-gray-900 text-xs"
                    />
                </div>
                <button onClick={() => deleteQuestion(q.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
            </div>
            <textarea 
              value={q.question} 
              onChange={e => handleUpdate(qIdx, 'question', e.target.value)}
              className="w-full p-2 border rounded-lg mb-2 focus:border-indigo-500 focus:outline-none bg-white text-gray-900 min-h-[60px] text-sm"
              placeholder="Question text..."
            />
            <div className="mb-3">
                <textarea 
                  value={q.hint || ''} 
                  onChange={e => handleUpdate(qIdx, 'hint', e.target.value)}
                  className="w-full p-2 border-l-4 border-amber-400 bg-amber-50 rounded-r-lg text-xs focus:outline-none text-gray-900"
                  placeholder="Hint (optional, user can request)..."
                />
            </div>
            
            <div className="space-y-2 pl-2 border-l-2 border-gray-100">
              {q.answers.map((ans, aIdx) => (
                <div key={aIdx} className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={ans.correct} 
                    onChange={e => handleAnswerUpdate(qIdx, aIdx, 'correct', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                  <input 
                    type="text" 
                    value={ans.text} 
                    onChange={e => handleAnswerUpdate(qIdx, aIdx, 'text', e.target.value)}
                    className="flex-1 p-1.5 border rounded focus:border-indigo-500 focus:outline-none bg-white text-gray-900 text-sm"
                    placeholder="Answer..."
                  />
                  <button onClick={() => removeAnswer(qIdx, aIdx)} className="text-gray-400 hover:text-red-500"><X size={14}/></button>
                </div>
              ))}
              <button onClick={() => addAnswer(qIdx)} className="text-xs text-indigo-500 font-medium hover:underline">+ Add Answer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const HistoryView = ({ 
    history, onClear, theme
}: { history: QuizHistoryItem[], onClear: () => void, theme: ThemeKey }) => {
    // Show oldest to newest
    const sortedHistory = [...history]; 
    const styles = THEMES[theme] || THEMES['basic-indigo'];

    const data = sortedHistory.map(h => ({
        date: formatDate(h.timestamp),
        score: h.percent
    }));

    return (
        <div className="animate-slide-up space-y-6">
            <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-700 mb-3 text-sm">Πρόοδος (Παλαιότερα → Νεότερα)</h3>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="date" fontSize={10} tick={{fill: '#9ca3af'}} />
                            <YAxis domain={[0, 100]} fontSize={10} tick={{fill: '#9ca3af'}} />
                            <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px'}} />
                            <Line type="monotone" dataKey="score" stroke={styles.color || '#4f46e5'} strokeWidth={2} dot={{r:3}} activeDot={{r:5}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-xs md:text-sm">
                    <thead className="bg-gray-50 text-gray-500 uppercase">
                        <tr>
                            <th className="p-3">Date</th>
                            <th className="p-3">Type</th>
                            <th className="p-3">Score</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sortedHistory.map((h, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="p-3">{formatDate(h.timestamp)}</td>
                                <td className="p-3 capitalize">{h.quizType}</td>
                                <td className="p-3 font-bold text-gray-700">{h.score}/{h.total} ({h.percent}%)</td>
                            </tr>
                        ))}
                        {history.length === 0 && <tr><td colSpan={3} className="p-6 text-center text-gray-400">No history yet.</td></tr>}
                    </tbody>
                </table>
            </div>

            <button onClick={onClear} className="w-full py-2.5 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 font-medium transition-colors text-sm">
                Clear History
            </button>
        </div>
    );
};

const LeaderboardView = ({ currentUser, theme }: { currentUser: User, theme: ThemeKey }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await fetchAllUsers();
            const list = Object.keys(data).map(k => ({ username: k, ...data[k] })).filter(u => u.isVisible && !u.suspended);
            list.sort((a, b) => b.bestScore - a.bestScore || b.totalQuizzes - a.totalQuizzes);
            setUsers(list);
            setLoading(false);
        };
        load();
    }, []);

    const styles = THEMES[theme] || THEMES['basic-indigo'];

    if (loading) return <div className="p-6 text-center text-sm">Loading...</div>;

    return (
        <div className="animate-slide-up">
            <h2 className="text-lg font-bold mb-2">Leaderboard 🏆</h2>
            <p className="text-xs text-gray-500 mb-3">Οι καλύτεροι βαθμοί από χρήστες που έχουν ενεργοποιήσει τη δημόσια προβολή.</p>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className={`${styles.lightBg} ${styles.primaryText}`}>
                        <tr>
                            <th className="p-3 text-left">#</th>
                            <th className="p-3 text-left">User</th>
                            <th className="p-3 text-right">Best Score</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((u, i) => (
                            <tr key={u.username} className={u.username === currentUser.username ? `${styles.lightBg} opacity-80` : ""}>
                                <td className="p-3 font-bold text-gray-400">
                                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                                </td>
                                <td className="p-3 font-medium text-gray-700">{u.username}</td>
                                <td className={`p-3 text-right font-bold ${styles.primaryText}`}>{u.bestScore}</td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr><td colSpan={3} className="p-6 text-center text-gray-400">No public profiles yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const SettingsView = ({ 
    user, onUpdate, onRename, onResetAccount, theme 
}: { 
    user: User, 
    onUpdate: (u: Partial<UserProfile>) => void, 
    onRename: (oldN: string, newN: string) => void,
    onResetAccount: () => void,
    theme: ThemeKey
}) => {
    const [visible, setVisible] = useState(user.isVisible);
    const [shuffle, setShuffle] = useState(user.shuffleAnswers || false);
    const [password, setPassword] = useState('');
    const [newUsername, setNewUsername] = useState('');
    
    const styles = THEMES[theme] || THEMES['basic-indigo'];
    const categories = ['basic', 'pastel', 'neon'];

    const handleVisibilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVisible(e.target.checked);
        onUpdate({ isVisible: e.target.checked });
    };

    const handleShuffleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShuffle(e.target.checked);
        onUpdate({ shuffleAnswers: e.target.checked });
    };

    const handlePasswordChange = () => {
        if(password.length < 3) return alert("Ο κωδικός πρέπει να είναι τουλάχιστον 3 χαρακτήρες.");
        onUpdate({ password });
        setPassword('');
        alert("Ο κωδικός ενημερώθηκε!");
    };

    const handleRename = () => {
        if(newUsername.length < 3) return alert("Το όνομα πρέπει να είναι τουλάχιστον 3 χαρακτήρες.");
        onRename(user.username, newUsername);
    };

    const handleResetProfileClick = () => {
        if (window.confirm("ΠΡΟΣΟΧΗ: Θα διαγραφούν όλα τα στατιστικά, το ιστορικό και η πρόοδος σας. Η ενέργεια δεν αναιρείται. Είστε σίγουροι;")) {
            onResetAccount();
        }
    };

    return (
        <div className="animate-slide-up space-y-6">
            <h2 className="text-lg font-bold mb-2">Ρυθμίσεις Προφίλ ⚙️</h2>
            
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm"><Palette size={18}/> Θέμα Εφαρμογής</h3>
                
                <div className="space-y-4">
                    {categories.map(cat => (
                        <div key={cat}>
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-wider">{cat}</h4>
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide touch-pan-x">
                                {Object.entries(THEMES).filter(([_, t]) => t.type === cat).map(([key, t]) => (
                                     <button 
                                         key={key}
                                         onClick={() => onUpdate({ theme: key })}
                                         className={`
                                            w-8 h-8 rounded-lg border-2 transition-all flex-shrink-0 flex items-center justify-center shadow-sm
                                            ${user.theme === key ? 'border-gray-800 scale-110 ring-2 ring-gray-200' : 'border-transparent hover:scale-105 hover:shadow-md'}
                                         `}
                                         style={{ backgroundColor: t.color }}
                                         title={t.label}
                                     >
                                        {user.theme === key && (
                                            <Check 
                                                size={16} 
                                                strokeWidth={3}
                                                className={cat === 'pastel' ? 'text-black/70' : 'text-white'} 
                                            />
                                        )}
                                     </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm grid md:grid-cols-2 gap-4">
                <div>
                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2 text-sm"><Eye size={18}/> Δημόσια Προβολή</h3>
                    <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500 mr-4">
                            Εμφάνιση στο leaderboard.
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={visible} onChange={handleVisibilityChange} />
                            <div className={`w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:${styles.primary}`}></div>
                        </label>
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2 text-sm"><Shuffle size={18}/> Ανακάτεμα Απαντήσεων</h3>
                    <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500 mr-4">
                            Τυχαία σειρά απαντήσεων.
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={shuffle} onChange={handleShuffleChange} />
                            <div className={`w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:${styles.primary}`}></div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm"><Edit3 size={18}/> Αλλαγή Ονόματος</h3>
                <div className="flex gap-2">
                    <input 
                        value={newUsername} 
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="Νέο όνομα χρήστη"
                        className="flex-1 p-2 border rounded-lg focus:border-indigo-500 focus:outline-none bg-white text-gray-900 text-sm"
                    />
                    <button 
                        onClick={handleRename}
                        disabled={!newUsername}
                        className={`${styles.primary} text-white px-4 py-2 rounded-lg font-bold ${styles.primaryHover} disabled:opacity-50 text-sm`}
                    >
                        Αλλαγή
                    </button>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm"><Lock size={18}/> Αλλαγή Κωδικού</h3>
                <div className="flex gap-2">
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Νέος κωδικός"
                        className="flex-1 p-2 border rounded-lg focus:border-indigo-500 focus:outline-none bg-white text-gray-900 text-sm"
                    />
                    <button 
                        onClick={handlePasswordChange}
                        disabled={!password}
                        className={`${styles.primary} text-white px-4 py-2 rounded-lg font-bold ${styles.primaryHover} disabled:opacity-50 text-sm`}
                    >
                        Αλλαγή
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm mt-6">
                <h3 className="font-bold text-red-700 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <AlertTriangle size={16}/> Ζώνη Κινδύνου
                </h3>
                
                <div className="space-y-3">
                    <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-red-100">
                         <div className="text-sm text-gray-700 mr-2">
                            <div className="font-bold">Επαναφορά Προφίλ</div>
                            <div className="text-[10px] text-gray-500">Μηδενισμός σκορ, ιστορικού και στατιστικών.</div>
                        </div>
                        <button 
                            type="button"
                            onClick={handleResetProfileClick} 
                            className="bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-700 shadow-sm whitespace-nowrap transition-colors"
                        >
                            Επαναφορά
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const UserManagementView = ({ theme }: { theme: ThemeKey }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    
    // Edit State
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editName, setEditName] = useState('');
    const [editPass, setEditPass] = useState('');
    const [showEditPass, setShowEditPass] = useState(false);

    const styles = THEMES[theme] || THEMES['basic-indigo'];

    const loadUsers = async () => {
        setLoading(true);
        const data = await fetchAllUsers();
        setUsers(Object.keys(data).map(k => ({ username: k, ...data[k] })));
        setLoading(false);
    };

    useEffect(() => { loadUsers(); }, []);

    const handleCreate = async () => {
        if(!newUsername || !newPassword) return;
        try {
            await createNewUser(newUsername, {
                password: newPassword,
                role: 'user',
                bestScore: 0,
                totalQuizzes: 0,
                isVisible: false,
                suspended: false
            });
            setNewUsername('');
            setNewPassword('');
            setShowAdd(false);
            loadUsers();
        } catch(e: any) {
            alert(e.message);
        }
    };

    const toggleRole = async (u: User) => {
        const newRole = u.role === 'admin' ? 'user' : 'admin';
        await updateUserProfile(u.username, { role: newRole });
        loadUsers();
    };

    const toggleSuspension = async (u: User) => {
        const newVal = !u.suspended;
        await updateUserProfile(u.username, { suspended: newVal });
        loadUsers();
    };
    
    const openEdit = (u: User) => {
        setEditingUser(u);
        setEditName(u.username);
        setEditPass(u.password || '');
        setShowEditPass(false);
    };

    const handleSaveEdit = async () => {
        if (!editingUser) return;
        try {
            // Handle Rename
            if (editName !== editingUser.username) {
                await renameUser(editingUser.username, editName);
            }
            // Handle Password / Other updates (uses new name if changed)
            const targetUser = editName;
            if (editPass !== editingUser.password) {
                await updateUserProfile(targetUser, { password: editPass });
            }
            
            setEditingUser(null);
            loadUsers();
        } catch (e: any) {
            alert(e.message);
        }
    };

    return (
        <div className="animate-slide-up">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Διαχείριση Χρηστών</h2>
                <button onClick={() => setShowAdd(!showAdd)} className={`${styles.primary} text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 ${styles.primaryHover} text-sm`}>
                    <UserPlus size={16}/> {showAdd ? 'Άκυρο' : 'Νέος Χρήστης'}
                </button>
            </div>

            {showAdd && (
                <div className={`${styles.lightBg} p-3 rounded-xl mb-4 flex flex-col md:flex-row gap-2 items-end`}>
                    <div className="w-full">
                        <label className={`text-[10px] font-bold ${styles.primaryText}`}>Username</label>
                        <input className="w-full p-2 border rounded bg-white text-gray-900 text-sm" value={newUsername} onChange={e => setNewUsername(e.target.value)} />
                    </div>
                    <div className="w-full">
                        <label className={`text-[10px] font-bold ${styles.primaryText}`}>Password</label>
                        <input className="w-full p-2 border rounded bg-white text-gray-900 text-sm" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                    </div>
                    <button onClick={handleCreate} className="bg-emerald-500 text-white px-4 py-2 rounded font-bold hover:bg-emerald-600 text-sm">Δημιουργία</button>
                </div>
            )}

            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white p-5 rounded-xl w-full max-w-sm shadow-2xl animate-slide-up">
                        <h3 className="text-lg font-bold mb-3">Επεξεργασία: {editingUser.username}</h3>
                        
                        <div className="mb-3">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username</label>
                            <input 
                                className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors text-sm"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                             <div className="relative">
                                <input 
                                    type={showEditPass ? "text" : "password"}
                                    className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors text-sm"
                                    value={editPass}
                                    onChange={e => setEditPass(e.target.value)}
                                />
                                <button 
                                    onClick={() => setShowEditPass(!showEditPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                                >
                                    {showEditPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                                </button>
                             </div>
                        </div>

                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setEditingUser(null)} className="px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-lg font-medium text-sm">Άκυρο</button>
                            <button onClick={handleSaveEdit} className={`${styles.primary} text-white px-4 py-2 rounded-lg font-bold hover:opacity-90 text-sm`}>Αποθήκευση</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase">
                            <tr>
                                <th className="p-3">User</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Stats</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map(u => (
                                <tr key={u.username} className={`hover:bg-gray-50 ${u.suspended ? 'bg-red-50' : ''}`}>
                                    <td className="p-3 font-medium flex items-center gap-2">
                                        {u.username}
                                        {u.suspended && <Ban size={12} className="text-red-500"/>}
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-3 text-[10px]">
                                        {u.suspended ? <span className="text-red-600 font-bold">SUSPENDED</span> : <span className="text-emerald-600 font-bold">ACTIVE</span>}
                                    </td>
                                    <td className="p-3 text-xs text-gray-500">
                                        Best: {u.bestScore} | Quiz: {u.totalQuizzes}
                                    </td>
                                    <td className="p-3 flex gap-1">
                                        <button onClick={() => openEdit(u)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded" title="Edit User">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => toggleRole(u)} className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded" title="Toggle Admin">
                                            <Shield size={16} />
                                        </button>
                                        <button onClick={() => toggleSuspension(u)} className={`${u.suspended ? 'text-emerald-600 hover:bg-emerald-50' : 'text-red-600 hover:bg-red-50'} p-1.5 rounded`} title={u.suspended ? "Unsuspend" : "Suspend"}>
                                            {u.suspended ? <UserCheck size={16} /> : <Ban size={16} />}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [view, setView] = useState<'landing' | 'quiz' | 'results' | 'history' | 'leaderboard' | 'editor' | 'admin' | 'settings'>('landing');
  const [online, setOnline] = useState(navigator.onLine);
  const [loadingData, setLoadingData] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  
  const themeKey = (THEMES[user?.theme || 'basic-indigo'] ? user?.theme : 'basic-indigo') as ThemeKey;
  const themeStyles = THEMES[themeKey] || THEMES['basic-indigo'];

  // Effects for Network & Data
  useEffect(() => {
    const handleStatus = () => {
        setOnline(navigator.onLine);
        if (navigator.onLine) syncData();
    };
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    
    // Listen for PWA install prompt
    const handleBeforeInstall = (e: any) => {
        e.preventDefault();
        setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Initial Data Load
    const init = async () => {
        setLoadingData(true);
        const qs = await fetchGlobalQuestions();
        setQuestions(qs);
        setLoadingData(false);
    };
    init();

    return () => {
        window.removeEventListener('online', handleStatus);
        window.removeEventListener('offline', handleStatus);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const syncData = async () => {
    console.log("Syncing...");
    const qs = await fetchGlobalQuestions();
    setQuestions(qs);
    if (user) {
        const uData = await fetchUserData(user.username);
        setUserData(uData);
    }
  };

  const handleInstallClick = async () => {
      if (!installPrompt) return;
      try {
          await installPrompt.prompt();
          // Wait for the user to respond to the prompt
          const { outcome } = await installPrompt.userChoice;
          console.log('Install prompt outcome:', outcome);
      } catch (e) {
          console.error("Install prompt error:", e);
      } finally {
          // Clear the saved prompt since it can't be used again
          setInstallPrompt(null);
      }
  };

  // Load user data on login
  useEffect(() => {
    if (user) {
        fetchUserData(user.username).then(d => {
            setUserData(d);
            if (d.session) {
                setView('landing'); // Allow user to choose to resume from landing page
            } else {
                setView('landing');
            }
        });
    }
  }, [user]);

  const handleFinishQuiz = async (score: number, total: number, mistakes: number[]) => {
    if (!user || !userData) return;
    
    const percent = Math.round((score / total) * 100);
    const newHistoryItem: QuizHistoryItem = {
        timestamp: new Date().toISOString(),
        score,
        total,
        percent,
        quizType: userData.session?.type || 'all'
    };

    let updatedMistakes = [...userData.mistakes];
    if (userData.session?.type === 'mistakes') {
        const sessionQIds = userData.session.questions.map(q => q.id);
        const correctIds = sessionQIds.filter(id => !mistakes.includes(id));
        updatedMistakes = updatedMistakes.filter(id => !correctIds.includes(id));
    } else {
        updatedMistakes = Array.from(new Set([...updatedMistakes, ...mistakes]));
    }

    const newUserData: UserData = {
        ...userData,
        mistakes: updatedMistakes,
        history: [...userData.history, newHistoryItem],
        session: null
    };

    setUserData(newUserData);
    await saveUserData(user.username, newUserData);

    const best = Math.max(user.bestScore, score); 
    const totalQ = user.totalQuizzes + 1;
    updateUserProfile(user.username, { bestScore: best, totalQuizzes: totalQ });
    setUser({ ...user, bestScore: best, totalQuizzes: totalQ });

    setView('results');
  };

  const handlePause = async (session: QuizSession) => {
    if (!user || !userData) return;
    const newData = { ...userData, session };
    setUserData(newData);
    await saveUserData(user.username, newData);
    setView('landing');
  };

  const handleUserUpdate = async (updates: Partial<UserProfile>) => {
      if(!user) return;
      await updateUserProfile(user.username, updates);
      setUser({ ...user, ...updates });
  };

  const handleRenameUser = async (oldN: string, newN: string) => {
      try {
          await renameUser(oldN, newN);
          setUser({ ...user!, username: newN });
          alert("Το όνομα άλλαξε επιτυχώς!");
      } catch (e: any) {
          alert(e.message);
      }
  };

  const handleResetAccount = async () => {
      if(!user) return;
      try {
          const defaultData: UserData = { mistakes: [], favorites: [], history: [], session: null };
          setUserData(defaultData);
          await saveUserData(user.username, defaultData);
          
          const updates = { bestScore: 0, totalQuizzes: 0 };
          await updateUserProfile(user.username, updates);
          setUser({ ...user, ...updates });
          alert("Ο λογαριασμός επαναφέρθηκε επιτυχώς.");
      } catch (e) {
          console.error(e);
          alert("Προέκυψε σφάλμα κατά την επαναφορά.");
      }
  };

  const toggleFavorite = async (id: number) => {
      if (!user || !userData) return;
      let favs = userData.favorites || [];
      if (favs.includes(id)) {
          favs = favs.filter(f => f !== id);
      } else {
          favs = [...favs, id];
      }
      const newData = { ...userData, favorites: favs };
      setUserData(newData);
      // Debounce or just save
      await saveUserData(user.username, newData);
  };

  const startQuiz = (type: 'all' | 'mistakes' | 'favorites') => {
    if (!userData) return;
    let qs = [];
    if (type === 'mistakes') {
        qs = questions.filter(q => userData.mistakes.includes(q.id));
        if (qs.length === 0) return alert("Δεν υπάρχουν λάθη!");
    } else if (type === 'favorites') {
        qs = questions.filter(q => (userData.favorites || []).includes(q.id));
        if (qs.length === 0) return alert("Δεν υπάρχουν SOS θέματα!");
    } else {
        qs = [...questions].sort(() => Math.random() - 0.5);
    }
    
    // Reset session
    const session: QuizSession = { questions: qs, index: 0, score: 0, type };
    setUserData({ ...userData, session });
    setView('quiz');
    setMobileMenuOpen(false);
  };

  const handleClearMistakes = async () => {
      if (!user || !userData) return;
      
      // If user is currently in a 'mistakes' session, we must cancel it to avoid state inconsistencies
      // Check if active session type is 'mistakes'
      const shouldKillSession = userData.session?.type === 'mistakes';
      const nextSession = shouldKillSession ? null : userData.session;

      const newData = { ...userData, mistakes: [], session: nextSession };
      setUserData(newData);
      
      try {
          await saveUserData(user.username, newData);
          alert("Τα λάθη διαγράφηκαν επιτυχώς!");
      } catch (e) {
          console.error(e);
          alert("Τα λάθη διαγράφηκαν τοπικά (Offline).");
      }
  };

  const setViewAndCloseMenu = (v: any) => {
      setView(v);
      setMobileMenuOpen(false);
  };

  if (!user) return <LoginScreen onLogin={setUser} />;

  return (
    <>
      {/* Mobile Header */}
      <div className={`md:hidden ${themeStyles.sidebar} text-white p-3 flex items-center gap-4 z-30 sticky top-0 shadow-md`}>
         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1.5 hover:bg-white/10 rounded">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
         </button>
         <div className="flex items-center gap-2 font-bold">
            <div className="w-7 h-7 bg-white/10 rounded flex items-center justify-center">⚡️</div>
            <div className="flex flex-col">
                <span className="text-sm">Quiz ET</span>
                <span className="text-[9px] opacity-70 leading-none">kieran 2025</span>
            </div>
         </div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm" 
            onClick={() => setMobileMenuOpen(false)}
          />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 ${themeStyles.sidebar} ${themeStyles.sidebarText} flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:w-64
      `}>
        <div className="p-4 border-b border-white/10">
           <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-lg">⚡️</div>
               <div>
                   <h1 className="font-bold text-base tracking-tight text-white leading-tight">Quiz ET</h1>
                   <div className="text-[10px] opacity-50 font-medium">kieran 2025</div>
               </div>
           </div>
        </div>

        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto scrollbar-hide">
            <div className="text-[10px] font-bold opacity-50 uppercase tracking-wider mb-1.5 px-2 mt-2">Menu</div>
            
            <button onClick={() => setViewAndCloseMenu('landing')} className={`nav-btn ${view === 'landing' ? themeStyles.navActive : themeStyles.navInactive}`}>
                <Home size={18} /> Αρχική
            </button>

            {userData?.session && (
                <button onClick={() => setViewAndCloseMenu('quiz')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors text-sm">
                    <PlayCircle size={18} /> Συνέχιση
                </button>
            )}

            <button onClick={() => startQuiz('all')} className={`nav-btn ${view === 'quiz' && !userData?.session ? themeStyles.navActive : themeStyles.navInactive}`}>
                <LayoutDashboard size={18} /> Νέο Τεστ
            </button>
            <button onClick={() => startQuiz('mistakes')} className={`nav-btn ${themeStyles.navInactive}`}>
                <AlertTriangle size={18} /> Λάθη ({userData?.mistakes.length || 0})
            </button>
            <button onClick={() => startQuiz('favorites')} className={`nav-btn ${themeStyles.navInactive}`}>
                <LifeBuoy size={18} /> SOS ({userData?.favorites?.length || 0})
            </button>
            <button onClick={() => setViewAndCloseMenu('history')} className={`nav-btn ${view === 'history' ? themeStyles.navActive : themeStyles.navInactive}`}>
                <History size={18} /> Ιστορικό
            </button>
            <button onClick={() => setViewAndCloseMenu('leaderboard')} className={`nav-btn ${view === 'leaderboard' ? themeStyles.navActive : themeStyles.navInactive}`}>
                <Trophy size={18} /> Κατάταξη
            </button>
            <button onClick={() => setViewAndCloseMenu('settings')} className={`nav-btn ${view === 'settings' ? themeStyles.navActive : themeStyles.navInactive}`}>
                <Settings size={18} /> Ρυθμίσεις
            </button>

            {installPrompt && (
                <button onClick={handleInstallClick} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 hover:bg-indigo-500/40 transition-colors mt-4 animate-pulse text-sm">
                    <Download size={18} /> Install App
                </button>
            )}

            {user.role === 'admin' && (
                <>
                    <div className="text-[10px] font-bold opacity-50 uppercase tracking-wider mb-1.5 px-2 mt-4">Admin</div>
                    <button onClick={() => setViewAndCloseMenu('editor')} className={`nav-btn ${view === 'editor' ? themeStyles.navActive : themeStyles.navInactive}`}>
                        <Edit3 size={18} /> Ερωτήσεις
                    </button>
                    <button onClick={() => setViewAndCloseMenu('admin')} className={`nav-btn ${view === 'admin' ? themeStyles.navActive : themeStyles.navInactive}`}>
                        <UsersIcon size={18} /> Χρήστες
                    </button>
                </>
            )}
        </nav>

        <div className="p-3 border-t border-white/10">
            <div className="flex items-center justify-between mb-2 px-2">
                <span className="text-xs font-medium opacity-80">{user.username}</span>
                <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded opacity-80">{user.role}</span>
            </div>
            <button onClick={() => window.location.reload()} className="w-full flex items-center justify-center gap-2 p-1.5 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors text-xs text-white/60">
                <LogOut size={14} /> Αποσύνδεση
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden h-screen">
        {!online && (
            <div className="bg-orange-500 text-white text-[10px] font-bold text-center py-1 flex items-center justify-center gap-2 flex-shrink-0">
                <WifiOff size={10} /> Offline Mode
            </div>
        )}
        
        <main className="flex-1 overflow-y-auto p-2 md:p-6 bg-gray-50">
            {loadingData ? (
                <div className={`h-full flex items-center justify-center ${themeStyles.primaryText} text-sm`}>Loading data...</div>
            ) : (
                <div className="max-w-4xl mx-auto bg-white min-h-[400px] rounded-xl shadow-sm border border-gray-100 p-4 md:p-8">
                    {view === 'landing' && userData && (
                        <LandingView 
                            user={user} 
                            userData={userData} 
                            onStartQuiz={() => startQuiz('all')} 
                            theme={themeKey}
                            onViewChange={setView}
                        />
                    )}
                    {view === 'quiz' && userData?.session && (
                        <QuizView 
                            questions={userData.session.questions} 
                            session={userData.session}
                            onFinish={handleFinishQuiz}
                            onPause={handlePause}
                            onToggleFavorite={toggleFavorite}
                            favorites={userData.favorites || []}
                            theme={themeKey}
                            shuffleEnabled={user.shuffleAnswers || false}
                        />
                    )}
                    {view === 'results' && userData?.history.length > 0 && (
                        <ResultsView 
                            score={userData.history[userData.history.length-1].score} 
                            total={userData.history[userData.history.length-1].total} 
                            onRestart={startQuiz}
                            theme={themeKey}
                            onViewChange={setView}
                        />
                    )}
                    {view === 'editor' && <EditorView allQuestions={questions} onSave={saveGlobalQuestions} />}
                    {view === 'history' && <HistoryView history={userData?.history || []} onClear={() => { setUserData({...userData!, history: []}); saveUserData(user.username, {...userData!, history: []}); }} theme={themeKey} />}
                    {view === 'leaderboard' && <LeaderboardView currentUser={user} theme={themeKey} />}
                    {view === 'settings' && (
                        <SettingsView 
                            user={user} 
                            onUpdate={handleUserUpdate} 
                            onRename={handleRenameUser} 
                            onResetAccount={handleResetAccount}
                            theme={themeKey} 
                        />
                    )}
                    {view === 'admin' && <UserManagementView theme={themeKey} />}
                </div>
            )}
        </main>
      </div>

      <style>{`
        .nav-btn {
            width: 100%; display: flex; align-items: center; gap: 10px; padding: 10px 12px;
            border-radius: 10px; font-weight: 500; transition: all 0.2s; font-size: 0.9rem;
        }
      `}</style>
    </>
  );
}
