import { useEffect } from 'react'
import { recordPageView } from '../services/api'

export function usePageView() {
  useEffect(() => {
    recordPageView()
  }, [])
}
