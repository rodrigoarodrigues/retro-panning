import { useState, type FormEvent, type KeyboardEvent } from 'react'

interface SearchBarProps {
  onSearch: (q: string) => void
  isLoading: boolean
}

const SUGGESTIONS = [
  'Super Nintendo',
  'Atari 2600',
  'Game Boy Color',
  'Sega Genesis',
  'Nintendo 64',
  'PlayStation 1',
  'Mega Drive',
  'NES Cartridge',
]

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [value, setValue] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (value.trim() && !isLoading) {
      onSearch(value.trim())
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !isLoading && value.trim()) {
      onSearch(value.trim())
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 space-y-4">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex gap-0">
          {/* Prompt prefix */}
          <span
            className="flex items-center px-3 py-4 text-xs whitespace-nowrap"
            style={{
              backgroundColor: 'rgba(139,37,0,0.3)',
              border: '4px solid #CC6600',
              borderRight: 'none',
              color: '#FF4500',
            }}
          >
            &gt;_
          </span>

          {/* Input */}
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="SUPER NINTENDO, ATARI 2600..."
            disabled={isLoading}
            className="flex-1 text-xs px-4 py-4"
            style={{
              backgroundColor: '#1A0A00',
              color: '#F5DEB3',
              border: '4px solid #CC6600',
              borderLeft: 'none',
              borderRight: 'none',
              outline: 'none',
            }}
            autoFocus
          />

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading || !value.trim()}
            className="text-xs px-5 py-4 transition-colors cursor-pointer"
            style={{
              backgroundColor: isLoading ? '#4A1800' : '#8B2500',
              color: '#F5DEB3',
              border: '4px solid #CC6600',
              borderLeft: 'none',
            }}
            onMouseEnter={(e) => {
              if (!isLoading && value.trim()) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FF4500'
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                isLoading ? '#4A1800' : '#8B2500'
            }}
          >
            {isLoading ? '...' : 'SCAN'}
          </button>
        </div>
      </form>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-2 justify-center">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => {
              setValue(s)
              onSearch(s)
            }}
            disabled={isLoading}
            className="text-xs px-2 py-1 transition-colors cursor-pointer"
            style={{
              backgroundColor: 'transparent',
              color: '#CC9966',
              border: '1px solid #CC6600',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = '#FF4500'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#FF4500'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = '#CC9966'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#CC6600'
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
