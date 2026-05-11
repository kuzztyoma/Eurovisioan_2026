import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";

const logoUrl = "https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/de/thumb/1/10/Eurovision_Song_Contest_2026_Logo.svg/1280px-Eurovision_Song_Contest_2026_Logo.svg.png";

const initialCountries = [
  { id: "md", name: "Moldova", song: "Satoshi — Viva, Moldova", flag: "🇲🇩", image: "https://photos.ebu.ch/media/image?src=thumbs/37207_400_h.jpg&1778481834", score: 0, note: "" },
  { id: "se", name: "Sweden", song: "Felicia — My System", flag: "🇸🇪", image: "https://photos.ebu.ch/media/image?src=thumbs/37224_400_h.jpg&1778482234", score: 0, note: "" },
  { id: "hr", name: "Croatia", song: "Lelek — Andromeda", flag: "🇭🇷", image: "https://photos.ebu.ch/media/image?src=thumbs/37077_400_h.jpg&1778482274", score: 0, note: "" },
  { id: "gr", name: "Greece", song: "Akylas — Ferto", flag: "🇬🇷", image: "https://photos.ebu.ch/media/image?src=thumbs/37812_400_h.jpg&1778482325", score: 0, note: "" },
  { id: "pt", name: "Portugal", song: "Bandidos do Cante — Rosa", flag: "🇵🇹", image: "https://photos.ebu.ch/media/image?src=thumbs/37222_400_h.jpg&1778482352", score: 0, note: "" },
  { id: "ge", name: "Georgia", song: "Bzikebi — On Replay", flag: "🇬🇪", image: "https://photos.ebu.ch/media/image?src=thumbs/37819_400_h.jpg&1778482385", score: 0, note: "" },
  { id: "fi", name: "Finland", song: "Linda & Pete — Liekinheitin", flag: "🇫🇮", image: "https://photos.ebu.ch/media/image?src=thumbs/37824_400_h.jpg&1778482429", score: 0, note: "" },
  { id: "me", name: "Montenegro", song: "Tamara Živković — Nova zora", flag: "🇲🇪", image: "https://photos.ebu.ch/media/image?src=thumbs/37830_400_h.jpg&1778482452", score: 0, note: "" },
  { id: "ee", name: "Estonia", song: "Vanilla Ninja — Too Epic To Be True", flag: "🇪🇪", image: "https://photos.ebu.ch/media/image?src=thumbs/37832_400_h.jpg&1778482479", score: 0, note: "" },
  { id: "il", name: "Israel", song: "Noam Bettan — Michelle", flag: "🇮🇱", image: "https://static.wixstatic.com/media/02fefe_e8106b6f4ee64573994a8f5bdc860f26~mv2.png/v1/fill/w_1480,h_986,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/02fefe_e8106b6f4ee64573994a8f5bdc860f26~mv2.png", score: 0, note: "" },
  { id: "be", name: "Belgium", song: "Essyla — Dancing on the Ice", flag: "🇧🇪", image: "https://photos.ebu.ch/media/image?src=thumbs/37844_400_h.jpg&1778482558", score: 0, note: "" },
  { id: "lt", name: "Lithuania", song: "Lion Ceccah — Sólo quiero más", flag: "🇱🇹", image: "https://photos.ebu.ch/media/image?src=thumbs/37847_400_h.jpg&1778482586", score: 0, note: "" },
  { id: "sm", name: "San Marino", song: "Senhit ft. Boy George — Superstar", flag: "🇸🇲", image: "https://photos.ebu.ch/media/image?src=thumbs/37251_400_h.jpg&1778482607", score: 0, note: "" },
  { id: "pl", name: "Poland", song: "Alicja Szemplińska — Pray", flag: "🇵🇱", image: "https://photos.ebu.ch/media/image?src=thumbs/37701_400_h.jpg&1778482646", score: 0, note: "" },
  { id: "rs", name: "Serbia", song: "Lavina — Kraj mene", flag: "🇷🇸", image: "https://photos.ebu.ch/media/image?src=thumbs/37706_400_h.jpg&1778482671", score: 0, note: "" },
];

export default function EurovisionScoreboard() {
  const exportRef = useRef(null);
  const [countries, setCountries] = useState(() => {
    const saved = localStorage.getItem("eurovision-scores-2026-v12");
    return saved ? JSON.parse(saved) : initialCountries;
  });
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    localStorage.setItem("eurovision-scores-2026-v12", JSON.stringify(countries));
  }, [countries]);

  const toggleScore = (targetId, clickedPoints) => {
    setCountries((prev) =>
      prev.map((c) => {
        if (c.id === targetId) return { ...c, score: c.score === clickedPoints ? 0 : clickedPoints };
        if (c.score === clickedPoints) return { ...c, score: 0 };
        return c;
      })
    );
  };

  const updateNote = (id, text) => {
    setCountries((prev) => prev.map((c) => (c.id === id ? { ...c, note: text } : c)));
  };

  const resetScores = () => {
    if (window.confirm("Reset all votes?")) {
      setCountries(initialCountries);
      localStorage.removeItem("eurovision-scores-2026-v12");
    }
  };

  const downloadAsImage = async () => {
    if (!exportRef.current || votesCount !== 10) return;
    setIsExporting(true);
    setTimeout(async () => {
      try {
        const canvas = await html2canvas(exportRef.current, {
          scale: 1, 
          backgroundColor: "#f8fafc",
          useCORS: true,
          width: 1080,
          height: 1920
        });
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "My_Eurovision_Top_Stories.png";
        link.click();
      } catch (e) {
        alert("Error saving image.");
      } finally {
        setIsExporting(false);
      }
    }, 800);
  };

  const sorted = [...countries].sort((a, b) => b.score - a.score);
  const votingStarted = countries.some((c) => c.score > 0);
  const votesCount = countries.filter((c) => c.score > 0).length;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#6366f1]/15 via-slate-50 to-[#d8b4fe]/15 text-gray-900 font-sans flex flex-col items-center overflow-x-hidden relative text-center">
      
      {/* 1. ЭКСПОРТНЫЙ КОНТЕЙНЕР ( Stories 9:16 — Идеальная верстка без фона плашки ) */}
      <div style={{ position: 'absolute', left: '-5000px', top: 0 }}>
        <div ref={exportRef} className="w-[1080px] h-[1920px] bg-[#f3f4f6] pt-40 pb-40 px-16 flex flex-col items-center justify-between">
          <header className="text-center flex flex-col items-center w-full mb-10">
            <img src={logoUrl} crossOrigin="anonymous" className="h-32 mb-6 object-contain" alt="" />
            <h1 className="text-8xl font-black text-gray-900 mb-2 tracking-tighter italic uppercase leading-none">Semi-Final 1</h1>
            <p className="text-gray-500 text-2xl font-bold tracking-[0.3em] uppercase opacity-60 mb-10">12 MAY 2026 // VIENNA</p>
            <div className="text-[#002FA7] text-6xl font-black uppercase tracking-[0.2em] italic">My Top 10</div>
          </header>

          <div className="flex flex-col gap-4 w-full px-2 flex-grow justify-center">
            {sorted.slice(0, 10).map((c, i) => (
              <div key={c.id} className="bg-white px-12 h-[110px] flex items-center justify-between rounded-[40px] border border-gray-100">
                <div className="flex items-center gap-10 h-full">
                  <span className="text-4xl font-black text-gray-200 italic w-12 flex items-center justify-center h-full leading-none">{i + 1}</span>
                  <div className="w-24 h-full flex items-center justify-center text-[70px] leading-none">{c.flag}</div>
                  <div className="ml-2 text-left flex flex-col justify-center h-full">
                    <h2 className="text-[44px] font-black uppercase tracking-tighter leading-none mb-1">{c.name}</h2>
                    <p className="text-gray-400 text-2xl italic font-medium leading-none">{c.song}</p>
                  </div>
                </div>
                <div className="text-7xl font-black text-[#002FA7] flex items-center h-full pr-4 tracking-tighter leading-none">{c.score}</div>
              </div>
            ))}
          </div>
          <div className="h-10 w-full"></div>
        </div>
      </div>

      {/* 2. ПАНЕЛЬ УПРАВЛЕНИЯ */}
      {!isExporting && (
        <div className="w-full bg-white/60 backdrop-blur-xl border-b border-white/60 py-3 px-6 flex justify-center gap-3 sticky top-0 z-50 shadow-sm">
          {votingStarted ? (
            <>
              <button onClick={resetScores} className="px-4 py-2 bg-red-50/50 text-red-600 rounded-xl text-sm font-bold border border-red-100 transition-colors">Reset</button>
              <button onClick={downloadAsImage} disabled={votesCount !== 10} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${votesCount === 10 ? "bg-[#002FA7] text-white shadow-lg shadow-blue-200 scale-105" : "bg-gray-200/50 text-gray-400 cursor-not-allowed"}`}>Download Story</button>
            </>
          ) : (
            <span className="text-gray-500 py-2 text-sm font-bold italic tracking-wide">Select your top 10 countries</span>
          )}
        </div>
      )}

      {/* 3. ОСНОВНОЙ СПИСОК ( Исправленные поля заметок ) */}
      <div className="w-full max-w-5xl p-4 md:p-8 flex flex-col relative z-10">
        <header className="mb-12 text-center flex flex-col items-center">
          <img src={logoUrl} crossOrigin="anonymous" className="h-20 md:h-28 mb-4 object-contain" alt="" />
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-1 tracking-tighter italic uppercase">Semi-Final 1</h1>
          <p className="text-gray-500 text-sm font-bold tracking-widest uppercase opacity-60">12 MAY 2026, VIENNA</p>
        </header>

        <div className="flex flex-col gap-5">
          {sorted.map((c, i) => (
            <React.Fragment key={c.id}>
              {votingStarted && i === 10 && (
                <div className="w-full py-12 flex items-center gap-6 px-4">
                  <div className="flex-1 h-px bg-gray-300/50"></div>
                  <span className="text-gray-400 text-xs font-black uppercase tracking-[0.4em]">Zero Points</span>
                  <div className="flex-1 h-px bg-gray-300/50"></div>
                </div>
              )}
              <motion.div layout className={`group bg-white/50 backdrop-blur-2xl border-2 p-3 md:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between shadow-xl rounded-[32px] gap-4 transition-all ${c.score > 0 ? "border-[#002FA7]/30 ring-8 ring-[#002FA7]/5" : "border-white/80"}`}>
                <div className="flex items-center gap-3 md:gap-6">
                  <div className="w-8 text-center text-xl font-bold text-gray-300 italic">{i + 1}</div>
                  <div className="text-4xl flex items-center justify-center bg-white/60 w-14 h-14 rounded-full shadow-inner border border-white/40">{c.flag}</div>
                  <img src={c.image} alt="" className="w-24 h-14 rounded-2xl object-cover bg-gray-100 shadow-sm border border-white/20" />
                  <div className="flex-1 text-left min-w-0">
                    <h2 className="text-lg md:text-xl font-black uppercase tracking-tight leading-none mb-1 truncate">{c.name}</h2>
                    <p className="text-gray-500 text-xs md:text-sm italic opacity-80 truncate">{c.song}</p>
                    
                    {/* Исправленное поле для заметок: высокая контрастность */}
                    <textarea 
                      value={c.note || ""} 
                      onChange={(e) => updateNote(c.id, e.target.value)} 
                      placeholder="Add note..." 
                      className="w-full mt-2 p-2 text-[10px] bg-white/70 border border-slate-200 rounded-lg text-gray-800 focus:bg-white/90 focus:border-[#002FA7]/30 outline-none resize-none placeholder:text-gray-500 transition-all shadow-inner" 
                      rows="1" 
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="grid grid-cols-5 gap-1.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((p) => {
                      const mine = c.score === p;
                      const taken = countries.some((other) => other.id !== c.id && other.score === p);
                      return (
                        <button key={p} onClick={() => toggleScore(c.id, p)} className={`h-10 w-10 flex items-center justify-center rounded-xl text-xs font-black transition-all border ${mine ? "bg-[#002FA7] text-white border-transparent scale-110 shadow-lg shadow-blue-200" : taken ? "bg-gray-100/40 text-gray-300 border-gray-100/50 cursor-not-allowed" : "bg-white/80 text-gray-700 border-slate-200 hover:bg-white hover:border-[#002FA7]/30"}`}>{p}</button>
                      );
                    })}
                  </div>
                  <div className="hidden md:block w-16 text-right text-4xl font-black text-[#002FA7] drop-shadow-sm">{c.score > 0 ? c.score : "-"}</div>
                </div>
              </motion.div>
            </React.Fragment>
          ))}
        </div>

        <footer className="mt-20 mb-8 text-center text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] opacity-50 relative z-20">
          Created by <a href="https://www.instagram.com/artkuztom/" target="_blank" rel="noopener noreferrer" className="text-[#002FA7] hover:underline font-bold transition-colors">Artyom Kuzmenko</a>
        </footer>
      </div>
    </div>
  );
}
