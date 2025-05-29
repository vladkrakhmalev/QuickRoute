import { FC, useState, useMemo } from 'react'
import { MapContainer, TileLayer, Polyline, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useGeojson } from '../hooks/useGeojson'
import { useRouteCalculation } from '../hooks/useRouteCalculation'
import { MarkerLayer } from './MarkerLayer'
import { MapClickHandler } from './MapClickHandler'
import { DEFAULT_POSITION, DEFAULT_ZOOM } from '../data/consts'
import { LatLngExpression } from 'leaflet'
import type { Position } from 'geojson'

const MapView: FC = () => {
  const [points, setPoints] = useState<Position[]>([])
  const roadsData = useGeojson('roads.geojson')
  const route = useRouteCalculation(roadsData, points)

  const mainRoutePolyline = useMemo(() => {
    if (route.length > 1) {
      return (
        <Polyline
          positions={
            route.map(([lng, lat]) => [lat, lng]) as LatLngExpression[]
          }
          color='red'
          weight={5}
        />
      )
    }
    return null
  }, [route])

  const startConnector = useMemo(() => {
    if (route.length > 0 && points.length > 0) {
      return (
        <Polyline
          positions={
            [
              [points[0][0], points[0][1]],
              [route[0][1], route[0][0]],
            ] as LatLngExpression[]
          }
          color='blue'
          weight={3}
          dashArray='6 6'
        />
      )
    }
    return null
  }, [route, points])

  const endConnector = useMemo(() => {
    if (route.length > 0 && points.length > 1) {
      return (
        <Polyline
          positions={
            [
              [route.at(-1)![1], route.at(-1)![0]],
              [points.at(-1)![0], points.at(-1)![1]],
            ] as LatLngExpression[]
          }
          color='green'
          weight={3}
          dashArray='6 6'
        />
      )
    }
    return null
  }, [route, points])

  const handleMarkerClick = (idx: number) => {
    setPoints(prev => prev.filter((_, i) => i !== idx))
  }

  const handleMarkerDrag = (idx: number, newPos: Position) => {
    setPoints(prev => prev.map((pt, i) => (i === idx ? newPos : pt)))
  }

  return (
    <MapContainer
      center={DEFAULT_POSITION}
      zoom={DEFAULT_ZOOM}
      style={{ height: '70vh', width: '100%' }}
    >
      {roadsData && <GeoJSON data={roadsData} />}
      {mainRoutePolyline}
      {startConnector}
      {endConnector}

      <MarkerLayer
        points={points}
        onMarkerClick={handleMarkerClick}
        onMarkerDrag={handleMarkerDrag}
      />
      <MapClickHandler points={points} setPoints={setPoints} />
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
    </MapContainer>
  )
}

export default MapView
