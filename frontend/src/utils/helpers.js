export const formatDate = (date) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(date))

export const formatPercent = (val) => `${(val * 100).toFixed(1)}%`

export const getStatusColor = (status) => ({
  Normal: 'emerald',
  Warning: 'amber',
  Critical: 'rose',
  Failure: 'rose',
}[status] || 'cyan')

export const getStatusStyles = (status) => ({
  Normal:   { bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.3)',  text: '#34d399', pulse: 'animate-pulse-emerald' },
  Warning:  { bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.3)',  text: '#fbbf24', pulse: '' },
  Critical: { bg: 'rgba(251,113,133,0.1)', border: 'rgba(251,113,133,0.3)', text: '#fb7185', pulse: 'animate-pulse-rose' },
  Failure:  { bg: 'rgba(251,113,133,0.1)', border: 'rgba(251,113,133,0.3)', text: '#fb7185', pulse: 'animate-pulse-rose' },
}[status] || { bg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.3)', text: '#38bdf8', pulse: '' })

export const getRiskLabel = (prob) => {
  if (prob >= 0.8) return { label: 'Critical Risk', color: '#fb7185' }
  if (prob >= 0.5) return { label: 'High Risk', color: '#f97316' }
  if (prob >= 0.3) return { label: 'Medium Risk', color: '#fbbf24' }
  return { label: 'Low Risk', color: '#34d399' }
}

export const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']