import { FC } from 'react'
import { Marker } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'
import { Position } from 'geojson'

interface IProps {
  points: Position[]
  onMarkerClick: (idx: number) => void
}

export const MarkerLayer: FC<IProps> = ({ points, onMarkerClick }) => (
  <>
    {points.map((pos, idx) => (
      <Marker
        key={idx}
        position={pos as LatLngExpression}
        eventHandlers={{
          click: () => onMarkerClick(idx),
        }}
      />
    ))}
  </>
)
