import { motion } from 'framer-motion'
import {
  Bell, CheckCircle2, AlertCircle, Tag, Briefcase,
  Heart, ShoppingCart, MoreHorizontal, Layers, Plus,
  Clock
} from 'lucide-react'

const CATEGORY_ICONS = {
  personal: Tag,
  work: Briefcase,
  health: Heart,
  shopping: ShoppingCart,
  other: MoreHorizontal,
}

export default function Sidebar({
  categories,
  reminders,
  activeCategory,
  onCategoryChange,
  activeTab,
  onTabChange,
  upcomingCount,
  doneCount,
  overdueCount,
  onAdd,
}) {
  const counts = {}
  reminders.forEach(r => {
    counts[r.category] = (counts[r.category] || 0) + 1
  })

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 border-r border-bg-card flex-shrink-0 overflow-y-auto">
      <div className="p-4 flex flex-col gap-1">

        {/* Section: Views */}
        <p className="text-xs font-semibold text-text-muted uppercase tracking-widest px-3 mb-1 mt-2">
          Tampilan
        </p>

        <SidebarItem
          icon={Clock}
          label="Aktif"
          count={upcomingCount}
          active={activeTab === 'upcoming'}
          onClick={() => onTabChange('upcoming')}
          color="#8b5cf6"
          badge={overdueCount > 0 ? { count: overdueCount, color: 'text-status-overdue' } : null}
        />
        <SidebarItem
          icon={CheckCircle2}
          label="Selesai"
          count={doneCount}
          active={activeTab === 'done'}
          onClick={() => onTabChange('done')}
          color="#10b981"
        />

        {overdueCount > 0 && (
          <div className="mx-3 mt-1 mb-2 px-3 py-2 rounded-xl bg-status-overdue/10 border border-status-overdue/20">
            <div className="flex items-center gap-2">
              <AlertCircle size={13} className="text-status-overdue flex-shrink-0" />
              <span className="text-xs text-status-overdue font-medium">
                {overdueCount} reminder terlewat
              </span>
            </div>
          </div>
        )}

        {/* Section: Categories */}
        <p className="text-xs font-semibold text-text-muted uppercase tracking-widest px-3 mb-1 mt-3">
          Kategori
        </p>

        <SidebarItem
          icon={Layers}
          label="Semua"
          count={reminders.length}
          active={activeCategory === 'all'}
          onClick={() => onCategoryChange('all')}
          color="#8b5cf6"
        />

        {categories.map(cat => {
          const Icon = CATEGORY_ICONS[cat.id] || Tag
          return (
            <SidebarItem
              key={cat.id}
              icon={Icon}
              label={cat.label}
              count={counts[cat.id] || 0}
              active={activeCategory === cat.id}
              onClick={() => onCategoryChange(cat.id)}
              color={cat.color}
            />
          )
        })}

        {/* Add button bottom */}
        <div className="mt-4 px-1">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onAdd}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-bg-hover text-text-muted hover:text-accent-purple hover:border-accent-purple/40 text-sm font-medium transition-all duration-200"
          >
            <Plus size={15} />
            Tambah Pengingat
          </motion.button>
        </div>

      </div>
    </aside>
  )
}

function SidebarItem({ icon: Icon, label, count, active, onClick, color, badge }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
        active
          ? 'text-white'
          : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
      }`}
      style={active ? { backgroundColor: color, boxShadow: `0 0 14px ${color}44` } : {}}
    >
      <Icon
        size={16}
        strokeWidth={active ? 2.5 : 2}
        className={active ? 'text-white' : 'text-text-muted group-hover:text-text-secondary'}
      />
      <span className="flex-1 text-left">{label}</span>
      {count > 0 && (
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
          active ? 'bg-white/20 text-white' : 'bg-bg-hover text-text-muted'
        }`}>
          {count}
        </span>
      )}
      {badge && !active && (
        <span className={`text-xs font-bold ${badge.color}`}>
          {badge.count}
        </span>
      )}
    </motion.button>
  )
}
