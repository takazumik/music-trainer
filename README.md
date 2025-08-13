# Music Trainer (Scale & Chord Trainer)

音楽理論を学習するためのNext.jsベースのWebアプリケーションです。鍵盤楽器のシミュレーション、MIDI入力サポート、スケール・コード練習機能を提供します。

## 機能

- 🎹 **バーチャルピアノキーボード**: マウスクリックまたはPCキーボードで演奏可能
- 🎵 **MIDI入力サポート**: 外部MIDIデバイスからの入力対応
- 🎼 **音楽理論ツール**: スケール・コード練習機能
- 🔊 **リアルタイム音声**: Tone.jsを使用した高品質な音声合成
- 📱 **レスポンシブデザイン**: デスクトップ・モバイル対応

## 技術スタック

- **フレームワーク**: Next.js 15.4.6 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v4
- **音声エンジン**: Tone.js
- **音楽理論**: Tonal.js
- **デプロイ**: Vercel

## セットアップガイド

### 1. プロジェクト作成とライブラリインストール

```bash
# プロジェクト作成
npx create-next-app@latest music-trainer --typescript --tailwind --app --no-src-dir
cd music-trainer

# 必要なライブラリをインストール
npm install tone tonal
npm install -D @types/node
```

### 2. ディレクトリ構造の作成

```bash
# ディレクトリ作成
mkdir -p components/ui
mkdir -p lib
mkdir -p hooks
mkdir -p types

# 必要なファイルを作成
touch components/Keyboard.tsx
touch components/Key.tsx
touch components/ControlPanel.tsx
touch lib/musicUtils.ts
touch lib/audioEngine.ts
touch hooks/useMidi.ts
touch hooks/useKeyboard.ts
touch hooks/useAudio.ts
touch types/music.ts
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認

## PCキーボードマッピング

### 白鍵マッピング
```
Z = C3    X = D3    C = E3    V = F3
B = G3    N = A3    M = B3    , = C4
```

### 黒鍵マッピング
```
S = C#3   D = D#3   G = F#3   H = G#3   J = A#3
```

## プロジェクト構造

```
music-trainer/
├── app/                    # Next.js App Router
│   ├── globals.css        # グローバルスタイル
│   ├── layout.tsx         # ルートレイアウト
│   └── page.tsx           # メインページ
├── components/            # Reactコンポーネント
│   ├── ControlPanel.tsx   # 楽器選択・設定パネル
│   ├── Key.tsx           # 個別キーコンポーネント
│   ├── Keyboard.tsx      # キーボード全体
│   └── ui/               # UI共通コンポーネント
├── hooks/                # カスタムフック
│   ├── useAudio.ts       # 音声管理
│   ├── useKeyboard.ts    # キーボード入力
│   └── useMidi.ts        # MIDI入力
├── lib/                  # ユーティリティ
│   ├── audioEngine.ts    # 音声エンジン
│   └── musicUtils.ts     # 音楽理論ヘルパー
└── types/                # TypeScript型定義
    └── music.ts          # 音楽関連型
```

## 開発・デプロイ

### Git管理

```bash
git init
git add .
git commit -m "Initial commit: Music Trainer MVP setup"

# GitHubでリポジトリ作成後
git remote add origin https://github.com/YOUR_USERNAME/music-trainer.git
git branch -M main
git push -u origin main
```

### Vercelデプロイ

1. [Vercel](https://vercel.com)にアクセス
2. GitHubアカウントでログイン
3. "Import Git Repository"をクリック
4. 作成したリポジトリを選択
5. "Deploy"をクリック

## ライセンス

MIT License

## 開発者

Created with Claude AI Assistant
