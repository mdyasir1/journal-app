import { useState, useEffect, useRef } from "react";
import "./App.css";

function Task() {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const recentPhrasesRef = useRef<string[]>([]); // To store recent final phrases

  useEffect(() => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

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

    recognition.onerror = (event: any) => {
      setError(`Speech recognition error: ${event.error}`);
      setListening(false);
    };

    recognition.onresult = (event: any) => {
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

      // Handle final results
      if (finalTranscript) {
        const cleaned = cleanText(finalTranscript);

        // If it's not similar to recent final ones, keep it
        const isDuplicate = recentPhrasesRef.current.some((phrase) =>
          arePhrasesSimilar(phrase, cleaned)
        );

        if (!isDuplicate) {
          recentPhrasesRef.current.push(cleaned);
          if (recentPhrasesRef.current.length > 5)
            recentPhrasesRef.current.shift(); // Keep last 5 only
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
function cleanText(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, "")
    .trim();
}

// 🤖 Smart comparison
function arePhrasesSimilar(a: string, b: string) {
  const tokensA = new Set(a.split(/\s+/));
  const tokensB = new Set(b.split(/\s+/));
  const common = [...tokensA].filter((word) => tokensB.has(word));

  const ratio = common.length / Math.max(tokensA.size, tokensB.size);
  return ratio > 0.8; // Consider similar if >80% words match
}

export default Task;
