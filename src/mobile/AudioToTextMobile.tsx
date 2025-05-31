import { useEffect, useRef, useState } from "react";
import { SpeechRecognitionErrorEvent, SpeechRecognitionEvent, SpeechRecognitionInstance, Window } from "../types";

function AudioToTextMobile(){
    const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

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
    setText("");
  };

  return (
    <div className="flex flex-col items-center gap-3 justify-center">
      <h1 className="text-3xl font-bold">Audio To Text for Mobile</h1>
      <button
        id="buttonImg"
        onClick={handler}
        className="bg-[#d9dbf4aa] rounded-full w-16 h-16"
      >
        <img src="mic.svg" alt="Mic" id="micImg" className="" />
      </button>
      <p>{listening ? "Listening...." : "Tap on Mic to Speak.."}</p>
      <p className="w-[800px] h-[200px] bg-[#d9dbf4aa] rounded-3xl p-3 text-base font-bold text-black">
        {text}
      </p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button className="border-[#d9dbf4aa]" onClick={resetHandler}>
        Reset
      </button>
    </div>
  );
}
export default AudioToTextMobile;