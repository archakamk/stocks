import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import ChatInput from './components/chatinput'
import MessageBubble from './components/MessageBubble'
// import Spinner from './components/Spinner'
import './styles/App.css'

function App() {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0()

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showPrompt, setShowPrompt] = useState(true)
  const [sessions, setSessions] = useState<{ id: number; title: string; messages: { role: 'user' | 'bot'; text: string }[] }[]>([
    { id: 1, title: 'Session 1', messages: [] },
  ])
  const [activeSessionId, setActiveSessionId] = useState(1)
  const activeSession = sessions.find(s => s.id === activeSessionId)!

  const handleSend = (text: string) => {
    const newMessage = { role: 'user' as const, text }
    const newBotMessage = { role: 'bot' as const, text: `Echoing: ${text}` }

    setSessions(prev =>
      prev.map(session =>
        session.id === activeSessionId
          ? { ...session, messages: [...session.messages, newMessage, newBotMessage] }
          : session
      )
    )
    setShowPrompt(false)
  }

  const handleNewChat = () => {
    const newId = sessions.length + 1
    const newSession = { id: newId, title: `Session ${newId}`, messages: [] }
    setSessions(prev => [newSession, ...prev])
    setActiveSessionId(newId)
    setShowPrompt(true)
  }

  return (
    <>
      <div
        className="background-overlay"
        style={{ backgroundImage: `url('https://i.imgur.com/sft8diF.gif')` }}
      ></div>

      <div className="app-container">
        {sidebarOpen && (
          <aside className="sidebar">
            <div className="sidebar-header">
              <img
                src="/image.png"
                alt="Collapse Sidebar"
                className="sidebar-icon"
                onClick={() => setSidebarOpen(false)}
              />
              <h1 className="site-title">FinTrack</h1>
              <img
                src="/newchat.png"
                alt="New Chat"
                className="sidebar-icon"
                onClick={handleNewChat}
              />
            </div>

            <div className="history-list">
              {sessions.map(session => (
                <div
                  key={session.id}
                  className={`history-item ${session.id === activeSessionId ? 'active' : ''}`}
                  onClick={() => setActiveSessionId(session.id)}
                >
                  {session.title}
                </div>
              ))}
            </div>
          </aside>
        )}

        {!sidebarOpen && (
          <img
            src="/opensidebar.png"
            alt="Open Sidebar"
            className="open-sidebar-button"
            onClick={() => setSidebarOpen(true)}
          />
        )}

        <main className="main-panel">
          <div className="top-ui-wrapper">
            <div className="top-navbar">
              <img src="/Cropped_Image.png" className="nav-logo" alt="Logo" />
              <span className="nav-link">About</span>
              <span className="nav-link">Founders</span>
            </div>
            <div className="auth-buttons">
              {!isAuthenticated ? (
                <>
                  <span className="auth-link" onClick={() => loginWithRedirect()}>Login</span>
                  <span
                    className="auth-link"
                    onClick={() =>
                      loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })
                    }
                  >
                    Sign Up
                  </span>
                </>
              ) : (
                <span className="auth-link" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                  Log Out
                </span>
              )}
            </div>
          </div>

          {showPrompt && (
            <div className="prompt-banner">
              <h2 className="prompt-text fade-in">How can I help you?</h2>
            </div>
          )}

          <div className="chat-area">
            {activeSession.messages.map((msg, i) => (
              <MessageBubble key={i} role={msg.role} text={msg.text} />
            ))}
            {/* <Spinner /> */}
          </div>

          <div className="chat-box-wrapper">
            <ChatInput onSend={handleSend} />
          </div>
        </main>
      </div>
    </>
  )
}

export default App
