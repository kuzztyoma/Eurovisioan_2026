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

const finalLogoUrl =
  "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/frame-2147206933png/Frame%202147206933-width%3D600.png";

const initialCountriesSF1 = [
  {
    id: "md",
    name: "Moldova",
    song: "Satoshi — Viva, Moldova",
    flag: "https://www.eurovision.com/static/images/flags/flag_md.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/moldovapng/Moldova-fill_size%3D2560x1600-focal_point%3D1167x399-focal_size%3D482x523-fill_size%3D2560x1600-focal_point%3D1167x399-focal_size%3D482x523.png",
    score: 0,
    note: "",
  },
  {
    id: "se",
    name: "Sweden",
    song: "Felicia — My System",
    flag: "https://www.eurovision.com/static/images/flags/flag_se.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/felicia_69ac8624368c5_26_lizzsa7jpg/felicia_69ac8624368c5_26_lIzZSa7-fill_size%3D2560x1600-focal_point%3D840x440-focal_size%3D460x535-fill_size%3D2560x1600-focal_point%3D840x440-focal_size%3D460x535.jpg",
    score: 0,
    note: "",
  },
  {
    id: "hr",
    name: "Croatia",
    song: "Lelek — Andromeda",
    flag: "https://www.eurovision.com/static/images/flags/flag_hr.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/lelek_-croatia_-photo-by-hrt-dario-njavro_-8png/lelek_%20croatia_%20photo%20by%20hrt%20%26%20dario%20njavro_%20%20%288%29-fill_size%3D2560x1600-focal_point%3D1256x584-focal_size%3D188x188-fill_size%3D2560x1600-focal_point%3D1256x584-focal_size%3D188x188.png",
    score: 0,
    note: "",
  },
  {
    id: "gr",
    name: "Greece",
    song: "Akylas — Ferto",
    flag: "https://www.eurovision.com/static/images/flags/flag_gr.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/greecejpg/Greece-fill_size%3D2560x1600-focal_point%3D1241x405-focal_size%3D310x253-fill_size%3D2560x1600-focal_point%3D1241x405-focal_size%3D310x253.jpg",
    score: 0,
    note: "",
  },
  {
    id: "pt",
    name: "Portugal",
    song: "Bandidos do Cante — Rosa",
    flag: "https://www.eurovision.com/static/images/flags/flag_pt.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/foto-bandidos-do-cantejpg/Foto%20Bandidos%20do%20Cante-fill_size%3D2560x1600-focal_point%3D1050x559-focal_size%3D333x310-fill_size%3D2560x1600-focal_point%3D1050x559-focal_size%3D333x310.jpg",
    score: 0,
    note: "",
  },
  {
    id: "ge",
    name: "Georgia",
    song: "Bzikebi — On Replay",
    flag: "https://www.eurovision.com/static/images/flags/flag_ge.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/georgiapng/Georgia-fill_size%3D2560x1600-focal_point%3D1281x262-focal_size%3D188x188-fill_size%3D2560x1600-focal_point%3D1281x262-focal_size%3D188x188.png",
    score: 0,
    note: "",
  },
  {
    id: "fi",
    name: "Finland",
    song: "Linda & Pete — Liekinheitin",
    flag: "https://www.eurovision.com/static/images/flags/flag_fi.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/linda_lampenius_x_pete_parkkonen_music_video_still_credit_nelli_kentta_lcyg46bjpg/Linda_Lampenius_x_Pete_Parkkonen_music_video_still_Credit_Nelli_kentta_LCYG46b-fill_size%3D2560x1600-focal_point%3D2546x913-focal_size%3D968x704-fill_size%3D2560x1600-focal_point%3D2546x913-focal_size%3D968x704.jpg",
    score: 0,
    note: "",
  },
  {
    id: "me",
    name: "Montenegro",
    song: "Tamara Živković — Nova zora",
    flag: "https://www.eurovision.com/static/images/flags/flag_me.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/montenegrojpg/Montenegro-fill_size%3D2560x1600-focal_point%3D1378x418-focal_size%3D308x368-fill_size%3D2560x1600-focal_point%3D1378x418-focal_size%3D308x368.jpg",
    score: 0,
    note: "",
  },
  {
    id: "ee",
    name: "Estonia",
    song: "Vanilla Ninja — Too Epic To Be True",
    flag: "https://www.eurovision.com/static/images/flags/flag_ee.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/estoniajpg/Estonia-fill_size%3D2560x1600-focal_point%3D1181x1630-focal_size%3D450x468-fill_size%3D2560x1600-focal_point%3D1181x1630-focal_size%3D450x468.jpg",
    score: 0,
    note: "",
  },
  {
    id: "il",
    name: "Israel",
    song: "Noam Bettan — Michelle",
    flag: "https://www.eurovision.com/static/images/flags/flag_il.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/israeljpg/Israel-fill_size%3D2560x1600-focal_point%3D1204x310-focal_size%3D259x267-fill_size%3D2560x1600-focal_point%3D1204x310-focal_size%3D259x267.jpg",
    score: 0,
    note: "",
  },
  {
    id: "be",
    name: "Belgium",
    song: "Essyla — Dancing on the Ice",
    flag: "https://www.eurovision.com/static/images/flags/flag_be.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/essyla-euro_l_rs_ekrztndjpg/ESSYLA%20EURO_L_RS_ekRZTnD-fill_size%3D2560x1600-focal_point%3D973x526-focal_size%3D423x369-fill_size%3D2560x1600-focal_point%3D973x526-focal_size%3D423x369.jpg",
    score: 0,
    note: "",
  },
  {
    id: "lt",
    name: "Lithuania",
    song: "Lion Ceccah — Sólo quiero más",
    flag: "https://www.eurovision.com/static/images/flags/flag_lt.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/lithuaniajpg/Lithuania-fill_size%3D2560x1600-focal_point%3D1306x690-focal_size%3D570x459-fill_size%3D2560x1600-focal_point%3D1306x690-focal_size%3D570x459.jpg",
    score: 0,
    note: "",
  },
  {
    id: "sm",
    name: "San Marino",
    song: "Senhit ft. Boy George — Superstar",
    flag: "https://www.eurovision.com/static/images/flags/flag_sm.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/san-marinojpg/San%20Marino-fill_size%3D2560x1600-focal_point%3D1335x451-focal_size%3D318x413-fill_size%3D2560x1600-focal_point%3D1335x451-focal_size%3D318x413.jpg",
    score: 0,
    note: "",
  },
  {
    id: "pl",
    name: "Poland",
    song: "Alicja Szemplińska — Pray",
    flag: "https://www.eurovision.com/static/images/flags/flag_pl.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/polandjpeg/Poland-fill_size%3D2560x1600-focal_point%3D1241x537-focal_size%3D422x416-fill_size%3D2560x1600-focal_point%3D1241x537-focal_size%3D422x416.jpeg",
    score: 0,
    note: "",
  },
  {
    id: "rs",
    name: "Serbia",
    song: "Lavina — Kraj mene",
    flag: "https://www.eurovision.com/static/images/flags/flag_rs.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/serbia-lavina-photo-5-by-natasa-stamatovicjpg/Serbia%2C%20Lavina%2C%20photo%205%20by%20Nata%C5%A1a%20Stamatovi%C4%87-fill_size%3D2560x1600-focal_point%3D1905x1014-focal_size%3D345x300-fill_size%3D2560x1600-focal_point%3D1905x1014-focal_size%3D345x300.jpg",
    score: 0,
    note: "",
  },
];

const initialCountriesSF2 = [
  {
    id: "bg",
    name: "Bulgaria",
    song: "DARA — Bangaranga",
    flag: "https://www.eurovision.com/static/images/flags/flag_bg.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/bulgariajpg/Bulgaria-fill_size%3D2560x1600-focal_point%3D1288x394-focal_size%3D225x240-fill_size%3D2560x1600-focal_point%3D1288x394-focal_size%3D225x240.jpg",
    score: 0,
    note: "",
  },
  {
    id: "az",
    name: "Azerbaijan",
    song: "Jiva — Just Go",
    flag: "https://www.eurovision.com/static/images/flags/flag_az.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/alif4156-1jpg/ALIF4156%20%281%29-fill_size%3D2560x1600-focal_point%3D1298x447-focal_size%3D224x279-fill_size%3D2560x1600-focal_point%3D1298x447-focal_size%3D224x279.jpg",
    score: 0,
    note: "",
  },
  {
    id: "ro",
    name: "Romania",
    song: "Alexandra Căpitănescu — Choke Me",
    flag: "https://www.eurovision.com/static/images/flags/flag_ro.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/romaniajpg/Romania-fill_size%3D2560x1600-focal_point%3D1659x838-focal_size%3D348x296-fill_size%3D2560x1600-focal_point%3D1659x838-focal_size%3D348x296.jpg",
    score: 0,
    note: "",
  },
  {
    id: "lu",
    name: "Luxembourg",
    song: "Eva Marija — Mother Nature",
    flag: "https://www.eurovision.com/static/images/flags/flag_lu.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/luxembourgjpg/Luxembourg-fill_size%3D2560x1600-focal_point%3D1272x852-focal_size%3D445x445-fill_size%3D2560x1600-focal_point%3D1272x852-focal_size%3D445x445.jpg",
    score: 0,
    note: "",
  },
  {
    id: "cz",
    name: "Czechia",
    song: "Daniel Žižka — Crossroads",
    flag: "https://www.eurovision.com/static/images/flags/flag_cz.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/daniel-zizka_finals__img7135_dcg99uzjpg/Daniel%20Zizka_finals__IMG7135_dcG99Uz-fill_size%3D2560x1600-focal_point%3D765x673-focal_size%3D418x375-fill_size%3D2560x1600-focal_point%3D765x673-focal_size%3D418x375.jpg",
    score: 0,
    note: "",
  },
  {
    id: "am",
    name: "Armenia",
    song: "SIMÓN — Paloma Rumba",
    flag: "https://www.eurovision.com/static/images/flags/flag_am.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/armeniajpg/Armenia-fill_size%3D2560x1600-focal_point%3D1383x749-focal_size%3D427x405-fill_size%3D2560x1600-focal_point%3D1383x749-focal_size%3D427x405.jpg",
    score: 0,
    note: "",
  },
  {
    id: "ch",
    name: "Switzerland",
    song: "Veronica Fusaro — Alice",
    flag: "https://www.eurovision.com/static/images/flags/flag_ch.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/switzerland_edk0ddyjpg/Switzerland_eDk0DdY-fill_size%3D2560x1600-focal_point%3D1219x615-focal_size%3D436x403-fill_size%3D2560x1600-focal_point%3D1219x615-focal_size%3D436x403.jpg",
    score: 0,
    note: "",
  },
  {
    id: "cy",
    name: "Cyprus",
    song: "Antigoni — Jalla",
    flag: "https://www.eurovision.com/static/images/flags/flag_cy.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/cyprus_qo5gwlojpg/Cyprus_qO5gWlo-fill_size%3D2560x1600-focal_point%3D880x1054-focal_size%3D629x507-fill_size%3D2560x1600-focal_point%3D880x1054-focal_size%3D629x507.jpg",
    score: 0,
    note: "",
  },
  {
    id: "lv",
    name: "Latvia",
    song: "Atvara — Enā",
    flag: "https://www.eurovision.com/static/images/flags/flag_lv.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/latviajpeg/Latvia-fill_size%3D2560x1600-focal_point%3D1477x710-focal_size%3D392x459-fill_size%3D2560x1600-focal_point%3D1477x710-focal_size%3D392x459.jpeg",
    score: 0,
    note: "",
  },
  {
    id: "dk",
    name: "Denmark",
    song: "Søren Torpegaard Lund — Før vi går hjem",
    flag: "https://www.eurovision.com/static/images/flags/flag_dk.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/denmark_8rbh8gajpg/Denmark_8Rbh8gA-fill_size%3D2560x1600-focal_point%3D1283x368-focal_size%3D207x218-fill_size%3D2560x1600-focal_point%3D1283x368-focal_size%3D207x218.jpg",
    score: 0,
    note: "",
  },
  {
    id: "au",
    name: "Australia",
    song: "Delta Goodrem — Eclipse",
    flag: "https://www.eurovision.com/static/images/flags/flag_au.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/australiajpg/Australia-fill_size%3D2560x1600-focal_point%3D1268x831-focal_size%3D531x582-fill_size%3D2560x1600-focal_point%3D1268x831-focal_size%3D531x582.jpg",
    score: 0,
    note: "",
  },
  {
    id: "ua",
    name: "Ukraine",
    song: "Leléka — Ridnym",
    flag: "https://www.eurovision.com/static/images/flags/flag_ua.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/ukrainejpg/Ukraine-fill_size%3D2560x1600-focal_point%3D1138x849-focal_size%3D674x715-fill_size%3D2560x1600-focal_point%3D1138x849-focal_size%3D674x715.jpg",
    score: 0,
    note: "",
  },
  {
    id: "al",
    name: "Albania",
    song: "Alis — Nân",
    flag: "https://www.eurovision.com/static/images/flags/flag_al.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/img_6182jpeg/IMG_6182-fill_size%3D2560x1600-focal_point%3D917x593-focal_size%3D491x571-fill_size%3D2560x1600-focal_point%3D917x593-focal_size%3D491x571.jpeg",
    score: 0,
    note: "",
  },
  {
    id: "mt",
    name: "Malta",
    song: "Aidan — Bella",
    flag: "https://www.eurovision.com/static/images/flags/flag_mt.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/maltajpg/Malta-fill_size%3D2560x1600-focal_point%3D1189x630-focal_size%3D317x302-fill_size%3D2560x1600-focal_point%3D1189x630-focal_size%3D317x302.jpg",
    score: 0,
    note: "",
  },
  {
    id: "no",
    name: "Norway",
    song: "Jonas Lovv — Ya ya ya",
    flag: "https://www.eurovision.com/static/images/flags/flag_no.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/norway_u2zlerkjpg/Norway_U2ZlERK-fill_size%3D2560x1600-focal_point%3D1090x1038-focal_size%3D739x691-fill_size%3D2560x1600-focal_point%3D1090x1038-focal_size%3D739x691.jpg",
    score: 0,
    note: "",
  },
];

const copyCountry = (source, id, updates = {}) => {
  const country = source.find((c) => c.id === id);

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
  fromSF2("dk", {
    song: "Søren Torpegaard Lund — Før Vi Går Hjem",
  }),
  {
    id: "de",
    name: "Germany",
    song: "Sarah Engels — Fire",
    flag: "https://www.eurovision.com/static/images/flags/flag_de.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/germanyjpg/Germany-fill_size%3D2560x1600-focal_point%3D1276x1003-focal_size%3D488x428-fill_size%3D2560x1600-focal_point%3D1276x1003-focal_size%3D488x428.jpg",
    score: 0,
    note: "",
  },
  fromSF1("il"),
  fromSF1("be", {
    song: "ESSYLA — Dancing on the Ice",
  }),
  fromSF2("al"),
  fromSF1("gr", {
    song: "Akylas — Ferto",
  }),
  fromSF2("ua", {
    song: "LELÉKA — Ridnym",
  }),
  fromSF2("au"),
  fromSF1("rs", {
    song: "LAVINA — Kraj Mene",
  }),
  fromSF2("mt", {
    song: "AIDAN — Bella",
  }),
  fromSF2("cz", {
    song: "Daniel Zizka — CROSSROADS",
  }),
  fromSF2("bg", {
    song: "DARA — Bangaranga",
  }),
  fromSF1("hr", {
    song: "LELEK — Andromeda",
  }),
  {
    id: "gb",
    name: "United Kingdom",
    song: "LOOK MUM NO COMPUTER — Eins, Zwei, Drei",
    flag: "https://www.eurovision.com/static/images/flags/flag_gb.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/260509_corinne-cumming_ebu00021jpg/260509_Corinne%20Cumming_EBU00021-fill_size%3D2560x1600-focal_point%3D1513x2026-focal_size%3D610x683.jpg",
    score: 0,
    note: "",
  },
  {
    id: "fr",
    name: "France",
    song: "Monroe — Regarde !",
    flag: "https://www.eurovision.com/static/images/flags/flag_fr.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/monroe26jpg/Monroe26-fill_size%3D2560x1600-focal_point%3D1030x757-focal_size%3D402x426-fill_size%3D2560x1600-focal_point%3D1030x757-focal_size%3D402x426.jpg",
    score: 0,
    note: "",
  },
  fromSF1("md", {
    song: "Satoshi — Viva, Moldova!",
  }),
  fromSF1("fi", {
    song: "Linda Lampenius x Pete Parkkonen — Liekinheitin",
  }),
  fromSF1("pl", {
    song: "ALICJA — Pray",
  }),
  fromSF1("lt", {
    song: "Lion Ceccah — Sólo Quiero Más",
  }),
  fromSF1("se", {
    song: "FELICIA — My System",
  }),
  fromSF2("cy", {
    song: "Antigoni — JALLA",
  }),
  {
    id: "it",
    name: "Italy",
    song: "Sal Da Vinci — Per Sempre Sì",
    flag: "https://www.eurovision.com/static/images/flags/flag_it.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/italyjpg/Italy-fill_size%3D2560x1600-focal_point%3D1410x1119-focal_size%3D732x755-fill_size%3D2560x1600-focal_point%3D1410x1119-focal_size%3D732x755.jpg",
    score: 0,
    note: "",
  },
  fromSF2("no", {
    song: "JONAS LOVV — YA YA YA",
  }),
  fromSF2("ro"),
  {
    id: "at",
    name: "Austria",
    song: "COSMÓ — Tanzschein",
    flag: "https://www.eurovision.com/static/images/flags/flag_at.svg",
    image:
      "https://storage.googleapis.com/eurovision-com.appspot.com/renditions/public/cms/260509_corinne-cumming_ebu00018_croppedpng/260509_Corinne%20Cumming_EBU00018_cropped-fill_size%3D2560x1600.png",
    score: 0,
    note: "",
  },
];

const points = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12];

export default function EurovisionScoreboard() {
  const exportRef = useRef(null);

  const [activeSemi, setActiveSemi] = useState("FINAL");
  const [isExporting, setIsExporting] = useState(false);

  const [countriesFinal, setCountriesFinal] = useState(() => {
    const saved = localStorage.getItem("eurovision-scores-2026-final-v3");
    return saved ? JSON.parse(saved) : initialCountriesFinal;
  });

  const [countriesSF1, setCountriesSF1] = useState(() => {
    const saved = localStorage.getItem("eurovision-scores-2026-sf1-v3");
    return saved ? JSON.parse(saved) : initialCountriesSF1;
  });

  const [countriesSF2, setCountriesSF2] = useState(() => {
    const saved = localStorage.getItem("eurovision-scores-2026-sf2-v3");
    return saved ? JSON.parse(saved) : initialCountriesSF2;
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

  const currentCountries =
    activeSemi === "FINAL"
      ? countriesFinal
      : activeSemi === "SF1"
      ? countriesSF1
      : countriesSF2;

  const setCurrentCountries =
    activeSemi === "FINAL"
      ? setCountriesFinal
      : activeSemi === "SF1"
      ? setCountriesSF1
      : setCountriesSF2;

  const semiTitle =
    activeSemi === "FINAL"
      ? "Grand Final"
      : activeSemi === "SF1"
      ? "Semi-Final 1"
      : "Semi-Final 2";

  const semiDate =
    activeSemi === "FINAL"
      ? "16 MAY 2026, 21:00 CEST"
      : activeSemi === "SF1"
      ? "12 MAY 2026, 21:00 CEST"
      : "14 MAY 2026, 21:00 CEST";

  const sorted = [...currentCountries].sort((a, b) => b.score - a.score);
  const votingStarted = currentCountries.some((c) => c.score > 0);
  const votesCount = currentCountries.filter((c) => c.score > 0).length;

  const toggleScore = (targetId, clickedPoints) => {
    setCurrentCountries((prev) =>
      prev.map((c) => {
        if (c.id === targetId) {
          return {
            ...c,
            score: c.score === clickedPoints ? 0 : clickedPoints,
          };
        }

        if (c.score === clickedPoints) {
          return { ...c, score: 0 };
        }

        return c;
      })
    );
  };

  const updateNote = (id, text) => {
    setCurrentCountries((prev) =>
      prev.map((c) => (c.id === id ? { ...c, note: text } : c))
    );
  };

  const resetScores = () => {
    if (window.confirm(`Reset all votes for ${semiTitle}?`)) {
      const initial =
        activeSemi === "FINAL"
          ? initialCountriesFinal
          : activeSemi === "SF1"
          ? initialCountriesSF1
          : initialCountriesSF2;

      const storageKey =
        activeSemi === "FINAL"
          ? "eurovision-scores-2026-final-v3"
          : activeSemi === "SF1"
          ? "eurovision-scores-2026-sf1-v3"
          : "eurovision-scores-2026-sf2-v3";

      setCurrentCountries(initial);
      localStorage.removeItem(storageKey);
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
        link.download = `My_Eurovision_${activeSemi}_Top.png`;
        link.click();
      } catch (e) {
        alert("Error saving image.");
      } finally {
        setIsExporting(false);
      }
    }, 600);
  };

  const currentLogo = activeSemi === "FINAL" ? finalLogoUrl : logoUrl;

  return (
    <div className={`app-shell ${activeSemi === "FINAL" ? "final-theme" : ""}`}>
      <div className="export-hidden">
        <div
          ref={exportRef}
          className={`story-export ${
            activeSemi === "FINAL" ? "story-final-theme" : ""
          }`}
        >
          <header className="story-header">
            <img src={currentLogo} crossOrigin="anonymous" alt="Eurovision 2026" />
            <h1>{semiTitle}</h1>
            <p>{semiDate}</p>
            <div>My Top 10</div>
          </header>

          <div className="story-list">
            {sorted.slice(0, 10).map((c, i) => (
              <div key={c.id} className="story-card">
                <div className="story-left">
                  <span>{i + 1}</span>

                  <img
                    src={getProxyUrl(c.flag)}
                    crossOrigin="anonymous"
                    alt=""
                    className="story-flag"
                  />

                  <img
                    src={getProxyUrl(c.image)}
                    crossOrigin="anonymous"
                    alt=""
                    className="story-photo"
                  />

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

      {!isExporting && (
        <div className="topbar">
          <div className="tabs">
            <button
              onClick={() => setActiveSemi("FINAL")}
              className={activeSemi === "FINAL" ? "active" : ""}
            >
              Grand Final
            </button>

            <button
              onClick={() => setActiveSemi("SF1")}
              className={activeSemi === "SF1" ? "active" : ""}
            >
              Semi-Final 1
            </button>

            <button
              onClick={() => setActiveSemi("SF2")}
              className={activeSemi === "SF2" ? "active" : ""}
            >
              Semi-Final 2
            </button>
          </div>

          <div className="controls">
            {votingStarted ? (
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
        <header className="hero">
          <img src={currentLogo} crossOrigin="anonymous" alt="Eurovision 2026" />
          <h1>{semiTitle}</h1>
          <p>{semiDate}</p>
        </header>

        <section className="scoreboard-list">
          {sorted.map((c, i) => (
            <React.Fragment key={c.id}>
              {votingStarted && i === 10 && (
                <div className="zero-divider">
                  <span></span>
                  <strong>Zero Points</strong>
                  <span></span>
                </div>
              )}

              <motion.article
                layout
                className={`country-card ${c.score > 0 ? "selected" : ""}`}
              >
                <div className="country-main">
                  <div className="rank-flag">
                    <div className="rank">{i + 1}</div>

                    <div className="flag-bubble">
                      <img src={c.flag} alt="" />
                    </div>
                  </div>

                  <div className="artist-block">
                    <img className="artist-image" src={c.image} alt="" />

                    <div className="artist-text">
                      <h2>{c.name}</h2>
                      <p>{c.song}</p>

                      <textarea
                        value={c.note || ""}
                        onChange={(e) => updateNote(c.id, e.target.value)}
                        placeholder="Add note..."
                        rows="1"
                      />
                    </div>
                  </div>
                </div>

                <div className="vote-block">
                  <div className="point-grid">
                    {points.map((p) => {
                      const mine = c.score === p;
                      const taken = currentCountries.some(
                        (other) => other.id !== c.id && other.score === p
                      );

                      return (
                        <button
                          key={p}
                          onClick={() => toggleScore(c.id, p)}
                          className={`${mine ? "mine" : ""} ${
                            taken ? "taken" : ""
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>

                  <div className="score-value">
                    {c.score > 0 ? c.score : "-"}
                  </div>
                </div>
              </motion.article>
            </React.Fragment>
          ))}
        </section>

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
