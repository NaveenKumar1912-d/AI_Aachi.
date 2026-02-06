
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  HealthCondition,
  Allergy,
  CookingMode
} from './types';

import type {
  UserDNA,
  Recipe,
  Feedback,
  SelectedIngredient
} from './types';
import { INGREDIENT_CATEGORIES, INGREDIENT_PRICES } from './constants';
import { generateAdaptedRecipe, startChatSession } from './services/geminiService';
import {
  ChefHat,
  Heart,
  AlertTriangle,
  Clock,
  Flame,
  User,
  RefreshCcw,
  Zap,
  Scale,
  UtensilsCrossed,
  Settings,
  ShieldCheck,
  ZapOff,
  History,
  Coins,
  Search,
  Minus,
  Plus,
  Trash2,
  Lock,
  Mail,
  ArrowRight,
  LogOut,
  Tag,
  Stethoscope,
  Info,
  ChevronLeft,
  Sparkles,
  MessageSquare,
  X,
  Send,
  Library,
  IdCard,
  Languages
} from 'lucide-react';

// --- Components ---

const Login: React.FC<{ onLogin: () => void, onToggleRegister: () => void }> = ({ onLogin, onToggleRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-300 rounded-full blur-[100px] opacity-30 animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-300 rounded-full blur-[100px] opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-[40%] left-[40%] w-[40%] h-[40%] bg-pink-300 rounded-full blur-[100px] opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="glass-panel rounded-[3rem] p-10 transition-all hover:shadow-orange-200/50 hover:shadow-2xl">
          <div className="flex flex-col items-center mb-10">
            <div className="p-5 bg-gradient-primary rounded-[2rem] text-white shadow-xl shadow-orange-200 mb-6 rotate-3 transform hover:rotate-6 transition-transform">
              <ChefHat size={48} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight text-center">AI Aachi</h1>
            <p className="text-slate-500 font-medium mt-2">Personalized Tamil Cooking DNA</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  placeholder="chef@kitchenmind.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-[1.5rem] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-orange-500/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-[1.5rem] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-orange-500/10 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-95 group mt-8"
            >
              Sign In
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-sm text-slate-400 font-medium mb-4">New to AI Aachi?</p>
            <button
              onClick={onToggleRegister}
              className="w-full py-4 border-2 border-orange-100 bg-orange-50 text-orange-600 rounded-[1.25rem] font-black text-sm flex items-center justify-center gap-2 hover:bg-orange-100 transition-all active:scale-95"
            >
              <Sparkles size={16} />
              Register Your Cooking DNA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Register: React.FC<{ onComplete: (newDna: UserDNA) => void, onBack: () => void }> = ({ onComplete, onBack }) => {
  const [dna, setDna] = useState<UserDNA>({
    name: "",
    email: "",
    spiceTolerance: 3,
    oilUsage: 2,
    saltTolerance: 3,
    cookingSpeed: 'medium',
    healthConditions: [],
    allergies: [],
    customHealthNotes: "",
    customAllergyNotes: "",
    budget: 150,
    onePotEnabled: false,
    history: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(dna);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-orange-200 rounded-full blur-[100px] opacity-40 animate-blob" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-emerald-200 rounded-full blur-[100px] opacity-40 animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-600 transition-colors mb-8 group"
        >
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </button>

        <div className="glass-panel rounded-[3rem] p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-10 text-center">
            <div className="inline-block p-4 bg-gradient-primary rounded-3xl text-white shadow-xl shadow-orange-100 mb-6 rotate-3">
              <ShieldCheck size={40} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Create Your DNA Profile</h2>
            <p className="text-slate-500 font-medium mt-2">Tell Aachi who you are and how you cook.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Profile & Logistics */}
              <div className="space-y-6">
                <h3 className="text-xs uppercase font-black text-slate-400 tracking-widest flex items-center gap-2">
                  <User size={14} /> General Identity
                </h3>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Full Name</label>
                  <input
                    type="text" required placeholder="Chef Name"
                    value={dna.name} onChange={(e) => setDna({ ...dna, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-sm text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email</label>
                  <input
                    type="email" required placeholder="your@email.com"
                    value={dna.email} onChange={(e) => setDna({ ...dna, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-sm text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Daily Budget (₹)</label>
                  <input
                    type="number" required
                    value={dna.budget} onChange={(e) => setDna({ ...dna, budget: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-sm text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                {['Spice', 'Oil', 'Salt'].map((label, i) => {
                  const key = i === 0 ? 'spiceTolerance' : i === 1 ? 'oilUsage' : 'saltTolerance';
                  return (
                    <div key={label}>
                      <div className="flex justify-between mb-2">
                        <span className="text-[10px] font-black uppercase text-slate-400">{label} Level</span>
                        <span className="text-orange-500 font-black">{dna[key as keyof UserDNA] as number}/5</span>
                      </div>
                      <input
                        type="range" min="1" max="5"
                        value={dna[key as keyof UserDNA] as number}
                        onChange={e => setDna({ ...dna, [key]: parseInt(e.target.value) })}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Health */}
              <div className="space-y-6">
                <h3 className="text-xs uppercase font-black text-slate-400 tracking-widest flex items-center gap-2">
                  <Stethoscope size={14} /> Health DNA
                </h3>
                <div className="flex flex-wrap gap-2 max-h-[180px] overflow-y-auto no-scrollbar pb-2">
                  {Object.values(HealthCondition).map(cond => (
                    <button
                      key={cond} type="button"
                      onClick={() => setDna(prev => ({
                        ...prev,
                        healthConditions: prev.healthConditions.includes(cond) ? prev.healthConditions.filter(c => c !== cond) : [...prev.healthConditions, cond]
                      }))}
                      className={`px-3 py-2 rounded-xl text-[10px] font-black transition-all ${dna.healthConditions.includes(cond) ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 shadow-md' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100'}`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Typed Health Problems</label>
                  <textarea
                    placeholder="Type specific problems..."
                    value={dna.customHealthNotes} onChange={(e) => setDna({ ...dna, customHealthNotes: e.target.value })}
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/20 min-h-[80px] resize-none"
                  />
                </div>
              </div>

              {/* Allergies */}
              <div className="space-y-6">
                <h3 className="text-xs uppercase font-black text-slate-400 tracking-widest flex items-center gap-2">
                  <ZapOff size={14} /> Allergy DNA
                </h3>
                <div className="flex flex-wrap gap-2 max-h-[180px] overflow-y-auto no-scrollbar pb-2">
                  {Object.values(Allergy).map(alg => (
                    <button
                      key={alg} type="button"
                      onClick={() => setDna(prev => ({
                        ...prev,
                        allergies: prev.allergies.includes(alg) ? prev.allergies.filter(a => a !== alg) : [...prev.allergies, alg]
                      }))}
                      className={`px-3 py-2 rounded-xl text-[10px] font-black transition-all ${dna.allergies.includes(alg) ? 'bg-red-500 text-white ring-4 ring-red-100 shadow-md' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100'}`}
                    >
                      {alg}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Other Sensitivities</label>
                  <textarea
                    placeholder="Avoid these items..."
                    value={dna.customAllergyNotes} onChange={(e) => setDna({ ...dna, customAllergyNotes: e.target.value })}
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/20 min-h-[80px] resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 pt-10 border-t">
              <div className="flex items-center gap-3 px-6 py-3 bg-orange-50 rounded-2xl border border-orange-100">
                <Info className="text-orange-500" size={18} />
                <p className="text-xs font-bold text-orange-700 leading-tight">AI Aachi remembers your profile for every future meal.</p>
              </div>
              <button
                type="submit"
                className="w-full max-w-sm py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-95 group"
              >
                Sync Profile with Aachi
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const ChatBot: React.FC<{ userDNA: UserDNA }> = ({ userDNA }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !chatRef.current) {
      chatRef.current = startChatSession(userDNA);
    }
  }, [isOpen, userDNA]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !chatRef.current) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const result = await chatRef.current.sendMessage({ message: userMsg });
      const aiText = result.text || "I'm having a little kitchen trouble. Try asking again!";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: "Aachi is a bit busy. Try again in a minute!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      {isOpen && (
        <div className="w-[350px] sm:w-[400px] h-[500px] glass-panel rounded-[2.5rem] flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-300">
          <div className="p-6 bg-gradient-dark text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                <ChefHat size={20} />
              </div>
              <div>
                <h4 className="font-black text-sm tracking-tight">AI Aachi</h4>
                <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Always Learning</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-slate-50/30">
            {messages.length === 0 && (
              <div className="text-center py-10">
                <Sparkles className="mx-auto text-orange-400 mb-4" size={32} />
                <p className="text-sm font-bold text-slate-500">Ask Aachi anything about Tamil cooking, substitutions, or kitchen tips!</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-bold leading-relaxed ${m.role === 'user'
                  ? 'bg-gradient-dark text-white rounded-tr-none shadow-lg'
                  : 'bg-white/80 backdrop-blur-sm text-slate-900 border border-white/50 rounded-tl-none shadow-sm'
                  }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-white/50 border border-white/50 p-4 rounded-3xl rounded-tl-none flex gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white/60 backdrop-blur-md border-t border-white/50 flex gap-2">
            <input
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-5 py-3 bg-white/50 border border-white/50 rounded-2xl font-black text-sm text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white/80 transition-all shadow-inner"
            />
            <button
              onClick={handleSend}
              disabled={isTyping}
              className="p-3 bg-gradient-primary text-white rounded-2xl shadow-lg shadow-orange-100 hover:shadow-orange-200 transition-all active:scale-95 disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-5 rounded-full shadow-2xl transition-all active:scale-90 group relative ${isOpen ? 'bg-slate-900 text-white' : 'bg-gradient-primary text-white shadow-orange-200/50'
          }`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
          </span>
        )}
      </button>
    </div>
  );
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  const [dna, setDna] = useState<UserDNA>(() => {
    const saved = localStorage.getItem('cooking_dna');
    return saved ? JSON.parse(saved) : {
      name: "Guest Chef",
      email: "guest@kitchen.ai",
      spiceTolerance: 3,
      oilUsage: 2,
      saltTolerance: 3,
      cookingSpeed: 'medium',
      healthConditions: [],
      allergies: [],
      customHealthNotes: "",
      customAllergyNotes: "",
      budget: 150,
      onePotEnabled: false,
      history: []
    };
  });

  useEffect(() => {
    const session = localStorage.getItem('is_logged_in');
    if (session === 'true') setIsLoggedIn(true);
  }, []);

  const [selectedIngredients, setSelectedIngredients] = useState<Record<string, number>>({});
  const [mode, setMode] = useState<CookingMode>(CookingMode.Balanced);
  const [grandmaMode, setGrandmaMode] = useState(false);
  const [isNonVeg, setIsNonVeg] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDnaEdit, setShowDnaEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const estimatedCurrentCost = useMemo(() => {
    return Object.entries(selectedIngredients).reduce(
      // Cast qty to number to fix arithmetic type error if inferred as unknown
      (total, [name, qty]) => total + (INGREDIENT_PRICES[name] || 0) * (qty as number),
      0
    );
  }, [selectedIngredients]);

  const selectedCount = Object.keys(selectedIngredients).length;

  const filteredCategories = useMemo(() => {
    return INGREDIENT_CATEGORIES
      .filter(cat => isNonVeg || !cat.isNonVeg)
      .filter(cat => activeCategory === "All" || cat.name === activeCategory)
      .map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
          item.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }))
      .filter(cat => cat.items.length > 0);
  }, [isNonVeg, searchTerm, activeCategory]);

  const categoryChips = useMemo(() => {
    const available = INGREDIENT_CATEGORIES.filter(cat => isNonVeg || !cat.isNonVeg).map(cat => cat.name);
    return ["All", ...available];
  }, [isNonVeg]);

  const handleGenerate = async () => {
    if (selectedCount === 0) {
      alert("Please select some ingredients first!");
      return;
    }
    setLoading(true);
    try {
      const ingredientArray: SelectedIngredient[] = Object.entries(selectedIngredients).map(([name, quantity]) => ({
        name,
        // Cast quantity to number to satisfy SelectedIngredient type requirements
        quantity: quantity as number
      }));
      const generated = await generateAdaptedRecipe(ingredientArray, dna, mode, isNonVeg, grandmaMode);
      setRecipe(generated);
    } catch (error: any) {
      console.error("Gemini Verification Error Details:", error);
      let errorMsg = "Aachi is thinking too hard! Please check your network and try again.";
      if (error?.message) {
        errorMsg += `\nTechnical Error: ${error.message}`;
      }
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = (issue: Feedback['issue']) => {
    if (!recipe) return;
    const newFeedback: Feedback = {
      recipeName: recipe.name,
      issue,
      timestamp: Date.now()
    };
    const updatedDna = {
      ...dna,
      history: [newFeedback, ...dna.history].slice(0, 10)
    };
    setDna(updatedDna);
    localStorage.setItem('cooking_dna', JSON.stringify(updatedDna));
    alert(`Feedback: ${issue}. Aachi has noted this in her recipe book.`);
  };

  const updateQuantity = (name: string, val: number) => {
    setSelectedIngredients(prev => {
      const newMap = { ...prev };
      if (val <= 0) delete newMap[name];
      else newMap[name] = val;
      return newMap;
    });
  };

  const clearIngredients = () => setSelectedIngredients({});
  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthView('login');
    setRecipe(null);
    setSelectedIngredients({});
    localStorage.removeItem('is_logged_in');
  };

  const completeRegistration = (newDna: UserDNA) => {
    setDna(newDna);
    setIsLoggedIn(true);
    localStorage.setItem('cooking_dna', JSON.stringify(newDna));
    localStorage.setItem('is_logged_in', 'true');
  };

  const userInitial = dna.name ? dna.name.charAt(0).toUpperCase() : "G";

  if (!isLoggedIn) {
    if (authView === 'register') {
      return <Register onComplete={completeRegistration} onBack={() => setAuthView('login')} />;
    }
    return <Login onLogin={() => { setIsLoggedIn(true); localStorage.setItem('is_logged_in', 'true'); }} onToggleRegister={() => setAuthView('register')} />;
  }

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-1000 overflow-x-hidden relative ${grandmaMode ? 'bg-[#fff9f0]' : 'bg-slate-50'}`}>

      {/* Dynamic Background */}
      {!grandmaMode && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-orange-200/30 rounded-full blur-[120px] animate-blob" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-200/30 rounded-full blur-[120px] animate-blob animation-delay-2000" />
          <div className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] bg-purple-200/30 rounded-full blur-[120px] animate-blob animation-delay-4000" />

        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-8 animate-in fade-in duration-500 relative z-10">
        {/* Header */}
        <header className="py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-3xl text-white shadow-xl transition-all duration-500 rotate-3 hover:rotate-0 cursor-pointer ${grandmaMode ? 'bg-[#9c4d21] shadow-orange-100' : 'bg-gradient-primary shadow-orange-200/50'}`}>
              <ChefHat size={40} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                AI Aachi
                {grandmaMode && <Sparkles className="text-orange-400" size={20} />}
              </h1>
              <p className="text-slate-500 font-medium">Hyper-Personalized Tamil Cooking</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="glass flex items-center gap-3 p-2 pr-4 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 border-r border-slate-200 pr-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-black text-lg">
                  {userInitial}
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] uppercase font-black text-slate-400 leading-none mb-1">Active Chef</p>
                  <p className="text-sm font-black text-slate-900 leading-none">{dna.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDnaEdit(!showDnaEdit)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all font-bold shadow-lg shadow-slate-200 active:scale-95"
              >
                <Settings size={16} />
                Profile
              </button>
            </div>
            <button onClick={handleLogout} className="p-4 bg-white text-slate-400 hover:text-red-500 rounded-2xl border transition-colors shadow-sm active:scale-95" title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* DNA Settings Modal / Profile View */}
        {showDnaEdit && (
          <div className="bg-white border-4 border-orange-500/10 rounded-[2.5rem] p-8 mb-10 shadow-2xl animate-in slide-in-from-top-4 duration-500 max-h-[85vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between mb-8 sticky top-0 bg-white z-20 pb-4 border-b">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                  <User size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-800">Your Cooking Profile</h2>
              </div>
              <button
                onClick={() => {
                  setShowDnaEdit(false);
                  localStorage.setItem('cooking_dna', JSON.stringify(dna));
                }}
                className="text-slate-400 hover:text-slate-600 font-black px-4 py-2 bg-slate-50 rounded-xl"
              >
                CLOSE & SAVE
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {/* Identity & Preferences */}
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                  <h3 className="text-xs uppercase font-black text-slate-400 tracking-widest flex items-center gap-2 mb-4">
                    <IdCard size={14} /> User Identity
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Chef Name</label>
                      <input
                        type="text"
                        value={dna.name}
                        onChange={e => setDna({ ...dna, name: e.target.value })}
                        className="w-full mt-1 bg-white border-none rounded-xl px-4 py-2 font-bold text-slate-900 outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-orange-500/20"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email</label>
                      <input
                        type="email"
                        value={dna.email}
                        onChange={e => setDna({ ...dna, email: e.target.value })}
                        className="w-full mt-1 bg-white border-none rounded-xl px-4 py-2 font-bold text-slate-900 outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-orange-500/20"
                      />
                    </div>
                  </div>
                </div>

                <h3 className="text-xs uppercase font-black text-slate-400 tracking-widest flex items-center gap-2">
                  <Flame size={14} /> Taste Preferences
                </h3>
                {['Spice Tolerance', 'Oil Usage', 'Salt Level'].map((label, i) => {
                  const key = i === 0 ? 'spiceTolerance' : i === 1 ? 'oilUsage' : 'saltTolerance';
                  return (
                    <div key={label}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-bold text-slate-700">{label}</span>
                        <span className="text-orange-500 font-black">{dna[key as keyof UserDNA] as number}/5</span>
                      </div>
                      <input
                        type="range" min="1" max="5"
                        value={dna[key as keyof UserDNA] as number}
                        onChange={e => setDna({ ...dna, [key]: parseInt(e.target.value) })}
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      />
                    </div>
                  );
                })}

                <div className="pt-4 border-t">
                  <h3 className="text-xs uppercase font-black text-slate-400 tracking-widest mb-4 flex items-center gap-2">
                    <Coins size={14} /> Logistics
                  </h3>
                  <label className="block mb-6">
                    <span className="text-sm font-bold text-slate-700">Daily Budget (INR)</span>
                    <div className="relative mt-2">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                      <input
                        type="number"
                        value={dna.budget}
                        onChange={e => setDna({ ...dna, budget: parseInt(e.target.value) || 0 })}
                        className="w-full pl-8 pr-4 py-3 rounded-2xl border-2 border-slate-100 focus:border-orange-500 focus:ring-0 font-bold text-slate-900 outline-none"
                      />
                    </div>
                  </label>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-bold text-slate-700">One-Pot Enabled</span>
                      </div>
                      <button
                        onClick={() => setDna({ ...dna, onePotEnabled: !dna.onePotEnabled })}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${dna.onePotEnabled ? 'bg-orange-500' : 'bg-slate-300'}`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full transition-transform ${dna.onePotEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Conditions */}
              <div className="space-y-6">
                <h3 className="text-xs uppercase font-black text-slate-400 tracking-widest flex items-center gap-2">
                  <Stethoscope size={14} /> Health Conditions
                </h3>
                <div className="flex flex-wrap gap-2 max-h-[250px] overflow-y-auto no-scrollbar pb-2">
                  {Object.values(HealthCondition).map(cond => (
                    <button
                      key={cond}
                      onClick={() => setDna(prev => ({
                        ...prev,
                        healthConditions: prev.healthConditions.includes(cond) ? prev.healthConditions.filter(c => c !== cond) : [...prev.healthConditions, cond]
                      }))}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all ${dna.healthConditions.includes(cond) ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
                <div className="space-y-2 pt-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Typed Health Problems</label>
                  <textarea
                    placeholder="e.g. Heartburn, specific medical advice..."
                    value={dna.customHealthNotes}
                    onChange={(e) => setDna({ ...dna, customHealthNotes: e.target.value })}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:border-orange-500 outline-none min-h-[100px] resize-none"
                  />
                </div>
              </div>

              {/* Allergies */}
              <div className="space-y-6">
                <h3 className="text-xs uppercase font-black text-slate-400 tracking-widest flex items-center gap-2">
                  <ShieldCheck size={14} /> Allergies & Sensitivities
                </h3>
                <div className="flex flex-wrap gap-2 max-h-[250px] overflow-y-auto no-scrollbar pb-2">
                  {Object.values(Allergy).map(alg => (
                    <button
                      key={alg}
                      onClick={() => setDna(prev => ({
                        ...prev,
                        allergies: prev.allergies.includes(alg) ? prev.allergies.filter(a => a !== alg) : [...prev.allergies, alg]
                      }))}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all ${dna.allergies.includes(alg) ? 'bg-red-500 text-white ring-4 ring-red-100 shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                      {alg}
                    </button>
                  ))}
                </div>
                <div className="space-y-2 pt-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Other Sensitivities</label>
                  <textarea
                    placeholder="e.g. No cilantro, avoid star anise..."
                    value={dna.customAllergyNotes}
                    onChange={(e) => setDna({ ...dna, customAllergyNotes: e.target.value })}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:border-orange-500 outline-none min-h-[100px] resize-none"
                  />
                </div>

                {dna.history.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="text-xs font-black text-slate-400 flex items-center gap-2 mb-2"><History size={14} /> Memory Bank</h4>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {dna.history.map((h, i) => (
                        <span key={i} className="flex-shrink-0 px-2 py-1 bg-slate-100 text-[10px] font-bold rounded-lg text-slate-500 uppercase tracking-tighter">{h.issue}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-8">
            <section className="glass-panel rounded-[2rem] p-8">
              <div className="flex flex-col gap-6 mb-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-xl text-slate-800 flex items-center gap-3"><UtensilsCrossed size={22} className="text-orange-500" />Ingredients</h3>
                  <div onClick={() => setIsNonVeg(!isNonVeg)} className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors border">
                    <span className={`text-[10px] font-black tracking-widest uppercase ${isNonVeg ? 'text-red-500' : 'text-emerald-500'}`}>{isNonVeg ? 'Non-Veg Mode' : 'Veg Mode'}</span>
                    <div className={`w-3 h-3 rounded-full ${isNonVeg ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                  </div>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
                  {categoryChips.map(catName => (
                    <button key={catName} onClick={() => setActiveCategory(catName)} className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all border-2 ${activeCategory === catName ? 'bg-orange-500 border-orange-600 text-white shadow-md' : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'}`}>{catName}</button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder={`Search ${activeCategory}...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-sm text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/20" />
                  </div>
                  {selectedCount > 0 && (
                    <button
                      onClick={clearIngredients}
                      className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-500 border border-red-100 rounded-2xl font-black text-xs hover:bg-red-100 transition-all active:scale-95 whitespace-nowrap shadow-sm shadow-red-50"
                    >
                      <Trash2 size={14} />Clear All ({selectedCount})
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-[500px] overflow-y-auto pr-3 custom-scrollbar space-y-10">
                {filteredCategories.map(category => (
                  <div key={category.name} className="animate-in fade-in duration-300">
                    <div className="flex items-center justify-between mb-4 ml-1">
                      <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400"><Tag size={10} className="text-orange-400" />{category.name}</h4>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Unit: {category.unit}</span>
                    </div>
                    <div className="flex flex-col gap-4">
                      {category.items.map(ing => {
                        // Cast value to number to handle potential unknown inference
                        const qty = (selectedIngredients[ing] as number) || 0;
                        const isSelected = qty > 0;
                        const maxQty = category.unit === 'Grams' ? 1000 : 10;
                        const step = category.unit === 'Grams' ? 50 : 1;
                        return (
                          <div key={ing} className={`group flex flex-col p-4 rounded-3xl border-2 transition-all relative overflow-hidden ${isSelected ? 'border-orange-500 bg-orange-50/50 shadow-sm' : 'border-slate-50 bg-white hover:border-slate-100 hover:bg-slate-50/30'}`}>
                            <div className="flex items-center justify-between mb-3 z-10">
                              <div className="flex flex-col">
                                <span className={`text-sm font-black ${isSelected ? 'text-orange-900' : 'text-slate-600'}`}>{ing}</span>
                                <span className="text-[10px] font-bold text-slate-400 mt-0.5">₹{INGREDIENT_PRICES[ing]}/unit</span>
                              </div>
                              <div className="flex items-center gap-3">
                                {isSelected && (
                                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl shadow-sm border border-orange-100 animate-in zoom-in duration-200">
                                    <span className="text-xs font-black text-orange-600">{qty}</span>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{category.unit}</span>
                                    <button onClick={() => updateQuantity(ing, 0)} className="ml-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                                  </div>
                                )}
                                {!isSelected && <button onClick={() => updateQuantity(ing, step)} className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-orange-500 transition-all shadow-sm active:scale-95">Select</button>}
                              </div>
                            </div>
                            {isSelected && (
                              <div className="flex items-center gap-3 w-full mt-1">
                                <button onClick={() => updateQuantity(ing, Math.max(0, qty - step))} className="w-6 h-6 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-orange-500 shadow-sm active:scale-90"><Minus size={12} /></button>
                                <div className="flex-1 relative h-2 bg-white rounded-full overflow-hidden border border-slate-100">
                                  <div className="absolute top-0 left-0 h-full bg-orange-400 transition-all duration-300" style={{ width: `${(qty / maxQty) * 100}%` }} />
                                  <input type="range" min="0" max={maxQty} step={step} value={qty} onChange={(e) => updateQuantity(ing, parseInt(e.target.value))} className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-20" />
                                </div>
                                <button onClick={() => updateQuantity(ing, Math.min(maxQty, qty + step))} className="w-6 h-6 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-orange-500 shadow-sm active:scale-90"><Plus size={12} /></button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="glass-panel rounded-[2rem] p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-xl text-slate-800 flex items-center gap-3"><Flame size={22} className="text-orange-500" />Cook Style</h3>
                <button
                  onClick={() => setGrandmaMode(!grandmaMode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-xs transition-all border-2 ${grandmaMode
                    ? 'bg-[#9c4d21] text-white border-[#7a3c1a] shadow-lg shadow-orange-100'
                    : 'bg-[#fff5e6] text-[#9c4d21] border-[#9c4d21]/20 hover:bg-[#ffead1]'
                    }`}
                >
                  <Library size={14} />
                  {grandmaMode ? 'Grandma Mode: ON' : 'Enable Grandma Mode'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {(Object.values(CookingMode) as CookingMode[]).map(m => (
                  <button key={m} onClick={() => setMode(m)} className={`flex flex-col items-center justify-center p-5 rounded-3xl border-2 transition-all group ${mode === m ? 'bg-orange-50 text-orange-600 border-orange-200 ring-2 ring-orange-100 shadow-sm' : 'bg-white text-slate-500 border-slate-50 hover:bg-slate-50'}`}>
                    <span className="text-lg font-black">{m.split(' ')[1]}</span>
                    <span className="text-xs font-black tracking-widest uppercase mt-1 opacity-70 group-hover:opacity-100">{m.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </section>

            <button onClick={handleGenerate} disabled={loading} className={`w-full py-6 text-white font-black text-xl rounded-[2rem] shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-95 group transform hover:-translate-y-1 ${grandmaMode ? 'bg-[#9c4d21] hover:bg-[#7a3c1a]' : 'bg-gradient-dark hover:shadow-lg hover:shadow-slate-900/20'} disabled:bg-slate-300`}>
              {loading ? <><RefreshCcw className="animate-spin" />Consulting Aachi...</> : <><Zap size={24} className="group-hover:text-orange-400 transition-colors" />Generate My Recipe</>}
            </button>
          </div>

          <div className="lg:col-span-7">
            {!recipe && !loading ? (
              <div className="h-full flex flex-col items-center justify-center bg-slate-50 border-4 border-dashed border-slate-100 rounded-[3rem] p-12 text-center text-slate-300">
                <div className="p-8 bg-white rounded-full shadow-inner mb-6"><ChefHat size={80} className="opacity-10" /></div>
                <p className="text-2xl font-black text-slate-400">Waiting for your selection...</p>
                <p className="max-w-xs mx-auto mt-2 text-slate-400 font-medium italic">"Tell Aachi what you have, and she'll cook from her heart."</p>
              </div>
            ) : loading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-8 animate-pulse">
                <div className="relative">
                  <div className={`w-24 h-24 border-8 border-t-orange-500 rounded-full animate-spin ${grandmaMode ? 'border-[#9c4d21]/10' : 'border-orange-500/10'}`} />
                  <ChefHat className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-500" size={32} />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-black text-slate-800">{grandmaMode ? "Aachi is remembering her heirloom recipes..." : "Aachi is Cooking..."}</h3>
                  <div className="flex flex-col gap-2 mt-4 text-slate-400 font-bold">
                    <p className="flex items-center justify-center gap-2"><ShieldCheck size={16} className="text-emerald-500" />Checking DNA Filters</p>
                    <p className="flex items-center justify-center gap-2"><Coins size={16} className="text-yellow-500" />Optimizing Budget</p>
                    {grandmaMode && <p className="flex items-center justify-center gap-2 text-orange-600"><Sparkles size={16} />Enhancing Traditional Flavor</p>}
                  </div>
                </div>
              </div>
            ) : (
              <div className={`glass-panel rounded-[3rem] p-10 shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-700 relative overflow-hidden ${grandmaMode ? 'bg-[#fffdfa]' : 'bg-white/80'}`}>
                {grandmaMode && (
                  <div className="absolute top-4 left-4">
                    <span className="flex items-center gap-2 px-3 py-1 bg-[#9c4d21] text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">
                      <Library size={12} /> Authentic Traditional
                    </span>
                  </div>
                )}
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-10 -mt-10" />
                <div className="relative z-10 mb-10">
                  <div className="flex flex-wrap items-start justify-between gap-6 mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <Languages size={18} className="text-orange-500" />
                        <h2 className="text-3xl font-black text-slate-900 leading-tight">{recipe.name}</h2>
                      </div>
                      <p className="text-xl font-black text-orange-600 mb-3">{recipe.nameTamil}</p>
                      <div className="flex flex-wrap gap-4">
                        <span className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-xl text-xs font-black text-slate-500 border"><Clock size={14} className="text-orange-500" /> {recipe.cookingTime}</span>
                        <span className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-xl text-xs font-black text-slate-500 border"><Scale size={14} className="text-orange-500" /> {recipe.difficulty}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-4xl font-black text-slate-900">₹{recipe.totalCost}</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest mt-1 px-3 py-1 rounded-full ${recipe.budgetStatus === 'Within budget' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{recipe.budgetStatus}</span>
                    </div>
                  </div>
                  <div className={`p-5 rounded-3xl border ${grandmaMode ? 'bg-[#fff5e6] border-[#9c4d21]/20' : 'bg-blue-50 border-blue-100'}`}>
                    <h4 className={`flex items-center gap-2 font-black text-xs uppercase tracking-widest mb-2 ${grandmaMode ? 'text-[#9c4d21]' : 'text-blue-900'}`}>
                      {grandmaMode ? <Sparkles size={16} /> : <Info size={16} />}
                      {grandmaMode ? "Aachi's Traditional Wisdom" : "Aachi's Reasoning"}
                    </h4>
                    <p className={`text-sm font-bold italic leading-relaxed ${grandmaMode ? 'text-[#7a3c1a]' : 'text-blue-800'}`}>"{recipe.aiDecisionExplanation}"</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-3">
                    <h4 className="flex items-center gap-2 text-slate-800 font-black text-xs uppercase tracking-widest mb-2"><Heart size={16} className="text-red-500" /> Health Compliance</h4>
                    <p className="text-xs font-black text-slate-900">{recipe.healthSuitability}</p>
                    <p className="text-xs font-black text-emerald-600">✓ {recipe.allergySafety}</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <h4 className="flex items-center gap-2 text-slate-800 font-black text-xs uppercase tracking-widest mb-4"><AlertTriangle size={16} className="text-orange-500" /> Safety Warnings</h4>
                    <ul className="text-[11px] font-bold text-slate-600 space-y-1">
                      {recipe.warnings.map((w, i) => <li key={i} className="flex gap-2"><span className="text-orange-500">•</span> {w}</li>)}
                    </ul>
                  </div>
                </div>
                <div className="mb-12">
                  <h3 className={`text-xl font-black text-slate-800 mb-6 border-b pb-4 ${grandmaMode ? 'border-[#9c4d21]/10' : ''}`}>Cooking Instructions / சமையல் குறிப்புகள்</h3>
                  <div className="space-y-10">
                    {recipe.method.map((step, i) => (
                      <div key={i} className="flex gap-6 group">
                        <div className={`flex-shrink-0 w-10 h-10 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-lg transition-transform group-hover:scale-110 ${grandmaMode ? 'bg-[#9c4d21] shadow-orange-100' : 'bg-orange-500 shadow-orange-100'}`}>{i + 1}</div>
                        <div className="pt-1 flex-1 space-y-2">
                          <p className="text-slate-900 font-bold leading-relaxed">{step}</p>
                          <p className="text-slate-500 font-bold leading-relaxed text-sm bg-slate-50/50 p-2 rounded-xl italic border-l-4 border-orange-200">{recipe.methodTamil[i]}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-center text-white">
                  <h4 className="text-xl font-black mb-8">How was the result?</h4>
                  <div className="flex flex-wrap justify-center gap-4">
                    {['perfect', 'burnt', 'too spicy', 'too oily', 'undercooked'].map((issue) => (
                      <button key={issue} onClick={() => handleFeedback(issue as any)} className="px-6 py-3 rounded-2xl border border-slate-700 font-black text-xs uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all active:scale-95">{issue}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <ChatBot userDNA={dna} />
      </div>
    </div>
  );
};

export default App;

// Refresh types
