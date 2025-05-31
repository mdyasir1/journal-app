import { useEffect, useRef, useState } from "react";
import {
  SpeechRecognitionErrorEvent,
  SpeechRecognitionEvent,
  SpeechRecognitionInstance,
  Window,
} from "../types";

function AudioToTextMobile() {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const [chunks, setChunks] = useState<string[]>([]); // Add this line
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    if (!listening && text) {
      setChunks((prevChunks) => [...prevChunks, text]);
      setText("");
    }
  }, [listening, text]);

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
        const transcript = result[0].transcript;
        if (result.isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      setText(finalTranscript || interimTranscript);
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
    setChunks([""]);
  };

  return (
    <div className="flex flex-col items-center gap-3 justify-center">
      {/* <pre>{JSON.stringify({ listening, text, chunks }, null, 2)}</pre> */}
      <h1 className="text-xl font-bold">Audio To Text</h1>
      <p className="w-[300px] h-[400px] overflow-auto bg-[#d9dbf4aa] rounded-3xl p-3 text-base font-bold text-black">
        {chunks?.join(" ")}
        {listening && text}
      </p>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="mt-10 flex flex-col items-center gap-3 justify-center">
        {chunks && (
          <button className="border-[#d9dbf4aa] mb" onClick={resetHandler}>
            Reset
          </button>
        )}
        <button
          id="buttonImg"
          onClick={handler}
          className="bg-[#d9dbf4aa] rounded-full w-16 h-16"
        >
          <img src="mic.svg" alt="Mic" id="micImg" className="" />
        </button>
      </div>
      <p>{listening ? "Listening...." : "Tap on Mic to Speak.."}</p>
    </div>
  );
}
export default AudioToTextMobile;
