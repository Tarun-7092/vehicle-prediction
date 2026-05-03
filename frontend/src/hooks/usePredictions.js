import { useState, useCallback } from 'react'
import { predictionsApi } from '@/api/predictions'
import toast from 'react-hot-toast'

export function usePredictions() {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(false)
  const [meta, setMeta] = useState(null)

  const fetchPredictions = useCallback(async (params = {}) => {
    setLoading(true)
    try {
      const { data } = await predictionsApi.list(params)
      setPredictions(data.data)
      setMeta(data.meta)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch predictions')
    } finally { setLoading(false) }
  }, [])

  const deletePrediction = useCallback(async (id) => {
    try {
      await predictionsApi.delete(id)
      setPredictions(prev => prev.filter(p => p._id !== id))
      toast.success('Prediction deleted')
      return true
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete')
      return false
    }
  }, [])

  return { predictions, loading, meta, fetchPredictions, deletePrediction }
}