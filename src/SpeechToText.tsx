import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

function SpeechToText() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn’t support speech recognition.</span>;
  }
  const handler = () => {
    if (!listening) {
      continuouslyListen();
    } else {
      SpeechRecognition.stopListening();
    }
  };
  const continuouslyListen = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });
  };
  return (
    <div>
      <h1>Speech to Text</h1>
      <button id="buttonImg" onClick={handler}>
        <img src="mic.svg" alt="Mic" id="micImg" />
      </button>
      <p>{listening ? "Listening..." : "Tap on mic to Speak"}</p>
      <p id="p-text">{transcript}</p>
      <button id="reset-btn" onClick={resetTranscript}>
        Reset
      </button>
    </div>
  );
}
export default SpeechToText;
