# CIELO — Gallery Content Management

作品を追加するだけでサイトに自動反映されます。

---

## フォルダ構造

```
gallery/
  01_composition-in-depth/     ← フォルダ名の先頭番号が sort_order になります
    image.jpg                   ← メイン画像 (jpg / png / webp / avif)
    meta.json                   ← 作品メタデータ (任意)
    description.md              ← 詳細テキスト (任意)

  02_horizon-study/
    image.webp
    meta.json

  03_surface-and-light/
    image.jpg
    meta.json
```

---

## meta.json 仕様

```json
{
  "title":       "Composition in Depth No. 3",
  "series":      "Lumière Series",
  "edition":     "I of III",
  "status":      "available",
  "city":        "Tokyo",
  "year":        2024,
  "featured":    true,
  "sort_order":  10,
  "description": "カスタム説明文 (設定するとseries/edition等は無視されます)"
}
```

| フィールド    | 型        | 必須 | 説明                                      |
|-------------|-----------|------|-------------------------------------------|
| `title`     | string    | —    | 未設定時はフォルダ名から自動生成            |
| `series`    | string    | —    | シリーズ名                                |
| `edition`   | string    | —    | エディション (例: "I of III")             |
| `status`    | string    | —    | `available` / `sold` / `private`         |
| `city`      | string    | —    | 制作都市                                  |
| `year`      | number    | —    | 制作年                                    |
| `featured`  | boolean   | —    | true でヒーロースライダーに表示           |
| `sort_order`| number    | —    | 未設定時はフォルダ番号 × 10              |
| `description`| string   | —    | 設定するとほかのフィールドを上書き        |

---

## description.md

長い説明文が必要な場合、`meta.json` の代わりに `description.md` を使えます。  
最初の非空行が `description` として使用されます。

---

## 作品追加・更新の手順

```bash
# 1. gallery/ にフォルダと画像を追加
mkdir gallery/04_new-work
cp my-image.jpg gallery/04_new-work/image.jpg
cp my-meta.json gallery/04_new-work/meta.json

# 2. 同期実行
npm run sync-gallery

# 3. 確認のみ (アップロードなし)
npm run sync-gallery -- --dry-run

# 4. 強制再アップロード
npm run sync-gallery -- --force
```

---

## 重複防止の仕組み

- ストレージファイル名: `{slug}--{md5ハッシュ}.{ext}`
- 同じファイルは再アップロードされません
- メタデータのみ変更した場合は DB だけ更新されます
- `--force` フラグで強制再アップロードできます

---

## Hero スライダーへの表示

`meta.json` に `"featured": true` を設定した作品が、  
ヒーローセクションのスライドショーに表示されます。

---

*CIELO. The space completed.*
