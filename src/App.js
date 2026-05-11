import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";

const logoUrl =
  "https://corsproxy.io/?" +
  encodeURIComponent(
    "https://upload.wikimedia.org/wikipedia/de/thumb/1/10/Eurovision_Song_Contest_2026_Logo.svg/1280px-Eurovision_Song_Contest_2026_Logo.png");

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
          scale: 1, // 1:1 для размера 1080x1920
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
    }, 600);
  };

  const sorted = [...countries].sort((a, b) => b.score - a.score);
  const votingStarted = countries.some((c) => c.score > 0);
  const votesCount = countries.filter((c) => c.score > 0).length;

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-gray-900 font-sans flex flex-col items-center overflow-x-hidden relative">
      
      {/* 1. ЭКСПОРТНЫЙ КОНТЕЙНЕР (Скрыт от глаз, виден только для html2canvas) */}
      <div style={{ position: 'absolute', left: '-5000px', top: 0 }}>
        <div 
          ref={exportRef} 
          className="w-[1080px] h-[1920px] bg-[#f3f4f6] p-20 flex flex-col justify-between items-center"
        >
          <header className="text-center flex flex-col items-center w-full">
            <img src="https://upload.wikimedia.org/wikipedia/de/thumb/1/10/Eurovision_Song_Contest_2026_Logo.svg/1280px-Eurovision_Song_Contest_2026_Logo.png" crossOrigin="anonymous" className="h-40 mb-10 object-contain" alt="" />
            <h1 className="text-8xl font-black text-gray-900 mb-4 tracking-tighter italic">Semi-Final 1</h1>
            <p className="text-gray-500 text-3xl font-bold tracking-[0.3em] uppercase opacity-60">12 MAY 2026 // VIENNA</p>
          </header>

          <div className="flex flex-col gap-6 w-full">
            {sorted.slice(0, 10).map((c, i) => (
              <div key={c.id} className="bg-white p-8 flex items-center justify-between shadow-sm rounded-[40px] border-b-8 border-[#002FA7]/10">
                <div className="flex items-center gap-10">
                  <span className="text-5xl font-black text-gray-300 italic w-16">{i + 1}</span>
                  <span className="text-8xl leading-none">{c.flag}</span>
                  <div className="ml-4">
                    <h2 className="text-5xl font-black uppercase tracking-tight leading-tight">{c.name}</h2>
                    <p className="text-gray-400 text-2xl italic font-medium">{c.song}</p>
                  </div>
                </div>
                <div className="text-7xl font-black text-[#002FA7]">{c.score}</div>
              </div>
            ))}
          </div>

          <footer className="w-full text-center">
             <p className="text-gray-400 text-2xl font-bold uppercase tracking-[0.4em] opacity-50">
               Scoreboard by <span className="text-[#002FA7]">Artyom Kuzmenko</span>
             </p>
          </footer>
        </div>
      </div>

      {/* 2. ВИДИМАЯ ПАНЕЛЬ УПРАВЛЕНИЯ */}
      <div className="w-full bg-white border-b py-3 px-6 flex justify-center gap-3 sticky top-0 z-50 shadow-sm">
        {votingStarted ? (
          <>
            <button onClick={resetScores} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold border border-red-100 transition-colors">Reset</button>
            <button
              onClick={downloadAsImage}
              disabled={votesCount !== 10}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                votesCount === 10 ? "bg-[#002FA7] text-white shadow-md" : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Download Story Image
            </button>
          </>
        ) : (
          <span className="text-gray-400 py-2 text-sm font-bold italic">Select your top 10 countries</span>
        )}
      </div>

      {/* 3. ОСНОВНОЙ СПИСОК (Для взаимодействия) */}
      <div className="w-full max-w-5xl p-4 md:p-8 flex flex-col">
        <header className="mb-8 text-center flex flex-col items-center">
          <img src={logoUrl} className="h-20 md:h-28 mb-3 object-contain" alt="ESC 2026" />
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-1 leading-normal uppercase">Semi-Final 1</h1>
          <p className="text-gray-500 text-sm italic font-medium mb-4">12 MAY 2026, VIENNA</p>
        </header>

        <div className="flex flex-col gap-3 flex-grow">
          {sorted.map((c, i) => (
            <React.Fragment key={c.id}>
              {votingStarted && i === 10 && (
                <div className="w-full py-6 flex items-center justify-center relative">
                  <div className="absolute inset-x-0 top-1/2 h-px bg-gray-300 -translate-y-1/2"></div>
                  <span className="relative z-10 text-gray-400 text-xs font-bold uppercase tracking-widest bg-[#f3f4f6] px-4">Zero Points</span>
                </div>
              )}

              <motion.div layout className={`bg-white border-b p-3 md:pl-5 md:pr-6 flex flex-col md:flex-row items-stretch md:items-center justify-between shadow-sm rounded-xl gap-3 ${c.score > 0 ? "border-[#002FA7]/40 ring-1 ring-[#002FA7]/10" : "border-gray-200"}`}>
                <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                  <div className="w-6 text-center text-lg md:text-xl font-bold text-gray-400 italic shrink-0">{i + 1}</div>
                  <div className="text-3xl md:text-4xl flex items-center justify-center shrink-0 leading-normal rounded-full bg-gray-50 w-10 h-10 md:w-12 md:h-12 shadow-inner">{c.flag}</div>
                  <img src={c.image} alt="" className="w-16 h-10 md:w-24 md:h-14 rounded-lg object-cover bg-gray-100 shrink-0 shadow-sm" />
                  <div className="flex-1 min-w-0 md:w-56 ml-2">
                    <h2 className="text-lg md:text-xl font-black uppercase truncate leading-none mb-1">{c.name}</h2>
                    <p className="text-gray-500 text-[11px] md:text-sm italic truncate">{c.song}</p>
                    <textarea
                      value={c.note || ""}
                      onChange={(e) => updateNote(c.id, e.target.value)}
                      placeholder="Add your note..."
                      className="w-full mt-2 p-1.5 text-[10px] bg-gray-50 border border-b-gray-200 rounded text-gray-400 focus:text-gray-700 outline-none resize-none transition-all"
                      rows="1"
                    />
                  </div>
                  <div className="md:hidden text-xl font-black text-[#002FA7] shrink-0">{c.score > 0 ? c.score : "-"}</div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="grid grid-cols-5 gap-1.5 w-full md:w-auto">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((p) => {
                      const mine = c.score === p;
                      const taken = countries.some((other) => other.id !== c.id && other.score === p);
                      return (
                        <button key={p} onClick={() => toggleScore(c.id, p)} className={`h-10 md:h-9 w-full md:w-9 flex items-center justify-center rounded-lg text-xs font-black transition-all border ${mine ? "bg-[#002FA7] text-white border-[#002FA7] shadow-md scale-105" : taken ? "bg-gray-50 text-gray-200 border-gray-100" : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"}`}>{p}</button>
                      );
                    })}
                  </div>
                  <div className="hidden md:block w-16 text-right text-4xl font-black text-[#002FA7]">{c.score > 0 ? c.score : "-"}</div>
                </div>
              </motion.div>
            </React.Fragment>
          ))}
        </div>

        <footer className="mt-12 mb-4 text-center text-gray-400 text-xs font-medium uppercase tracking-[0.2em]">
          Scoreboard created by <a href="https://www.instagram.com/artkuztom/" target="_blank" rel="noopener noreferrer" className="text-[#002FA7] hover:underline font-bold">Artyom Kuzmenko</a>
        </footer>
      </div>
    </div>
  );
}
