// モデルコース(旅程例)のデータ。spotId は spots.js の id を参照する。
const COURSES = [
  {
    id: "kanazawa-hida-2n3d",
    title: "金沢・白川郷・飛騨高山 2泊3日",
    area: "中部", days: 3,
    summary: "北陸新幹線で金沢入りし、世界遺産の合掌集落を経て飛騨の城下町へ。加賀百万石の文化と山里の原風景を一度に味わう王道ルート。",
    itinerary: [
      { day: 1, steps: [
        { spotId: "kenrokuen", note: "午前は兼六園とひがし茶屋街、昼は近江町市場で海鮮を" },
        { spotId: "chirihama", note: "夕方はレンタカーで砂浜ドライブ、金沢泊" },
      ]},
      { day: 2, steps: [
        { spotId: "shirakawago", note: "午前のうちに展望台へ。集落をゆっくり散策" },
        { spotId: "ainokura", note: "帰り道に立ち寄り。静かな合掌集落を独り占め、高山泊" },
      ]},
      { day: 3, steps: [
        { spotId: "takayama", note: "宮川朝市から古い町並へ。飛騨牛にぎりで締め" },
      ]},
    ],
  },
  {
    id: "kyoto-nara-2n3d",
    title: "京都・奈良 王道めぐり 2泊3日",
    area: "近畿", days: 3,
    summary: "千本鳥居に金閣、嵐山の竹林、そして奈良の大仏と鹿。初めての関西旅行ならまずこのコース。どの季節でも外さない。",
    itinerary: [
      { day: 1, steps: [
        { spotId: "fushimi-inari", note: "朝イチで千本鳥居へ(混雑回避)" },
      ]},
      { day: 2, steps: [
        { spotId: "kinkakuji", note: "開門直後の静かな金閣を" },
        { spotId: "arashiyama", note: "午後は渡月橋と竹林、川沿いのカフェでひと休み" },
      ]},
      { day: 3, steps: [
        { spotId: "nara-park", note: "近鉄で奈良へ。大仏殿と鹿せんべい体験" },
      ]},
    ],
  },
  {
    id: "hokkaido-2n3d",
    title: "札幌・小樽・登別 2泊3日",
    area: "北海道", days: 3,
    summary: "海鮮とレトロな港町、そして地獄谷の名湯。初めての北海道を凝縮した定番コース。冬は雪景色、夏は爽やかな気候が待っている。",
    itinerary: [
      { day: 1, steps: [
        { spotId: "sapporo-nijo-market", note: "到着したらまず海鮮丼。午後は大通公園を散歩、札幌泊" },
      ]},
      { day: 2, steps: [
        { spotId: "otaru-canal", note: "JRで小樽へ。硝子工房とお寿司、夕暮れの運河まで" },
      ]},
      { day: 3, steps: [
        { spotId: "noboribetsu-onsen", note: "地獄谷を散策してから名湯で締めくくり" },
      ]},
    ],
  },
  {
    id: "setouchi-2n3d",
    title: "広島・しまなみ・道後 2泊3日",
    area: "中国・四国", days: 3,
    summary: "宮島の大鳥居から尾道の坂道、島々を渡るサイクリング、そして日本最古級の湯へ。瀬戸内の光と多島美を浴びる3日間。",
    itinerary: [
      { day: 1, steps: [
        { spotId: "genbaku-dome", note: "平和記念公園で祈りを" },
        { spotId: "itsukushima", note: "午後は宮島へ渡り、干潮・満潮両方の大鳥居を。広島泊" },
      ]},
      { day: 2, steps: [
        { spotId: "onomichi", note: "千光寺からの眺めと尾道ラーメン" },
        { spotId: "shimanami-kaido", note: "レンタサイクルで島へ。亀老山の夕景は必見、今治泊" },
      ]},
      { day: 3, steps: [
        { spotId: "dogo-onsen", note: "松山へ移動して本館の湯と商店街散策" },
      ]},
    ],
  },
  {
    id: "kyushu-onsen-2n3d",
    title: "九州 温泉と大自然 2泊3日",
    area: "九州・沖縄", days: 3,
    summary: "別府の地獄、由布院の朝霧、黒川の露天、阿蘇の大草原、高千穂の神話峡谷。九州の「湯と火の国」を縦断する濃厚ルート。",
    itinerary: [
      { day: 1, steps: [
        { spotId: "beppu-jigoku", note: "海地獄と血の池地獄を中心に" },
        { spotId: "yufuin-onsen", note: "夕方は湯の坪街道と金鱗湖、由布院泊" },
      ]},
      { day: 2, steps: [
        { spotId: "kurokawa-onsen", note: "入湯手形で露天めぐり" },
        { spotId: "aso-daikanbo", note: "カルデラを一望してあか牛丼、阿蘇泊" },
      ]},
      { day: 3, steps: [
        { spotId: "takachiho-gorge", note: "ボートで真名井の滝へ" },
      ]},
    ],
  },
  {
    id: "tohoku-2n3d",
    title: "みちのく情緒 2泊3日",
    area: "東北", days: 3,
    summary: "日本三景の松島、山寺の石段、大正ロマンの銀山温泉、武家屋敷の角館。新幹線でめぐる、しっとりと美しい東北の旅。",
    itinerary: [
      { day: 1, steps: [
        { spotId: "matsushima", note: "遊覧船と牡蠣ランチ、仙台泊" },
      ]},
      { day: 2, steps: [
        { spotId: "yamadera", note: "午前中に1015段に挑戦" },
        { spotId: "ginzan-onsen", note: "夕暮れのガス灯の温泉街へ、銀山温泉泊" },
      ]},
      { day: 3, steps: [
        { spotId: "kakunodate", note: "新幹線で角館へ。武家屋敷通りを着物散策" },
      ]},
    ],
  },
  {
    id: "fuji-hakone-1n2d",
    title: "富士山ぐるり 1泊2日",
    area: "中部・関東", days: 2,
    summary: "河口湖の逆さ富士、忍野の湧水、芦ノ湖の海賊船、熱海の湯。週末にさっと行ける、富士山を全方位から愛でる小旅行。",
    itinerary: [
      { day: 1, steps: [
        { spotId: "kawaguchiko", note: "大石公園から富士と湖のパノラマ" },
        { spotId: "oshino-hakkai", note: "湧水の里を散策、河口湖温泉泊" },
      ]},
      { day: 2, steps: [
        { spotId: "hakone-ashinoko", note: "海賊船と箱根神社の湖上鳥居" },
        { spotId: "atami-onsen", note: "締めは熱海で湯と食べ歩き" },
      ]},
    ],
  },
  {
    id: "okinawa-3n4d",
    title: "沖縄 本島と八重山 3泊4日",
    area: "九州・沖縄", days: 4,
    summary: "ジンベエザメに会い、古宇利ブルーの海を渡り、飛行機で八重山へ。赤瓦の集落と遠浅の海で何もしない贅沢を味わう島旅。",
    itinerary: [
      { day: 1, steps: [
        { spotId: "churaumi", note: "午後の給餌タイムを狙って、本部泊" },
      ]},
      { day: 2, steps: [
        { spotId: "kouri-island", note: "古宇利大橋を渡って絶景カフェ。夕方の便で石垣へ" },
      ]},
      { day: 3, steps: [
        { spotId: "taketomi-island", note: "水牛車とコンドイビーチで島時間、石垣泊" },
      ]},
      { day: 4, steps: [
        { spotId: "taketomi-island", note: "朝の静かな集落をもう一度散歩してから帰路へ" },
      ]},
    ],
  },
  {
    id: "sanin-2n3d",
    title: "山陰 出雲・松江・鳥取 2泊3日",
    area: "中国", days: 3,
    summary: "縁結びの出雲大社から国宝松江城、美肌の玉造温泉とラドンの三朝温泉をはしごして、最後は鳥取砂丘へ。神話と名湯の山陰路。",
    itinerary: [
      { day: 1, steps: [
        { spotId: "izumo-taisha", note: "二礼四拍手一礼でご縁祈願。門前でそばを" },
        { spotId: "tamatsukuri-onsen", note: "美肌の湯と川沿いの足湯めぐり、玉造泊" },
      ]},
      { day: 2, steps: [
        { spotId: "matsue-castle", note: "国宝天守と堀川めぐりの小舟" },
        { spotId: "adachi-museum", note: "額縁のような日本庭園をゆっくり鑑賞" },
        { spotId: "misasa-onsen", note: "レトロな温泉街へ移動して三朝泊" },
      ]},
      { day: 3, steps: [
        { spotId: "tottori-sakyu", note: "朝の砂丘は風紋がいちばん美しい" },
      ]},
    ],
  },
  {
    id: "hokuriku-2n3d",
    title: "北陸ぐるり 金沢・能登・福井 2泊3日",
    area: "中部", days: 3,
    summary: "近江町市場の海鮮とひがし茶屋街、砂浜を走る千里浜、海の温泉・和倉。締めは永平寺の静寂と東尋坊の断崖。北陸の名所を一筆書きでめぐる。",
    itinerary: [
      { day: 1, steps: [
        { spotId: "omicho-market", note: "昼は市場で海鮮丼" },
        { spotId: "higashi-chaya", note: "午後は茶屋街を着物散歩、金沢泊" },
      ]},
      { day: 2, steps: [
        { spotId: "chirihama", note: "レンタカーで波打ち際をドライブ" },
        { spotId: "wakura-onsen", note: "七尾湾を望む海の温泉で和倉泊" },
      ]},
      { day: 3, steps: [
        { spotId: "eiheiji", note: "杉木立の中の七堂伽藍で座禅体験も" },
        { spotId: "tojinbo", note: "夕暮れの断崖で旅を締めくくる" },
      ]},
    ],
  },
  {
    id: "shikoku-3n4d",
    title: "四国ぐるり周遊 3泊4日",
    area: "四国", days: 4,
    summary: "こんぴら参りに鳴門の渦潮、祖谷の秘境、道後の湯。うどんもカツオも阿波おどりも、四国のいいとこ取りをぐるり一周。",
    itinerary: [
      { day: 1, steps: [
        { spotId: "ritsurin", note: "高松入りしてまず名園を散策。昼は讃岐うどん" },
        { spotId: "kotohiragu", note: "785段の石段を上ってこんぴら参り、琴平泊" },
      ]},
      { day: 2, steps: [
        { spotId: "naruto-whirlpools", note: "潮見表で大潮の時間を確認して渦の道へ" },
        { spotId: "awaodori-kaikan", note: "夜の公演で一緒に踊る、徳島泊" },
      ]},
      { day: 3, steps: [
        { spotId: "oboke-koboke", note: "遊覧船で渓谷美を堪能" },
        { spotId: "iya-kazurabashi", note: "スリル満点のかずら橋を渡って祖谷泊" },
      ]},
      { day: 4, steps: [
        { spotId: "matsuyama-castle", note: "松山へ移動してリフトで本丸へ" },
        { spotId: "dogo-onsen", note: "旅の締めは3000年の名湯" },
      ]},
    ],
  },
  {
    id: "furano-biei-1n2d",
    title: "旭川・美瑛・富良野 1泊2日",
    area: "北海道", days: 2,
    summary: "行動展示の旭山動物園から、青い池とラベンダー畑へ。夏の北海道のハイライトを凝縮した週末旅。レンタカーがおすすめ。",
    itinerary: [
      { day: 1, steps: [
        { spotId: "asahiyama-zoo", note: "午前中に人気のもぐもぐタイムを" },
        { spotId: "biei-blue-pond", note: "午後の光で青さが際立つ、美瑛泊" },
      ]},
      { day: 2, steps: [
        { spotId: "furano-farm-tomita", note: "朝いちばんのラベンダー畑とメロンで締め" },
      ]},
    ],
  },
  {
    id: "minami-kyushu-2n3d",
    title: "南九州 桜島・指宿・霧島・日南 2泊3日",
    area: "九州・沖縄", days: 3,
    summary: "噴煙を上げる桜島、砂に埋まる指宿、神話の霧島神宮から日南海岸の鵜戸神宮へ。火山と神話と温泉、九州の南端をめぐる旅。",
    itinerary: [
      { day: 1, steps: [
        { spotId: "sakurajima", note: "フェリーで渡って湯之平展望所へ" },
        { spotId: "ibusuki-onsen", note: "夕方の砂むしで汗を流して指宿泊" },
      ]},
      { day: 2, steps: [
        { spotId: "kirishima-jingu", note: "朱塗りの社殿と杉並木で森林浴" },
        { spotId: "ebino-kogen", note: "池めぐりの散策路を歩いて霧島泊" },
      ]},
      { day: 3, steps: [
        { spotId: "udo-jingu", note: "洞窟の本殿と運玉投げ" },
        { spotId: "aoshima", note: "鬼の洗濯板を見ながら日南海岸ドライブ" },
      ]},
    ],
  },
];
// コースを追加するときも、上のオブジェクトをひとつコピーして書き換えるだけでOK。
