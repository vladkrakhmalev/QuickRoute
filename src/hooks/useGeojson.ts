import { useState, useEffect } from 'react'
import type { FeatureCollection } from 'geojson'

export const useGeojson = (url: string): FeatureCollection | null => {
  const [geojson, setGeojson] = useState<FeatureCollection | null>(null)

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setGeojson)
      .catch(console.error)
  }, [url])

  return geojson
}
