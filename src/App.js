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

const finalLogoUrl = getProxyUrl(
  "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/frame-2147206933png/Frame%202147206933-width%3D600.png"
);

const bingoHeartUrl = getProxyUrl(
  "https://www.eurovision.com/static/images/70-heart@2x.0fe89b9ce3a9.webp"
);

const flagUrl = (code) =>
  `https://www.eurovision.com/static/images/flags/flag_${code}.svg`;

const makeCountry = (id, name, song, flagCode, image) => ({
  id,
  name,
  song,
  flag: flagUrl(flagCode),
  image,
  score: 0,
  note: "",
});

const bingoSquares = [
  { id: "thank-you", text: "Thank you, Europe!" },
  { id: "barefoot", text: "Barefoot artist" },
  { id: "wind-machine", text: "Wind machine goes feral" },
  { id: "big-five", text: "Big 5 shock top 3" },
  { id: "boos", text: "Audience boos someone" },
  { id: "political-comment", text: "Political comment" },
  { id: "apolitical", text: "“This contest is apolitical”" },
  { id: "host-banter", text: "Awkward host banter" },
  { id: "fire", text: "Fire bursts for no reason" },
  { id: "asia-ad", text: "Eurovision Asia ad" },
  { id: "postcard", text: "Cringey country postcard" },
  { id: "instrument", text: "“Playing” an instrument" },
  { id: "free", text: "FREE SPACE", free: true },
  { id: "opera", text: "Opera moment" },
  { id: "uk-zero", text: "UK gets 0 points" },
  { id: "lift", text: "Dancers lift the singer" },
  { id: "rap", text: "Unnecessary rap verse" },
  { id: "costume", text: "Costume reveal mid-song" },
  { id: "off-key", text: "Someone sings off-key live" },
  { id: "languages", text: "Host speaks 3 languages" },
  { id: "green-room", text: "Green room group hug" },
  { id: "good-evening", text: "Spokesperson says “Good evening!”" },
  { id: "shirtless", text: "Shirtless man" },
  { id: "televote", text: "Televote kills a jury darling" },
  { id: "native-robbed", text: "Native language entry gets robbed" },
];

const bingoLines = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

const createInitialBingoMarks = () => ({ free: true });

const hasBingoLine = (marks) =>
  bingoLines.some((line) =>
    line.every((index) => marks[bingoSquares[index].id])
  );

const initialCountriesSF1 = [
  makeCountry(
    "md",
    "Moldova",
    "Satoshi — Viva, Moldova",
    "md",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/moldovapng/Moldova-fill_size%3D2560x1600-focal_point%3D1167x399-focal_size%3D482x523-fill_size%3D2560x1600-focal_point%3D1167x399-focal_size%3D482x523.png"
  ),
  makeCountry(
    "se",
    "Sweden",
    "Felicia — My System",
    "se",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/felicia_69ac8624368c5_26_lizzsa7jpg/felicia_69ac8624368c5_26_lIzZSa7-fill_size%3D2560x1600-focal_point%3D840x440-focal_size%3D460x535-fill_size%3D2560x1600-focal_point%3D840x440-focal_size%3D460x535.jpg"
  ),
  makeCountry(
    "hr",
    "Croatia",
    "Lelek — Andromeda",
    "hr",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/lelek_-croatia_-photo-by-hrt-dario-njavro_-8png/lelek_%20croatia_%20photo%20by%20hrt%20%26%20dario%20njavro_%20%20%288%29-fill_size%3D2560x1600-focal_point%3D1256x584-focal_size%3D188x188-fill_size%3D2560x1600-focal_point%3D1256x584-focal_size%3D188x188.png"
  ),
  makeCountry(
    "gr",
    "Greece",
    "Akylas — Ferto",
    "gr",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/greecejpg/Greece-fill_size%3D2560x1600-focal_point%3D1241x405-focal_size%3D310x253-fill_size%3D2560x1600-focal_point%3D1241x405-focal_size%3D310x253.jpg"
  ),
  makeCountry(
    "pt",
    "Portugal",
    "Bandidos do Cante — Rosa",
    "pt",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/foto-bandidos-do-cantejpg/Foto%20Bandidos%20do%20Cante-fill_size%3D2560x1600-focal_point%3D1050x559-focal_size%3D333x310-fill_size%3D2560x1600-focal_point%3D1050x559-focal_size%3D333x310.jpg"
  ),
  makeCountry(
    "ge",
    "Georgia",
    "Bzikebi — On Replay",
    "ge",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/georgiapng/Georgia-fill_size%3D2560x1600-focal_point%3D1281x262-focal_size%3D188x188-fill_size%3D2560x1600-focal_point%3D1281x262-focal_size%3D188x188.png"
  ),
  makeCountry(
    "fi",
    "Finland",
    "Linda & Pete — Liekinheitin",
    "fi",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/linda_lampenius_x_pete_parkkonen_music_video_still_credit_nelli_kentta_lcyg46bjpg/Linda_Lampenius_x_Pete_Parkkonen_music_video_still_Credit_Nelli_kentta_LCYG46b-fill_size%3D2560x1600-focal_point%3D2546x913-focal_size%3D968x704-fill_size%3D2560x1600-focal_point%3D2546x913-focal_size%3D968x704.jpg"
  ),
  makeCountry(
    "me",
    "Montenegro",
    "Tamara Živković — Nova zora",
    "me",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/montenegrojpg/Montenegro-fill_size%3D2560x1600-focal_point%3D1378x418-focal_size%3D308x368-fill_size%3D2560x1600-focal_point%3D1378x418-focal_size%3D308x368.jpg"
  ),
  makeCountry(
    "ee",
    "Estonia",
    "Vanilla Ninja — Too Epic To Be True",
    "ee",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/estoniajpg/Estonia-fill_size%3D2560x1600-focal_point%3D1181x1630-focal_size%3D450x468-fill_size%3D2560x1600-focal_point%3D1181x1630-focal_size%3D450x468.jpg"
  ),
  makeCountry(
    "il",
    "Israel",
    "Noam Bettan — Michelle",
    "il",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/israeljpg/Israel-fill_size%3D2560x1600-focal_point%3D1204x310-focal_size%3D259x267-fill_size%3D2560x1600-focal_point%3D1204x310-focal_size%3D259x267.jpg"
  ),
  makeCountry(
    "be",
    "Belgium",
    "Essyla — Dancing on the Ice",
    "be",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/essyla-euro_l_rs_ekrztndjpg/ESSYLA%20EURO_L_RS_ekRZTnD-fill_size%3D2560x1600-focal_point%3D973x526-focal_size%3D423x369-fill_size%3D2560x1600-focal_point%3D973x526-focal_size%3D423x369.jpg"
  ),
  makeCountry(
    "lt",
    "Lithuania",
    "Lion Ceccah — Sólo quiero más",
    "lt",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/lithuaniajpg/Lithuania-fill_size%3D2560x1600-focal_point%3D1306x690-focal_size%3D570x459-fill_size%3D2560x1600-focal_point%3D1306x690-focal_size%3D570x459.jpg"
  ),
  makeCountry(
    "sm",
    "San Marino",
    "Senhit ft. Boy George — Superstar",
    "sm",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/san-marinojpg/San%20Marino-fill_size%3D2560x1600-focal_point%3D1335x451-focal_size%3D318x413-fill_size%3D2560x1600-focal_point%3D1335x451-focal_size%3D318x413.jpg"
  ),
  makeCountry(
    "pl",
    "Poland",
    "Alicja Szemplińska — Pray",
    "pl",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/polandjpeg/Poland-fill_size%3D2560x1600-focal_point%3D1241x537-focal_size%3D422x416-fill_size%3D2560x1600-focal_point%3D1241x537-focal_size%3D422x416.jpeg"
  ),
  makeCountry(
    "rs",
    "Serbia",
    "Lavina — Kraj mene",
    "rs",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/serbia-lavina-photo-5-by-natasa-stamatovicjpg/Serbia%2C%20Lavina%2C%20photo%205%20by%20Nata%C5%A1a%20Stamatovi%C4%87-fill_size%3D2560x1600-focal_point%3D1905x1014-focal_size%3D345x300-fill_size%3D2560x1600-focal_point%3D1905x1014-focal_size%3D345x300.jpg"
  ),
];

const initialCountriesSF2 = [
  makeCountry(
    "bg",
    "Bulgaria",
    "DARA — Bangaranga",
    "bg",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/bulgariajpg/Bulgaria-fill_size%3D2560x1600-focal_point%3D1288x394-focal_size%3D225x240-fill_size%3D2560x1600-focal_point%3D1288x394-focal_size%3D225x240.jpg"
  ),
  makeCountry(
    "az",
    "Azerbaijan",
    "Jiva — Just Go",
    "az",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/alif4156-1jpg/ALIF4156%20%281%29-fill_size%3D2560x1600-focal_point%3D1298x447-focal_size%3D224x279-fill_size%3D2560x1600-focal_point%3D1298x447-focal_size%3D224x279.jpg"
  ),
  makeCountry(
    "ro",
    "Romania",
    "Alexandra Căpitănescu — Choke Me",
    "ro",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/romaniajpg/Romania-fill_size%3D2560x1600-focal_point%3D1659x838-focal_size%3D348x296-fill_size%3D2560x1600-focal_point%3D1659x838-focal_size%3D348x296.jpg"
  ),
  makeCountry(
    "lu",
    "Luxembourg",
    "Eva Marija — Mother Nature",
    "lu",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/luxembourgjpg/Luxembourg-fill_size%3D2560x1600-focal_point%3D1272x852-focal_size%3D445x445-fill_size%3D2560x1600-focal_point%3D1272x852-focal_size%3D445x445.jpg"
  ),
  makeCountry(
    "cz",
    "Czechia",
    "Daniel Žižka — Crossroads",
    "cz",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/daniel-zizka_finals__img7135_dcg99uzjpg/Daniel%20Zizka_finals__IMG7135_dcG99Uz-fill_size%3D2560x1600-focal_point%3D765x673-focal_size%3D418x375-fill_size%3D2560x1600-focal_point%3D765x673-focal_size%3D418x375.jpg"
  ),
  makeCountry(
    "am",
    "Armenia",
    "SIMÓN — Paloma Rumba",
    "am",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/armeniajpg/Armenia-fill_size%3D2560x1600-focal_point%3D1383x749-focal_size%3D427x405-fill_size%3D2560x1600-focal_point%3D1383x749-focal_size%3D427x405.jpg"
  ),
  makeCountry(
    "ch",
    "Switzerland",
    "Veronica Fusaro — Alice",
    "ch",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/switzerland_edk0ddyjpg/Switzerland_eDk0DdY-fill_size%3D2560x1600-focal_point%3D1219x615-focal_size%3D436x403-fill_size%3D2560x1600-focal_point%3D1219x615-focal_size%3D436x403.jpg"
  ),
  makeCountry(
    "cy",
    "Cyprus",
    "Antigoni — Jalla",
    "cy",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/cyprus_qo5gwlojpg/Cyprus_qO5gWlo-fill_size%3D2560x1600-focal_point%3D880x1054-focal_size%3D629x507-fill_size%3D2560x1600-focal_point%3D880x1054-focal_size%3D629x507.jpg"
  ),
  makeCountry(
    "lv",
    "Latvia",
    "Atvara — Enā",
    "lv",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/latviajpeg/Latvia-fill_size%3D2560x1600-focal_point%3D1477x710-focal_size%3D392x459-fill_size%3D2560x1600-focal_point%3D1477x710-focal_size%3D392x459.jpeg"
  ),
  makeCountry(
    "dk",
    "Denmark",
    "Søren Torpegaard Lund — Før vi går hjem",
    "dk",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/denmark_8rbh8gajpg/Denmark_8Rbh8gA-fill_size%3D2560x1600-focal_point%3D1283x368-focal_size%3D207x218-fill_size%3D2560x1600-focal_point%3D1283x368-focal_size%3D207x218.jpg"
  ),
  makeCountry(
    "au",
    "Australia",
    "Delta Goodrem — Eclipse",
    "au",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/australiajpg/Australia-fill_size%3D2560x1600-focal_point%3D1268x831-focal_size%3D531x582-fill_size%3D2560x1600-focal_point%3D1268x831-focal_size%3D531x582.jpg"
  ),
  makeCountry(
    "ua",
    "Ukraine",
    "Leléka — Ridnym",
    "ua",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/ukrainejpg/Ukraine-fill_size%3D2560x1600-focal_point%3D1138x849-focal_size%3D674x715-fill_size%3D2560x1600-focal_point%3D1138x849-focal_size%3D674x715.jpg"
  ),
  makeCountry(
    "al",
    "Albania",
    "Alis — Nân",
    "al",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/img_6182jpeg/IMG_6182-fill_size%3D2560x1600-focal_point%3D917x593-focal_size%3D491x571-fill_size%3D2560x1600-focal_point%3D917x593-focal_size%3D491x571.jpeg"
  ),
  makeCountry(
    "mt",
    "Malta",
    "Aidan — Bella",
    "mt",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/maltajpg/Malta-fill_size%3D2560x1600-focal_point%3D1189x630-focal_size%3D317x302-fill_size%3D2560x1600-focal_point%3D1189x630-focal_size%3D317x302.jpg"
  ),
  makeCountry(
    "no",
    "Norway",
    "Jonas Lovv — Ya ya ya",
    "no",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/norway_u2zlerkjpg/Norway_U2ZlERK-fill_size%3D2560x1600-focal_point%3D1090x1038-focal_size%3D739x691-fill_size%3D2560x1600-focal_point%3D1090x1038-focal_size%3D739x691.jpg"
  ),
];

const copyCountry = (source, id, updates = {}) => {
  const country = source.find((item) => item.id === id);

  return {
    ...country,
    score: 0,
    note: "",
    ...updates,
  };
};

const fromSF1 = (id, updates = {}) =>
  copyCountry(initialCountriesSF1, id, updates);

const fromSF2 = (id, updates = {}) =>
  copyCountry(initialCountriesSF2, id, updates);

const initialCountriesFinal = [
  fromSF2("dk", { song: "Søren Torpegaard Lund — Før Vi Går Hjem" }),
  makeCountry(
    "de",
    "Germany",
    "Sarah Engels — Fire",
    "de",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/germanyjpg/Germany-fill_size%3D2560x1600-focal_point%3D1276x1003-focal_size%3D488x428-fill_size%3D2560x1600-focal_point%3D1276x1003-focal_size%3D488x428.jpg"
  ),
  fromSF1("il"),
  fromSF1("be", { song: "ESSYLA — Dancing on the Ice" }),
  fromSF2("al"),
  fromSF1("gr", { song: "Akylas — Ferto" }),
  fromSF2("ua", { song: "LELÉKA — Ridnym" }),
  fromSF2("au"),
  fromSF1("rs", { song: "LAVINA — Kraj Mene" }),
  fromSF2("mt", { song: "AIDAN — Bella" }),
  fromSF2("cz", { song: "Daniel Zizka — CROSSROADS" }),
  fromSF2("bg", { song: "DARA — Bangaranga" }),
  fromSF1("hr", { song: "LELEK — Andromeda" }),
  makeCountry(
    "gb",
    "United Kingdom",
    "LOOK MUM NO COMPUTER — Eins, Zwei, Drei",
    "gb",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/260509_corinne-cumming_ebu00021jpg/260509_Corinne%20Cumming_EBU00021-fill_size%3D2560x1600-focal_point%3D1513x2026-focal_size%3D610x683.jpg"
  ),
  makeCountry(
    "fr",
    "France",
    "Monroe — Regarde !",
    "fr",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/monroe26jpg/Monroe26-fill_size%3D2560x1600-focal_point%3D1030x757-focal_size%3D402x426-fill_size%3D2560x1600-focal_point%3D1030x757-focal_size%3D402x426.jpg"
  ),
  fromSF1("md", { song: "Satoshi — Viva, Moldova!" }),
  fromSF1("fi", { song: "Linda Lampenius x Pete Parkkonen — Liekinheitin" }),
  fromSF1("pl", { song: "ALICJA — Pray" }),
  fromSF1("lt", { song: "Lion Ceccah — Sólo Quiero Más" }),
  fromSF1("se", { song: "FELICIA — My System" }),
  fromSF2("cy", { song: "Antigoni — JALLA" }),
  makeCountry(
    "it",
    "Italy",
    "Sal Da Vinci — Per Sempre Sì",
    "it",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/italyjpg/Italy-fill_size%3D2560x1600-focal_point%3D1410x1119-focal_size%3D732x755-fill_size%3D2560x1600-focal_point%3D1410x1119-focal_size%3D732x755.jpg"
  ),
  fromSF2("no", { song: "JONAS LOVV — YA YA YA" }),
  fromSF2("ro"),
  makeCountry(
    "at",
    "Austria",
    "COSMÓ — Tanzschein",
    "at",
    "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/260509_corinne-cumming_ebu00018_croppedpng/260509_Corinne%20Cumming_EBU00018_cropped-fill_size%3D2560x1600.png"
  ),
];

const points = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12];

const safeLoad = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

export default function EurovisionScoreboard() {
  const exportRef = useRef(null);
  const bingoStoryRef = useRef(null);
  const bingoPostRef = useRef(null);

  const [activeSemi, setActiveSemi] = useState("FINAL");
  const [lastScoreTab, setLastScoreTab] = useState("FINAL");
  const [isExporting, setIsExporting] = useState(false);

  const [countriesFinal, setCountriesFinal] = useState(() =>
    safeLoad("eurovision-scores-2026-final-v3", initialCountriesFinal)
  );

  const [countriesSF1, setCountriesSF1] = useState(() =>
    safeLoad("eurovision-scores-2026-sf1-v3", initialCountriesSF1)
  );

  const [countriesSF2, setCountriesSF2] = useState(() =>
    safeLoad("eurovision-scores-2026-sf2-v3", initialCountriesSF2)
  );

  const [bingoMarks, setBingoMarks] = useState(() => {
    const saved = safeLoad("eurovision-bingo-2026-v1", null);
    return saved ? { ...saved, free: true } : createInitialBingoMarks();
  });

  useEffect(() => {
    localStorage.setItem(
      "eurovision-scores-2026-final-v3",
      JSON.stringify(countriesFinal)
    );
  }, [countriesFinal]);

  useEffect(() => {
    localStorage.setItem(
      "eurovision-scores-2026-sf1-v3",
      JSON.stringify(countriesSF1)
    );
  }, [countriesSF1]);

  useEffect(() => {
    localStorage.setItem(
      "eurovision-scores-2026-sf2-v3",
      JSON.stringify(countriesSF2)
    );
  }, [countriesSF2]);

  useEffect(() => {
    localStorage.setItem(
      "eurovision-bingo-2026-v1",
      JSON.stringify({ ...bingoMarks, free: true })
    );
  }, [bingoMarks]);

  const isBingoPage = activeSemi === "BINGO";
  const scoreTab = isBingoPage ? lastScoreTab : activeSemi;

  const currentCountries =
    scoreTab === "FINAL"
      ? countriesFinal
      : scoreTab === "SF1"
      ? countriesSF1
      : countriesSF2;

  const setCurrentCountries =
    scoreTab === "FINAL"
      ? setCountriesFinal
      : scoreTab === "SF1"
      ? setCountriesSF1
      : setCountriesSF2;

  const semiTitle =
    scoreTab === "FINAL"
      ? "Grand Final"
      : scoreTab === "SF1"
      ? "Semi-Final 1"
      : "Semi-Final 2";

  const semiDate =
    scoreTab === "FINAL"
      ? "16 MAY 2026, 21:00 CEST"
      : scoreTab === "SF1"
      ? "12 MAY 2026, 21:00 CEST"
      : "14 MAY 2026, 21:00 CEST";

  const sorted = [...currentCountries].sort((a, b) => b.score - a.score);
  const votingStarted = currentCountries.some((country) => country.score > 0);
  const votesCount = currentCountries.filter((country) => country.score > 0).length;

  const bingoWin = hasBingoLine(bingoMarks);
  const markedBingoCount = bingoSquares.filter(
    (square) => !square.free && bingoMarks[square.id]
  ).length;

  const openScoreTab = (tab) => {
    setActiveSemi(tab);
    setLastScoreTab(tab);
  };

  const toggleScore = (targetId, clickedPoints) => {
    setCurrentCountries((prev) =>
      prev.map((country) => {
        if (country.id === targetId) {
          return {
            ...country,
            score: country.score === clickedPoints ? 0 : clickedPoints,
          };
        }

        if (country.score === clickedPoints) {
          return { ...country, score: 0 };
        }

        return country;
      })
    );
  };

  const updateNote = (id, text) => {
    setCurrentCountries((prev) =>
      prev.map((country) =>
        country.id === id ? { ...country, note: text } : country
      )
    );
  };

  const resetScores = () => {
    if (window.confirm(`Reset all votes for ${semiTitle}?`)) {
      const initial =
        scoreTab === "FINAL"
          ? initialCountriesFinal
          : scoreTab === "SF1"
          ? initialCountriesSF1
          : initialCountriesSF2;

      const storageKey =
        scoreTab === "FINAL"
          ? "eurovision-scores-2026-final-v3"
          : scoreTab === "SF1"
          ? "eurovision-scores-2026-sf1-v3"
          : "eurovision-scores-2026-sf2-v3";

      setCurrentCountries(initial);
      localStorage.removeItem(storageKey);
    }
  };

  const toggleBingoCell = (id, isFree) => {
    if (isFree) return;

    setBingoMarks((prev) => ({
      ...prev,
      free: true,
      [id]: !prev[id],
    }));
  };

  const resetBingo = () => {
    if (window.confirm("Reset Eurovision Bingo?")) {
      setBingoMarks(createInitialBingoMarks());
      localStorage.removeItem("eurovision-bingo-2026-v1");
    }
  };

  const downloadAsImage = async () => {
    if (!exportRef.current || votesCount !== 10) return;

    setIsExporting(true);

    setTimeout(async () => {
      try {
        const canvas = await html2canvas(exportRef.current, {
          scale: 1.5,
          backgroundColor: "#f3f4f6",
          useCORS: true,
          width: 1080,
          height: 1920,
          logging: false,
        });

        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `My_Eurovision_${scoreTab}_Top.png`;
        link.click();
      } catch {
        alert("Error saving image.");
      } finally {
        setIsExporting(false);
      }
    }, 600);
  };

  const downloadBingoImage = async (format) => {
    const config =
      format === "post"
        ? {
            ref: bingoPostRef,
            width: 1080,
            height: 1350,
            filename: "Eurovision_Bingo_Post_1080x1350.png",
          }
        : {
            ref: bingoStoryRef,
            width: 1080,
            height: 1920,
            filename: "Eurovision_Bingo_Story_1080x1920.png",
          };

    if (!config.ref.current) return;

    setIsExporting(true);

    setTimeout(async () => {
      try {
        const canvas = await html2canvas(config.ref.current, {
          scale: 1.5,
          backgroundColor: "#05071f",
          useCORS: true,
          width: config.width,
          height: config.height,
          logging: false,
        });

        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = config.filename;
        link.click();
      } catch {
        alert("Error saving bingo image.");
      } finally {
        setIsExporting(false);
      }
    }, 600);
  };

  const isFinalLike = activeSemi === "FINAL" || activeSemi === "BINGO";
  const currentLogo = isFinalLike ? finalLogoUrl : logoUrl;

  return (
    <div className={`app-shell ${isFinalLike ? "final-theme" : ""}`}>
      <style>{`
        .bingo-launcher {
          position: fixed;
          right: 22px;
          top: 50%;
          z-index: 70;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          width: 96px;
          padding: 12px 10px 14px;
          border: 1px solid rgba(255, 255, 255, 0.28);
          border-radius: 28px;
          color: #ffffff;
          background: rgba(5, 7, 31, 0.54);
          backdrop-filter: blur(22px);
          box-shadow:
            0 18px 45px rgba(0, 0, 0, 0.35),
            0 0 30px rgba(255, 43, 214, 0.28);
          transform: translateY(-50%);
          transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
        }

        .bingo-launcher:hover,
        .bingo-launcher.active {
          background: linear-gradient(135deg, rgba(255, 43, 214, 0.78), rgba(0, 93, 255, 0.68));
          box-shadow:
            0 20px 55px rgba(0, 0, 0, 0.42),
            0 0 38px rgba(255, 43, 214, 0.46),
            0 0 34px rgba(0, 194, 255, 0.28);
          transform: translateY(-50%) scale(1.04);
        }

        .bingo-launcher img {
          width: 52px;
          height: 52px;
          object-fit: contain;
          filter: drop-shadow(0 0 14px rgba(255, 255, 255, 0.2));
        }

        .bingo-launcher span {
          font-size: 11px;
          line-height: 1.05;
          font-weight: 1000;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .bingo-page {
          width: 100%;
          max-width: 980px;
          margin: 0 auto;
          padding: 10px 0 80px;
        }

        .bingo-hero-card {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 22px;
          margin-bottom: 22px;
          padding: 22px 28px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 36px;
          background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.07));
          box-shadow:
            0 26px 60px rgba(0, 0, 0, 0.34),
            inset 0 1px 0 rgba(255, 255, 255, 0.16);
          text-align: left;
        }

        .bingo-hero-heart {
          width: 86px;
          height: 86px;
          object-fit: contain;
          filter:
            drop-shadow(0 0 18px rgba(255, 255, 255, 0.24))
            drop-shadow(0 0 24px rgba(255, 43, 214, 0.28));
        }

        .bingo-kicker {
          margin: 0 0 6px;
          color: rgba(255, 255, 255, 0.62);
          font-size: 12px;
          font-weight: 1000;
          letter-spacing: 0.28em;
          text-transform: uppercase;
        }

        .bingo-hero-card h1 {
          margin: 0 0 8px;
          color: #ffffff;
          font-size: clamp(42px, 7vw, 82px);
          line-height: 0.92;
          font-weight: 1000;
          font-style: italic;
          letter-spacing: -0.07em;
          text-transform: uppercase;
          text-shadow:
            0 0 20px rgba(255, 43, 214, 0.7),
            0 0 34px rgba(0, 194, 255, 0.34);
        }

        .bingo-hero-card p:last-child {
          margin: 0;
          color: rgba(255, 255, 255, 0.74);
          font-size: 15px;
          font-weight: 800;
        }

        .bingo-status {
          justify-self: end;
          min-width: 138px;
          padding: 12px 16px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 20px;
          color: rgba(255, 255, 255, 0.72);
          background: rgba(255, 255, 255, 0.08);
          font-size: 13px;
          font-weight: 1000;
          text-align: center;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .bingo-status.win {
          color: #ffffff;
          background: linear-gradient(135deg, #ff2bd6, #005dff);
          box-shadow:
            0 0 26px rgba(255, 43, 214, 0.58),
            0 0 30px rgba(0, 194, 255, 0.26);
        }

        .bingo-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          overflow: hidden;
          border: 2px solid rgba(255, 255, 255, 0.32);
          border-radius: 34px;
          background: rgba(255, 255, 255, 0.1);
          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.36),
            0 0 42px rgba(255, 43, 214, 0.14);
        }

        .bingo-cell {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 132px;
          padding: 16px 12px;
          border: 0;
          border-right: 1px solid rgba(255, 255, 255, 0.24);
          border-bottom: 1px solid rgba(255, 255, 255, 0.24);
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
          font-size: 17px;
          line-height: 1.14;
          font-weight: 900;
          text-align: center;
          transition: background 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
        }

        .bingo-cell:nth-child(5n) {
          border-right: 0;
        }

        .bingo-cell:nth-last-child(-n + 5) {
          border-bottom: 0;
        }

        .bingo-cell:hover {
          background: rgba(255, 255, 255, 0.16);
        }

        .bingo-cell.marked {
          background:
            radial-gradient(circle at 50% 42%, rgba(255, 255, 255, 0.24), transparent 32%),
            linear-gradient(135deg, rgba(255, 43, 214, 0.72), rgba(0, 93, 255, 0.64));
          box-shadow: inset 0 0 28px rgba(255, 255, 255, 0.12);
        }

        .bingo-cell.free {
          background:
            radial-gradient(circle at 50% 48%, rgba(255, 255, 255, 0.32), transparent 36%),
            linear-gradient(135deg, rgba(255, 43, 214, 0.78), rgba(0, 194, 255, 0.58));
        }

        .bingo-cell span {
          position: relative;
          z-index: 2;
        }

        .bingo-cell strong {
          position: absolute;
          right: 10px;
          top: 8px;
          z-index: 3;
          color: #ffffff;
          font-size: 24px;
          text-shadow: 0 0 16px rgba(255, 255, 255, 0.5);
        }

        .bingo-cell-heart {
          width: 60px;
          height: 60px;
          object-fit: contain;
          margin-bottom: 8px;
          filter: drop-shadow(0 0 14px rgba(255, 255, 255, 0.22));
        }

        .bingo-free-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .bingo-actions {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 24px;
        }

        .bingo-action-button {
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 16px;
          padding: 10px 16px;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
          font-size: 13px;
          font-weight: 1000;
          letter-spacing: 0.04em;
          transition: all 0.18s ease;
        }

        .bingo-action-button:hover,
        .bingo-action-button.ready {
          background: linear-gradient(135deg, #ff2bd6, #005dff);
          box-shadow:
            0 0 22px rgba(255, 43, 214, 0.42),
            0 0 30px rgba(0, 194, 255, 0.24);
        }

        .bingo-export {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #ffffff;
          background:
            radial-gradient(circle at 18% 16%, rgba(0, 194, 255, 0.48), transparent 30%),
            radial-gradient(circle at 82% 20%, rgba(255, 0, 168, 0.52), transparent 34%),
            linear-gradient(135deg, #05071f 0%, #071a5c 40%, #321064 72%, #09051b 100%);
          overflow: hidden;
        }

        .bingo-export-story {
          width: 1080px;
          height: 1920px;
          padding: 142px 72px 92px;
        }

        .bingo-export-post {
          width: 1080px;
          height: 1350px;
          padding: 70px 64px 58px;
        }

        .bingo-export-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          text-align: center;
        }

        .bingo-export-logo {
          width: 430px;
          max-height: 148px;
          object-fit: contain;
          margin-bottom: 22px;
          filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.22));
        }

        .bingo-export-title {
          margin: 0;
          color: #ffffff;
          font-size: 88px;
          line-height: 0.9;
          font-weight: 1000;
          font-style: italic;
          letter-spacing: -0.07em;
          text-transform: uppercase;
          text-shadow:
            0 0 24px rgba(255, 43, 214, 0.82),
            0 0 38px rgba(0, 194, 255, 0.38);
        }

        .bingo-export-subtitle {
          margin: 20px 0 34px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 22px;
          font-weight: 1000;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .bingo-export-result {
          margin-bottom: 34px;
          padding: 12px 24px;
          border-radius: 999px;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.13);
          font-size: 22px;
          font-weight: 1000;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .bingo-export-result.win {
          background: linear-gradient(135deg, #ff2bd6, #005dff);
          box-shadow:
            0 0 26px rgba(255, 43, 214, 0.52),
            0 0 32px rgba(0, 194, 255, 0.26);
        }

        .bingo-export-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          width: 100%;
          overflow: hidden;
          border: 2px solid rgba(255, 255, 255, 0.34);
          border-radius: 34px;
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.32);
        }

        .bingo-export-cell {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 154px;
          padding: 14px 12px;
          border-right: 1px solid rgba(255, 255, 255, 0.26);
          border-bottom: 1px solid rgba(255, 255, 255, 0.26);
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
          font-size: 24px;
          line-height: 1.08;
          font-weight: 950;
          text-align: center;
        }

        .bingo-export-post .bingo-export-cell {
          height: 116px;
          font-size: 20px;
        }

        .bingo-export-cell:nth-child(5n) {
          border-right: 0;
        }

        .bingo-export-cell:nth-last-child(-n + 5) {
          border-bottom: 0;
        }

        .bingo-export-cell.marked {
          background:
            radial-gradient(circle at 50% 42%, rgba(255, 255, 255, 0.24), transparent 34%),
            linear-gradient(135deg, rgba(255, 43, 214, 0.74), rgba(0, 93, 255, 0.64));
        }

        .bingo-export-cell.free {
          background:
            radial-gradient(circle at 50% 48%, rgba(255, 255, 255, 0.32), transparent 36%),
            linear-gradient(135deg, rgba(255, 43, 214, 0.82), rgba(0, 194, 255, 0.58));
        }

        .bingo-export-cell-check {
          position: absolute;
          top: 8px;
          right: 10px;
          font-size: 30px;
          text-shadow: 0 0 16px rgba(255, 255, 255, 0.5);
        }

        .bingo-export-heart {
          width: 72px;
          height: 72px;
          object-fit: contain;
          margin-bottom: 8px;
        }

        .bingo-export-footer {
          margin-top: auto;
          color: rgba(255, 255, 255, 0.48);
          font-size: 18px;
          font-weight: 900;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .story-final-theme .story-header h1 {
          color: #ffffff !important;
          background: none !important;
          -webkit-background-clip: initial !important;
          background-clip: initial !important;
          text-shadow:
            0 0 18px rgba(255, 43, 214, 0.9),
            0 0 32px rgba(0, 194, 255, 0.45) !important;
          filter: none !important;
        }

        @media (max-width: 1020px) {
          .bingo-launcher {
            top: auto;
            right: 16px;
            bottom: 18px;
            width: 86px;
            padding: 10px 8px 12px;
            transform: none;
          }

          .bingo-launcher:hover,
          .bingo-launcher.active {
            transform: scale(1.04);
          }

          .bingo-launcher img {
            width: 44px;
            height: 44px;
          }

          .bingo-page {
            padding-bottom: 110px;
          }
        }

        @media (max-width: 760px) {
          .bingo-hero-card {
            grid-template-columns: 1fr;
            text-align: center;
            justify-items: center;
            padding: 22px 18px;
          }

          .bingo-status {
            justify-self: center;
          }

          .bingo-grid {
            border-radius: 24px;
          }

          .bingo-cell {
            min-height: 96px;
            padding: 10px 6px;
            font-size: 12px;
            line-height: 1.08;
          }

          .bingo-cell strong {
            right: 6px;
            top: 4px;
            font-size: 18px;
          }

          .bingo-cell-heart {
            width: 38px;
            height: 38px;
          }
        }
      `}</style>

      <button
        className={`bingo-launcher ${activeSemi === "BINGO" ? "active" : ""}`}
        onClick={() => setActiveSemi("BINGO")}
        type="button"
        aria-label="Open Eurovision Bingo"
      >
        <img src={bingoHeartUrl} crossOrigin="anonymous" alt="" />
        <span>Bingo</span>
      </button>

      <div className="export-hidden">
        <div
          ref={exportRef}
          className={`story-export ${
            scoreTab === "FINAL" ? "story-final-theme" : ""
          }`}
        >
          <header className="story-header">
            <img src={currentLogo} crossOrigin="anonymous" alt="Eurovision 2026" />
            <h1>{semiTitle}</h1>
            <p>{semiDate}</p>
            <div>My Top 10</div>
          </header>

          <div className="story-list">
            {sorted.slice(0, 10).map((country, index) => (
              <div key={country.id} className="story-card">
                <div className="story-left">
                  <span>{index + 1}</span>

                  <img
                    src={getProxyUrl(country.flag)}
                    crossOrigin="anonymous"
                    alt=""
                    className="story-flag"
                  />

                  <img
                    src={getProxyUrl(country.image)}
                    crossOrigin="anonymous"
                    alt=""
                    className="story-photo"
                  />

                  <div>
                    <h2>{country.name}</h2>
                    <p>{country.song}</p>
                  </div>
                </div>

                <strong>{country.score}</strong>
              </div>
            ))}
          </div>
        </div>

        <div ref={bingoStoryRef} className="bingo-export bingo-export-story">
          <header className="bingo-export-header">
            <img
              src={finalLogoUrl}
              crossOrigin="anonymous"
              alt="Eurovision 2026"
              className="bingo-export-logo"
            />
            <h1 className="bingo-export-title">Eurovision Bingo</h1>
            <p className="bingo-export-subtitle">Grand Final · 16 May 2026</p>
            <div className={`bingo-export-result ${bingoWin ? "win" : ""}`}>
              {bingoWin ? "BINGO!" : `${markedBingoCount}/24 marked`}
            </div>
          </header>

          <div className="bingo-export-grid">
            {bingoSquares.map((square) => {
              const marked = Boolean(bingoMarks[square.id]) || square.free;

              return (
                <div
                  key={square.id}
                  className={`bingo-export-cell ${marked ? "marked" : ""} ${
                    square.free ? "free" : ""
                  }`}
                >
                  {square.free ? (
                    <div className="bingo-free-inner">
                      <img
                        src={bingoHeartUrl}
                        crossOrigin="anonymous"
                        alt=""
                        className="bingo-export-heart"
                      />
                      <span>{square.text}</span>
                    </div>
                  ) : (
                    <span>{square.text}</span>
                  )}

                  {marked && (
                    <strong className="bingo-export-cell-check">✓</strong>
                  )}
                </div>
              );
            })}
          </div>

          <footer className="bingo-export-footer">eurovision 2026 bingo</footer>
        </div>

        <div ref={bingoPostRef} className="bingo-export bingo-export-post">
          <header className="bingo-export-header">
            <img
              src={finalLogoUrl}
              crossOrigin="anonymous"
              alt="Eurovision 2026"
              className="bingo-export-logo"
            />
            <h1 className="bingo-export-title">Eurovision Bingo</h1>
            <p className="bingo-export-subtitle">Grand Final · 16 May 2026</p>
            <div className={`bingo-export-result ${bingoWin ? "win" : ""}`}>
              {bingoWin ? "BINGO!" : `${markedBingoCount}/24 marked`}
            </div>
          </header>

          <div className="bingo-export-grid">
            {bingoSquares.map((square) => {
              const marked = Boolean(bingoMarks[square.id]) || square.free;

              return (
                <div
                  key={square.id}
                  className={`bingo-export-cell ${marked ? "marked" : ""} ${
                    square.free ? "free" : ""
                  }`}
                >
                  {square.free ? (
                    <div className="bingo-free-inner">
                      <img
                        src={bingoHeartUrl}
                        crossOrigin="anonymous"
                        alt=""
                        className="bingo-export-heart"
                      />
                      <span>{square.text}</span>
                    </div>
                  ) : (
                    <span>{square.text}</span>
                  )}

                  {marked && (
                    <strong className="bingo-export-cell-check">✓</strong>
                  )}
                </div>
              );
            })}
          </div>

          <footer className="bingo-export-footer">eurovision 2026 bingo</footer>
        </div>
      </div>

      {!isExporting && (
        <div className="topbar">
          <div className="tabs">
            <button
              onClick={() => openScoreTab("FINAL")}
              className={activeSemi === "FINAL" ? "active" : ""}
            >
              Grand Final
            </button>

            <button
              onClick={() => openScoreTab("SF1")}
              className={activeSemi === "SF1" ? "active" : ""}
            >
              Semi-Final 1
            </button>

            <button
              onClick={() => openScoreTab("SF2")}
              className={activeSemi === "SF2" ? "active" : ""}
            >
              Semi-Final 2
            </button>
          </div>

          <div className="controls">
            {isBingoPage ? (
              <>
                <button className="reset-button" onClick={resetBingo}>
                  Reset Bingo
                </button>

                <button
                  className="download-button ready"
                  onClick={() => downloadBingoImage("story")}
                >
                  Save Story 1080×1920
                </button>

                <button
                  className="download-button ready"
                  onClick={() => downloadBingoImage("post")}
                >
                  Save Post 1080×1350
                </button>
              </>
            ) : votingStarted ? (
              <>
                <button className="reset-button" onClick={resetScores}>
                  Reset
                </button>

                <button
                  className={`download-button ${
                    votesCount === 10 ? "ready" : ""
                  }`}
                  onClick={downloadAsImage}
                  disabled={votesCount !== 10}
                >
                  Download Story Image
                </button>
              </>
            ) : (
              <span>Select your top 10 for {semiTitle}</span>
            )}
          </div>
        </div>
      )}

      <main className="page">
        {isBingoPage ? (
          <section className="bingo-page">
            <div className="bingo-hero-card">
              <img
                src={bingoHeartUrl}
                crossOrigin="anonymous"
                alt=""
                className="bingo-hero-heart"
              />

              <div>
                <p className="bingo-kicker">Vienna 2026 · Grand Final</p>
                <h1>Eurovision Bingo</h1>
                <p>Tap a square when it happens during the show.</p>
              </div>

              <div className={`bingo-status ${bingoWin ? "win" : ""}`}>
                {bingoWin ? "BINGO!" : `${markedBingoCount}/24 marked`}
              </div>
            </div>

            <div className="bingo-grid">
              {bingoSquares.map((square) => {
                const marked = Boolean(bingoMarks[square.id]) || square.free;

                return (
                  <button
                    type="button"
                    key={square.id}
                    onClick={() => toggleBingoCell(square.id, square.free)}
                    className={`bingo-cell ${marked ? "marked" : ""} ${
                      square.free ? "free" : ""
                    }`}
                  >
                    {square.free ? (
                      <div className="bingo-free-inner">
                        <img
                          src={bingoHeartUrl}
                          crossOrigin="anonymous"
                          alt=""
                          className="bingo-cell-heart"
                        />
                        <span>{square.text}</span>
                      </div>
                    ) : (
                      <span>{square.text}</span>
                    )}

                    {marked && <strong>✓</strong>}
                  </button>
                );
              })}
            </div>

            <div className="bingo-actions">
              <button className="bingo-action-button" onClick={resetBingo}>
                Reset Bingo
              </button>

              <button
                className="bingo-action-button ready"
                onClick={() => downloadBingoImage("story")}
              >
                Save Story 1080×1920
              </button>

              <button
                className="bingo-action-button ready"
                onClick={() => downloadBingoImage("post")}
              >
                Save Post 1080×1350
              </button>
            </div>
          </section>
        ) : (
          <>
            <header className="hero">
              <img
                src={currentLogo}
                crossOrigin="anonymous"
                alt="Eurovision 2026"
              />
              <h1>{semiTitle}</h1>
              <p>{semiDate}</p>
            </header>

            <section className="scoreboard-list">
              {sorted.map((country, index) => (
                <React.Fragment key={country.id}>
                  {votingStarted && index === 10 && (
                    <div className="zero-divider">
                      <span></span>
                      <strong>Zero Points</strong>
                      <span></span>
                    </div>
                  )}

                  <motion.article
                    layout
                    className={`country-card ${
                      country.score > 0 ? "selected" : ""
                    }`}
                  >
                    <div className="country-main">
                      <div className="rank-flag">
                        <div className="rank">{index + 1}</div>

                        <div className="flag-bubble">
                          <img src={country.flag} alt="" />
                        </div>
                      </div>

                      <div className="artist-block">
                        <img
                          className="artist-image"
                          src={country.image}
                          alt=""
                        />

                        <div className="artist-text">
                          <h2>{country.name}</h2>
                          <p>{country.song}</p>

                          <textarea
                            value={country.note || ""}
                            onChange={(event) =>
                              updateNote(country.id, event.target.value)
                            }
                            placeholder="Add note..."
                            rows="1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="vote-block">
                      <div className="point-grid">
                        {points.map((point) => {
                          const mine = country.score === point;
                          const taken = currentCountries.some(
                            (other) =>
                              other.id !== country.id && other.score === point
                          );

                          return (
                            <button
                              key={point}
                              onClick={() => toggleScore(country.id, point)}
                              className={`${mine ? "mine" : ""} ${
                                taken ? "taken" : ""
                              }`}
                            >
                              {point}
                            </button>
                          );
                        })}
                      </div>

                      <div className="score-value">
                        {country.score > 0 ? country.score : "-"}
                      </div>
                    </div>
                  </motion.article>
                </React.Fragment>
              ))}
            </section>
          </>
        )}

        <footer className="footer">
          Scoreboard created by{" "}
          <a
            href="https://www.instagram.com/artkuztom/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Artyom Kuzmenko
          </a>
        </footer>
      </main>

      <Analytics />
    </div>
  );
}
