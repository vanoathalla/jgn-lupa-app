import { BellRing, Minus, Square, X, Plus } from 'lucide-react'

const isElectron = !!window.electronAPI

export default function Header({ onAdd }) {
  return (
    <header
      className="flex items-center justify-between px-5 py-3 border-b border-bg-card select-none flex-shrink-0"
      style={{ WebkitAppRegion: 'drag' }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center shadow-glow-sm">
          <BellRing size={16} className="text-white" strokeWidth={2.5} />
        </div>
        <div>
          <span className="text-sm font-bold text-text-primary tracking-tight">Jgn Lupa</span>
          <span className="hidden sm:inline text-xs text-text-muted ml-2">— pengingat kamu</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' }}>
        {/* Add button — desktop */}
        <button
          onClick={onAdd}
          className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-purple text-white text-sm font-semibold hover:bg-accent-purpleDark transition-colors shadow-glow-sm"
        >
          <Plus size={15} strokeWidth={2.5} />
          Tambah
        </button>

        {/* Window controls — Electron only */}
        {isElectron && (
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={() => window.electronAPI.minimize()}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:bg-bg-hover hover:text-text-primary transition-colors"
            >
              <Minus size={12} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => window.electronAPI.maximize()}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:bg-bg-hover hover:text-text-primary transition-colors"
            >
              <Square size={11} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => window.electronAPI.close()}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:bg-red-500/20 hover:text-red-400 transition-colors"
            >
              <X size={13} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
