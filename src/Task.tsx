import { useState, useEffect, useRef } from "react";
import "./App.css";

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance {
  start: () => void;
  stop: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

interface CustomWindow extends Window {
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
  SpeechRecognition?: SpeechRecognitionConstructor;
}

function Task() {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const recentPhrasesRef = useRef<string[]>([]); // Store last 5 phrases

  useEffect(() => {
    const SpeechRecognition =
      (window as CustomWindow).webkitSpeechRecognition ||
      (window as CustomWindow).SpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setListening(true);
      setError(null);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(`Speech recognition error: ${event.error}`);
      setListening(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        const transcript = result[0].transcript.trim();

        if (result.isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript + " ";
        }
      }

      if (finalTranscript) {
        const cleaned = cleanText(finalTranscript);

        const isDuplicate = recentPhrasesRef.current.some((phrase) =>
          arePhrasesSimilar(phrase, cleaned)
        );

        if (!isDuplicate) {
          recentPhrasesRef.current.push(cleaned);
          if (recentPhrasesRef.current.length > 5) {
            recentPhrasesRef.current.shift();
          }
          setText((prev) => (prev + " " + cleaned).trim());
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const handler = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      setError("Speech recognition not available.");
      return;
    }

    if (!listening) {
      setError(null);
      recognition.start();
      setListening(true);
    } else {
      recognition.stop();
      setListening(false);
    }
  };

  const resetHandler = () => {
    setText("");
    recentPhrasesRef.current = [];
  };

  return (
    <div>
      <h1>Audio To Text</h1>
      <button id="buttonImg" onClick={handler}>
        <img src="mic.svg" alt="Mic" id="micImg" />
      </button>
      <p>{listening ? "Listening...." : "Tap on Mic to Speak.."}</p>
      <div
        style={{ background: "#aaa", padding: "1rem", borderRadius: "20px" }}
      >
        <p id="p-text">{text}</p>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button id="reset-btn" onClick={resetHandler}>
        Reset
      </button>
    </div>
  );
}

// 🧼 Clean and normalize transcript
function cleanText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, "")
    .trim();
}

// 🤖 Smart comparison
function arePhrasesSimilar(a: string, b: string): boolean {
  const tokensA = new Set(a.split(/\s+/));
  const tokensB = new Set(b.split(/\s+/));
  const common = [...tokensA].filter((word) => tokensB.has(word));

  const ratio = common.length / Math.max(tokensA.size, tokensB.size);
  return ratio > 0.8;
}

export default Task;
