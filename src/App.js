import React, { useState, useEffect, useRef, useMemo } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  increment,
  onSnapshot,
  doc,
  getDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import {
  Gift,
  Send,
  Copy,
  Plus,
  Users,
  MessageSquareHeart,
  Calendar,
  ChevronLeft,
  Check,
  Share2,
  PartyPopper,
  Sparkles,
  Heart,
  Archive,
  History,
  Clock,
  Lock,
  LockOpen,
  KeyRound,
  Eye,
  Cookie,
  ThumbsUp,
  Utensils,
  Shield,
  ShieldCheck,
  Stamp,
  Star,
  Crown,
  Music,
  Globe,
  Power,
  Ban,
  Trash2,
  Edit2,
  Save,
  X,
  Settings,
  LogOut,
  Rocket,
} from "lucide-react";

// --- 設定您的超級管理員密碼 ---
const MASTER_PASSWORD = "8888";

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyDLN2rlkUfVydlqfvQQ4f_eQ-EyLGP_8ss",
  authDomain: "birthday-card-app-a20fd.firebaseapp.com",
  projectId: "birthday-card-app-a20fd",
  storageBucket: "birthday-card-app-a20fd.firebasestorage.app",
  messagingSenderId: "496624713968",
  appId: "1:496624713968:web:3dc7b18af84908db854235",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = "birthday-card-app-production";

// --- Style Helpers ---
const StyleInjector = () => {
  useEffect(() => {
    if (!document.querySelector('script[src*="tailwindcss"]')) {
      const script = document.createElement("script");
      script.src = "https://cdn.tailwindcss.com";
      document.head.appendChild(script);
    }
    if (!document.querySelector('link[href*="fonts.googleapis.com"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&display=swap";
      document.head.appendChild(link);
      const style = document.createElement("style");
      style.innerHTML = `body { font-family: 'Noto Sans TC', sans-serif; }`;
      document.head.appendChild(style);
    }
  }, []);
  return null;
};

const GlobalStyles = () => (
  <style>{`
    @keyframes float { 0% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(5deg); } 100% { transform: translateY(0px) rotate(0deg); } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes popIn { 0% { opacity: 0; transform: scale(0.9); } 70% { transform: scale(1.05); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); } 20%, 40%, 60%, 80% { transform: translateX(4px); } }
    @keyframes stamp { 0% { transform: scale(2) rotate(15deg); opacity: 0; } 50% { transform: scale(0.9) rotate(-5deg); opacity: 1; } 100% { transform: scale(1) rotate(-15deg); opacity: 1; } }
    
    @keyframes rise {
      0% { transform: translateY(0) rotate(0deg); opacity: 0; }
      10% { opacity: var(--target-opacity); }
      80% { opacity: var(--target-opacity); }
      100% { transform: translateY(-110vh) rotate(180deg); opacity: 0; }
    }

    @keyframes shimmer {
      0% { background-position: 200% center; }
      100% { background-position: -200% center; }
    }
    @keyframes breathe {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    @keyframes boost {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-3px) rotate(5deg); }
    }

    .animate-rise { animation: rise linear infinite; }
    .animate-float { animation: float 8s ease-in-out infinite; }
    .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-pop-in { animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
    .animate-shake { animation: shake 0.4s ease-in-out; }
    .animate-stamp { animation: stamp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
    .animate-breathe { animation: breathe 3s ease-in-out infinite; }
    .animate-boost { animation: boost 2s ease-in-out infinite; }

    .text-shimmer {
      background: linear-gradient(to right, #1b69b4 20%, #60a5fa 40%, #60a5fa 60%, #1b69b4 80%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      animation: shimmer 4s linear infinite;
    }

    .glass-card { background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.6); }
    .btn-gradient { background: linear-gradient(135deg, #1b69b4 0%, #3b82f6 100%); }
    .no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .stamp-seal { border: 3px solid #ef4444; color: #ef4444; border-radius: 8px; padding: 4px 8px; text-transform: uppercase; font-weight: 900; font-family: sans-serif; letter-spacing: 2px; transform: rotate(-15deg); box-shadow: inset 0 0 0 2px #ef4444, 0 0 0 2px transparent; position: absolute; top: 20%; right: 10%; background: rgba(255,255,255,0.8); z-index: 10; pointer-events: none; }
  `}</style>
);

// --- Dynamic Background (改用星星與圓圈，無需圖片) ---
const DynamicBackground = () => {
  const items = useMemo(() => {
    const generated = [];
    const count = 30;
    // 使用深淺藍色
    const colors = ["#1b69b4", "#60a5fa", "#93c5fd"];

    for (let i = 0; i < count; i++) {
      const size = Math.floor(Math.random() * 30) + 10; // 10px - 40px
      generated.push({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        left: `${Math.random() * 100}%`,
        size: size,
        duration: Math.floor(Math.random() * 15) + 10 + "s",
        delay: `-${Math.random() * 20}s`,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }
    return generated;
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-slate-50">
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute flex items-center justify-center text-white animate-rise"
          style={{
            left: item.left,
            width: `${item.size}px`,
            height: `${item.size}px`,
            color: item.color,
            "--target-opacity": item.opacity,
            animationDuration: item.duration,
            animationDelay: item.delay,
            bottom: "-10%",
          }}
        >
          {/* 隨機使用星星或圓圈 */}
          {item.id % 2 === 0 ? (
            <Sparkles
              size={item.size}
              fill="currentColor"
              className="opacity-50"
            />
          ) : (
            <div className="rounded-full bg-current opacity-30 w-full h-full"></div>
          )}
        </div>
      ))}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-100 via-slate-100/80 to-transparent"></div>
    </div>
  );
};

const ConfettiExplosion = ({ active }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particles = [];
    const colors = ["#1b69b4", "#3b82f6", "#6BCB77", "#FFD93D", "#FF9ff3"];
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20,
        life: 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 5 + 2,
      });
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.life -= 1;
        p.size *= 0.96;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        if (p.life <= 0) particles.splice(index, 1);
      });
      if (particles.length > 0) requestAnimationFrame(animate);
    };
    animate();
  }, [active]);
  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
};

// --- Main Component ---
export default function BirthdayApp() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("home");
  const [activeCardId, setActiveCardId] = useState(null);
  const [activeCardData, setActiveCardData] = useState(null);
  const [isGlobalAdmin, setIsGlobalAdmin] = useState(false);

  useEffect(() => {
    signInAnonymously(auth).catch((err) => console.error("Login Error:", err));
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const navigate = (targetView, cardId = null, cardData = null) => {
    setView(targetView);
    if (cardId) setActiveCardId(cardId);
    if (cardData) setActiveCardData(cardData);
  };

  if (!user) {
    return (
      <>
        <StyleInjector />
        <div className="min-h-screen flex items-center justify-center bg-blue-50 text-[#1b69b4]">
          <div className="animate-bounce flex flex-col items-center">
            <Gift size={64} className="mb-4" />
            <p className="font-bold tracking-widest">LOADING...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-200 overflow-hidden relative">
      <StyleInjector />
      <GlobalStyles />

      {/* 使用不需圖片的動態背景 */}
      <DynamicBackground />

      <div className="max-w-md mx-auto min-h-screen relative z-10 flex flex-col shadow-2xl glass-card border-x border-white/50">
        {/* Header */}
        <header
          className={`bg-white/60 backdrop-blur-md text-slate-700 p-4 flex items-center justify-between shadow-sm sticky top-0 z-20 border-b ${
            isGlobalAdmin
              ? "border-amber-300 bg-amber-50/90"
              : "border-transparent"
          }`}
        >
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => navigate("home")}
          >
            <div className="flex items-center">
              <Rocket
                size={24}
                className="text-amber-400 animate-boost mr-1.5 ml-1"
              />
              <span className="font-black text-xl tracking-wide text-shimmer">
                FineBoost
              </span>
            </div>
            {isGlobalAdmin && (
              <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm animate-pulse ml-2">
                ADMIN
              </span>
            )}
          </div>
          {view !== "home" && (
            <button
              onClick={() => navigate("home")}
              className="text-slate-400 hover:text-[#1b69b4] transition-colors text-sm font-medium px-3 py-1 rounded-full hover:bg-blue-50 flex items-center gap-1"
            >
              <ChevronLeft size={16} /> 回首頁
            </button>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 scroll-smooth no-scrollbar">
          {view === "home" && (
            <HomeView
              navigate={navigate}
              db={db}
              isGlobalAdmin={isGlobalAdmin}
            />
          )}
          {view === "create" && <CreateView navigate={navigate} db={db} />}
          {view === "archive" && (
            <ArchiveView
              navigate={navigate}
              db={db}
              isGlobalAdmin={isGlobalAdmin}
            />
          )}
          {view === "portal" && (
            <PortalView
              navigate={navigate}
              cardId={activeCardId}
              cardData={activeCardData}
              isGlobalAdmin={isGlobalAdmin}
            />
          )}
          {view === "write" && (
            <WriteView
              navigate={navigate}
              db={db}
              cardId={activeCardId}
              cardData={activeCardData}
            />
          )}
          {view === "view" && (
            <AdminView
              navigate={navigate}
              db={db}
              cardId={activeCardId}
              isGlobalAdmin={isGlobalAdmin}
            />
          )}
        </main>

        <Footer
          isGlobalAdmin={isGlobalAdmin}
          setIsGlobalAdmin={setIsGlobalAdmin}
        />
      </div>
    </div>
  );
}

// --- Admin Footer Login ---
function Footer({ isGlobalAdmin, setIsGlobalAdmin }) {
  const handleAdminLogin = () => {
    if (isGlobalAdmin) {
      if (window.confirm("要登出管理員模式嗎？")) setIsGlobalAdmin(false);
      return;
    }
    const pass = prompt("請輸入管理員密碼：");
    if (pass === MASTER_PASSWORD) {
      setIsGlobalAdmin(true);
      alert("歡迎回來，管理員！您現在擁有最高權限。");
    } else if (pass !== null) {
      alert("密碼錯誤");
    }
  };

  return (
    <footer
      className={`p-4 text-center text-xs backdrop-blur-sm transition-colors flex justify-center items-center gap-2 ${
        isGlobalAdmin
          ? "bg-amber-100 text-amber-800"
          : "text-slate-400/80 bg-white/50"
      }`}
    >
      <span>Created with ❤️ for your colleagues</span>
      <button
        onClick={handleAdminLogin}
        className="opacity-50 hover:opacity-100 transition-opacity"
      >
        {isGlobalAdmin ? <LogOut size={12} /> : <Lock size={12} />}
      </button>
    </footer>
  );
}

function HomeView({ navigate, db, isGlobalAdmin }) {
  const [activeTab, setActiveTab] = useState("birthday");

  return (
    <div className="space-y-6 py-2 animate-slide-up">
      <div className="bg-slate-100 p-1 rounded-xl flex relative mb-2">
        <div
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-out ${
            activeTab === "birthday" ? "left-1" : "left-[calc(50%+4px)]"
          }`}
        ></div>
        <button
          onClick={() => setActiveTab("birthday")}
          className={`flex-1 py-2 text-sm font-bold relative z-10 flex items-center justify-center gap-2 transition-colors ${
            activeTab === "birthday" ? "text-[#1b69b4]" : "text-slate-400"
          }`}
        >
          <Calendar size={16} /> 活動牆
        </button>
        <button
          onClick={() => setActiveTab("snack")}
          className={`flex-1 py-2 text-sm font-bold relative z-10 flex items-center justify-center gap-2 transition-colors ${
            activeTab === "snack" ? "text-amber-500" : "text-slate-400"
          }`}
        >
          <Cookie size={16} /> 零食池
        </button>
      </div>
      <div className="min-h-[60vh]">
        {activeTab === "birthday" ? (
          <BirthdayList
            navigate={navigate}
            db={db}
            isGlobalAdmin={isGlobalAdmin}
          />
        ) : (
          <SnackList db={db} isGlobalAdmin={isGlobalAdmin} />
        )}
      </div>
    </div>
  );
}

function BirthdayList({ navigate, db, isGlobalAdmin }) {
  const [myCards, setMyCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = collection(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      "birthday_cards"
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const allCards = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const sorted = allCards.sort(
          (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
        );
        setMyCards(sorted);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsubscribe();
  }, [db]);

  const handleDelete = async (e, cardId, name) => {
    e.stopPropagation();
    if (
      window.confirm(`確定要永久刪除「${name}」這個活動嗎？此動作無法復原。`)
    ) {
      try {
        await deleteDoc(
          doc(
            db,
            "artifacts",
            appId,
            "public",
            "data",
            "birthday_cards",
            cardId
          )
        );
        alert("已刪除");
      } catch (err) {
        console.error(err);
        alert("刪除失敗");
      }
    }
  };

  const displayCards = myCards.slice(0, 5);
  const cardThemes = [
    {
      bg: "bg-gradient-to-br from-[#1b69b4] to-[#3b82f6]",
      iconColor: "text-blue-100",
    },
    {
      bg: "bg-gradient-to-br from-violet-500 to-fuchsia-500",
      iconColor: "text-purple-100",
    },
    {
      bg: "bg-gradient-to-br from-pink-500 to-rose-400",
      iconColor: "text-pink-100",
    },
    {
      bg: "bg-gradient-to-br from-emerald-400 to-teal-500",
      iconColor: "text-emerald-100",
    },
    {
      bg: "bg-gradient-to-br from-amber-400 to-orange-500",
      iconColor: "text-amber-100",
    },
  ];
  const decorativeIcons = [
    Gift,
    PartyPopper,
    Crown,
    Star,
    Heart,
    Sparkles,
    Music,
  ];

  return (
    <div className="space-y-6 animate-pop-in">
      <div className="flex justify-between items-center pt-2 px-1">
        <h2 className="text-xl font-bold text-slate-700 flex items-center gap-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-500">
            近期活動
          </span>
        </h2>
        <button
          onClick={() => navigate("create")}
          className="btn-gradient text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
        >
          <Plus size={16} /> 發起活動
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-slate-100/50 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : displayCards.length === 0 ? (
        <div className="text-center py-12 bg-white/50 rounded-2xl border-2 border-dashed border-slate-200 backdrop-blur-sm">
          <p className="text-slate-400 font-medium">還沒有任何活動</p>
          <p className="text-xs text-slate-400/70 mt-1">
            快來發起第一個活動吧！
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayCards.map((card, idx) => {
            const theme = cardThemes[idx % cardThemes.length];
            const Icon = decorativeIcons[idx % decorativeIcons.length];
            const isPublic = !card.viewPassword;
            return (
              <div
                key={card.id}
                onClick={() => navigate("portal", card.id, card)}
                className={`rounded-2xl p-5 shadow-md hover:shadow-lg transition-all cursor-pointer flex justify-between items-center group hover:-translate-y-1 relative overflow-hidden ${theme.bg}`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12 scale-150 text-white">
                  <Icon size={100} />
                </div>
                <div className="flex items-center gap-4 relative z-10">
                  <div
                    className={`w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl shadow-inner ${theme.iconColor}`}
                  >
                    <Icon size={24} />
                  </div>
                  <div className="text-white">
                    <h3 className="font-bold text-lg leading-tight drop-shadow-sm">
                      {card.recipientName}
                    </h3>
                    <p className="text-xs opacity-80 mt-1 font-medium flex items-center gap-1">
                      <Clock size={10} /> {card.targetDate}{" "}
                      {isPublic ? (
                        <span className="flex items-center gap-0.5 ml-2 bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">
                          <Globe size={8} /> 公開
                        </span>
                      ) : (
                        <span className="flex items-center gap-0.5 ml-2 bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">
                          <Lock size={8} /> 加密
                        </span>
                      )}{" "}
                      {card.isClosed && (
                        <span className="flex items-center gap-0.5 ml-1 bg-red-500/30 px-1.5 py-0.5 rounded-full text-[10px]">
                          <Ban size={8} /> 截止
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 flex items-center gap-2">
                  {isGlobalAdmin && (
                    <button
                      onClick={(e) =>
                        handleDelete(e, card.id, card.recipientName)
                      }
                      className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-red-500 hover:text-white transition-colors"
                      title="刪除活動"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-slate-800 transition-all">
                    <ChevronLeft className="rotate-180" size={20} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {myCards.length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("archive")}
            className="inline-flex items-center gap-2 text-slate-500 text-sm font-medium hover:text-[#1b69b4] transition px-4 py-2 rounded-full hover:bg-blue-50"
          >
            <Archive size={16} /> 查看過往典藏 ({myCards.length})
          </button>
        </div>
      )}
    </div>
  );
}

function SnackList({ db, isGlobalAdmin }) {
  const [snackName, setSnackName] = useState("");
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    const q = collection(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      "snack_wishes"
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const sorted = items.sort((a, b) => {
        if (a.fulfilled !== b.fulfilled) return a.fulfilled ? 1 : -1;
        if ((b.votes || 0) !== (a.votes || 0))
          return (b.votes || 0) - (a.votes || 0);
        return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
      });
      setWishes(sorted);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [db]);

  const handleAddSnack = async (e) => {
    e.preventDefault();
    if (!snackName.trim()) return;
    setIsSubmitting(true);
    try {
      await addDoc(
        collection(db, "artifacts", appId, "public", "data", "snack_wishes"),
        {
          name: snackName.trim(),
          votes: 1,
          fulfilled: false,
          createdAt: serverTimestamp(),
        }
      );
      setSnackName("");
    } catch (e) {
      console.error(e);
      alert("許願失敗");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (snackId, isFulfilled) => {
    if (isFulfilled) return;
    try {
      await updateDoc(
        doc(db, "artifacts", appId, "public", "data", "snack_wishes", snackId),
        { votes: increment(1) }
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleFulfill = async (e, snackId, currentStatus) => {
    e.stopPropagation();
    if (
      !confirm(
        currentStatus ? "要取消「已實現」狀態嗎？" : "確認已買到這個零食了嗎？"
      )
    )
      return;
    try {
      await updateDoc(
        doc(db, "artifacts", appId, "public", "data", "snack_wishes", snackId),
        { fulfilled: !currentStatus }
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSnack = async (e, snackId) => {
    e.stopPropagation();
    if (!confirm("確定要刪除這個願望嗎？")) return;
    try {
      await deleteDoc(
        doc(db, "artifacts", appId, "public", "data", "snack_wishes", snackId)
      );
    } catch (e) {
      console.error(e);
    }
  };

  const effectiveAdmin = isGlobalAdmin || isAdminMode;

  return (
    <div className="animate-pop-in pb-20 relative">
      {!isGlobalAdmin && (
        <div className="absolute -top-12 right-0">
          <button
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={`p-2 rounded-full transition-colors ${
              isAdminMode
                ? "bg-amber-500 text-white shadow-lg"
                : "bg-slate-100/50 text-slate-400 hover:bg-slate-200"
            }`}
            title="管理員模式"
          >
            {isAdminMode ? <ShieldCheck size={16} /> : <Shield size={16} />}
          </button>
        </div>
      )}

      <div className="bg-white/80 p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 sticky top-0 z-10 backdrop-blur-sm">
        <form onSubmit={handleAddSnack} className="flex gap-2">
          <input
            type="text"
            value={snackName}
            onChange={(e) => setSnackName(e.target.value)}
            className="flex-1 bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all placeholder-slate-400"
            placeholder="輸入想吃的零食..."
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center min-w-[3rem]"
          >
            {isSubmitting ? "..." : <Plus size={24} />}
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center text-slate-400 mt-10">載入清單中...</div>
      ) : wishes.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <Cookie size={48} className="mx-auto text-slate-300 mb-2" />
          <p className="text-slate-400">目前空空如也</p>
          <p className="text-xs text-slate-400/70">快來許下第一個願望吧！</p>
        </div>
      ) : (
        <div className="space-y-3">
          {wishes.map((item, idx) => (
            <div
              key={item.id}
              onClick={() =>
                !effectiveAdmin && handleVote(item.id, item.fulfilled)
              }
              className={`relative p-4 rounded-xl shadow-sm border-b-4 flex justify-between items-center transition-all ${
                item.fulfilled
                  ? "bg-slate-50/80 border-slate-200 opacity-70"
                  : "bg-white/80 border-slate-100 hover:-translate-y-0.5 cursor-pointer group"
              }`}
            >
              {item.fulfilled && (
                <div className="animate-stamp stamp-seal">已實現</div>
              )}
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`font-bold text-lg w-8 text-center ${
                    item.fulfilled
                      ? "text-slate-300"
                      : idx < 3
                      ? "text-amber-500"
                      : "text-slate-300"
                  }`}
                >
                  #{idx + 1}
                </div>
                <div
                  className={`font-bold text-lg ${
                    item.fulfilled
                      ? "text-slate-400 line-through decoration-slate-300"
                      : "text-slate-700"
                  }`}
                >
                  {item.name}
                </div>
              </div>

              {effectiveAdmin ? (
                <div className="flex gap-2 z-20">
                  <button
                    onClick={(e) =>
                      handleToggleFulfill(e, item.id, item.fulfilled)
                    }
                    className={`p-2 rounded-lg flex items-center gap-1 font-bold text-xs transition-colors ${
                      item.fulfilled
                        ? "bg-slate-200 text-slate-500 hover:bg-slate-300"
                        : "bg-green-100 text-green-600 hover:bg-green-200"
                    }`}
                  >
                    <Stamp size={16} /> {item.fulfilled ? "取消" : "蓋章"}
                  </button>
                  <button
                    onClick={(e) => handleDeleteSnack(e, item.id)}
                    className="p-2 rounded-lg bg-red-100 text-red-500 hover:bg-red-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <div
                  className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-colors ${
                    item.fulfilled
                      ? "text-slate-300"
                      : "bg-slate-50 group-hover:bg-amber-50 text-slate-400 group-hover:text-amber-500"
                  }`}
                >
                  <ThumbsUp size={20} />
                  <span className="text-xs font-bold mt-0.5">
                    {item.votes || 0}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PortalView({ navigate, cardId, cardData, isGlobalAdmin }) {
  const [password, setPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [error, setError] = useState(false);

  const isPublic = !cardData.viewPassword;
  const isClosed = cardData.isClosed;

  useEffect(() => {
    if (isGlobalAdmin) {
      navigate("view", cardId, cardData);
    }
  }, [isGlobalAdmin, navigate, cardId, cardData]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === cardData.viewPassword || password === MASTER_PASSWORD) {
      navigate("view", cardId, cardData);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="py-6 animate-pop-in flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner text-[#1b69b4]">
          <Gift size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">
          <span className="text-[#1b69b4]">{cardData.recipientName}</span>
        </h2>
        <div className="flex items-center justify-center gap-2 mt-1">
          {isClosed && (
            <span className="text-red-500 font-bold flex items-center gap-1 text-xs bg-red-100 px-2 py-0.5 rounded-full">
              <Ban size={12} /> 活動已截止
            </span>
          )}
          <p className="text-slate-400 text-sm">
            {isPublic ? "這是一個公開活動" : "請選擇您的身份"}
          </p>
        </div>
      </div>

      {!showPasswordInput ? (
        <div className="w-full space-y-4 px-4">
          {isClosed ? (
            <div className="bg-slate-100 border-2 border-slate-200 text-slate-400 font-bold py-4 rounded-xl flex items-center justify-center gap-3">
              <Ban size={20} /> 已停止接收新祝福
            </div>
          ) : (
            <button
              onClick={() => navigate("write", cardId, cardData)}
              className="w-full bg-white border-2 border-blue-100 hover:border-[#1b69b4] hover:bg-blue-50 text-slate-700 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-sm group"
            >
              <div className="bg-blue-100 p-2 rounded-full text-[#1b69b4] group-hover:scale-110 transition-transform">
                <MessageSquareHeart size={20} />
              </div>
              我要寫祝福
            </button>
          )}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-slate-300 text-xs">
              OR
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>
          {isPublic ? (
            <button
              onClick={() => navigate("view", cardId, cardData)}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg"
            >
              <div className="bg-green-400 p-2 rounded-full text-white">
                <Eye size={20} />
              </div>
              查看留言牆 (公開)
            </button>
          ) : (
            <button
              onClick={() => setShowPasswordInput(true)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg"
            >
              <div className="bg-slate-600 p-2 rounded-full text-white">
                <Lock size={20} />
              </div>
              我是壽星/管理員 (查看留言)
            </button>
          )}
        </div>
      ) : (
        <div className="w-full px-6 animate-slide-up">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <KeyRound size={18} className="text-[#1b69b4]" />
                輸入開啟密碼
              </h3>
              <button
                onClick={() => setShowPasswordInput(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <ChevronLeft size={20} />
              </button>
            </div>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className={`w-full bg-slate-50 border-2 rounded-xl px-4 py-3 text-center text-xl font-bold tracking-widest focus:outline-none transition-all mb-4 ${
                  error
                    ? "border-red-400 bg-red-50 animate-shake"
                    : "border-slate-200 focus:border-[#1b69b4]"
                }`}
                placeholder="請輸入密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              <button
                type="submit"
                className="w-full btn-gradient text-white font-bold py-3 rounded-xl shadow-md active:scale-95 transition-all"
              >
                確認開啟
              </button>
            </form>
            <p className="text-xs text-center text-slate-400 mt-4">
              密碼請向活動發起人索取
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function CreateView({ navigate, db }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdInfo, setCreatedInfo] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name || !date) return;
    setIsSubmitting(true);

    try {
      const simpleCode = String(Math.floor(Math.random() * 900) + 100);
      const secretPass = isPrivate
        ? String(Math.floor(Math.random() * 9000) + 1000)
        : null;
      const newCard = {
        recipientName: name,
        targetDate: date,
        createdAt: serverTimestamp(),
        creatorId: "anonymous",
        viewPassword: secretPass,
        isClosed: false,
      };
      await setDoc(
        doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "birthday_cards",
          simpleCode
        ),
        newCard
      );
      setCreatedInfo({
        code: simpleCode,
        pass: secretPass,
        name: name,
        isPrivate: isPrivate,
      });
    } catch (error) {
      console.error(error);
      alert("建立失敗");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (createdInfo) {
    return (
      <div className="py-6 animate-pop-in">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
            <Check size={32} strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            活動建立成功！
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            請務必截圖或記下以下資訊
          </p>
          <div className="space-y-4 mb-8">
            {/* <div className="bg-blue-50 p-4 rounded-xl border border-blue-100"><p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">活動入口代碼</p><p className="text-3xl font-bold text-[#1b69b4] tracking-widest font-mono">{createdInfo.code}</p><p className="text-xs text-blue-400 mt-1">👉 分享給參與者</p></div> */}
            {/* 因為已經沒有輸入代碼的頁面，這裡不需要強調代碼，直接強調進入首頁即可。但保留後台資料需要ID。 */}

            {createdInfo.isPrivate ? (
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 bg-amber-200 w-16 h-16 rounded-full opacity-20"></div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1 flex items-center justify-center gap-1">
                  <Lock size={10} /> 管理員/壽星密碼
                </p>
                <p className="text-3xl font-bold text-amber-600 tracking-widest font-mono">
                  {createdInfo.pass}
                </p>
                <p className="text-xs text-amber-500 mt-1">
                  🤫 只有這個密碼能查看留言
                </p>
              </div>
            ) : (
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1 flex items-center justify-center gap-1">
                  <Globe size={10} /> 公開活動
                </p>
                <p className="text-green-600 font-bold">
                  所有人皆可直接查看留言
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => navigate("home")}
            className="w-full btn-gradient text-white font-bold py-3 rounded-xl shadow-md"
          >
            我知道了，回首頁
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 animate-pop-in">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 text-[#1b69b4] shadow-inner">
            <Sparkles size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">發起新活動</h2>
          <p className="text-sm text-slate-400">系統將產生兩組代碼確保隱私</p>
        </div>
        <form onSubmit={handleCreate} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1.5 ml-1">
              活動名稱 / 壽星大名
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-blue-300 focus:bg-white focus:outline-none transition-all"
              placeholder="例如：聖誕節交換禮物、設計部 小美"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1.5 ml-1">
              活動日期
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-blue-300 focus:bg-white focus:outline-none transition-all"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div
            className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border-2 border-slate-100 cursor-pointer"
            onClick={() => setIsPrivate(!isPrivate)}
          >
            <div
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                isPrivate ? "bg-[#1b69b4]" : "bg-slate-300"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                  isPrivate ? "left-7" : "left-1"
                }`}
              ></div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                {isPrivate ? <Lock size={14} /> : <Globe size={14} />}
                {isPrivate ? "加密保護 (預設)" : "公開活動"}
              </p>
              <p className="text-xs text-slate-400">
                {isPrivate
                  ? "只有持有密碼的人能查看留言"
                  : "所有人都能直接查看留言牆"}
              </p>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-gradient text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-blue-200/50 active:scale-95 transition-all disabled:opacity-50 mt-4 text-lg"
          >
            {isSubmitting ? "建立中..." : "🎉 產生加密活動"}
          </button>
        </form>
      </div>
    </div>
  );
}

function ArchiveView({ navigate, db, isGlobalAdmin }) {
  const [allCards, setAllCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = collection(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      "birthday_cards"
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const cards = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const sorted = cards.sort(
          (a, b) => new Date(b.targetDate) - new Date(a.targetDate)
        );
        setAllCards(sorted);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsubscribe();
  }, [db]);

  const handleDelete = async (e, cardId, name) => {
    e.stopPropagation();
    if (window.confirm(`確定要永久刪除「${name}」嗎？`)) {
      try {
        await deleteDoc(
          doc(
            db,
            "artifacts",
            appId,
            "public",
            "data",
            "birthday_cards",
            cardId
          )
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="animate-slide-up pb-8">
      <div className="text-center mb-8 pt-4">
        <div className="inline-block p-3 bg-amber-100 rounded-full text-amber-600 mb-3 shadow-sm">
          <History size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">典藏回憶</h2>
        <p className="text-sm text-slate-400">所有美好的時光都收藏在這裡</p>
      </div>

      {loading ? (
        <div className="text-center text-slate-400">載入歷史資料...</div>
      ) : (
        <div className="space-y-4">
          {allCards.map((card, idx) => (
            <div
              key={card.id}
              onClick={() => navigate("portal", card.id, card)}
              className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white hover:bg-white hover:shadow-md transition-all cursor-pointer flex gap-4 items-center group"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="flex flex-col items-center justify-center w-14 h-14 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-500 transition-colors">
                <span className="text-xs font-bold uppercase">
                  {new Date(card.targetDate).toLocaleString("en-US", {
                    month: "short",
                  })}
                </span>
                <span className="text-xl font-bold">
                  {new Date(card.targetDate).getDate()}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-700 text-lg group-hover:text-[#1b69b4] transition-colors">
                  {card.recipientName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-mono">
                    #{card.id}
                  </span>
                  {card.viewPassword ? (
                    <span className="text-xs text-amber-500 flex items-center gap-1 bg-amber-50 px-1.5 rounded">
                      <Lock size={10} /> 加密
                    </span>
                  ) : (
                    <span className="text-xs text-green-500 flex items-center gap-1 bg-green-50 px-1.5 rounded">
                      <Globe size={10} /> 公開
                    </span>
                  )}
                  {card.isClosed && (
                    <span className="text-xs text-red-500 flex items-center gap-1 bg-red-50 px-1.5 rounded">
                      <Ban size={10} /> 截止
                    </span>
                  )}
                </div>
              </div>
              {isGlobalAdmin ? (
                <button
                  onClick={(e) => handleDelete(e, card.id, card.recipientName)}
                  className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors z-20"
                >
                  <Trash2 size={16} />
                </button>
              ) : (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300">
                  <ChevronLeft className="rotate-180" size={20} />
                </div>
              )}
            </div>
          ))}
          {allCards.length === 0 && (
            <div className="text-center text-slate-400 py-10">
              目前還沒有歷史活動喔
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function WriteView({ navigate, db, cardId, cardData }) {
  const [sender, setSender] = useState("");
  const [message, setMessage] = useState("");
  const [theme, setTheme] = useState("pink");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isClosed, setIsClosed] = useState(cardData?.isClosed || false);

  useEffect(() => {
    if (!cardId) return;
    const unsubscribe = onSnapshot(
      doc(db, "artifacts", appId, "public", "data", "birthday_cards", cardId),
      (doc) => {
        if (doc.exists()) setIsClosed(doc.data().isClosed);
      }
    );
    return () => unsubscribe();
  }, [db, cardId]);

  const themes = [
    {
      id: "pink",
      bg: "bg-pink-50",
      border: "border-pink-200",
      active: "ring-pink-300",
      color: "text-pink-800",
    },
    {
      id: "blue",
      bg: "bg-blue-50",
      border: "border-blue-200",
      active: "ring-blue-300",
      color: "text-blue-800",
    },
    {
      id: "green",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      active: "ring-emerald-300",
      color: "text-emerald-800",
    },
    {
      id: "yellow",
      bg: "bg-amber-50",
      border: "border-amber-200",
      active: "ring-amber-300",
      color: "text-amber-800",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isClosed) return alert("活動已截止，無法送出");
    if (!sender || !message) return;
    setIsSubmitting(true);
    try {
      await addDoc(
        collection(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "birthday_messages"
        ),
        {
          cardId,
          sender,
          content: message,
          style: theme,
          createdAt: serverTimestamp(),
        }
      );
      setSuccess(true);
      setTimeout(() => navigate("home"), 2500);
    } catch (error) {
      console.error(error);
      alert("傳送失敗");
      setIsSubmitting(false);
    }
  };

  if (success)
    return (
      <div className="h-full flex flex-col items-center justify-center text-center animate-pop-in">
        <ConfettiExplosion active={true} />
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6 shadow-lg animate-bounce">
          <Check size={48} strokeWidth={4} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">送出成功！</h2>
        <p className="text-slate-500">
          {cardData?.viewPassword
            ? `您的祝福已經加密飛向 ${cardData?.recipientName} 囉 🚀`
            : `您的祝福已經發佈到 ${cardData?.recipientName} 囉 🚀`}
        </p>
      </div>
    );
  if (isClosed)
    return (
      <div className="h-full flex flex-col items-center justify-center text-center animate-pop-in px-6">
        <ConfettiExplosion active={true} />
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-6 shadow-lg">
          <Ban size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">活動已截止</h2>
        <p className="text-slate-500">
          感謝大家的熱情參與！
          <br />
          下次活動見 👋
        </p>
        <button
          onClick={() => navigate("home")}
          className="mt-8 text-[#1b69b4] font-bold hover:underline"
        >
          回首頁
        </button>
      </div>
    );

  return (
    <div className="py-2 animate-slide-up">
      <div className="mb-6 text-center">
        <span className="inline-block px-3 py-1 bg-white/60 rounded-full text-xs font-bold text-slate-500 mb-2 border border-white">
          給 {cardData?.recipientName} 的祝福
        </span>
        <h2 className="text-2xl font-bold text-slate-800">留下溫暖話語</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white/80 p-4 rounded-2xl shadow-sm border border-white backdrop-blur-sm transition focus-within:ring-2 focus-within:ring-blue-200">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            我是...
          </label>
          <input
            type="text"
            className="w-full text-lg bg-transparent border-none p-0 focus:ring-0 placeholder-slate-300 text-slate-700 font-bold"
            placeholder="你的名字"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            required
          />
        </div>
        <div className="bg-white/80 p-4 rounded-2xl shadow-sm border border-white backdrop-blur-sm">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            選擇卡片風格
          </label>
          <div className="flex gap-3 justify-center">
            {themes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={`w-10 h-10 rounded-full ${
                  t.bg
                } border-2 transition-all duration-300 transform hover:scale-110 ${
                  theme === t.id
                    ? `${t.active} ring-2 ring-offset-2 scale-110 border-transparent`
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        </div>
        <div
          className={`p-6 rounded-2xl shadow-sm border transition-all duration-500 ${
            themes.find((t) => t.id === theme).bg
          } ${themes.find((t) => t.id === theme).border}`}
        >
          <textarea
            className={`w-full h-40 bg-transparent resize-none focus:outline-none placeholder-slate-400/60 text-lg leading-relaxed ${
              themes.find((t) => t.id === theme).color
            }`}
            placeholder={`祝 ${cardData?.recipientName} 生日快樂...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl hover:bg-slate-700 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 group"
        >
          <Send
            size={20}
            className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform"
          />
          {isSubmitting ? "傳送中..." : "送出祝福"}
        </button>
      </form>
    </div>
  );
}

// Enhanced AdminView with Edit/Delete/Privacy Controls
function AdminView({ navigate, db, cardId, initialCardData, isGlobalAdmin }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [cardData, setCardData] = useState(initialCardData);

  // Edit States
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(
    initialCardData?.recipientName || ""
  );
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!cardId) return;
    // Listen to card meta changes
    const unsubCard = onSnapshot(
      doc(db, "artifacts", appId, "public", "data", "birthday_cards", cardId),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCardData(data);
          if (!isEditingTitle) setNewTitle(data.recipientName);
        }
      }
    );

    // Listen to messages
    const q = collection(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      "birthday_messages"
    );
    const unsubMsg = onSnapshot(q, (snapshot) => {
      const allMsgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(allMsgs.filter((m) => m.cardId === cardId));
      setLoading(false);
    });

    return () => {
      unsubCard();
      unsubMsg();
    };
  }, [db, cardId]);

  const handleToggleClose = async () => {
    try {
      await updateDoc(
        doc(db, "artifacts", appId, "public", "data", "birthday_cards", cardId),
        { isClosed: !cardData.isClosed }
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveTitle = async () => {
    if (!newTitle.trim()) return;
    try {
      await updateDoc(
        doc(db, "artifacts", appId, "public", "data", "birthday_cards", cardId),
        { recipientName: newTitle }
      );
      setIsEditingTitle(false);
    } catch (e) {
      console.error(e);
      alert("更新失敗");
    }
  };

  const handleDeleteEvent = async () => {
    if (
      !window.confirm(
        "⚠️ 警告：確定要刪除整個活動嗎？\n這將會刪除所有留言，且無法復原！"
      )
    )
      return;
    if (!window.confirm("再次確認：真的要刪除嗎？")) return;
    try {
      await deleteDoc(
        doc(db, "artifacts", appId, "public", "data", "birthday_cards", cardId)
      );
      alert("活動已刪除");
      navigate("home");
    } catch (e) {
      console.error(e);
      alert("刪除失敗");
    }
  };

  const handleTogglePrivacy = async () => {
    try {
      if (cardData.viewPassword) {
        // Make Public
        if (!window.confirm("確定要公開活動嗎？任何人都可以直接查看留言。"))
          return;
        await updateDoc(
          doc(
            db,
            "artifacts",
            appId,
            "public",
            "data",
            "birthday_cards",
            cardId
          ),
          { viewPassword: null }
        );
      } else {
        // Make Private
        const newPass = String(Math.floor(Math.random() * 9000) + 1000);
        await updateDoc(
          doc(
            db,
            "artifacts",
            appId,
            "public",
            "data",
            "birthday_cards",
            cardId
          ),
          { viewPassword: newPass }
        );
        alert(`活動已上鎖，新密碼為：${newPass}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const copyAllMessages = () => {
    if (messages.length === 0) return;
    const fullText =
      `🎉 給 ${cardData.recipientName} 的祝福 🎉\n\n` +
      messages
        .map((m) => `${m.sender}：\n${m.content}\n`)
        .join("\n----------------\n\n") +
      `\n(來自大家的滿滿心意)`;
    const el = document.createElement("textarea");
    el.value = fullText;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const themeMap = {
    pink: "bg-pink-50 text-pink-900 border-pink-100 rotate-1",
    blue: "bg-blue-50 text-blue-900 border-blue-100 -rotate-1",
    green: "bg-emerald-50 text-emerald-900 border-emerald-100 rotate-2",
    yellow: "bg-amber-50 text-amber-900 border-amber-100 -rotate-2",
  };

  return (
    <div className="py-2 h-full flex flex-col animate-slide-up pb-20 relative">
      {/* Header Card */}
      <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-white mb-4">
        <div className="flex justify-between items-start mb-2">
          {isEditingTitle ? (
            <div className="flex items-center gap-2 w-full">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="flex-1 border-b-2 border-[#1b69b4] bg-transparent font-bold text-xl focus:outline-none"
                autoFocus
              />
              <button
                onClick={handleSaveTitle}
                className="text-green-600 p-1 hover:bg-green-50 rounded"
              >
                <Save size={20} />
              </button>
              <button
                onClick={() => {
                  setIsEditingTitle(false);
                  setNewTitle(cardData.recipientName);
                }}
                className="text-red-400 p-1 hover:bg-red-50 rounded"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-800">
                {cardData?.recipientName} 的留言板
              </h2>
              {isGlobalAdmin && (
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="text-slate-300 hover:text-[#1b69b4]"
                >
                  <Edit2 size={16} />
                </button>
              )}
            </div>
          )}
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-inner ${
              cardData?.isClosed
                ? "bg-red-100 text-red-500"
                : "bg-green-100 text-green-600"
            }`}
          >
            {cardData?.isClosed ? <Ban size={20} /> : <Eye size={20} />}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-slate-500 flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg">
            {cardData?.viewPassword ? <Lock size={12} /> : <Globe size={12} />}
            {cardData?.viewPassword ? "加密" : "公開"}
          </span>
          {cardData?.viewPassword && isGlobalAdmin && (
            <span
              className="text-xs text-amber-600 flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg font-mono select-all cursor-pointer"
              onClick={() => alert(`密碼是: ${cardData.viewPassword}`)}
            >
              <KeyRound size={12} /> {cardData.viewPassword}
            </span>
          )}
          <span className="text-xs text-slate-400 ml-auto">ID: {cardId}</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-4 px-2">
        <span className="text-sm font-bold text-slate-500 flex items-center gap-2">
          <Users size={16} /> 共 {messages.length} 則祝福
        </span>
        <button
          onClick={copyAllMessages}
          disabled={messages.length === 0}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 ${
            copied
              ? "bg-green-500 text-white shadow-green-200"
              : "bg-slate-800 text-white hover:bg-slate-700 shadow-slate-300"
          } disabled:opacity-50 disabled:shadow-none`}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "已複製！" : "一鍵複製"}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4 no-scrollbar">
        {loading ? (
          <div className="text-center text-slate-400 mt-10">讀取中...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-slate-400 mt-10 py-10 bg-white/40 rounded-2xl border border-dashed border-white">
            <p>還沒有留言</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border shadow-sm transition hover:shadow-md hover:scale-[1.01] hover:z-10 ${
                themeMap[msg.style || "pink"]
              }`}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <p className="whitespace-pre-wrap text-base leading-relaxed mb-4 font-medium opacity-90">
                {msg.content}
              </p>
              <div className="flex justify-end items-center gap-1 opacity-60 text-xs font-bold uppercase tracking-wider">
                <div className="w-4 h-1 bg-current rounded-full"></div>{" "}
                {msg.sender}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Admin Control Floating Button */}
      <div className="absolute bottom-4 left-4 z-30">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="bg-white p-3 rounded-full shadow-lg border border-slate-100 text-slate-600 hover:text-[#1b69b4] hover:rotate-90 transition-all"
        >
          <Settings size={24} />
        </button>

        {showSettings && (
          <div className="absolute bottom-14 left-0 bg-white p-2 rounded-2xl shadow-xl border border-slate-100 flex flex-col gap-2 w-48 animate-pop-in origin-bottom-left">
            <button
              onClick={handleToggleClose}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                cardData?.isClosed
                  ? "bg-green-50 text-green-600 hover:bg-green-100"
                  : "bg-red-50 text-red-500 hover:bg-red-100"
              }`}
            >
              <Power size={18} /> {cardData?.isClosed ? "重啟活動" : "截止活動"}
            </button>

            {isGlobalAdmin && (
              <>
                <button
                  onClick={handleTogglePrivacy}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  {cardData?.viewPassword ? (
                    <Globe size={18} />
                  ) : (
                    <Lock size={18} />
                  )}
                  {cardData?.viewPassword ? "設為公開" : "設為加密"}
                </button>
                <div className="h-px bg-slate-100 my-1"></div>
                <button
                  onClick={handleDeleteEvent}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={18} /> 刪除此活動
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
