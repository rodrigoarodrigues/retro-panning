interface ErrorBannerProps {
  message: string
}

export default function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <div
      className="mt-6 p-4 text-xs text-center pixel-border-scam"
      style={{ backgroundColor: 'rgba(255,0,0,0.08)', color: '#FF6666' }}
    >
      &gt; ERRO: {message}
    </div>
  )
}
