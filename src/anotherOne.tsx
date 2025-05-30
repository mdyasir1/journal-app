import "./App.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useState, useEffect } from "react";

const AnotherOne: React.FC = () => {
  const [textToCopy, setTextToCopy] = useState<string>("");
  const [shouldListen, setShouldListen] = useState<boolean>(false);

  const { transcript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const startListening = () => {
    setShouldListen(true);
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  };

  const stopListening = () => {
    setShouldListen(false);
    SpeechRecognition.stopListening();
  };

  // Auto-restart listening if it unexpectedly stops (on mobile)
  useEffect(() => {
    if (shouldListen && !listening) {
      const timeout = setTimeout(() => {
        SpeechRecognition.startListening({
          continuous: true,
          language: "en-IN",
        });
      }, 500); // delay to prevent rapid restart loops
      return () => clearTimeout(timeout);
    }
  }, [listening, shouldListen]);

  if (!browserSupportsSpeechRecognition) {
    return <p>Browser does not support speech recognition.</p>;
  }

  return (
    <div className="container">
      <h2>Speech to Text Converter</h2>
      <br />
      <p>
        A React hook that converts speech from the microphone to text and makes
        it available to your React components.
      </p>

      <div className="main-content" onClick={() => setTextToCopy(transcript)}>
        {transcript}
      </div>

      <div className="btn-style">
        <button onClick={startListening}>Start Listening</button>
        <button onClick={stopListening}>Stop Listening</button>
        <p>{textToCopy}</p>
      </div>
    </div>
  );
};

export default AnotherOne;
