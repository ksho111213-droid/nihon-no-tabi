// 一覧・絞り込み・詳細モーダル・モデルコース・行きたいリストのロジック。
// 状態はグローバル変数で持ち、URLハッシュで表示(ビュー/詳細)を切り替える。
const REGIONS = ["北海道", "東北", "関東", "中部", "近畿", "中国", "四国", "九州・沖縄"];
const CATEGORIES = ["絶景", "温泉", "グルメ", "歴史", "自然", "街歩き"];
// ご意見・感想の Google フォームURL。空文字の間はフッターのリンクを出さない
const FEEDBACK_URL = "";
const WISHLIST_KEY = "travel-spots-wishlist-v2";
const OLD_WISHLIST_KEY = "travel-spots-wishlist";
const VISITED_KEY = "travel-spots-visited";

// 写真がないスポット用の地域色グラデーション
const REGION_COLORS = {
  "北海道": ["#88aec7", "#476f8e"],
  "東北": ["#93b3a2", "#5a7f6c"],
  "関東": ["#c0a97e", "#8e744a"],
  "中部": ["#9dabc4", "#5e7092"],
  "近畿": ["#c79d90", "#8f5c4b"],
  "中国": ["#b3a3c6", "#786296"],
  "四国": ["#a6bd9c", "#6a8e5f"],
  "九州・沖縄": ["#c8ae7c", "#a3684a"],
};

// ---- 多言語対応 ----
// UI文言の原本(日本語)。他言語は lang-*.js の辞書から引き、無ければこれにフォールバック。
// フィルタ・localStorage の内部値(カテゴリ・地域・スポットid)は常に日本語のまま。
const JA_UI = {
  docTitle: "たびそめ。— 国内旅行おすすめスポット",
  eyebrow: "にっぽん、再発見。",
  heroLead: "全47都道府県から選んだ{spots}のスポットと、{courses}のモデルコース。気になった場所は ⭐ で行きたいリストへ、訪れたら朱印を。",
  unitSpots: "{n}件",
  unitCourses: "{n}本",
  tabSpots: "スポットを探す",
  tabCourses: "モデルコース",
  searchPlaceholder: "スポット名・キーワードで検索",
  prefAll: "都道府県: すべて",
  allLabel: "すべて",
  wishlistToggle: "⭐ 行きたいリスト ({n})",
  sortAdded: "追加順",
  sortRegion: "地方順",
  exportBtn: "書き出し",
  importBtn: "読み込み",
  resultCount: "{n}件 / 全{total}件",
  emptyMsg: "条件に合うスポットがありません",
  clearFilters: "条件をクリアして全件を見る",
  seasonalHeading: "いまが旬の旅先",
  months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
  bestSeasonLabel: "ベストシーズン",
  stayTimeLabel: "滞在目安",
  accessLabel: "アクセス",
  mapLink: "地図を見る →",
  hotelSearch: "🏨 この辺りの宿を探す",
  shareLabel: "共有:",
  copyUrl: "URLをコピー",
  copied: "✓ コピーしました",
  visitedOnlyBtn: "訪 訪問済みのみ",
  stampbookTitle: "朱印帳 — 訪問 {n}件・{m}/47都道府県",
  feeLabel: "入場料(目安)",
  feeFree: "無料",
  feeAbout: "約¥{n}",
  feeRange: "¥{a}〜{b}",
  feeDisclaimer: "※ 料金は目安です。変更されることがあります。",
  budgetLabel: "💴 現地費用の目安(1人): {range}",
  budgetNote: "宿・食事・入場料の合計。交通費は含みません。",
  starAdd: "☆ 行きたいリストに追加",
  starAdded: "⭐ 行きたいリストに追加済み",
  visitedYes: "訪 訪問済み",
  visitedNo: "○ まだ行っていない",
  memoLabel: "わたしのメモ",
  memoPlaceholder: "気になること、食べたいもの、泊まりたい宿…",
  nearbyHeading: "あわせて行きたい",
  inCoursesHeading: "このスポットを含むコース",
  daysUnit: "{n}日間",
  dayLabel: "{n}日目",
  backToCourses: "← コース一覧へ戻る",
  confirmRemove: "メモも消えます。行きたいリストから外しますか?",
  importError: "読み込めませんでした。書き出したJSONファイルを選んでください。",
  importNone: "有効なスポットが見つかりませんでした。",
  importDone: "{n}件を読み込みました。",
  exportFilename: "たびそめ-行きたいリスト.json",
  photoCredit: "写真: {a} ({l}) / {s}",
  feedbackLink: "📝 ご意見・感想はこちら",
  footerText: "全47都道府県から選んだ{n}件のスポットとモデルコースの手引き。写真は Wikimedia Commons のものを使用し、各写真にクレジットを表示しています。アクセス状況の把握に Google Analytics を使用しています。",
  ariaClose: "閉じる",
  ariaStar: "{name}を行きたいリストに追加/削除",
  ariaCardOpen: "{name}の詳細を見る",
  ariaDotShow: "{name}の写真を表示",
  ariaCaption: "表示中の写真のスポットを開く",
};
const LANGS = { ja: null, en: LANG_EN, zh: LANG_ZH, ko: LANG_KO };
let currentLang = localStorage.getItem("travel-spots-lang");
if (!Object.prototype.hasOwnProperty.call(LANGS, currentLang)) currentLang = "ja";

function langData() { return LANGS[currentLang]; }
function t(key, params) {
  const d = langData();
  let s = (d && d.ui && d.ui[key] !== undefined) ? d.ui[key] : JA_UI[key];
  if (params) for (const [k, v] of Object.entries(params)) s = s.replaceAll(`{${k}}`, v);
  return s;
}
function spotText(spot, field) {
  const d = langData();
  return (d && d.spots[spot.id] && d.spots[spot.id][field]) || spot[field];
}
function regionLabel(region) {
  const d = langData();
  return (d && d.regions[region]) || region;
}
function prefLabel(pref) {
  const d = langData();
  return (d && d.prefectures[pref]) || pref;
}
function catLabel(category) {
  const d = langData();
  return (d && d.categories[category]) || category;
}
// コースの area は「中国・四国」のような複合表記なので分割して地域名を引く
function areaLabel(area) {
  return area.split("・").map((part) => regionLabel(part)).join(currentLang === "ja" ? "・" : " / ");
}
function courseText(course, field) {
  const d = langData();
  const c = d && d.courses[course.id];
  return (c && c[field]) || course[field];
}
function courseNote(course, dayIdx, stepIdx) {
  const d = langData();
  const c = d && d.courses[course.id];
  return (c && c.notes && c.notes[dayIdx] && c.notes[dayIdx][stepIdx]) ||
    course.itinerary[dayIdx].steps[stepIdx].note;
}

let searchText = "";
let selectedRegion = "";
let selectedPrefecture = "";
let selectedCategories = new Set();
let wishlistOnly = false;
let visitedOnly = false;
let sortMode = "added";
let lastViewHash = ""; // モーダルを閉じたときに戻る先("" / #courses / #course/xx)

const spotById = {};
SPOTS.forEach((spot) => { spotById[spot.id] = spot; });

// 地方→都道府県の対応(スポット出現順)。SPOTS は不変なので起動時に一度だけ導出する
const PREFS_BY_REGION = {};
REGIONS.forEach((region) => { PREFS_BY_REGION[region] = []; });
SPOTS.forEach((spot) => {
  const prefs = PREFS_BY_REGION[spot.region];
  if (prefs && !prefs.includes(spot.prefecture)) prefs.push(spot.prefecture);
});

// ---- 行きたいリスト(v2: id をキーにしたオブジェクト) ----
let wishlist = {};
try {
  wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY) || "{}") || {};
} catch (e) { /* 壊れていたら空から始める(アプリ全体を道連れにしない) */ }

// ---- 訪問済み(id → true。行きたいリストとは独立) ----
let visitedIds = {};
try {
  visitedIds = JSON.parse(localStorage.getItem(VISITED_KEY) || "{}") || {};
} catch (e) { /* 壊れていたら空から始める */ }

// 旧形式(リストのエントリ内に visited を持つ)からの移行
{
  let migrated = false;
  for (const [id, entry] of Object.entries(wishlist)) {
    if (entry && entry.visited !== undefined) {
      if (entry.visited) visitedIds[id] = true;
      delete entry.visited;
      migrated = true;
    }
  }
  if (migrated) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    localStorage.setItem(VISITED_KEY, JSON.stringify(visitedIds));
  }
}

// 旧形式(名前の配列)からの移行。改名したスポットは旧名→id の対応表で救う
const RENAMED_SPOTS = { "阿蘇": "aso-daikanbo" };
const oldData = localStorage.getItem(OLD_WISHLIST_KEY);
if (oldData) {
  try {
    JSON.parse(oldData).forEach((name) => {
      const spot = SPOTS.find((s) => s.name === name) || spotById[RENAMED_SPOTS[name]];
      if (spot && !wishlist[spot.id]) {
        wishlist[spot.id] = { added: today(), memo: "" };
      }
    });
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    localStorage.removeItem(OLD_WISHLIST_KEY); // 移行に成功したときだけ旧データを消す
  } catch (e) { /* 壊れた旧データは残しておく */ }
}

function today() {
  return new Date().toISOString().slice(0, 10);
}
function saveWishlist() {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  document.getElementById("wishlist-count").textContent = Object.keys(wishlist).length;
}
function saveVisited() {
  localStorage.setItem(VISITED_KEY, JSON.stringify(visitedIds));
}

// ---- 朱印帳(行きたいリスト表示中の制覇サマリー)----
// 訪問済みスポットの件数と、訪問済みのある都道府県を8地方のグリッドで点灯させる。
// 描画の起点は applyFilters に一本化(言語切替・フィルタ・ウィッシュリスト変更のすべてが通る)
function renderStampbook() {
  const box = document.getElementById("stampbook");
  if (!wishlistOnly) { box.hidden = true; return; }
  const visitedSpots = SPOTS.filter((s) => visitedIds[s.id]);
  const visitedPrefs = new Set(visitedSpots.map((s) => s.prefecture));
  box.hidden = false;
  box.innerHTML = "";
  const heading = document.createElement("p");
  heading.className = "stampbook-title";
  heading.textContent = t("stampbookTitle", { n: visitedSpots.length, m: visitedPrefs.size });
  box.appendChild(heading);
  REGIONS.forEach((region) => {
    const row = document.createElement("div");
    row.className = "stampbook-row";
    const label = document.createElement("span");
    label.className = "stampbook-region";
    label.textContent = regionLabel(region);
    row.appendChild(label);
    PREFS_BY_REGION[region].forEach((pref) => {
      const chip = document.createElement("span");
      chip.className = "stampbook-pref" + (visitedPrefs.has(pref) ? " on" : "");
      chip.textContent = prefLabel(pref);
      row.appendChild(chip);
    });
    box.appendChild(row);
  });
}
function ensureEntry(id) {
  if (!wishlist[id]) wishlist[id] = { added: today(), memo: "" };
  return wishlist[id];
}

// ---- DOM 参照 ----
const searchBox = document.getElementById("search-box");
const prefectureSelect = document.getElementById("prefecture-select");
const regionTabs = document.getElementById("region-tabs");
const categoryChips = document.getElementById("category-chips");
const wishlistToggle = document.getElementById("wishlist-toggle");
const wishlistTools = document.getElementById("wishlist-tools");
const visitedOnlyBtn = document.getElementById("visited-only");
const sortSelect = document.getElementById("sort-select");
const resultCount = document.getElementById("result-count");
const cardsEl = document.getElementById("cards");
const emptyMessage = document.getElementById("empty-message");
const spotControls = document.getElementById("spot-controls");
const coursesView = document.getElementById("courses-view");
const courseListEl = document.getElementById("course-list");
const courseDetailEl = document.getElementById("course-detail");
const tabSpots = document.getElementById("tab-spots");
const tabCourses = document.getElementById("tab-courses");
const dialog = document.getElementById("spot-dialog");

// ---- 写真まわり ----
function photoUrl(spot, width) {
  return "https://commons.wikimedia.org/wiki/Special:FilePath/" +
    encodeURIComponent(spot.photo.file) + "?width=" + width;
}
function photoPageUrl(spot) {
  return "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(spot.photo.file);
}
// ライセンス表記(例 "CC BY-SA 4.0" / "CC0" / "Public domain")を条文ページのURLへ。
// 未知の表記は null を返し、呼び出し側でリンクせず素のテキストにフォールバックする。
function licenseUrl(license) {
  if (license === "CC0") return "https://creativecommons.org/publicdomain/zero/1.0/";
  if (license === "Public domain") return "https://creativecommons.org/publicdomain/mark/1.0/";
  const m = license.match(/^CC (BY(?:-SA)?) ([\d.]+)( \w+)?$/);
  if (!m) return null;
  const type = m[1].toLowerCase();               // "by" / "by-sa"
  const port = m[3] ? m[3].trim() + "/" : "";    // ポート版(例 "jp/")
  return "https://creativecommons.org/licenses/" + type + "/" + m[2] + "/" + port;
}
// 写真クレジットを組み立てて <span> で返す。ローカライズ済みテンプレートを
// {a}=作者 / {l}=ライセンス条文リンク / {s}=出典(Wikimedia Commons)リンク に展開する。
// HTML はリンクの入れ子ができないため、要素ごとに分けて組む。
function buildCredit(spot) {
  const span = document.createElement("span");
  const tmpl = t("photoCredit", { a: "\x00a\x00", l: "\x00l\x00", s: "\x00s\x00" });
  tmpl.split(/\x00([als])\x00/).forEach((part, i) => {
    if (i % 2 === 0) {
      if (part) span.appendChild(document.createTextNode(part));
      return;
    }
    if (part === "a") {
      span.appendChild(document.createTextNode(spot.photo.author));
    } else if (part === "l") {
      const url = licenseUrl(spot.photo.license);
      if (url) {
        span.appendChild(creditLink(url, spot.photo.license));
      } else {
        span.appendChild(document.createTextNode(spot.photo.license));
      }
    } else if (part === "s") {
      span.appendChild(creditLink(photoPageUrl(spot), "Wikimedia Commons"));
    }
  });
  return span;
}
// クレジット内リンク。カード内で押してもスポットモーダルが開かないよう伝播を止める。
function creditLink(href, text) {
  const a = document.createElement("a");
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener";
  a.textContent = text;
  a.addEventListener("click", (e) => e.stopPropagation());
  return a;
}
function mapUrl(spot) {
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(spot.mapQuery);
}
// 宿検索リンク。config.js の楽天アフィリエイトID が設定されていれば楽天トラベル検索(アフィリエイト)、
// 未設定なら従来どおり Google のホテル検索へフォールバックする
function hotelSearchUrl(spot) {
  if (typeof rakutenTravelSearch === "function") {
    const rakuten = rakutenTravelSearch(spot.prefecture + " " + spot.name);
    if (rakuten) return rakuten;
  }
  return "https://www.google.com/travel/search?q=" + encodeURIComponent(spot.mapQuery + " ホテル");
}
// 楽天アフィリエイトが有効か(=宿リンクがアフィリエイトリンクか)。開示表示の出し分けに使う
function affiliateActive() {
  return typeof RAKUTEN_AFFILIATE_ID !== "undefined" && !!RAKUTEN_AFFILIATE_ID;
}
// 「無料」と扱う fee の形はここだけで判定する(免責文の出し分けも同じ判定を使う)
function isFreeFee(spot) {
  return spot.fee === 0;
}
// 入場料(目安)の表示文字列。無料 / 数値=約¥n / [min,max]=¥a〜b / 未設定=null
function formatFee(spot) {
  const fee = spot.fee;
  if (isFreeFee(spot)) return t("feeFree");
  if (typeof fee === "number") return t("feeAbout", { n: fee.toLocaleString() });
  if (Array.isArray(fee)) return t("feeRange", { a: fee[0].toLocaleString(), b: fee[1].toLocaleString() });
  return null;
}
// コースの現地費用レンジ(交通費除く)。宿×(泊数)+食事×日数+入場料合計を[min,max]で返す
function budgetRange(course) {
  const b = course.budget;
  if (!b) return null;
  const nights = course.days - 1;
  return [
    b.hotelPerNight[0] * nights + b.foodPerDay[0] * course.days + b.tickets,
    b.hotelPerNight[1] * nights + b.foodPerDay[1] * course.days + b.tickets,
  ];
}
function formatBudget(course) {
  const range = budgetRange(course);
  if (!range) return null;
  // レンジの区切りは入場料と同じ feeRange テンプレートで言語ごとに揃える
  return t("budgetLabel", { range: t("feeRange", { a: range[0].toLocaleString(), b: range[1].toLocaleString() }) });
}
// コース費用の目安の <p> を組み立てる(budget が無いコースは null)。一覧と詳細で共用
function buildBudgetLine(course) {
  const budgetText = formatBudget(course);
  if (!budgetText) return null;
  const budget = document.createElement("p");
  budget.className = "course-budget";
  budget.textContent = budgetText;
  return budget;
}
// シェア行(X / LINE / URLコピー)を組み立てて返す
function buildShareRow(url, text, itemId) {
  const row = document.createElement("div");
  row.className = "share-row";
  const label = document.createElement("span");
  label.textContent = t("shareLabel");
  row.appendChild(label);

  // 外部リンクの作法(target/rel/伝播停止)は creditLink に集約し、ここでは見た目と計測だけ足す
  function addShareLink(href, label, method) {
    const a = creditLink(href, label);
    a.className = "share-btn";
    a.addEventListener("click", () => track("share", { method, item_id: itemId }));
    row.appendChild(a);
  }
  addShareLink("https://twitter.com/intent/tweet?url=" + encodeURIComponent(url) +
    "&text=" + encodeURIComponent(text), "X", "x");
  addShareLink("https://social-plugins.line.me/lineit/share?url=" + encodeURIComponent(url), "LINE", "line");

  const copyBtn = document.createElement("button");
  copyBtn.className = "share-btn";
  copyBtn.textContent = t("copyUrl");
  copyBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    track("share", { method: "copy", item_id: itemId });
    const done = () => {
      copyBtn.textContent = t("copied");
      setTimeout(() => { copyBtn.textContent = t("copyUrl"); }, 1500);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(done).catch(() => prompt("URL", url));
    else prompt("URL", url);
  });
  row.appendChild(copyBtn);
  return row;
}
// スポット/コースの共有用URL(ハッシュ込みの正規形)。
// file:// で開くと origin が文字列 "null" になるため、その場合は canonical の公開URLを使う
function shareUrl(hash) {
  if (location.protocol === "file:") {
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) return canonical.href + hash;
  }
  return location.origin + location.pathname + hash;
}

// スポット詳細を開く。モーダル内からの遷移は履歴エントリを積み替える
// (積むと、閉じたあとブラウザの「戻る」で古い #spot/ に当たってモーダルが復活してしまう)
function gotoSpot(id) {
  if (dialog.open) {
    history.replaceState(null, "", location.pathname + location.search + "#spot/" + id);
    openSpot(id);
  } else {
    location.hash = "spot/" + id;
  }
}

// 写真ボックス(img + 失敗時のプレースホルダー + クレジット)を container に組み立てる
function fillPhotoBox(container, spot, width) {
  container.querySelectorAll("img, .photo-placeholder, .photo-credit").forEach((el) => el.remove());
  const colors = REGION_COLORS[spot.region];
  // 読み込み中も灰色ベタにならないよう、写真の背後に常に地域色を敷く
  container.style.background = `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;
  const placeholder = document.createElement("div");
  placeholder.className = "photo-placeholder";
  placeholder.style.background = `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;
  placeholder.textContent = spot.name.charAt(0);
  if (spot.photo.file) {
    const img = document.createElement("img");
    img.src = photoUrl(spot, width);
    img.alt = spot.name;
    img.loading = "lazy";
    img.decoding = "async"; // デコードでメインスレッドを止めない
    img.addEventListener("error", () => {
      img.remove();
      container.prepend(placeholder);
    });
    container.prepend(img);
    const credit = buildCredit(spot);
    credit.className = "photo-credit";
    container.appendChild(credit);
  } else {
    container.prepend(placeholder);
  }
}

// ---- フィルターUIの生成 ----
["", ...REGIONS].forEach((region) => {
  const btn = document.createElement("button");
  btn.dataset.region = region; // 言語切替時の再ラベル用
  btn.textContent = region === "" ? t("allLabel") : regionLabel(region);
  if (region === selectedRegion) btn.classList.add("active");
  btn.addEventListener("click", () => {
    selectedRegion = region;
    selectedPrefecture = "";
    regionTabs.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    updatePrefectureOptions();
    applyFilters();
  });
  regionTabs.appendChild(btn);
});

CATEGORIES.forEach((category) => {
  const btn = document.createElement("button");
  btn.textContent = catLabel(category);
  btn.dataset.cat = category;
  btn.addEventListener("click", () => {
    if (selectedCategories.has(category)) {
      selectedCategories.delete(category);
      btn.classList.remove("active");
    } else {
      selectedCategories.add(category);
      btn.classList.add("active");
    }
    applyFilters();
  });
  categoryChips.appendChild(btn);
});

function updatePrefectureOptions() {
  const prefectures = [];
  SPOTS.forEach((spot) => {
    if (selectedRegion !== "" && spot.region !== selectedRegion) return;
    if (!prefectures.includes(spot.prefecture)) prefectures.push(spot.prefecture);
  });
  prefectureSelect.innerHTML = "";
  const allOption = document.createElement("option");
  allOption.value = "";
  allOption.textContent = t("prefAll");
  prefectureSelect.appendChild(allOption);
  prefectures.forEach((pref) => {
    const option = document.createElement("option");
    option.value = pref;
    option.textContent = prefLabel(pref);
    prefectureSelect.appendChild(option);
  });
  prefectureSelect.value = selectedPrefecture;
}

let searchTimer = null;
searchBox.addEventListener("input", () => {
  clearTimeout(searchTimer); // 1文字ごとに103枚を再描画しないよう少し待つ
  searchTimer = setTimeout(() => {
    searchText = searchBox.value.trim();
    applyFilters();
  }, 150);
});
prefectureSelect.addEventListener("change", () => {
  selectedPrefecture = prefectureSelect.value;
  applyFilters();
});
wishlistToggle.addEventListener("click", () => {
  wishlistOnly = !wishlistOnly;
  if (!wishlistOnly) setVisitedOnly(false); // リストを閉じたら訪問済み絞り込みも解除
  wishlistToggle.classList.toggle("active", wishlistOnly);
  wishlistTools.hidden = !wishlistOnly;
  applyFilters();
});
sortSelect.addEventListener("change", () => {
  sortMode = sortSelect.value;
  applyFilters();
});
// visitedOnly はフラグとボタンの active クラスを常にここで揃える
function setVisitedOnly(on) {
  visitedOnly = on;
  visitedOnlyBtn.classList.toggle("active", on);
}
visitedOnlyBtn.addEventListener("click", () => {
  setVisitedOnly(!visitedOnly);
  applyFilters();
});

// 0件のときの「条件をクリア」: すべての絞り込みを外して初期状態に戻す
document.getElementById("clear-filters").addEventListener("click", () => {
  searchText = "";
  searchBox.value = "";
  selectedRegion = "";
  selectedPrefecture = "";
  selectedCategories.clear();
  wishlistOnly = false;
  setVisitedOnly(false);
  wishlistToggle.classList.remove("active");
  wishlistTools.hidden = true;
  regionTabs.querySelectorAll("button").forEach((b, i) => b.classList.toggle("active", i === 0));
  categoryChips.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
  updatePrefectureOptions();
  applyFilters();
});

// ---- 書き出し / 読み込み ----
document.getElementById("export-btn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify({ version: 3, wishlist, visited: visitedIds }, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = t("exportFilename");
  a.click();
  URL.revokeObjectURL(a.href);
});
const importFile = document.getElementById("import-file");
document.getElementById("import-btn").addEventListener("click", () => importFile.click());
importFile.addEventListener("change", () => {
  const file = importFile.files[0];
  if (!file) return;
  file.text().then((text) => {
    let data;
    try { data = JSON.parse(text); } catch (e) {
      alert(t("importError"));
      return;
    }
    const entries = data.wishlist || data; // 素のオブジェクトも受け付ける
    const imported = {};
    const importedVisited = {};
    for (const [id, entry] of Object.entries(entries)) {
      if (!spotById[id] || !entry || typeof entry !== "object") continue; // typeof null も "object" なので !entry が必要
      imported[id] = {
        added: entry.added || today(),
        memo: String(entry.memo || ""),
      };
      if (entry.visited) importedVisited[id] = true; // 旧形式(version 2)はエントリ内に visited を持つ
    }
    for (const id of Object.keys(data.visited || {})) {
      if (spotById[id] && data.visited[id]) importedVisited[id] = true;
    }
    const count = new Set([...Object.keys(imported), ...Object.keys(importedVisited)]).size;
    if (count === 0) {
      alert(t("importNone"));
      return;
    }
    wishlist = imported;
    visitedIds = importedVisited;
    saveWishlist();
    saveVisited();
    applyFilters();
    alert(t("importDone", { n: count }));
  });
  importFile.value = "";
});

// ---- スポット一覧 ----
function applyFilters() {
  let filtered = SPOTS.filter((spot) => {
    if (selectedRegion !== "" && spot.region !== selectedRegion) return false;
    if (selectedPrefecture !== "" && spot.prefecture !== selectedPrefecture) return false;
    if (selectedCategories.size > 0 && ![...selectedCategories].every((c) => spot.categories.includes(c))) return false;
    // 「訪問済みのみ」はリスト未登録の訪問済みスポットも出す(朱印帳の件数と一致させる)
    if (wishlistOnly && !visitedOnly && !wishlist[spot.id]) return false;
    if (visitedOnly && !visitedIds[spot.id]) return false;
    if (searchText !== "") {
      // 表示中の言語の訳語でも検索できるよう、原文+訳文を対象にする
      let haystack = spot.name + spot.description + spot.prefecture;
      const tr = langData() && langData().spots[spot.id];
      if (tr) haystack += (tr.name || "") + (tr.description || "") + prefLabel(spot.prefecture);
      if (!haystack.toLowerCase().includes(searchText.toLowerCase())) return false;
    }
    return true;
  });

  if (wishlistOnly && sortMode === "added") {
    filtered = [...filtered].sort((a, b) =>
      ((wishlist[a.id]?.added || "") + a.name).localeCompare((wishlist[b.id]?.added || "") + b.name));
  } // 地方順はデータの並び(地方ごと)のまま

  cardsEl.innerHTML = "";
  // 絞り込みなしのときだけ、各地方の先頭スポットを2列幅の「地域の顔」カードにする
  const noFilter = selectedRegion === "" && selectedPrefecture === "" &&
    selectedCategories.size === 0 && !wishlistOnly && searchText === "";
  const seenRegion = new Set();
  filtered.forEach((spot) => {
    const card = buildCard(spot);
    if (noFilter && !seenRegion.has(spot.region)) {
      seenRegion.add(spot.region);
      card.classList.add("card-wide");
    }
    cardsEl.appendChild(card);
  });
  resultCount.textContent = t("resultCount", { n: filtered.length, total: SPOTS.length });
  emptyMessage.hidden = filtered.length !== 0;
  renderStampbook();
}

function buildCard(spot) {
  const card = document.createElement("div");
  card.className = "card";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", t("ariaCardOpen", { name: spotText(spot, "name") }));

  const photoBox = document.createElement("div");
  photoBox.className = "card-photo";
  fillPhotoBox(photoBox, spot, 480);

  const starBtn = document.createElement("button");
  starBtn.className = "star-btn";
  starBtn.textContent = "⭐";
  const starLabel = t("ariaStar", { name: spotText(spot, "name") });
  starBtn.title = starLabel;
  starBtn.setAttribute("aria-label", starLabel);
  starBtn.classList.toggle("on", !!wishlist[spot.id]);
  starBtn.setAttribute("aria-pressed", !!wishlist[spot.id]);
  starBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleStar(spot.id);
    starBtn.classList.toggle("on", !!wishlist[spot.id]);
    starBtn.setAttribute("aria-pressed", !!wishlist[spot.id]);
    if (wishlistOnly) applyFilters();
  });
  photoBox.appendChild(starBtn);

  if (visitedIds[spot.id]) {
    const stamp = document.createElement("span");
    stamp.className = "visited-stamp";
    stamp.textContent = "訪";
    stamp.title = "訪問済み";
    photoBox.appendChild(stamp);
  }

  const body = document.createElement("div");
  body.className = "card-body";
  const title = document.createElement("h2");
  title.textContent = spotText(spot, "name");
  const place = document.createElement("div");
  place.className = "card-place";
  place.textContent = `${regionLabel(spot.region)}|${prefLabel(spot.prefecture)}`;
  const tags = buildTags(spot);
  const desc = document.createElement("p");
  desc.className = "card-desc";
  desc.textContent = spotText(spot, "description");

  const foot = document.createElement("div");
  foot.className = "card-foot";
  const season = document.createElement("span");
  season.textContent = `${t("bestSeasonLabel")}: ${spotText(spot, "bestSeason")}`;
  const mapLink = buildMapLink(spot);
  foot.appendChild(season);
  foot.appendChild(mapLink);

  // スポット名と県名は写真の上に重ねる(可読性はCSSのスクリムで確保)
  const overlay = document.createElement("div");
  overlay.className = "card-overlay";
  overlay.appendChild(place);
  overlay.appendChild(title);
  photoBox.appendChild(overlay);

  body.appendChild(tags);
  body.appendChild(desc);
  body.appendChild(foot);
  card.appendChild(photoBox);
  card.appendChild(body);

  card.addEventListener("click", (e) => {
    if (e.target.closest("a, .star-btn")) return; // 内側のリンク・ボタンはカードを開かない
    gotoSpot(spot.id);
  });
  card.addEventListener("keydown", (e) => {
    if (e.target !== card) return; // 内側の⭐やリンクのキーボード操作を奪わない
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      gotoSpot(spot.id);
    }
  });
  return card;
}

function buildTags(spot) {
  const tags = document.createElement("div");
  tags.className = "tags";
  spot.categories.forEach((category) => {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.dataset.cat = category; // 色分けとフィルタの内部値は日本語のまま
    tag.textContent = catLabel(category);
    tags.appendChild(tag);
  });
  return tags;
}

function buildMapLink(spot) {
  const link = document.createElement("a");
  link.className = "map-link";
  link.textContent = t("mapLink");
  link.href = mapUrl(spot);
  link.target = "_blank";
  link.rel = "noopener";
  link.addEventListener("click", (e) => e.stopPropagation());
  return link;
}

function toggleStar(id) {
  const entry = wishlist[id];
  if (entry) {
    if (entry.memo && !confirm(t("confirmRemove"))) return;
    delete wishlist[id];
  } else {
    ensureEntry(id);
    const spot = spotById[id];
    if (spot) track("add_to_wishlist", { spot_name: spot.name, prefecture: spot.prefecture });
  }
  saveWishlist();
}

// ---- スポット詳細モーダル ----
const dialogPhoto = document.getElementById("dialog-photo");
const dialogStar = document.getElementById("dialog-star");
const dialogVisited = document.getElementById("dialog-visited");
const memoInput = document.getElementById("memo-input");
let dialogSpotId = null;

function openSpot(id) {
  const spot = spotById[id];
  if (!spot) return;
  dialogSpotId = id;
  // まずカードで使った480px(キャッシュ済み)を出し、高解像度はデコード完了後に差し替える
  // (モーダルを開いた瞬間に大きな画像のデコードが走ってカクつくのを防ぐ)
  fillPhotoBox(dialogPhoto, spot, 480);
  if (spot.photo.file) {
    const hi = new Image();
    hi.src = photoUrl(spot, 1024);
    const swap = () => {
      const img = dialogPhoto.querySelector("img");
      if (dialog.open && dialogSpotId === id && img) img.src = hi.src;
    };
    if (hi.decode) hi.decode().then(swap).catch(() => {});
    else hi.onload = swap;
  }
  document.getElementById("dialog-title").textContent = spotText(spot, "name");
  document.getElementById("dialog-place").textContent = `${regionLabel(spot.region)}|${prefLabel(spot.prefecture)}`;
  const tagsEl = document.getElementById("dialog-tags");
  tagsEl.innerHTML = "";
  buildTags(spot).querySelectorAll("span").forEach((tag) => tagsEl.appendChild(tag));
  document.getElementById("dialog-desc").textContent = spotText(spot, "description");

  const info = document.getElementById("dialog-info");
  info.innerHTML = "";
  const feeText = formatFee(spot);
  [
    [t("bestSeasonLabel"), spotText(spot, "bestSeason")],
    [t("stayTimeLabel"), spotText(spot, "stayTime")],
    [t("accessLabel"), spotText(spot, "access")],
    ...(feeText ? [[t("feeLabel"), feeText]] : []),
  ].forEach(([label, value]) => {
    const cell = document.createElement("div");
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = value;
    cell.appendChild(dt);
    cell.appendChild(dd);
    info.appendChild(cell);
  });

  document.getElementById("fee-disclaimer").hidden = !feeText || isFreeFee(spot);
  document.getElementById("dialog-map").href = mapUrl(spot);
  document.getElementById("dialog-hotel").href = hotelSearchUrl(spot);
  document.getElementById("dialog-affiliate-note").hidden = !affiliateActive();
  const shareBox = document.getElementById("dialog-share");
  shareBox.innerHTML = "";
  shareBox.appendChild(buildShareRow(shareUrl("#spot/" + encodeURIComponent(id)), spotText(spot, "name") + " — " + t("docTitle"), id));
  refreshDialogButtons();
  memoInput.value = wishlist[id]?.memo || "";

  // あわせて行きたい(周辺スポット)
  const nearbyList = document.getElementById("nearby-list");
  nearbyList.innerHTML = "";
  const nearbySpots = (spot.nearby || []).map((nid) => spotById[nid]).filter(Boolean);
  document.getElementById("nearby-heading").hidden = nearbySpots.length === 0;
  nearbySpots.forEach((n) => {
    const btn = document.createElement("button");
    const name = document.createElement("span");
    name.textContent = spotText(n, "name");
    const pref = document.createElement("span");
    pref.className = "pref";
    pref.textContent = prefLabel(n.prefecture);
    btn.appendChild(name);
    btn.appendChild(pref);
    btn.addEventListener("click", () => { gotoSpot(n.id); });
    nearbyList.appendChild(btn);
  });

  // このスポットを含むコース
  const inCourses = document.getElementById("in-courses");
  inCourses.innerHTML = "";
  const related = COURSES.filter((c) => c.itinerary.some((d) => d.steps.some((s) => s.spotId === id)));
  document.getElementById("courses-heading").hidden = related.length === 0;
  related.forEach((course) => {
    const btn = document.createElement("button");
    btn.textContent = courseText(course, "title");
    btn.addEventListener("click", () => { location.hash = "course/" + course.id; });
    inCourses.appendChild(btn);
  });

  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
}

function refreshDialogButtons() {
  const entry = wishlist[dialogSpotId];
  dialogStar.textContent = entry ? t("starAdded") : t("starAdd");
  dialogStar.classList.toggle("on", !!entry);
  dialogVisited.textContent = visitedIds[dialogSpotId] ? t("visitedYes") : t("visitedNo");
  dialogVisited.classList.toggle("on", !!visitedIds[dialogSpotId]);
}

// モーダル内の変更は閉じるときにまとめて一覧へ反映する(毎回103枚を再描画しない)
let cardsStale = false;

dialogStar.addEventListener("click", () => {
  toggleStar(dialogSpotId);
  memoInput.value = wishlist[dialogSpotId]?.memo || "";
  refreshDialogButtons();
  cardsStale = true;
});
document.getElementById("feedback-link").addEventListener("click", () => track("feedback_click"));
document.getElementById("dialog-hotel").addEventListener("click", () => {
  const spot = spotById[dialogSpotId];
  if (spot) track("hotel_search_click", { spot_name: spot.name }); // 収益導線のクリック計測
});
dialogVisited.addEventListener("click", () => {
  // 訪問記録は行きたいリストとは独立(リストには追加しない)
  if (visitedIds[dialogSpotId]) delete visitedIds[dialogSpotId];
  else visitedIds[dialogSpotId] = true;
  saveVisited();
  refreshDialogButtons();
  cardsStale = true;
});
memoInput.addEventListener("change", () => {
  const text = memoInput.value.trim();
  if (text === "" && !wishlist[dialogSpotId]) return;
  const entry = ensureEntry(dialogSpotId); // メモを書いたらリストにも追加
  entry.memo = text;
  saveWishlist();
  refreshDialogButtons();
  cardsStale = true;
});

document.getElementById("dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) dialog.close(); // 背景クリックで閉じる
});
dialog.addEventListener("close", () => {
  dialogSpotId = null;
  if (location.hash.startsWith("#spot/")) {
    history.replaceState(null, "", location.pathname + location.search + lastViewHash);
  }
  if (cardsStale) {
    applyFilters();
    cardsStale = false;
  }
});

// ---- モデルコース ----
function renderCourseList() {
  courseListEl.innerHTML = "";
  COURSES.forEach((course) => {
    // クレジットのリンクを含められるよう、スポットカードと同じ div+role=button 方式
    const card = document.createElement("div");
    card.className = "course-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", t("ariaCardOpen", { name: courseText(course, "title") }));

    // 1日目の最初のスポットの写真をコースの顔にする
    const photoBox = document.createElement("div");
    photoBox.className = "course-photo";
    const firstSpot = spotById[course.itinerary[0]?.steps[0]?.spotId];
    if (firstSpot) fillPhotoBox(photoBox, firstSpot, 480);

    const body = document.createElement("div");
    body.className = "course-body";
    const meta = document.createElement("div");
    meta.className = "course-meta";
    const area = document.createElement("span");
    area.textContent = areaLabel(course.area);
    const days = document.createElement("span");
    days.className = "days";
    days.textContent = t("daysUnit", { n: course.days });
    meta.appendChild(area);
    meta.appendChild(days);
    const title = document.createElement("h2");
    title.textContent = courseText(course, "title");
    const summary = document.createElement("p");
    summary.textContent = courseText(course, "summary");
    // コース名も写真の上に重ねて、スポットカードと表現を揃える
    const overlay = document.createElement("div");
    overlay.className = "card-overlay";
    overlay.appendChild(title);
    photoBox.appendChild(overlay);
    body.appendChild(meta);
    body.appendChild(summary);
    const budgetLine = buildBudgetLine(course);
    if (budgetLine) body.appendChild(budgetLine);
    card.appendChild(photoBox);
    card.appendChild(body);

    card.addEventListener("click", (e) => {
      if (e.target.closest("a")) return; // クレジットのリンクはコースを開かない
      location.hash = "course/" + course.id;
    });
    card.addEventListener("keydown", (e) => {
      if (e.target !== card) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        location.hash = "course/" + course.id;
      }
    });
    courseListEl.appendChild(card);
  });
}

function renderCourseDetail(course) {
  courseDetailEl.innerHTML = "";
  const back = document.createElement("button");
  back.className = "back-btn";
  back.textContent = t("backToCourses");
  back.addEventListener("click", () => { location.hash = "courses"; });
  const meta = document.createElement("div");
  meta.className = "course-meta";
  meta.innerHTML = `<span>${areaLabel(course.area)}</span><span class="days">${t("daysUnit", { n: course.days })}</span>`;
  const title = document.createElement("h2");
  title.textContent = courseText(course, "title");
  const summary = document.createElement("p");
  summary.className = "course-summary";
  summary.textContent = courseText(course, "summary");
  courseDetailEl.appendChild(back);
  courseDetailEl.appendChild(meta);
  courseDetailEl.appendChild(title);
  courseDetailEl.appendChild(summary);
  const budgetLine = buildBudgetLine(course);
  if (budgetLine) {
    const budgetNote = document.createElement("p");
    budgetNote.className = "course-budget-note";
    budgetNote.textContent = t("budgetNote");
    courseDetailEl.appendChild(budgetLine);
    courseDetailEl.appendChild(budgetNote);
  }
  courseDetailEl.appendChild(buildShareRow(
    shareUrl("#course/" + encodeURIComponent(course.id)),
    courseText(course, "title") + " — " + t("docTitle"),
    course.id
  ));

  course.itinerary.forEach((dayPlan, dayIdx) => {
    const block = document.createElement("div");
    block.className = "day-block";
    const label = document.createElement("div");
    label.className = "day-label";
    label.textContent = t("dayLabel", { n: dayPlan.day });
    block.appendChild(label);
    dayPlan.steps.forEach((step, stepIdx) => {
      const spot = spotById[step.spotId];
      if (!spot) return;
      const row = document.createElement("div");
      row.className = "step";
      const spotBtn = document.createElement("button");
      spotBtn.className = "step-spot";
      const name = document.createElement("span");
      name.textContent = spotText(spot, "name");
      const pref = document.createElement("span");
      pref.className = "pref";
      pref.textContent = prefLabel(spot.prefecture);
      spotBtn.appendChild(name);
      spotBtn.appendChild(pref);
      spotBtn.addEventListener("click", () => { gotoSpot(spot.id); });
      const note = document.createElement("p");
      note.className = "step-note";
      note.textContent = courseNote(course, dayIdx, stepIdx);
      row.appendChild(spotBtn);
      row.appendChild(note);
      block.appendChild(row);
    });
    courseDetailEl.appendChild(block);
  });
}

// ---- ビュー切り替えとハッシュルーティング ----
// "" → スポット一覧 / #courses → コース一覧 / #course/<id> → コース詳細
// #spot/<id> → 現在のビューの上に詳細モーダル
tabSpots.addEventListener("click", () => { location.hash = ""; });
tabCourses.addEventListener("click", () => { location.hash = "courses"; });

function showView(view) {
  const isSpots = view === "spots";
  tabSpots.classList.toggle("active", isSpots);
  tabCourses.classList.toggle("active", !isSpots);
  spotControls.hidden = !isSpots;
  cardsEl.hidden = !isSpots;
  resultCount.hidden = !isSpots;
  // 0件メッセージはビューを行き来しても状態を保つ(コース表示中だけ隠す)
  emptyMessage.hidden = !isSpots || cardsEl.children.length !== 0;
  coursesView.hidden = isSpots;
  document.getElementById("seasonal-section").hidden = !isSpots || !seasonalHasItems;
}

// ---- アクセス解析(GA4)----
// gtag が無い環境(広告ブロッカー・オフライン等)でも壊れないよう必ずガードする
function track(name, params) {
  if (typeof gtag === "function") gtag("event", name, params);
}
// 表示中の画面を page_view として送る。タイトルは言語に依らず日本語で統一し、
// GA4 の「ページとスクリーン」レポートでスポット別の人気がそのまま読めるようにする
let lastTrackedHash = null;
function trackRoute(hash) {
  if (hash === lastTrackedHash) return; // 言語切替などの再描画で二重計上しない
  lastTrackedHash = hash;
  let title = "スポット一覧";
  if (hash.startsWith("#spot/")) {
    const spot = spotById[decodeURIComponent(hash.slice(6))];
    if (!spot) return;
    title = "スポット: " + spot.name;
  } else if (hash.startsWith("#course/")) {
    const course = COURSES.find((c) => c.id === decodeURIComponent(hash.slice(8)));
    if (!course) return;
    title = "コース: " + course.title;
  } else if (hash === "#courses") {
    title = "モデルコース一覧";
  }
  track("page_view", { page_title: title, page_location: location.href });
}

function route() {
  const hash = location.hash;
  trackRoute(hash);
  if (hash.startsWith("#spot/")) {
    openSpot(decodeURIComponent(hash.slice(6)));
    return; // ビューは変えない(lastViewHash のまま)
  }
  if (dialog.open) dialog.close();
  if (hash.startsWith("#course/")) {
    const course = COURSES.find((c) => c.id === decodeURIComponent(hash.slice(8)));
    if (course) {
      lastViewHash = hash;
      showView("courses");
      courseListEl.hidden = true;
      courseDetailEl.hidden = false;
      renderCourseDetail(course);
      return;
    }
  }
  if (hash === "#courses") {
    lastViewHash = hash;
    showView("courses");
    courseListEl.hidden = false;
    courseDetailEl.hidden = true;
    return;
  }
  lastViewHash = "";
  showView("spots");
}
window.addEventListener("hashchange", route);

// ---- 固定ナビ ----
// ヒーローが画面から出たら .view-tabs にブランド名を表示する
const heroEl = document.querySelector(".hero");
const viewTabsEl = document.querySelector(".view-tabs");
new IntersectionObserver((entries) => {
  viewTabsEl.classList.toggle("scrolled", !entries[0].isIntersecting);
}, { rootMargin: "-56px 0px 0px 0px" }).observe(heroEl);

// ---- ヒーロー・スライドショー ----
// 季節と地域のバランスで選んだ5枚を7秒ごとにクロスフェードする。
// 画面外・タブ非表示・reduced-motion では自動再生しない。
const HERO_SLIDES = ["kawaguchiko", "biei-blue-pond", "kabira-bay", "fushimi-inari", "shirakawago"];
const heroSlidesEl = document.getElementById("hero-slides");
const heroCaptionEl = document.getElementById("hero-caption");
const heroCreditEl = document.getElementById("hero-credit");
const heroDotsEl = document.getElementById("hero-dots");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let heroIndex = 0;
let heroTimer = null;
let heroVisible = true;

HERO_SLIDES.forEach((id, i) => {
  const spot = spotById[id];
  const img = document.createElement("img");
  img.src = photoUrl(spot, 1920);
  img.alt = spot.name;
  img.loading = i === 0 ? "eager" : "lazy";
  img.decoding = "async";
  img.className = "hero-slide";
  heroSlidesEl.appendChild(img);
  const dot = document.createElement("button");
  dot.className = "hero-dot";
  dot.setAttribute("aria-label", t("ariaDotShow", { name: spotText(spot, "name") }));
  dot.addEventListener("click", () => {
    const slideImg = heroSlidesEl.children[i];
    const show = () => {
      showHeroSlide(i, false);
      restartHeroTimer(); // 手動操作したら周期を仕切り直す
    };
    if (slideImg && slideImg.decode) slideImg.decode().then(show).catch(show);
    else show();
  });
  heroDotsEl.appendChild(dot);
});

function showHeroSlide(index, initial) {
  heroIndex = index;
  heroSlidesEl.querySelectorAll(".hero-slide").forEach((el, i) => el.classList.toggle("active", i === index));
  heroDotsEl.querySelectorAll(".hero-dot").forEach((el, i) => el.classList.toggle("active", i === index));
  const spot = spotById[HERO_SLIDES[index]];
  heroCaptionEl.innerHTML = "";
  const name = document.createElement("strong");
  name.textContent = spotText(spot, "name");
  const pref = document.createElement("span");
  pref.textContent = prefLabel(spot.prefecture);
  heroCaptionEl.appendChild(name);
  heroCaptionEl.appendChild(pref);
  heroCreditEl.replaceChildren(...buildCredit(spot).childNodes);
  // 時間差表示: 写真のフェードよりワンテンポ遅れてキャプションが入れ替わる
  // (初回ロード時はCSSのカスケード演出に任せる)
  if (!initial && !reducedMotion.matches) {
    heroCaptionEl.classList.remove("caption-in");
    void heroCaptionEl.offsetWidth; // リフローを挟んでアニメーションを再発火させる
    heroCaptionEl.classList.add("caption-in");
  }
}

function stopHeroTimer() {
  clearInterval(heroTimer);
  heroTimer = null;
}
function restartHeroTimer() {
  stopHeroTimer();
  if (reducedMotion.matches || document.hidden || !heroVisible) return;
  heroTimer = setInterval(() => {
    // 次の写真のデコードを済ませてからフェードする(切替時のカクつき防止)
    const next = (heroIndex + 1) % HERO_SLIDES.length;
    const img = heroSlidesEl.children[next];
    const show = () => showHeroSlide(next, false);
    if (img && img.decode) img.decode().then(show).catch(show);
    else show();
  }, 7000);
}
new IntersectionObserver((entries) => {
  heroVisible = entries[0].isIntersecting;
  restartHeroTimer();
}).observe(heroEl);
document.addEventListener("visibilitychange", restartHeroTimer);
heroCaptionEl.addEventListener("click", () => { gotoSpot(HERO_SLIDES[heroIndex]); });

// ---- いまが旬の旅先(ベストシーズンが今月のスポット) ----
let seasonalHasItems = false;

function seasonalSpots() {
  const month = new Date().getMonth() + 1;
  const matches = SPOTS.filter((spot) => {
    const s = spot.bestSeason;
    if (s.includes("通年")) return false;
    const range = s.match(/(\d+)〜(\d+)月/);
    if (range) {
      const a = +range[1], b = +range[2];
      return a <= b ? (month >= a && month <= b) : (month >= a || month <= b); // 「11〜2月」の年またぎ対応
    }
    const single = s.match(/(\d+)月/);
    return single ? +single[1] === month : false;
  });
  // 特定の地方に偏らないよう、1地方2件までで最大12件
  const perRegion = {};
  const picked = [];
  for (const spot of matches) {
    perRegion[spot.region] = (perRegion[spot.region] || 0) + 1;
    if (perRegion[spot.region] <= 2) picked.push(spot);
    if (picked.length >= 12) break;
  }
  return picked;
}

function renderSeasonal() {
  const list = seasonalSpots();
  seasonalHasItems = list.length > 0;
  if (!seasonalHasItems) return;
  document.getElementById("seasonal-month").textContent = t("months")[new Date().getMonth()];
  const strip = document.getElementById("seasonal-strip");
  strip.innerHTML = "";
  list.forEach((spot) => {
    const chip = document.createElement("div");
    chip.className = "seasonal-chip";
    chip.tabIndex = 0;
    chip.setAttribute("role", "button");
    chip.setAttribute("aria-label", t("ariaCardOpen", { name: spotText(spot, "name") }));
    fillPhotoBox(chip, spot, 480);
    const overlay = document.createElement("div");
    overlay.className = "seasonal-overlay";
    const name = document.createElement("strong");
    name.textContent = spotText(spot, "name");
    const pref = document.createElement("span");
    pref.textContent = prefLabel(spot.prefecture);
    overlay.appendChild(name);
    overlay.appendChild(pref);
    chip.appendChild(overlay);
    chip.addEventListener("click", (e) => {
      if (e.target.closest("a")) return; // クレジットのリンクはモーダルを開かない
      gotoSpot(spot.id);
    });
    chip.addEventListener("keydown", (e) => {
      if (e.target !== chip) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        gotoSpot(spot.id);
      }
    });
    strip.appendChild(chip);
  });
}

// ---- 言語の適用 ----
// 静的なUI文言(HTMLに書かれているもの)を現在の言語で貼り直す
function applyStaticTexts() {
  document.title = t("docTitle");
  document.documentElement.lang = currentLang === "zh" ? "zh-Hans" : currentLang;
  document.querySelector(".hero-eyebrow").textContent = t("eyebrow");
  document.querySelector(".hero-lead").innerHTML = t("heroLead", {
    spots: `<span id="spot-total">${t("unitSpots", { n: SPOTS.length })}</span>`,
    courses: `<span id="course-total">${t("unitCourses", { n: COURSES.length })}</span>`,
  });
  heroCaptionEl.setAttribute("aria-label", t("ariaCaption"));
  tabSpots.textContent = t("tabSpots");
  tabCourses.textContent = t("tabCourses");
  searchBox.placeholder = t("searchPlaceholder");
  regionTabs.querySelectorAll("button").forEach((btn) => {
    btn.textContent = btn.dataset.region === "" ? t("allLabel") : regionLabel(btn.dataset.region);
  });
  categoryChips.querySelectorAll("button").forEach((btn) => {
    btn.textContent = catLabel(btn.dataset.cat);
  });
  wishlistToggle.innerHTML = t("wishlistToggle", {
    n: `<span id="wishlist-count">${Object.keys(wishlist).length}</span>`,
  });
  sortSelect.options[0].textContent = t("sortAdded");
  sortSelect.options[1].textContent = t("sortRegion");
  document.getElementById("export-btn").textContent = t("exportBtn");
  document.getElementById("import-btn").textContent = t("importBtn");
  emptyMessage.childNodes[0].nodeValue = t("emptyMsg");
  document.getElementById("clear-filters").textContent = t("clearFilters");
  document.querySelector(".seasonal-heading").childNodes[0].nodeValue = t("seasonalHeading");
  document.getElementById("dialog-close").setAttribute("aria-label", t("ariaClose"));
  document.getElementById("dialog-map").textContent = t("mapLink");
  document.getElementById("dialog-hotel").textContent = t("hotelSearch");
  document.getElementById("fee-disclaimer").textContent = t("feeDisclaimer");
  visitedOnlyBtn.textContent = t("visitedOnlyBtn");
  document.querySelector(".memo-label").textContent = t("memoLabel");
  memoInput.placeholder = t("memoPlaceholder");
  document.getElementById("nearby-heading").textContent = t("nearbyHeading");
  document.getElementById("courses-heading").textContent = t("inCoursesHeading");
  document.querySelector(".site-footer p:last-child").textContent = t("footerText", { n: SPOTS.length });
  const feedbackLink = document.getElementById("feedback-link");
  feedbackLink.hidden = !FEEDBACK_URL;
  feedbackLink.href = FEEDBACK_URL;
  feedbackLink.textContent = t("feedbackLink");
}

function setLang(lang) {
  currentLang = Object.prototype.hasOwnProperty.call(LANGS, lang) ? lang : "ja";
  localStorage.setItem("travel-spots-lang", currentLang);
  langSelect.value = currentLang;
  applyStaticTexts();
  updatePrefectureOptions();
  applyFilters();
  renderCourseList();
  renderSeasonal();
  showHeroSlide(heroIndex, true); // キャプションとクレジットを現在の言語で描き直す
  if (dialog.open && dialogSpotId) openSpot(dialogSpotId);
  if (!courseDetailEl.hidden) route(); // コース詳細を開いていれば描き直す
}

const langSelect = document.getElementById("lang-select");
langSelect.value = currentLang;
langSelect.addEventListener("change", () => {
  setLang(langSelect.value);
  track("language_change", { language: currentLang });
});

// ---- 初期化 ----
saveWishlist();
setLang(currentLang);
restartHeroTimer();
route();
