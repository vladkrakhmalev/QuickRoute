import { FC } from 'react'
import { Marker } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'
import { Position } from 'geojson'

interface IProps {
  points: Position[]
  onMarkerClick: (idx: number) => void
  onMarkerDrag?: (idx: number, newPos: Position) => void
}

export const MarkerLayer: FC<IProps> = ({
  points,
  onMarkerClick,
  onMarkerDrag,
}) => (
  <>
    {points.map((pos, idx) => (
      <Marker
        key={idx}
        position={pos as LatLngExpression}
        draggable={!!onMarkerDrag}
        eventHandlers={{
          click: () => onMarkerClick(idx),
          dragend: e => {
            if (onMarkerDrag) {
              const marker = e.target
              const { lat, lng } = marker.getLatLng()
              onMarkerDrag(idx, [lat, lng])
            }
          },
        }}
      />
    ))}
  </>
)
