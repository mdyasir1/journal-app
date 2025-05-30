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

function AudioToText() {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const lastFinalTranscriptRef = useRef("");
  const lastProcessedIndexRef = useRef(-1);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognition =
      (window as Window).webkitSpeechRecognition ||
      (window as Window).SpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      setError(
        "Speech Recognition is not supported in this browser. Try using Chrome on desktop or Android."
      );
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
        if (i <= lastProcessedIndexRef.current) continue;

        const result = event.results[i];
        const transcript = result[0].transcript.trim();

        if (result.isFinal) {
          if (!lastFinalTranscriptRef.current.endsWith(transcript + " ")) {
            finalTranscript += transcript + " ";
            lastProcessedIndexRef.current = i;
          }
        } else {
          interimTranscript += transcript + " ";
        }
      }

      if (finalTranscript) {
        lastFinalTranscriptRef.current += finalTranscript;
        setText(lastFinalTranscriptRef.current);
      } else {
        setText(lastFinalTranscriptRef.current + interimTranscript);
      }
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
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    if (!listening) {
      setError(null);
      recognition.start();
    } else {
      recognition.stop();
    }
  };

  const resetHandler = () => {
    setText("");
    lastFinalTranscriptRef.current = "";
    lastProcessedIndexRef.current = -1;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const downloadText = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "transcript.txt";
    link.click();
  };

  return (
    <div className="container">
      <h1>Audio To Text</h1>

      {!supported ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <button id="buttonImg" onClick={handler}>
            <img src="mic.svg" alt="Mic" id="micImg" />
          </button>
          <p>{listening ? "Listening..." : "Tap on Mic to Speak.."}</p>
          <textarea id="p-text" value={text} readOnly rows={8} />

          {error && <p className="error">{error}</p>}

          <div className="btn-group">
            <button className="reset-btn" onClick={resetHandler}>
              Reset
            </button>
            {/* Optional: Uncomment to enable these */}
            <button className="reset-btn" onClick={copyToClipboard}>Copy</button>
            <button className="reset-btn" onClick={downloadText}>Download</button>
          </div>
        </>
      )}
    </div>
  );
}

export default AudioToText;
