import { FC } from 'react'
import { useMapEvents } from 'react-leaflet'
import { Position } from 'geojson'

interface IProps {
  points: Position[]
  setPoints: (pts: Position[]) => void
}

export const MapClickHandler: FC<IProps> = ({ points, setPoints }) => {
  useMapEvents({
    click(e) {
      if (points.length < 2) {
        setPoints([...points, [e.latlng.lat, e.latlng.lng]])
      }
    },
  })
  return null
}
