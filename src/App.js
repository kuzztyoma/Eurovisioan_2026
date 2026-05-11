import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";

// Прокси для стабильной загрузки всех внешних изображений
const getProxyUrl = (url) => `https://images.weserv.nl/?url=${encodeURIComponent(url.replace(/^https?:\/\//, ''))}`;
const logoUrl = "https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/de/thumb/1/10/Eurovision_Song_Contest_2026_Logo.svg/1280px-Eurovision_Song_Contest_2026_Logo.svg.png";

const initialCountries = [
  { id: "md", name: "Moldova", song: "Satoshi — Viva, Moldova", flag: "https://www.eurovision.com/static/images/flags/flag_md.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/moldovapng/Moldova-fill_size%3D2560x1600-focal_point%3D1167x399-focal_size%3D482x523-fill_size%3D2560x1600-focal_point%3D1167x399-focal_size%3D482x523.png", score: 0, note: "" },
  { id: "se", name: "Sweden", song: "Felicia — My System", flag: "https://www.eurovision.com/static/images/flags/flag_se.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/felicia_69ac8624368c5_26_lizzsa7jpg/felicia_69ac8624368c5_26_lIzZSa7-fill_size%3D2560x1600-focal_point%3D840x440-focal_size%3D460x535-fill_size%3D2560x1600-focal_point%3D840x440-focal_size%3D460x535.jpg", score: 0, note: "" },
  { id: "hr", name: "Croatia", song: "Lelek — Andromeda", flag: "https://www.eurovision.com/static/images/flags/flag_hr.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/lelek_-croatia_-photo-by-hrt-dario-njavro_-8png/lelek_%20croatia_%20photo%20by%20hrt%20%26%20dario%20njavro_%20%20%288%29-fill_size%3D2560x1600-focal_point%3D1256x584-focal_size%3D188x188-fill_size%3D2560x1600-focal_point%3D1256x584-focal_size%3D188x188.png", score: 0, note: "" },
  { id: "gr", name: "Greece", song: "Akylas — Ferto", flag: "https://www.eurovision.com/static/images/flags/flag_gr.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/greecejpg/Greece-fill_size%3D2560x1600-focal_point%3D1241x405-focal_size%3D310x253-fill_size%3D2560x1600-focal_point%3D1241x405-focal_size%3D310x253.jpg", score: 0, note: "" },
  { id: "pt", name: "Portugal", song: "Bandidos do Cante — Rosa", flag: "https://www.eurovision.com/static/images/flags/flag_pt.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/foto-bandidos-do-cantejpg/Foto%20Bandidos%20do%20Cante-fill_size%3D2560x1600-focal_point%3D1050x559-focal_size%3D333x310-fill_size%3D2560x1600-focal_point%3D1050x559-focal_size%3D333x310.jpg", score: 0, note: "" },
  { id: "ge", name: "Georgia", song: "Bzikebi — On Replay", flag: "https://www.eurovision.com/static/images/flags/flag_ge.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/georgiapng/Georgia-fill_size%3D2560x1600-focal_point%3D1281x262-focal_size%3D188x188-fill_size%3D2560x1600-focal_point%3D1281x262-focal_size%3D188x188.png", score: 0, note: "" },
  { id: "fi", name: "Finland", song: "Linda & Pete — Liekinheitin", flag: "https://www.eurovision.com/static/images/flags/flag_fi.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/linda_lampenius_x_pete_parkkonen_music_video_still_credit_nelli_kentta_lcyg46bjpg/Linda_Lampenius_x_Pete_Parkkonen_music_video_still_Credit_Nelli_kentta_LCYG46b-fill_size%3D2560x1600-focal_point%3D2546x913-focal_size%3D968x704-fill_size%3D2560x1600-focal_point%3D2546x913-focal_size%3D968x704.jpg", score: 0, note: "" },
  { id: "me", name: "Montenegro", song: "Tamara Živković — Nova zora", flag: "https://www.eurovision.com/static/images/flags/flag_me.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/montenegrojpg/Montenegro-fill_size%3D2560x1600-focal_point%3D1378x418-focal_size%3D308x368-fill_size%3D2560x1600-focal_point%3D1378x418-focal_size%3D308x368.jpg", score: 0, note: "" },
  { id: "ee", name: "Estonia", song: "Vanilla Ninja — Too Epic To Be True", flag: "https://www.eurovision.com/static/images/flags/flag_ee.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/estoniajpg/Estonia-fill_size%3D2560x1600-focal_point%3D1181x1630-focal_size%3D450x468-fill_size%3D2560x1600-focal_point%3D1181x1630-focal_size%3D450x468.jpg", score: 0, note: "" },
  { id: "il", name: "Israel", song: "Noam Bettan — Michelle", flag: "https://www.eurovision.com/static/images/flags/flag_il.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/israeljpg/Israel-fill_size%3D2560x1600-focal_point%3D1204x310-focal_size%3D259x267-fill_size%3D2560x1600-focal_point%3D1204x310-focal_size%3D259x267.jpg", score: 0, note: "" },
  { id: "be", name: "Belgium", song: "Essyla — Dancing on the Ice", flag: "https://www.eurovision.com/static/images/flags/flag_be.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/essyla-euro_l_rs_ekrztndjpg/ESSYLA%20EURO_L_RS_ekRZTnD-fill_size%3D2560x1600-focal_point%3D973x526-focal_size%3D423x369-fill_size%3D2560x1600-focal_point%3D973x526-focal_size%3D423x369.jpg", score: 0, note: "" },
  { id: "lt", name: "Lithuania", song: "Lion Ceccah — Sólo quiero más", flag: "https://www.eurovision.com/static/images/flags/flag_lt.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/lithuaniajpg/Lithuania-fill_size%3D2560x1600-focal_point%3D1306x690-focal_size%3D570x459-fill_size%3D2560x1600-focal_point%3D1306x690-focal_size%3D570x459.jpg", score: 0, note: "" },
  { id: "sm", name: "San Marino", song: "Senhit ft. Boy George — Superstar", flag: "https://www.eurovision.com/static/images/flags/flag_sm.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/san-marinojpg/San%20Marino-fill_size%3D2560x1600-focal_point%3D1335x451-focal_size%3D318x413-fill_size%3D2560x1600-focal_point%3D1335x451-focal_size%3D318x413.jpg", score: 0, note: "" },
  { id: "pl", name: "Poland", song: "Alicja Szemplińska — Pray", flag: "https://www.eurovision.com/static/images/flags/flag_pl.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/polandjpeg/Poland-fill_size%3D2560x1600-focal_point%3D1241x537-focal_size%3D422x416-fill_size%3D2560x1600-focal_point%3D1241x537-focal_size%3D422x416.jpeg", score: 0, note: "" },
  { id: "rs", name: "Serbia", song: "Lavina — Kraj mene", flag: "https://www.eurovision.com/static/images/flags/flag_rs.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/serbia-lavina-photo-5-by-natasa-stamatovicjpg/Serbia%2C%20Lavina%2C%20photo%205%20by%20Nata%C5%A1a%20Stamatovi%C4%87-fill_size%3D2560x1600-focal_point%3D1905x1014-focal_size%3D345x300-fill_size%3D2560x1600-focal_point%3D1905x1014-focal_size%3D345x300.jpg", score: 0, note: "" },
];

export default function EurovisionScoreboard() {
  const exportRef = useRef(null);
  const [countries, setCountries] = useState(() => {
    const saved = localStorage.getItem("eurovision-scores-2026-v24");
    return saved ? JSON.parse(saved) : initialCountries;
  });
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    localStorage.setItem("eurovision-scores-2026-v24", JSON.stringify(countries));
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
      localStorage.removeItem("eurovision-scores-2026-v24");
    }
  };

  const downloadAsImage = async () => {
    if (!exportRef.current || votesCount !== 10) return;
    setIsExporting(true);
    setTimeout(async () => {
      try {
        const canvas = await html2canvas(exportRef.current, {
          scale: 1.5, // Увеличил качество
          backgroundColor: "#f3f4f6",
          useCORS: true,
          width: 1080,
          height: 1920,
          logging: false
        });
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "My_Eurovision_Clean_Top.png";
        link.click();
      } catch (e) {
        alert("Error saving image.");
      } finally {
        setIsExporting(false);
      }
    }, 1500); 
  };

  const sorted = [...countries].sort((a, b) => b.score - a.score);
  const votingStarted = countries.some((c) => c.score > 0);
  const votesCount = countries.filter((c) => c.score > 0).length;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#6366f1]/15 via-slate-50 to-[#d8b4fe]/15 text-gray-900 font-sans flex flex-col items-center overflow-x-hidden relative text-center transition-all">
      
      {/* 1. ЭКСПОРТНЫЙ КОНТЕЙНЕР ( Stories: Чистые цвета, без прозрачности и теней ) */}
      <div style={{ position: 'absolute', left: '-5000px', top: 0 }}>
        <div ref={exportRef} className="w-[1080px] h-[1920px] bg-[#f3f4f6] pt-[200px] pb-[200px] px-14 flex flex-col items-center justify-between">
          <header className="text-center flex flex-col items-center w-full mb-12">
            <img src={logoUrl} crossOrigin="anonymous" className="h-32 mb-8 object-contain" alt="" />
            <h1 className="text-8xl font-black text-gray-900 mb-2 tracking-tighter italic uppercase leading-none">Semi-Final 1</h1>
            <p className="text-gray-400 text-2xl font-bold tracking-[0.4em] uppercase opacity-60 mb-10">12 MAY 2026 // VIENNA</p>
            <div className="text-[#002FA7] text-7xl font-black uppercase tracking-[0.1em] italic">My Top 10</div>
          </header>

          <div className="flex flex-col gap-4 w-full px-2 flex-grow justify-start">
            {sorted.slice(0, 10).map((c, i) => (
              <div key={c.id} className="bg-white h-[105px] px-8 flex items-center justify-between rounded-[40px] border border-gray-200">
                <div className="flex items-center gap-8 h-full leading-none">
                  <span className="text-3xl font-black text-gray-200 italic w-10 flex items-center justify-center">{i + 1}</span>
                  <div className="w-[100px] flex items-center justify-center">
                    <img src={getProxyUrl(c.flag)} crossOrigin="anonymous" className="w-20 h-14 object-contain" alt="" />
                  </div>
                  <img src={getProxyUrl(c.image)} crossOrigin="anonymous" alt="" className="w-28 h-16 rounded-xl object-cover border border-gray-100" />
                  <div className="ml-1 text-left flex flex-col justify-center h-full">
                    <h2 className="text-[34px] font-black uppercase tracking-tighter leading-none mb-1 text-gray-900">{c.name}</h2>
                    <p className="text-gray-400 text-lg italic font-medium leading-none">{c.song}</p>
                  </div>
                </div>
                <div className="text-6xl font-black text-[#002FA7] tracking-tighter leading-none">{c.score}</div>
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
              <button onClick={downloadAsImage} disabled={votesCount !== 10} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${votesCount === 10 ? "bg-[#002FA7] text-white shadow-lg shadow-blue-200 scale-105" : "bg-gray-200/50 text-gray-400 cursor-not-allowed"}`}>Download Story Image</button>
            </>
          ) : (
            <span className="text-gray-500 py-2 text-sm font-bold italic tracking-wide">Select your top 10 countries</span>
          )}
        </div>
      )}

      {/* 3. ОСНОВНОЙ СПИСОК UI */}
      <div className="w-full max-w-6xl p-4 md:p-8 flex flex-col relative z-10">
        <header className="mb-12 text-center flex flex-col items-center">
          <img src={logoUrl} crossOrigin="anonymous" className="h-20 md:h-28 mb-4 object-contain" alt="Logo" />
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-1 tracking-tighter italic uppercase font-sans">Semi-Final 1</h1>
          <p className="text-gray-500 text-sm font-bold tracking-widest uppercase opacity-60">12 MAY 2026, VIENNA</p>
        </header>

        <div className="flex flex-col gap-5 w-full">
          {sorted.map((c, i) => (
            <React.Fragment key={c.id}>
              {votingStarted && i === 10 && (
                <div className="w-full py-12 flex items-center gap-6 px-4">
                  <div className="flex-1 h-px bg-gray-300/50"></div>
                  <span className="text-gray-400 text-xs font-black uppercase tracking-[0.4em]">Zero Points</span>
                  <div className="flex-1 h-px bg-gray-300/50"></div>
                </div>
              )}
              <motion.div layout className={`group bg-white/50 backdrop-blur-3xl border p-4 md:p-5 md:h-32 flex flex-col md:flex-row items-center md:justify-between shadow-2xl rounded-[38px] gap-5 md:flex-nowrap ${c.score > 0 ? "border-[#002FA7]/30 ring-8 ring-[#002FA7]/5" : "border-white/80"}`}>
                
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 flex-1 w-full md:w-auto h-full">
                  <div className="flex items-center gap-4 shrink-0 md:w-32">
                    <div className="w-8 text-center text-xl font-bold text-gray-300 italic">{i + 1}</div>
                    <div className="text-4xl flex items-center justify-center bg-white/70 w-16 h-16 md:w-14 md:h-14 rounded-full shadow-inner border border-white/50 overflow-hidden">
                      <img src={c.flag} className="w-12 h-12 object-contain drop-shadow-sm" alt="" />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 flex-1 w-full md:w-auto min-w-0 h-full">
                    <img src={c.image} alt="" className="w-32 md:w-28 h-20 md:h-16 rounded-2xl object-cover bg-gray-100 shadow-md border-2 border-white/50 shrink-0" />
                    <div className="flex flex-col text-center md:text-left flex-1 min-w-0 w-full justify-center">
                      <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-tight mb-1 truncate">{c.name}</h2>
                      <p className="text-gray-600 text-sm md:text-base italic font-medium leading-tight mb-3 md:mb-1 truncate opacity-80">{c.song}</p>
                      <textarea value={c.note || ""} onChange={(e) => updateNote(c.id, e.target.value)} placeholder="Add note..." className="w-full mt-1 p-3 text-xs bg-white/60 border border-slate-200 rounded-2xl text-gray-800 focus:bg-white/90 outline-none resize-none placeholder:text-gray-500 shadow-inner h-9 transition-colors" rows="1" />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 shrink-0 w-full md:w-auto">
                  <div className="grid grid-cols-5 gap-1.5 w-full max-w-xs md:w-auto">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((p) => {
                      const mine = c.score === p;
                      const taken = countries.some((other) => other.id !== c.id && other.score === p);
                      return (
                        <button key={p} onClick={() => toggleScore(c.id, p)} className={`h-10 w-full md:w-10 flex items-center justify-center rounded-xl text-xs font-black transition-all border ${mine ? "bg-[#002FA7] text-white border-transparent scale-110 shadow-lg shadow-blue-200" : taken ? "bg-gray-100/40 text-gray-300 border-gray-100/50 cursor-not-allowed" : "bg-white/80 text-gray-700 border-slate-200 hover:bg-white hover:border-[#002FA7]/30"}`}>{p}</button>
                      );
                    })}
                  </div>
                  <div className="w-16 text-center md:text-right text-4xl md:text-5xl font-black text-[#002FA7] drop-shadow-sm shrink-0">{c.score > 0 ? c.score : "-"}</div>
                </div>
              </motion.div>
            </React.Fragment>
          ))}
        </div>

        <footer className="mt-20 mb-8 text-center text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] opacity-50 relative z-20 font-sans">
          Scoreboard created by <a href="https://www.instagram.com/artkuztom/" target="_blank" rel="noopener noreferrer" className="text-[#002FA7] hover:underline font-bold transition-colors">Artyom Kuzmenko</a>
        </footer>
      </div>
    </div>
  );
}
