import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

function AudioToText() {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const handler = () => {
    if (!listening) {
      SpeechRecognition.startListening({
        continuous: true,
      });
    }
    SpeechRecognition.stopListening();
  };
  return (
    <div className="flex flex-col items-center gap-3 justify-center">
      <h1 className="text-3xl font-bold">Audio To Text for Desktop</h1>
      <div
        className="bg-[#d9dbf4aa] rounded-full w-16 h-16 flex justify-center items-center"
        onClick={handler}
      >
        <img src="mic.svg" alt="mic" className="w-18 h-8" />
      </div>
      <p>{listening ? "Listening...." : "Tap on Mic to Speak.."}</p>

      <p className="w-[800px] h-[200px] bg-[#d9dbf4aa] rounded-3xl p-3 text-base font-bold text-black">
        {transcript}
      </p>
      <button className="border-[#d9dbf4aa]" onClick={resetTranscript}>
        Reset
      </button>
    </div>
  );
}

export default AudioToText;
