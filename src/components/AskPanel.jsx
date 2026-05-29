import React from 'react';
import { Icon } from './Icon.jsx';
import { createVoiceRecognition, askClaude } from '../lib/voice.js';

const { useState, useEffect, useRef, useCallback } = React;

// ============================================================
// AskPanel — voice-driven Q&A grounded in the current mishnah
// ============================================================
const AskPanel = ({ mishnah, perek, onClose }) => {
  const [phase, setPhase] = useState('idle'); // idle | listening | thinking | answering | done | error
  const [interim, setInterim] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [errorCode, setErrorCode] = useState(null);
  const [inputQ, setInputQ] = useState('');
  const [showInput, setShowInput] = useState(false);
  const recRef = useRef(null);
  const cleanupRef = useRef(null);
  const answerRef = useRef(null);
  const inputRef = useRef(null);

  const hasKey = !!import.meta.env.VITE_CLAUDE_API_KEY;

  // Auto-scroll answer as it streams
  useEffect(() => {
    if (answerRef.current) {
      answerRef.current.scrollTop = answerRef.current.scrollHeight;
    }
  }, [answer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      recRef.current?.stop();
      cleanupRef.current?.();
    };
  }, []);

  const sendQuestion = useCallback(async (q) => {
    if (!q.trim()) return;
    setQuestion(q.trim());
    setPhase('thinking');
    setAnswer('');
    setErrorCode(null);

    const cleanup = await askClaude({
      question: q.trim(),
      mishnah,
      perek,
      onChunk: (text) => {
        setAnswer(prev => prev + text);
        setPhase('answering');
      },
      onDone: () => setPhase('done'),
      onError: (code) => {
        setErrorCode(code);
        setPhase('error');
      },
    });
    cleanupRef.current = cleanup;
  }, [mishnah, perek]);

  const startListening = useCallback(() => {
    recRef.current?.stop();
    setPhase('listening');
    setInterim('');
    setQuestion('');
    setAnswer('');
    setErrorCode(null);

    const rec = createVoiceRecognition({
      onInterim: (t) => setInterim(t),
      onFinal: (t) => {
        setInterim('');
        setPhase('idle');
        sendQuestion(t);
      },
      onError: (err) => {
        if (err === 'not-allowed') setErrorCode('mic-denied');
        else setErrorCode('mic-error');
        setPhase('error');
      },
      onEnd: () => {
        if (phase === 'listening') setPhase('idle');
      },
    });

    if (!rec.supported) {
      setErrorCode('not-supported');
      setPhase('error');
      return;
    }

    recRef.current = rec;
    rec.start();
  }, [sendQuestion, phase]);

  // Auto-start listening when panel opens (if key is configured or user wants to search)
  useEffect(() => {
    startListening();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const submitInput = (e) => {
    e.preventDefault();
    if (!inputQ.trim()) return;
    setShowInput(false);
    sendQuestion(inputQ);
    setInputQ('');
  };

  const reset = () => {
    cleanupRef.current?.();
    recRef.current?.stop();
    setPhase('idle');
    setQuestion('');
    setAnswer('');
    setInterim('');
    setErrorCode(null);
    setShowInput(false);
    setInputQ('');
  };

  return (
    <div className="ask-panel-back" onClick={onClose}>
      <div className="ask-panel" onClick={e => e.stopPropagation()} role="dialog" aria-label="Ask about this mishnah">

        {/* Header */}
        <div className="ask-panel-header">
          <div className="ask-panel-context">
            <span className="ask-panel-ref">{perek.num}:{mishnah.num}</span>
            <span className="ask-panel-attr">{mishnah.attribution?.en}</span>
          </div>
          <button className="ask-close" onClick={onClose} aria-label="Close">
            <Icon name="close" size={16} />
          </button>
        </div>

        {/* Listening / question / answer area */}
        <div className="ask-panel-body" ref={answerRef}>

          {/* Idle — big mic prompt */}
          {phase === 'idle' && !question && (
            <div className="ask-idle">
              <button className="ask-mic-big" onClick={startListening} aria-label="Start speaking">
                <Icon name="mic" size={28} />
              </button>
              <p className="ask-idle-prompt">Tap to ask a question about this mishnah</p>
              <button className="ask-type-link" onClick={() => { setShowInput(true); setTimeout(() => inputRef.current?.focus(), 50); }}>
                or type your question
              </button>
            </div>
          )}

          {/* Listening — animated waveform */}
          {phase === 'listening' && (
            <div className="ask-listening">
              <div className="ask-listening-ring">
                <div className="ask-listening-dot" />
              </div>
              <p className="ask-listening-label">Listening…</p>
              {interim && <p className="ask-interim">"{interim}"</p>}
              <button className="ask-stop-btn" onClick={() => { recRef.current?.stop(); setPhase('idle'); }}>
                Stop
              </button>
            </div>
          )}

          {/* Question display */}
          {question && (
            <div className="ask-question-wrap">
              <span className="ask-q-label">Your question</span>
              <p className="ask-q-text">"{question}"</p>
            </div>
          )}

          {/* Thinking */}
          {phase === 'thinking' && (
            <div className="ask-thinking">
              <span className="ask-thinking-dot" />
              <span className="ask-thinking-dot" />
              <span className="ask-thinking-dot" />
            </div>
          )}

          {/* Answer streaming */}
          {(phase === 'answering' || phase === 'done') && answer && (
            <div className={`ask-answer ${phase === 'answering' ? 'ask-answer--streaming' : ''}`}>
              <span className="ask-a-label">Answer</span>
              <div className="ask-a-text">{answer}{phase === 'answering' && <span className="ask-cursor" />}</div>
            </div>
          )}

          {/* No API key placeholder */}
          {phase === 'error' && errorCode === 'no-key' && (
            <div className="ask-no-key">
              <Icon name="sparkle" size={20} />
              <p className="ask-no-key-title">AI answers need an API key</p>
              <p className="ask-no-key-body">
                Add your Claude API key to <code>.env.local</code>:
              </p>
              <pre className="ask-no-key-code">VITE_CLAUDE_API_KEY=sk-ant-…</pre>
              <p className="ask-no-key-body">Then restart the dev server. Your question was: "{question}"</p>
            </div>
          )}

          {/* Mic denied */}
          {phase === 'error' && (errorCode === 'mic-denied' || errorCode === 'mic-error') && (
            <div className="ask-error">
              <p>Microphone access was denied. Allow microphone access in your browser and try again.</p>
            </div>
          )}

          {/* Not supported */}
          {phase === 'error' && errorCode === 'not-supported' && (
            <div className="ask-error">
              <p>Voice input isn't supported in this browser. Use the text input below.</p>
            </div>
          )}

          {/* Other API errors */}
          {phase === 'error' && errorCode === 'bad-key' && (
            <div className="ask-error">
              <p>The API key in <code>.env.local</code> was rejected. Check that it's correct and try again.</p>
            </div>
          )}

          {phase === 'error' && (errorCode === 'network' || errorCode === 'stream-error' || (errorCode && errorCode.startsWith('api-'))) && (
            <div className="ask-error">
              <p>Couldn't reach the API ({errorCode}). Check your connection and try again.</p>
            </div>
          )}

          {/* Type input (always available as fallback) */}
          {(showInput || (phase === 'error' && (errorCode === 'not-supported' || errorCode === 'mic-denied'))) && (
            <form className="ask-type-form" onSubmit={submitInput}>
              <input
                ref={inputRef}
                className="ask-type-input"
                placeholder="Type your question…"
                value={inputQ}
                onChange={e => setInputQ(e.target.value)}
              />
              <button className="ask-type-submit" type="submit" disabled={!inputQ.trim()}>
                <Icon name="arrow_right" size={16} />
              </button>
            </form>
          )}
        </div>

        {/* Footer actions */}
        <div className="ask-panel-footer">
          {(phase === 'done' || phase === 'error') && (
            <button className="ask-footer-btn ask-footer-btn--primary" onClick={startListening}>
              <Icon name="mic" size={14} /> Ask another
            </button>
          )}
          {(phase === 'done' || (phase === 'error' && errorCode !== 'no-key' && errorCode !== 'not-supported')) && !showInput && (
            <button className="ask-footer-btn" onClick={() => { setShowInput(true); setTimeout(() => inputRef.current?.focus(), 50); }}>
              <Icon name="edit" size={13} /> Type instead
            </button>
          )}
          {phase === 'done' && (
            <button className="ask-footer-btn" onClick={reset}>
              <Icon name="close" size={13} /> Clear
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

window.AskPanel = AskPanel;
export { AskPanel };
