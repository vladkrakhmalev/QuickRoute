import { FC } from 'react'
import './styles/global.css'
import MapView from './components/MapView'

export const App: FC = () => {
  return (
    <div id='app' className='app'>
      <h1>Поиск кратчайшего пути</h1>
      <p>
        Нажмите на карту, чтобы добавить точки. Для удаления точки нажмите на
        маркер.
      </p>
      <MapView />
    </div>
  )
}
