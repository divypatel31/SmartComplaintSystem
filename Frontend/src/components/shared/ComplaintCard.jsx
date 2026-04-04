const categoryBadge = { PLUMBING: 'badge-plumbing', ELECTRICAL: 'badge-electrical', IT: 'badge-it', GENERAL: 'badge-general' };
const statusBadge   = { PENDING: 'badge-pending', ASSIGNED: 'badge-assigned', RESOLVED: 'badge-resolved' };
const categoryIcon  = { PLUMBING: '🔧', ELECTRICAL: '⚡', IT: '💻', GENERAL: '📋' };
const statusDot     = { PENDING: 'bg-amber-400', ASSIGNED: 'bg-blue-500', RESOLVED: 'bg-emerald-500' };

export default function ComplaintCard({ complaint, actions, meta }) {
  return (
    <div className="card-hover group flex flex-col gap-4">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={categoryBadge[complaint.category] || 'badge-general'}>
            {categoryIcon[complaint.category]} {complaint.category}
          </span>
          <span className={statusBadge[complaint.status] || 'badge-pending'}>
            <span className={`w-1.5 h-1.5 rounded-full inline-block ${statusDot[complaint.status]}`} />
            {complaint.status}
          </span>
        </div>
        <span className="font-mono text-xs text-gray-400 flex-shrink-0">
          #{String(complaint.id).padStart(4,'0')}
        </span>
      </div>

      {/* Description */}
      <p className="font-body text-gray-600 text-sm leading-relaxed flex-1">{complaint.description}</p>

      {/* Meta footer */}
      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100 text-xs font-body text-gray-400">
        {meta?.showUser && complaint.user && (
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {complaint.user.username}
          </span>
        )}
        {complaint.worker ? (
          <span className="flex items-center gap-1.5 text-emerald-600">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {complaint.worker.username}
          </span>
        ) : complaint.status === 'PENDING' ? (
          <span className="text-amber-500 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Awaiting assignment
          </span>
        ) : null}
      </div>

      {/* Actions */}
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
