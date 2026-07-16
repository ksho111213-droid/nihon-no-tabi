# 日本の旅 — 国内旅行おすすめスポット

全47都道府県から選んだ観光スポットとモデルコースをまとめた、静的サイトです。

- 🗾 全47都道府県・203スポット、モデルコース13本
- 🌏 4言語対応(日本語 / English / 简体中文 / 한국어)
- ⭐ 行きたいリスト・訪問メモ(localStorage 保存、書き出し/読み込み対応)
- ビルド・依存関係なし。`index.html` を開くだけで動く純粋な静的サイト

## 公開ページ

https://ksho111213-droid.github.io/nihon-no-tabi/

## ローカルで見る

```bash
npx serve .
```
を実行し、表示された URL を開く。

## 構成

`index.html` が `style.css` と各 JS を順に読み込む:

- `spots.js` — スポットデータ(203件)
- `courses.js` — モデルコース(13本、`spotId` で相互参照)
- `lang-en.js` / `lang-zh.js` / `lang-ko.js` — 各言語の翻訳辞書
- `main.js` — 表示ロジック・ハッシュルーティング・フィルタ・行きたいリスト

## 写真について

写真は [Wikimedia Commons](https://commons.wikimedia.org/) のものを使用し、各写真に撮影者・ライセンスのクレジットを表示しています。画像は Wikimedia の `Special:FilePath` から直接読み込んでいます。

## 料金・費用について

サイト内の入場料やコース費用は**目安**です(変更される場合があります)。正確な料金は各施設の公式情報をご確認ください。
