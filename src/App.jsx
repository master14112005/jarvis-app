import { useState, useRef, useEffect } from 'react'
import './App.css'

const SYSTEM_PROMPT = `Du bist J.A.R.V.I.S (Just A Rather Very Intelligent System), ein hochentwickelter KI-Assistent im Stil von Iron Man's Jarvis.
Sprich auf Deutsch, es sei denn, der Nutzer schreibt auf Englisch.
Sei präzise, intelligent und leicht förmlich — wie ein Butler-Assistent für einen Genius.
Nutze gelegentlich technische Terminologie. Antworte immer hilfreich und direkt.
Wenn du Websuche-Ergebnisse hast, integriere die Informationen nahtlos in deine Antwort.
Halte dich kurz aber vollständig. Formatiere lange Antworten mit Zeilenumbrüchen.`

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: 'jarvis',
      text: 'Guten Tag. Ich bin J.A.R.V.I.S — Just A Rather Very Intelligent System.\n\nIch bin online und einsatzbereit. Meine Web-Suchfunktion ist aktiv — ich kann aktuelle Informationen aus dem Internet abrufen.\n\nWas kann ich für Sie tun?',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [queryCount, setQueryCount] = useState(0)
  const [history, setHistory] = useState([])
  const chatRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages, loading])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    const userMsg = { role: 'user', text }
    setMessages(prev => [...prev, userMsg])

    const newHistory = [...history, { role: 'user', content: text }]
    setHistory(newHistory)
    setLoading(true)

    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: SYSTEM_PROMPT,
          messages: newHistory,
        }),
      })

      const data = await resp.json()

      if (data.error) throw new Error(data.error)

      const reply = data.content
        ?.filter(b => b.type === 'text')
        .map(b => b.text)
        .join('\n')
        .trim() || 'Anfrage verarbeitet.'

      setMessages(prev => [...prev, { role: 'jarvis', text: reply }])
      setHistory(prev => [...prev, { role: 'assistant', content: reply }])
      setQueryCount(prev => prev + 1)
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'jarvis', text: 'Verbindungsfehler zur KI-Engine. Bitte erneut versuchen.' },
      ])
    }

    setLoading(false)
    inputRef.current?.focus()
  }

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const now = new Date()
  const timeStr = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return (
    <div className="shell">
      {/* Scanline overlay */}
      <div className="scanlines" aria-hidden="true" />

      {/* Header */}
      <header className="hud-header">
        <div className="logo">J.A.R.V.I.S</div>
        <div className="header-right">
          <Clock />
          <div className="status-badge">
            <span className="status-dot" />
            ONLINE
          </div>
        </div>
      </header>

      {/* Stats bar */}
      <div className="stats-bar">
        <div className="stat">
          <span className="stat-label">MODELL</span>
          <span className="stat-value">SONNET 4</span>
        </div>
        <div className="stat">
          <span className="stat-label">ANFRAGEN</span>
          <span className="stat-value">{queryCount}</span>
        </div>
        <div className="stat">
          <span className="stat-label">WEB-SUCHE</span>
          <span className="stat-value green">AKTIV</span>
        </div>
        <div className="stat">
          <span className="stat-label">KONTEXT</span>
          <span className="stat-value">{history.length} MSG</span>
        </div>
      </div>

      {/* Chat area */}
      <main className="chat-area" ref={chatRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.role}`}>
            <div className="msg-label">
              {msg.role === 'user' ? '◎ BENUTZER' : '◈ J.A.R.V.I.S'}
            </div>
            <div className="msg-bubble">
              {msg.text.split('\n').map((line, j) => (
                <span key={j}>
                  {line}
                  {j < msg.text.split('\n').length - 1 && <br />}
                </span>
              ))}
            </div>
          </div>
        ))}

        {loading && (
          <div className="msg jarvis">
            <div className="msg-label">◈ J.A.R.V.I.S</div>
            <div className="msg-bubble typing">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        )}
      </main>

      {/* Suggested prompts (only if no conversation yet) */}
      {queryCount === 0 && (
        <div className="suggestions">
          {['Aktuelle KI-News heute', 'Wetter in Köln', 'Was ist Quantencomputing?'].map(s => (
            <button key={s} className="suggestion-chip" onClick={() => { setInput(s); inputRef.current?.focus() }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <footer className="input-row">
        <span className="input-prefix">▶</span>
        <textarea
          ref={inputRef}
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Befehl oder Frage eingeben… (Enter zum Senden)"
          rows={1}
          disabled={loading}
        />
        <button className="send-btn" onClick={send} disabled={loading || !input.trim()}>
          {loading ? '...' : 'SENDEN'}
        </button>
      </footer>
    </div>
  )
}

function Clock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('de-DE'))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return <span className="clock">{time}</span>
}
