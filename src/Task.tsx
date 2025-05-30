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
  message: string;
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

interface Window {
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
  SpeechRecognition?: SpeechRecognitionConstructor;
}

function Task() {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const lastFinalTranscriptRef = useRef("");

  useEffect(() => {
    const SpeechRecognition =
      (window as Window).webkitSpeechRecognition ||
      (window as Window).SpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition() as SpeechRecognitionInstance;
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

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript.trim();
        if (result.isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript + " ";
        }
      }

      setText((prev) => {
        if (finalTranscript) {
          // Only add finalTranscript if it's different from last one
          if (finalTranscript !== lastFinalTranscriptRef.current) {
            lastFinalTranscriptRef.current = finalTranscript;
            return prev + finalTranscript;
          }
          return prev;
        }
        // Show interim transcript temporarily without saving duplicates
        return interimTranscript ? prev + interimTranscript : prev;
      });
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(`Speech recognition error: ${event.error}`);
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const handler = () => {
    const recognition = recognitionRef.current;

    if (!recognition) {
      setError("Speech recognition is not supported in this browser");
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
    lastFinalTranscriptRef.current = "";
  };

  return (
    <div>
      <h1>Audio To Text</h1>
      <button id="buttonImg" onClick={handler}>
        <img src="mic.svg" alt="Mic" id="micImg" />
      </button>
      <p>{listening ? "Listening...." : "Tap on Mic to Speak.."}</p>
      <p id="p-text">{text}</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button id="reset-btn" onClick={resetHandler}>
        Reset
      </button>
    </div>
  );
}

export default Task;
