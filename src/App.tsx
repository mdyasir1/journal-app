import "./App.css";
import AudioToText from "./AudioToText";
import AudioToTextMobile from "./mobile/AudioToTextMobile";
import { useMediaQuery } from "usehooks-ts";
function App() {
  const matches = useMediaQuery("(min-width: 962px)");
  if (!matches) {
    return <AudioToTextMobile />;
  }
  return (
    <>
      <AudioToText />
    </>
  );
}

export default App;
