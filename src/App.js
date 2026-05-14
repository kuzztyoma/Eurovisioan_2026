import "./styles.css"; // КРИТИЧЕСКИ ВАЖНО: Импорт должен быть здесь!
import { Analytics } from "@vercel/analytics/react";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";

const getProxyUrl = (url) => `https://images.weserv.nl/?url=${encodeURIComponent(url.replace(/^https?:\/\//, ''))}`;
const logoUrl = "https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/de/thumb/1/10/Eurovision_Song_Contest_2026_Logo.svg/1280px-Eurovision_Song_Contest_2026_Logo.svg.png";

const initialCountriesSF1 = [
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

const initialCountriesSF2 = [
  { id: "bg", name: "Bulgaria", song: "DARA — Bangaranga", flag: "https://www.eurovision.com/static/images/flags/flag_bg.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/bulgariajpg/Bulgaria-fill_size%3D2560x1600-focal_point%3D1288x394-focal_size%3D225x240-fill_size%3D2560x1600-focal_point%3D1288x394-focal_size%3D225x240.jpg", score: 0, note: "" },
  { id: "az", name: "Azerbaijan", song: "Jiva — Just Go", flag: "https://www.eurovision.com/static/images/flags/flag_az.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/alif4156-1jpg/ALIF4156%20%281%29-fill_size%3D2560x1600-focal_point%3D1298x447-focal_size%3D224x279-fill_size%3D2560x1600-focal_point%3D1298x447-focal_size%3D224x279.jpg", score: 0, note: "" },
  { id: "ro", name: "Romania", song: "Alexandra Căpitănescu — Choke Me", flag: "https://www.eurovision.com/static/images/flags/flag_ro.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/romaniajpg/Romania-fill_size%3D2560x1600-focal_point%3D1659x838-focal_size%3D348x296-fill_size%3D2560x1600-focal_point%3D1659x838-focal_size%3D348x296.jpg", score: 0, note: "" },
  { id: "lu", name: "Luxembourg", song: "Eva Marija — Mother Nature", flag: "https://www.eurovision.com/static/images/flags/flag_lu.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/luxembourgjpg/Luxembourg-fill_size%3D2560x1600-focal_point%3D1272x852-focal_size%3D445x445-fill_size%3D2560x1600-focal_point%3D1272x852-focal_size%3D445x445.jpg", score: 0, note: "" },
  { id: "cz", name: "Czechia", song: "Daniel Žižka — Crossroads", flag: "https://www.eurovision.com/static/images/flags/flag_cz.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/daniel-zizka_finals__img7135_dcg99uzjpg/Daniel%20Zizka_finals__IMG7135_dcG99Uz-fill_size%3D2560x1600-focal_point%3D765x673-focal_size%3D418x375-fill_size%3D2560x1600-focal_point%3D765x673-focal_size%3D418x375.jpg", score: 0, note: "" },
  { id: "am", name: "Armenia", song: "SIMÓN — Paloma Rumba", flag: "https://www.eurovision.com/static/images/flags/flag_am.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/armeniajpg/Armenia-fill_size%3D2560x1600-focal_point%3D1383x749-focal_size%3D427x405-fill_size%3D2560x1600-focal_point%3D1383x749-focal_size%3D427x405.jpg", score: 0, note: "" },
  { id: "ch", name: "Switzerland", song: "Veronica Fusaro — Alice", flag: "https://www.eurovision.com/static/images/flags/flag_ch.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/switzerland_edk0ddyjpg/Switzerland_eDk0DdY-fill_size%3D2560x1600-focal_point%3D1219x615-focal_size%3D436x403-fill_size%3D2560x1600-focal_point%3D1219x615-focal_size%3D436x403.jpg", score: 0, note: "" },
  { id: "cy", name: "Cyprus", song: "Antigoni — Jalla", flag: "https://www.eurovision.com/static/images/flags/flag_cy.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/cyprus_qo5gwlojpg/Cyprus_qO5gWlo-fill_size%3D2560x1600-focal_point%3D880x1054-focal_size%3D629x507-fill_size%3D2560x1600-focal_point%3D880x1054-focal_size%3D629x507.jpg", score: 0, note: "" },
  { id: "lv", name: "Latvia", song: "Atvara — Enā", flag: "https://www.eurovision.com/static/images/flags/flag_lv.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/latviajpeg/Latvia-fill_size%3D2560x1600-focal_point%3D1477x710-focal_size%3D392x459-fill_size%3D2560x1600-focal_point%3D1477x710-focal_size%3D392x459.jpeg", score: 0, note: "" },
  { id: "dk", name: "Denmark", song: "Søren Torpegaard Lund — Før vi går hjem", flag: "https://www.eurovision.com/static/images/flags/flag_dk.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/denmark_8rbh8gajpg/Denmark_8Rbh8gA-fill_size%3D2560x1600-focal_point%3D1283x368-focal_size%3D207x218-fill_size%3D2560x1600-focal_point%3D1283x368-focal_size%3D207x218.jpg", score: 0, note: "" },
  { id: "au", name: "Australia", song: "Delta Goodrem — Eclipse", flag: "https://www.eurovision.com/static/images/flags/flag_au.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/australiajpg/Australia-fill_size%3D2560x1600-focal_point%3D1268x831-focal_size%3D531x582-fill_size%3D2560x1600-focal_point%3D1268x831-focal_size%3D531x582.jpg", score: 0, note: "" },
  { id: "ua", name: "Ukraine", song: "Leléka — Ridnym", flag: "https://www.eurovision.com/static/images/flags/flag_ua.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/ukrainejpg/Ukraine-fill_size%3D2560x1600-focal_point%3D1138x849-focal_size%3D674x715-fill_size%3D2560x1600-focal_point%3D1138x849-focal_size%3D674x715.jpg", score: 0, note: "" },
  { id: "al", name: "Albania", song: "Alis — Nân", flag: "https://www.eurovision.com/static/images/flags/flag_al.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/img_6182jpeg/IMG_6182-fill_size%3D2560x1600-focal_point%3D917x593-focal_size%3D491x571-fill_size%3D2560x1600-focal_point%3D917x593-focal_size%3D491x571.jpeg", score: 0, note: "" },
  { id: "mt", name: "Malta", song: "Aidan — Bella", flag: "https://www.eurovision.com/static/images/flags/flag_mt.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/maltajpg/Malta-fill_size%3D2560x1600-focal_point%3D1189x630-focal_size%3D317x302-fill_size%3D2560x1600-focal_point%3D1189x630-focal_size%3D317x302.jpg", score: 0, note: "" },
  { id: "no", name: "Norway", song: "Jonas Lovv — Ya ya ya", flag: "https://www.eurovision.com/static/images/flags/flag_no.svg", image: "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/norway_u2zlerkjpg/Norway_U2ZlERK-fill_size%3D2560x1600-focal_point%3D1090x1038-focal_size%3D739x691-fill_size%3D2560x1600-focal_point%3D1090x1038-focal_size%3D739x691.jpg", score: 0, note: "" },
];

export default function EurovisionScoreboard() {
  const exportRef = useRef(null);
  const [activeSemi, setActiveSemi] = useState("SF2");
  
  const [countriesSF1, setCountriesSF1] = useState(() => {
    const saved = localStorage.getItem("eurovision-scores-2026-sf1-v2");
    return saved ? JSON.parse(saved) : initialCountriesSF1;
  });

  const [countriesSF2, setCountriesSF2] = useState(() => {
    const saved = localStorage.getItem("eurovision-scores-2026-sf2-v2");
    return saved ? JSON.parse(saved) : initialCountriesSF2;
  });

  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    localStorage.setItem("eurovision-scores-2026-sf1-v2", JSON.stringify(countriesSF1));
  }, [countriesSF1]);

  useEffect(() => {
    localStorage.setItem("eurovision-scores-2026-sf2-v2", JSON.stringify(countriesSF2));
  }, [countriesSF2]);

  const currentCountries = activeSemi === "SF1" ? countriesSF1 : countriesSF2;
  const setCurrentCountries = activeSemi === "SF1" ? setCountriesSF1 : setCountriesSF2;
  const semiTitle = activeSemi === "SF1" ? "Semi-Final 1" : "Semi-Final 2";
  const semiDate = activeSemi === "SF1" ? "12 MAY 2026, 21:00 CEST" : "14 MAY 2026, 21:00 CEST";

  const toggleScore = (targetId, clickedPoints) => {
    setCurrentCountries((prev) =>
      prev.map((c) => {
        if (c.id === targetId) return
