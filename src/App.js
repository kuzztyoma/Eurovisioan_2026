import { Analytics } from "@vercel/analytics/react";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";

const getProxyUrl = (url) =>
  `https://images.weserv.nl/?url=${encodeURIComponent(
    url.replace(/^https?:\/\//, "")
  )}`;

const logoUrl =
  "https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/de/thumb/1/10/Eurovision_Song_Contest_2026_Logo.svg/1280px-Eurovision_Song_Contest_2026_Logo.svg.png";

const initialCountriesFinal = [
  { id: "at", name: "Austria", song: "Cosmó — Tanzschein", flag: "https://www.eurovision.com/static/images/flags/flag_at.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/260509_corinne-cumming_ebu00018_croppedpng/260509_Corinne%20Cumming_EBU00018_cropped-fill_size%3D2560x1600.png", score: 0, note: "" },
  { id: "de", name: "Germany", song: "Sarah Engels — Fire", flag: "https://www.eurovision.com/static/images/flags/flag_de.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/germanyjpg/Germany-fill_size%3D2560x1600-focal_point%3D1276x1003-focal_size%3D488x428.jpg", score: 0, note: "" },
  { id: "gb", name: "United Kingdom", song: "Look Mum No Computer — Eins, Zwei, Drei", flag: "https://www.eurovision.com/static/images/flags/flag_gb.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/260509_corinne-cumming_ebu00021jpg/260509_Corinne%20Cumming_EBU00021-fill_size%3D2560x1600.jpg", score: 0, note: "" },
  { id: "fr", name: "France", song: "Monroe — Regarde!", flag: "https://www.eurovision.com/static/images/flags/flag_fr.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/monroe26jpg/Monroe26-fill_size%3D2560x1600-focal_point%3D1030x757-focal_size%3D402x426.jpg", score: 0, note: "" },
  { id: "it", name: "Italy", song: "Sal Da Vinci — Per sempre sì", flag: "https://www.eurovision.com/static/images/flags/flag_it.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/italyjpg/Italy-fill_size%3D2560x1600-focal_point%3D1410x1119-focal_size%3D732x755.jpg", score: 0, note: "" },
  { id: "md", name: "Moldova", song: "Satoshi — Viva, Moldova", flag: "https://www.eurovision.com/static/images/flags/flag_md.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/moldovapng/Moldova-fill_size%3D2560x1600.png", score: 0, note: "" },
  { id: "se", name: "Sweden", song: "Felicia — My System", flag: "https://www.eurovision.com/static/images/flags/flag_se.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/felicia_69ac8624368c5_26_lizzsa7jpg/felicia_69ac8624368c5_26_lIzZSa7-fill_size%3D2560x1600.jpg", score: 0, note: "" },
  { id: "hr", name: "Croatia", song: "Lelek — Andromeda", flag: "https://www.eurovision.com/static/images/flags/flag_hr.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/lelek_-croatia_-photo-by-hrt-dario-njavro_-8png/lelek_%20croatia_%20photo%20by%20hrt%20%26%20dario%20njavro_%20%20%288%29-fill_size%3D2560x1600.png", score: 0, note: "" },
  { id: "gr", name: "Greece", song: "Akylas — Ferto", flag: "https://www.eurovision.com/static/images/flags/flag_gr.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/greecejpg/Greece-fill_size%3D2560x1600.jpg", score: 0, note: "" },
  { id: "pt", name: "Portugal", song: "Bandidos do Cante — Rosa", flag: "https://www.eurovision.com/static/images/flags/flag_pt.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/foto-bandidos-do-cantejpg/Foto%20Bandidos%20do%20Cante-fill_size%3D2560x1600.jpg", score: 0, note: "" },
  { id: "ge", name: "Georgia", song: "Bzikebi — On Replay", flag: "https://www.eurovision.com/static/images/flags/flag_ge.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/georgiapng/Georgia-fill_size%3D2560x1600.png", score: 0, note: "" },
  { id: "fi", name: "Finland", song: "Linda & Pete — Liekinheitin", flag: "https://www.eurovision.com/static/images/flags/flag_fi.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/linda_lampenius_x_pete_parkkonen_music_video_still_credit_nelli_kentta_lcyg46bjpg/Linda_Lampenius_x_Pete_Parkkonen_music_video_still_Credit_Nelli_kentta_LCYG46b-fill_size%3D2560x1600.jpg", score: 0, note: "" },
  { id: "me", name: "Montenegro", song: "Tamara Živković — Nova zora", flag: "https://www.eurovision.com/static/images/flags/flag_me.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/montenegrojpg/Montenegro-fill_size%3D2560x1600.jpg", score: 0, note: "" },
  { id: "ee", name: "Estonia", song: "Vanilla Ninja — Too Epic To Be True", flag: "https://www.eurovision.com/static/images/flags/flag_ee.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/estoniajpg/Estonia-fill_size%3D2560x1600.jpg", score: 0, note: "" },
  { id: "il", name: "Israel", song: "Noam Bettan — Michelle", flag: "https://www.eurovision.com/static/images/flags/flag_il.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/israeljpg/Israel-fill_size%3D2560x1600.jpg", score: 0, note: "" },
  { id: "bg", name: "Bulgaria", song: "DARA — Bangaranga", flag: "https://www.eurovision.com/static/images/flags/flag_bg.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/bulgariajpg/Bulgaria-fill_size%3D2560x1600.jpg", score: 0, note: "" },
  { id: "az", name: "Azerbaijan", song: "Jiva — Just Go", flag: "https://www.eurovision.com/static/images/flags/flag_az.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/alif4156-1jpg/ALIF4156%20%281%29-fill_size%3D2560x1600.jpg", score: 0, note: "" },
  { id: "ro", name: "Romania", song: "Alexandra Căpitănescu — Choke Me", flag: "https://www.eurovision.com/static/images/flags/flag_ro.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/romaniajpg/Romania-fill_size%3D2560x1600.jpg", score: 0, note: "" },
  { id: "lu", name: "Luxembourg", song: "Eva Marija — Mother Nature", flag: "https://www.eurovision.com/static/images/flags/flag_lu.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/luxembourgjpg/Luxembourg-fill_size%3D2560x1600.jpg", score: 0, note: "" },
  { id: "cz", name: "Czechia", song: "Daniel Žižka — Crossroads", flag: "https://www.eurovision.com/static/images/flags/flag_cz.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/daniel-zizka_finals__img7135_dcg99uzjpg/Daniel%20Zizka_finals__IMG7135_dcG99Uz-fill_size%3D2560x1600.jpg", score: 0, note: "" },
  { id: "am", name: "Armenia", song: "SIMÓN — Paloma Rumba", flag: "https://www.eurovision.com/static/images/flags/flag_am.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/armeniajpg/Armenia-fill_size%3D2560x1600.jpg", score: 0, note: "" },
  { id: "ch", name: "Switzerland", song: "Veronica Fusaro — Alice", flag: "https://www.eurovision.com/static/images/flags/flag_ch.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/switzerland_edk0ddyjpg/Switzerland_eDk0DdY-fill_size%3D2560x1600.jpg", score: 0, note: "" },
  { id: "cy", name: "Cyprus", song: "Antigoni — Jalla", flag: "https://www.eurovision.com/static/images/flags/flag_cy.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/cyprus_qo5gwlojpg/Cyprus_qO5gWlo-fill_size%3D2560x1600.jpg", score: 0, note: "" },
  { id: "lv", name: "Latvia", song: "Atvara — Enā", flag: "https://www.eurovision.com/static/images/flags/flag_lv.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/latviajpeg/Latvia-fill_size%3D2560x1600.jpeg", score: 0, note: "" },
  { id: "dk", name: "Denmark", song: "Søren Torpegaard Lund — Før vi går hjem", flag: "https://www.eurovision.com/static/images/flags/flag_dk.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/denmark_8rbh8gajpg/Denmark_8Rbh8gA-fill_size%3D2560x1600.jpg", score: 0, note: "" },
];

const points = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12];

export default function EurovisionScoreboard() {
  const exportRef = useRef(null);
  const [activeSemi, setActiveSemi] = useState("Final");
  const [isExporting, setIsExporting] = useState(false);

  // Состояния для всех трех этапов
  const [countriesFinal, setCountriesFinal] = useState(() => {
    const saved = localStorage.getItem("esc-2026-final-v4");
    return saved ? JSON.parse(saved) : initialCountriesFinal;
  });

  const [countriesSF1, setCountriesSF1] = useState(() => {
    const saved = localStorage.getItem("esc-2026-sf1-v4");
    return saved ? JSON.parse(saved) : []; // Здесь были бы начальные данные SF1
  });

  const [countriesSF2, setCountriesSF2] = useState(() => {
    const saved = localStorage.getItem("esc-2026-sf2-v4");
    return saved ? JSON.parse(saved) : []; // Здесь были бы начальные данные SF2
  });

  useEffect(() => { localStorage.setItem("esc-2026-final-v4", JSON.stringify(countriesFinal)); }, [countriesFinal]);

  const currentCountries = activeSemi === "Final" ? countriesFinal : (activeSemi === "SF1" ? countriesSF1 : countriesSF2);
  const setCurrentCountries = activeSemi === "Final" ? setCountriesFinal : (activeSemi === "SF1" ? setCountriesSF1 : setCountriesSF2);

  const semiTitle = activeSemi === "Final" ? "Grand Final" : (activeSemi === "SF1" ? "Semi-Final 1" : "Semi-Final 2");
  const semiDate = activeSemi === "Final" ? "16 MAY 2026, 21:00 CEST" : (activeSemi === "SF1" ? "12 MAY 2026" : "14 MAY 2026");

  const sorted = [...currentCountries].sort((a, b) => b.score - a.score);
  const votingStarted = currentCountries.some((c) => c.score > 0);
  const votesCount = currentCountries.filter((c) => c.score > 0).length;

  const toggleScore = (targetId, clickedPoints) => {
    setCurrentCountries((prev) => prev.map((c) => {
      if (c.id === targetId) return { ...c, score: c.score === clickedPoints ? 0 : clickedPoints };
      if (c.score === clickedPoints) return { ...c, score: 0 };
      return c;
    }));
  };

  const updateNote = (id, text) => { setCurrentCountries((prev) => prev.map((c) => (c.id === id ? { ...c, note: text } : c))); };

  const downloadAsImage = async () => {
    if (!exportRef.current || votesCount !== 10) return;
    setIsExporting(true);
    setTimeout(async () => {
      try {
        const canvas = await html2canvas(exportRef.current, { scale: 1.5, backgroundColor: "#f3f4f6", useCORS: true, width: 1080, height: 1920 });
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `ESC_2026_${activeSemi}_Top.png`;
        link.click();
      } catch (e) { alert("Error saving image."); } finally { setIsExporting(false); }
    }, 800);
  };

  return (
    <div className="app-shell">
      {/* ЭКСПОРТ (СКРЫТЫЙ) */}
      <div className="export-hidden">
        <div ref={exportRef} className="story-export">
          <header className="story-header">
            <img src={logoUrl} crossOrigin="anonymous" alt="" />
            <h1>{semiTitle}</h1>
            <p>{semiDate}</p>
            <div>My Top 10</div>
          </header>
          <div className="story-list">
            {sorted.slice(0, 10).map((c, i) => (
              <div key={c.id} className="story-card">
                <div className="story-left">
                  <span>{i + 1}</span>
                  <img src={getProxyUrl(c.flag)} crossOrigin="anonymous" className="story-flag" alt="" />
                  <img src={getProxyUrl(c.image)} crossOrigin="anonymous" className="story-photo" alt="" />
                  <div>
                    <h2>{c.name}</h2>
                    <p>{c.song}</p>
                  </div>
                </div>
                <strong>{c.score}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ТАБЫ И КНОПКИ */}
      {!isExporting && (
        <div className="topbar">
          <div className="tabs">
            <button onClick={() => setActiveSemi("Final")} className={activeSemi === "Final" ? "active" : ""}>Final</button>
            <button onClick={() => setActiveSemi("SF1")} className={activeSemi === "SF1" ? "active" : ""}>SF 1</button>
            <button onClick={() => setActiveSemi("SF2")} className={activeSemi === "SF2" ? "active" : ""}>SF 2</button>
          </div>
          <div className="controls">
            {votingStarted ? (
              <button className={`download-button ${votesCount === 10 ? "ready" : ""}`} onClick={downloadAsImage} disabled={votesCount !== 10}>
                {votesCount === 10 ? "Download Story Image" : `Rank ${10 - votesCount} more`}
              </button>
            ) : <span>Rank your Top 10 for {semiTitle}</span>}
          </div>
        </div>
      )}

      {/* ОСНОВНОЙ СПИСОК */}
      <main className="page">
        <header className="hero">
          <img src={logoUrl} crossOrigin="anonymous" alt="Eurovision 2026" />
          <h1>{semiTitle}</h1>
          <p>{semiDate}</p>
        </header>

        <section className="scoreboard-list">
          {sorted.map((c, i) => (
            <React.Fragment key={c.id}>
              {votingStarted && i === 10 && (
                <div className="zero-divider"><span></span><strong>Zero Points</strong><span></span></div>
              )}
              <motion.article layout className={`country-card ${c.score > 0 ? "selected" : ""}`}>
                <div className="country-main">
                  <div className="rank-flag">
                    <div className="rank">{i + 1}</div>
                    <div className="flag-bubble"><img src={c.flag} alt="" /></div>
                  </div>
                  <div className="artist-block">
                    <img className="artist-image" src={c.image} alt="" />
                    <div className="artist-text">
                      <h2>{c.name}</h2>
                      <p>{c.song}</p>
                      <textarea value={c.note || ""} onChange={(e) => updateNote(c.id, e.target.value)} placeholder="Add note..." rows="1" />
                    </div>
                  </div>
                </div>
                <div className="vote-block">
                  <div className="point-grid">
                    {points.map((p) => {
                      const mine = c.score === p;
                      const taken = currentCountries.some((other) => other.id !== c.id && other.score === p);
                      return (
                        <button key={p} onClick={() => toggleScore(c.id, p)} className={`${mine ? "mine" : ""} ${taken ? "taken" : ""}`}>{p}</button>
                      );
                    })}
                  </div>
                  <div className="score-value">{c.score > 0 ? c.score : "-"}</div>
                </div>
              </motion.article>
            </React.Fragment>
          ))}
        </section>

        <footer className="footer">
          Created by <a href="https://www.instagram.com/artkuztom/" target="_blank" rel="noopener noreferrer">Artyom Kuzmenko</a>
        </footer>
      </main>
      <Analytics />
    </div>
  );
}
