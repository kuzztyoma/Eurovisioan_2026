import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";

// Стабильный прокси для захвата логотипа
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
    const saved = localStorage.getItem("eurovision-scores-2026-v9");
    return saved ? JSON.parse(saved) : initialCountries;
  });

  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!document.getElementById("tailwind-cdn")) {
      const script = document.createElement("script");
      script.id = "tailwind-cdn";
      script.src = "https://cdn.tailwindcss.com";
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("eurovision-scores-2026-v9", JSON.stringify(countries));
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
      localStorage.removeItem("eurovision-scores-2026-v9");
    }
  };

  const downloadAsImage = async () => {
    if (!exportRef.current || votesCount !== 10) return;
    setIsExporting(true);

    setTimeout(async () => {
      try {
        const canvas = await html2canvas(exportRef.current, {
          scale: 1, 
          backgroundColor: "#f3f4f6",
          useCORS: true,
          allowTaint: false,
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
    <div className="min-h-screen bg-[#f3f4f6] text-gray-900 font-sans flex flex-col items-center overflow-x-hidden relative text-center">
      
      {/* 1. ЭКСПОРТНЫЙ КОНТЕЙНЕР ( Stories 9:16 — Только Топ-10 ) */}
      <div style={{ position: 'absolute', left: '-5000px', top: 0 }}>
        <div 
          ref={exportRef} 
          className="w-[1080px] h-[1920px] bg-[#f3f4f6] pt-36 pb-36 px-14 flex flex-col items-center justify-between"
        >
          <header className="text-center flex flex-col items-center w-full mb-8">
            <img src={logoUrl} crossOrigin="anonymous" className="h-28 mb-6 object-contain" alt="" />
            <h1 className="text-7xl font-black text-gray-900 mb-1 tracking-tighter italic uppercase leading-none">Semi-Final 1</h1>
            <p className="text-gray-500 text-xl font-bold tracking-[0.3em] uppercase opacity-60 mb-8">12 MAY 2026 // VIENNA</p>
            <div className="bg-[#002FA7] text-white px-10 h-16 flex items-center justify-center rounded-full text-3xl font-black uppercase tracking-widest italic shadow-lg">
              My Top 10
            </div>
          </header>

          <div className="flex flex-col gap-3 w-full px-2 flex-grow justify-center">
            {sorted.slice(0, 10).map((c, i) => (
              <div key={c.id} className="bg-white px-10 h-26 flex items-center justify-between rounded-[35px] border border-gray-100">
                <div className="flex items-center gap-8 h-full">
                  <span className="text-3xl font-black text-gray-200 italic w-12 flex items-center justify-center h-full leading-none">{i + 1}</span>
                  <div className="w-20 h-full flex items-center justify-center text-[65px] leading-none -mt-3">
                    {c.flag}
                  </div>
                  <div className="ml-3 text-left flex flex-col justify-center h-full">
                    <h2 className="text-[38px] font-black uppercase tracking-tighter leading-none mb-1">{c.name}</h2>
                    <p className="text-gray-400 text-xl italic font-medium leading-none">{c.song}</p>
                  </div>
                </div>
                <div className="text-7xl font-black text-[#002FA7] flex items-center h-full pr-2 -mt-2 tracking-tighter leading-none">
                   {c.score}
                </div>
              </div>
            ))}
          </div>
          
          <div className="h-10 w-full"></div>
        </div>
      </div>

      {/* 2. ПАНЕЛЬ УПРАВЛЕНИЯ ( Твой основной интерфейс ) */}
      {!isExporting && (
        <div className="w-full bg-white border-b py-3 px-3 sm:px-6 flex justify-center gap-2 sm:gap-3 sticky top-0 z-50 shadow-sm">
          {votingStarted ? (
            <>
              <button onClick={resetScores} className="px-3 sm:px-4 py-2 bg-red-50 text-red-600 rounded-lg text-xs sm:text-sm font-bold border border-red-100 transition-colors whitespace-nowrap">Reset</button>
              <button
                onClick={downloadAsImage}
                disabled={votesCount !== 10}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  votesCount === 10 ? "bg-[#002FA7] text-white shadow-md" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Download Story Image
              </button>
            </>
          ) : (
            <span className="text-gray-400 py-2 text-xs sm:text-sm font-bold italic text-center">Select your top 10 countries</span>
          )}
        </div>
      )}

      {/* 3. ОСНОВНОЙ СПИСОК ( Для работы на сайте ) */}
      <div className="w-full max-w-5xl p-3 sm:p-4 md:p-8 bg-[#f3f4f6] flex flex-col">
        <header className="mb-6 md:mb-8 text-center flex flex-col items-center">
          <img 
            src="https://upload.wikimedia.org/wikipedia/de/thumb/1/10/Eurovision_Song_Contest_2026_Logo.svg/1280px-Eurovision_Song_Contest_2026_Logo.png" 
            crossOrigin="anonymous" 
            className="h-16 sm:h-20 md:h-28 mb-3 object-contain" 
            alt="Logo" 
          />
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-1 leading-normal uppercase tracking-tighter italic">Semi-Final 1</h1>
          <p className="text-gray-500 text-sm italic font-medium mb-4">12 MAY 2026, VIENNA</p>
        </header>

        <div className="flex flex-col gap-3 flex-grow text-left">
          {sorted.map((c, i) => (
            <React.Fragment key={c.id}>
              {votingStarted && i === 10 && (
                <div className="w-full py-10 flex items-center gap-4 px-2 font-sans text-center">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <span className="text-gray-400 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] whitespace-nowrap shrink-0">
                    Zero Points
                  </span>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>
              )}
              <motion.div layout className={`bg-white border-b p-2.5 sm:p-3 md:pl-5 md:pr-6 flex flex-col md:flex-row items-stretch md:items-center justify-between shadow-sm rounded-lg gap-3 ${c.score > 0 ? "border-[#002FA7]/40 ring-1 ring-[#002FA7]/10" : "border-gray-200"}`}>
                <div className="flex items-start sm:items-center md:items-center gap-2 sm:gap-4 md:gap-6 w-full md:w-auto">
                  <div className="w-5 sm:w-6 text-center text-base sm:text-lg md:text-xl font-bold text-gray-400 italic shrink-0">{i + 1}</div>
                  <div className="text-2xl sm:text-3xl md:text-4xl flex items-center justify-center shrink-0 leading-normal rounded-full bg-gray-50 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 shadow-inner">{c.flag}</div>
                  <img src={c.image} alt="" className="w-14 h-9 sm:w-16 sm:h-10 md:w-24 md:h-14 rounded-md object-cover bg-gray-100 shrink-0 shadow-sm" />
                  <div className="flex-1 min-w-0 md:w-56 ml-0 md:ml-4">
                    <h2 className="text-base sm:text-lg md:text-xl font-black uppercase pb-1 leading-normal break-words">{c.name}</h2>
                    <p className="text-gray-500 text-[11px] sm:text-xs md:text-sm italic pb-1 leading-normal break-words">{c.song}</p>
                    <textarea
                      value={c.note || ""}
                      onChange={(e) => updateNote(c.id, e.target.value)}
                      placeholder="Add your note..."
                      className="w-full mt-2 p-1.5 text-[10px] bg-gray-50 border border-transparent border-b-gray-200 rounded text-gray-400 focus:text-gray-700 outline-none resize-none transition-all focus:border-[#002FA7]/30"
                      rows="1"
                    />
                  </div>
                  <div className="md:hidden text-xl sm:text-2xl font-black text-[#002FA7] shrink-0">{c.score > 0 ? c.score : "-"}</div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="grid grid-cols-5 gap-1.5 w-full md:w-auto">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((p) => {
                      const mine = c.score === p;
                      const taken = countries.some((other) => other.id !== c.id && other.score === p);
                      return (
                        <button key={p} onClick={() => toggleScore(c.id, p)} className={`h-10 md:h-9 w-full md:w-9 flex items-center justify-center rounded text-xs font-black transition-all border ${mine ? "bg-[#002FA7] text-white border-[#002FA7] shadow-md scale-105" : taken ? "bg-gray-50 text-gray-200 border-gray-100" : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"}`}>{p}</button>
                      );
                    })}
                  </div>
                  <div className="hidden md:block w-16 text-right text-4xl font-black text-[#002FA7]">{c.score > 0 ? c.score : "-"}</div>
                </div>
              </motion.div>
            </React.Fragment>
          ))}
        </div>

        <footer className="mt-12 mb-4 text-center text-gray-400 text-xs font-medium uppercase tracking-[0.2em] opacity-60">
          Scoreboard created by <a href="https://www.instagram.com/artkuztom/" target="_blank" rel="noopener noreferrer" className="text-[#002FA7] hover:underline font-bold transition-colors">Artyom Kuzmenko</a>
        </footer>
      </div>
    </div>
  );
}
