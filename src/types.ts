export interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
  }
  
  export interface SpeechRecognitionResult {
    isFinal: boolean;
    length: number;
    [index: number]: SpeechRecognitionAlternative;
  }
  
  export interface SpeechRecognitionResultList {
    length: number;
    [index: number]: SpeechRecognitionResult;
  }
  
  export interface SpeechRecognitionEvent {
    resultIndex: number;
    results: SpeechRecognitionResultList;
  }
  
  export interface SpeechRecognitionErrorEvent {
    error: string;
    message: string;
  }
  
  export interface SpeechRecognitionInstance {
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
  
  export interface SpeechRecognitionConstructor {
    new (): SpeechRecognitionInstance;
  }
  
  export interface Window {
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
    SpeechRecognition?: SpeechRecognitionConstructor;
  }