import "./App.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useState, useEffect } from "react";

const AnotherOne: React.FC = () => {
  const [textToCopy, setTextToCopy] = useState<string>("");
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    setIsListening(true);
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  };

  const stopListening = () => {
    setIsListening(false);
    SpeechRecognition.stopListening();
  };

  const { transcript, browserSupportsSpeechRecognition, listening } =
    useSpeechRecognition();

  useEffect(() => {
    if (isListening && !listening) {
      // Restart listening if it stopped unexpectedly (e.g., on mobile)
      SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    }
  }, [listening, isListening]);

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
