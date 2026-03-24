export default function Header() {
  return (
    <header
      className="px-4 py-8 text-center"
      style={{ borderBottom: '4px solid #CC6600', backgroundColor: 'rgba(139,37,0,0.15)' }}
    >
      <div className="mb-4">
        <h1
          className="text-2xl text-glow tracking-wider"
          style={{ color: '#FF4500' }}
        >
          RETRO
          <span style={{ color: '#F5DEB3' }}>PANNING</span>
        </h1>
        <div className="text-xs mt-1" style={{ color: '#CC9966' }}>
          ━━━━━━━━━━━━━━━━━━━━━━
        </div>
      </div>

      <p className="text-xs" style={{ color: '#CC9966' }}>
        &gt; GARIMPADOR DE OFERTAS RETRÔ COM IA
        <span className="animate-blink" style={{ color: '#FF4500' }}>_</span>
      </p>
      <p className="text-xs mt-2" style={{ color: '#8B4513' }}>
        VIDEOGAMES · CONSOLES · COLECIONÁVEIS
      </p>
    </header>
  )
}
