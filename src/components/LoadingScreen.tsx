export default function LoadingScreen() {
  return (
    <div className="mt-16 text-center space-y-6">
      <div className="text-accent text-glow text-base animate-pulse">
        GARIMPANDO...
      </div>

      <div className="text-left inline-block space-y-2 text-xs text-[#CC9966]">
        <p>&gt; CONECTANDO AO SERPER SHOPPING API<span className="animate-blink">_</span></p>
        <p>&gt; COLETANDO RESULTADOS<span className="animate-blink">_</span></p>
        <p>&gt; ATIVANDO ANÁLISE DE IA<span className="animate-blink">_</span></p>
        <p>&gt; DETECTANDO POSSÍVEIS GOLPES<span className="animate-blink">_</span></p>
        <p>&gt; RANKEANDO POR VALOR<span className="animate-blink">_</span></p>
      </div>

      {/* Pixel progress bar */}
      <div className="max-w-xs mx-auto mt-8">
        <div
          className="border-2 border-[#CC6600] h-5 bg-bg overflow-hidden"
          style={{ boxShadow: '2px 2px 0 0 #8B2500' }}
        >
          <div
            className="h-full bg-accent animate-pulse"
            style={{ width: '70%' }}
          />
        </div>
        <p className="text-[#CC9966] text-xs mt-2 text-center">
          PROCESSANDO...
        </p>
      </div>
    </div>
  )
}
