import { FC } from 'react'
import { MapContainer, TileLayer, Polyline, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useGeojson } from '../hooks/useGeojson'
import { useRouteCalculation } from '../hooks/useRouteCalculation'
import { MarkerLayer } from './MarkerLayer'
import { MapClickHandler } from './MapClickHandler'
import { DEFAULT_POSITION, DEFAULT_ZOOM } from '../data/consts'
import { LatLngExpression } from 'leaflet'
import type { Position } from 'geojson'
import { useState } from 'react'

const MapView: FC = () => {
  const [points, setPoints] = useState<Position[]>([])
  const geojson = useGeojson('/public/roads.geojson')
  const route = useRouteCalculation(geojson, points)

  const handleMarkerClick = (idx: number) => {
    setPoints(prev => prev.filter((_, i) => i !== idx))
  }

  return (
    <MapContainer
      center={DEFAULT_POSITION}
      zoom={DEFAULT_ZOOM}
      style={{ height: '70vh', width: '100%' }}
    >
      {geojson && <GeoJSON data={geojson} />}
      {route.length > 1 && (
        <Polyline
          positions={
            route.map(([lng, lat]) => [lat, lng]) as LatLngExpression[]
          }
          color='red'
          weight={5}
        />
      )}
      <MarkerLayer points={points} onMarkerClick={handleMarkerClick} />
      <MapClickHandler points={points} setPoints={setPoints} />
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
    </MapContainer>
  )
}

export default MapView
