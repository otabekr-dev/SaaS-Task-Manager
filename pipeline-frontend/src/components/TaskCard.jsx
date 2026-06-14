const STATUS_BORDER = {
  TODO: '#888780',
  IN_PROGRESS: '#BA7517',
  DONE: '#1D9E75',
}

export default function TaskCard({ task, onClick }) {
  const initials = task.assigned_to
    ? `${task.assigned_to.first_name?.[0] || ''}${task.assigned_to.last_name?.[0] || ''}`.toUpperCase() || task.assigned_to.username[0].toUpperCase()
    : null

  return (
    <button
      onClick={onClick}
      className="card text-left p-3 w-full hover:border-blue-200 transition-colors"
      style={{ borderLeft: `3px solid ${STATUS_BORDER[task.status] || '#888780'}`, borderRadius: '0.75rem' }}
    >
      <span className="font-mono text-xs text-text-tertiary">TM-{String(task.id).padStart(3, '0')}</span>
      <p className="text-sm mt-1 mb-2">{task.title}</p>
      <div className="flex items-center justify-between">
        {initials ? (
          <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-medium text-blue-600">
            {initials}
          </div>
        ) : (
          <span className="text-xs text-text-tertiary">Unassigned</span>
        )}
      </div>
    </button>
  )
}
