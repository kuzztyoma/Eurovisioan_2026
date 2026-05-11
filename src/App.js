import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";

// Тот самый стабильный прокси для логотипа
const logoUrl =
  "https://corsproxy.io/?" +
  encodeURIComponent(
    "https://upload.wikimedia.org/wikipedia/de/thumb/1/10/Eurovision_Song_Contest_2026_Logo.svg/1280px-Eurovision_Song_Contest_2026_Logo.png");

const initialCountries = [
  { id: "md", name: "Moldova", song: "Satoshi — Viva, Moldova", flag: "🇲🇩", image: "https://photos.ebu.ch/media/image?src=thumbs/37207_400_h.jpg&1778481834", score: 0 },
  { id: "se", name: "Sweden", song: "Felicia — My System", flag: "🇸🇪", image: "https://photos.ebu.ch/media/image?src=thumbs/37224_400_h.jpg&1778482234", score: 0 },
  { id: "hr", name: "Croatia", song: "Lelek — Andromeda", flag: "🇭🇷", image: "https://photos.ebu.ch/media/image?src=thumbs/37077_400_h.jpg&1778482274", score: 0 },
  { id: "gr", name: "Greece", song: "Akylas — Ferto", flag: "🇬🇷", image: "https://photos.ebu.ch/media/image?src=thumbs/37812_400_h.jpg&1778482325", score: 0 },
  { id: "pt", name: "Portugal", song: "Bandidos do Cante — Rosa", flag: "🇵🇹", image: "https://photos.ebu.ch/media/image?src=thumbs/37222_400_h.jpg&1778482352", score: 0 },
  { id: "ge", name: "Georgia", song: "Bzikebi — On Replay", flag: "🇬🇪", image: "https://photos.ebu.ch/media/image?src=thumbs/37819_400_h.jpg&1778482385", score: 0 },
  { id: "fi", name: "Finland", song: "Linda & Pete — Liekinheitin", flag: "🇫🇮", image: "https://photos.ebu.ch/media/image?src=thumbs/37824_400_h.jpg&1778482429", score: 0 },
  { id: "me", name: "Montenegro", song: "Tamara Živković — Nova zora", flag: "🇲🇪", image: "https://photos.ebu.ch/media/image?src=thumbs/37830_400_h.jpg&1778482452", score: 0 },
  { id: "ee", name: "Estonia", song: "Vanilla Ninja — Too Epic To Be True", flag: "🇪🇪", image: "https://photos.ebu.ch/media/image?src=thumbs/37832_400_h.jpg&1778482479", score: 0 },
  { id: "il", name: "Israel", song: "Noam Bettan — Michelle", flag: "🇮🇱", image: "https://static.wixstatic.com/media/02fefe_e8106b6f4ee64573994a8f5bdc860f26~mv2.png/v1/fill/w_1480,h_986,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/02fefe_e8106b6f4ee64573994a8f5bdc860f26~mv2.png", score: 0 },
  { id: "be", name: "Belgium", song: "Essyla — Dancing on the Ice", flag: "🇧🇪", image: "https://photos.ebu.ch/media/image?src=thumbs/37844_400_h.jpg&1778482558", score: 0 },
  { id: "lt", name: "Lithuania", song: "Lion Ceccah — Sólo quiero más", flag: "🇱🇹", image: "https://photos.ebu.ch/media/image?src=thumbs/37847_400_h.jpg&1778482586", score: 0 },
  { id: "sm", name: "San Marino", song: "Senhit ft. Boy George — Superstar", flag: "🇸🇲", image: "https://photos.ebu.ch/media/image?src=thumbs/37251_400_h.jpg&1778482607", score: 0 },
  { id: "pl", name: "Poland", song: "Alicja Szemplińska — Pray", flag: "🇵🇱", image: "https://photos.ebu.ch/media/image?src=thumbs/37701_400_h.jpg&1778482646", score: 0 },
  { id: "rs", name: "Serbia", song: "Lavina — Kraj mene", flag: "🇷🇸", image: "https://photos.ebu.ch/media/image?src=thumbs/37706_400_h.jpg&1778482671", score: 0 },
];

export default function EurovisionScoreboard() {
  const scoreboardRef = useRef(null);

  // Стейт для темной темы с сохранением выбора
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("esc-2026-theme");
    return savedTheme === "dark";
  });

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
    localStorage.setItem("esc-2026-theme", darkMode ? "dark" : "light");
  }, [countries, darkMode]);

  const toggleScore = (targetId, clickedPoints) => {
    setCountries((prev) =>
      prev.map((c) => {
        if (c.id === targetId) return { ...c, score: c.score === clickedPoints ? 0 : clickedPoints };
        if (c.score === clickedPoints) return { ...c, score: 0 };
        return c;
      })
    );
  };

  const resetScores = () => {
    if (window.confirm("Reset all votes?")) {
      setCountries(initialCountries);
      localStorage.removeItem("eurovision-scores-2026-v9");
    }
  };

  const downloadAsImage = async () => {
    if (!scoreboardRef.current) return;
    if (votesCount !== 10) return;

    setIsExporting(true);

    setTimeout(async () => {
      try {
        const canvas = await html2canvas(scoreboardRef.current, {
          scale: 2,
          backgroundColor: darkMode ? "#121212" : "#f3f4f6", // Цвет фона на картинке зависит от темы
          useCORS: true,
          allowTaint: false,
          windowWidth: 1024,
        });

        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "My_Eurovision_Top.png";
        link.click();
      } catch (e) {
        alert("Error saving image.");
      } finally {
        setIsExporting(false);
      }
    }, 300);
  };

  const sorted = [...countries].sort((a, b) => b.score - a.score);
  const votingStarted = countries.some((c) => c.score > 0);
  const votesCount = countries.filter((c) => c.score > 0).length;

  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen transition-colors duration-300`}>
      <div className="min-h-screen bg-[#f3f4f6] dark:bg-[#121212] text-gray-900 dark:text-white font-sans flex flex-col items-center overflow-x-hidden relative">
        
        {!isExporting && (
          <div className="w-full bg-white dark:bg-[#1e1e1e] border-b dark:border-gray-800 py-3 px-3 sm:px-6 flex justify-between md:justify-center items-center gap-2 sm:gap-3 sticky top-0 z-50 shadow-sm transition-colors">
            
            {/* Кнопка переключения темы */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-yellow-400 transition-all hover:scale-110"
              title="Toggle Theme"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            <div className="flex gap-2 sm:gap-3">
              {votingStarted ? (
                <>
                  <button
                    onClick={resetScores}
                    className="px-3 sm:px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-xs sm:text-sm font-bold border border-red-100 dark:border-red-900/30 transition-colors whitespace-nowrap"
                  >
                    Reset
                  </button>

                  <button
                    onClick={downloadAsImage}
                    disabled={votesCount !== 10}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                      votesCount === 10
                        ? "bg-[#002FA7] text-white shadow-md"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    Download Image
                  </button>
                </>
              ) : (
                <span className="text-gray-400 dark:text-gray-500 py-2 text-xs sm:text-sm font-bold italic text-center">
                  Select your top 10 to unlock controls
                </span>
              )}
            </div>
            
            {/* Пустой блок для баланса в мобильной версии при justify-between */}
            <div className="w-10 md:hidden"></div>
          </div>
        )}

        <div
          ref={scoreboardRef}
          className={`w-full max-w-5xl p-3 sm:p-4 md:p-8 flex flex-col transition-colors ${
            darkMode ? "bg-[#121212]" : "bg-[#f3f4f6]"
          } ${isExporting ? "w-[1024px] mx-auto" : ""}`}
        >
          <header className="mb-6 md:mb-8 text-center flex flex-col items-center">
            <img
              src={logoUrl}
              alt="Eurovision 2026"
              crossOrigin="anonymous"
              className="h-16 sm:h-20 md:h-28 mb-3 object-contain"
            />

            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-1 leading-normal">
              Semi-Final 1
            </h1>

            <p className="text-gray-500 dark:text-gray-400 text-sm italic font-medium mb-4 uppercase tracking-widest">
              12 MAY 2026, VIENNA
            </p>
          </header>

          <div className="flex flex-col gap-3 flex-grow">
            {sorted.map((c, i) => (
              <React.Fragment key={c.id}>
                {votingStarted && i === 10 && (
                  <div className="w-full py-4 flex items-center justify-center gap-4">
                    <div className="h-px bg-gray-300 dark:bg-gray-800 flex-1"></div>
                    <span className="text-gray-400 dark:text-gray-600 text-xs font-bold uppercase tracking-widest bg-transparent px-3 whitespace-nowrap">
                      Zero Points
                    </span>
                    <div className="h-px bg-gray-300 dark:bg-gray-800 flex-1"></div>
                  </div>
                )}

                <motion.div
                  layout
                  className={`bg-white dark:bg-[#1e1e1e] border-b dark:border-gray-800 p-2.5 sm:p-3 md:pl-5 md:pr-6 flex flex-col md:flex-row items-stretch md:items-center justify-between shadow-sm rounded-xl gap-3 transition-all ${
                    c.score > 0
                      ? "border-[#002FA7]/40 ring-1 ring-[#002FA7]/20"
                      : "border-gray-200 dark:border-gray-800"
                  }`}
                >
                  <div className="flex items-start sm:items-center md:items-center gap-2 sm:gap-4 md:gap-6 w-full md:w-auto">
                    <div className="w-5 sm:w-6 text-center text-base sm:text-lg md:text-xl font-bold text-gray-400 dark:text-gray-600 italic shrink-0">
                      {i + 1}
                    </div>

                    <div className={`${isExporting ? "text-4xl md:text-5xl" : "text-2xl sm:text-3xl md:text-4xl"} flex items-center justify-center shrink-0 leading-normal rounded-full bg-gray-50 dark:bg-gray-900 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 shadow-inner`}>
                      {c.flag}
                    </div>

                    {!isExporting && (
                      <img
                        src={c.image}
                        alt=""
                        className="w-14 h-9 sm:w-16 sm:h-10 md:w-24 md:h-14 rounded-md object-cover bg-gray-100 dark:bg-gray-800 shrink-0 shadow-sm"
                      />
                    )}

                    <div
                      className={`flex-1 ${
                        isExporting ? "w-64" : "min-w-0 md:w-56"
                      } ml-0 md:ml-4`}
                    >
                      <h2 className="text-base sm:text-lg md:text-xl font-black uppercase pb-1 leading-normal break-words dark:text-white">
                        {c.name}
                      </h2>

                      <p className="text-gray-500 dark:text-gray-400 text-[11px] sm:text-xs md:text-sm italic pb-1 leading-normal break-words">
                        {c.song}
                      </p>
                    </div>

                    <div className="md:hidden text-xl sm:text-2xl font-black text-[#002FA7] dark:text-blue-400 shrink-0">
                      {c.score > 0 ? c.score : "-"}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto">
                    {!isExporting ? (
                      <div className="grid grid-cols-5 gap-1 sm:gap-1.5 w-full md:w-auto">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((p) => {
                          const mine = c.score === p;
                          const taken = countries.some(
                            (other) => other.id !== c.id && other.score === p
                          );

                          return (
                            <button
                              key={p}
                              onClick={() => toggleScore(c.id, p)}
                              className={`h-10 md:h-9 w-full md:w-9 flex items-center justify-center rounded-lg text-xs font-black transition-all border ${
                                mine
                                  ? "bg-[#002FA7] text-white border-[#002FA7] shadow-md scale-105"
                                  : taken
                                  ? "bg-gray-50 dark:bg-gray-900/50 text-gray-200 dark:text-gray-800 border-gray-100 dark:border-gray-800"
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                              }`}
                            >
                              {p}
                            </button>
                          );
                        })}
                      </div>
                    ) : null}

                    <div
                      className={`hidden md:block w-16 text-right text-4xl font-black text-[#002FA7] dark:text-blue-400 ${
                        isExporting && "w-full text-right"
                      }`}
                    >
                      {c.score > 0 ? c.score : "-"}
                    </div>
                  </div>
                </motion.div>
              </React.Fragment>
            ))}
          </div>

          <footer className="mt-12 mb-4 text-center text-gray-400 dark:text-gray-600 text-[10px] font-bold uppercase tracking-widest">
            Scoreboard created by{" "}
            <a
              href="https://www.instagram.com/artkuztom/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#002FA7] dark:text-blue-400 hover:underline font-bold transition-colors"
            >
              Artyom Kuzmenko
            </a>
          </footer>
        </div>
      </div>
    </div>
  );
}
