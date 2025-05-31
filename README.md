# 🎤 Audio To Text Web App

A responsive web application that converts **spoken audio into text** using the **Web Speech API** and the **React Speech Recognition** library. Optimized separately for **mobile** and **desktop** users, the app offers an intuitive voice-to-text experience.

---

## 🚀 Features

- 🔊 **Voice-to-Text** transcription powered by the browser's speech recognition capabilities.
- 📱 Mobile and 💻 Desktop optimized interfaces.
- 🛠️ Graceful fallback with informative error handling for unsupported browsers.
- ✨ Real-time speech recognition with interim and final results (on supported devices).
- 🎨 Clean and responsive UI built with **Tailwind CSS**.
- 🔄 Reset button to clear text and start fresh.

---

## 📂 Project Structure

```bash
├── public/
│   └── mic.svg                # Microphone icon
├── src/
│   ├── App.tsx                # Entry point - decides between mobile and desktop
│   ├── AudioToText.tsx        # Desktop-specific component using react-speech-recognition
│   ├── mobile/
│   │   └── AudioToTextMobile.tsx  # Mobile-specific component using native Web Speech API
│   ├── types.ts               # TypeScript type definitions
│   └── App.css                # Custom styles (mostly handled by Tailwind)
├── package.json
└── README.md
```
