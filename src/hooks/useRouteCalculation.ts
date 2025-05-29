import { useMemo } from 'react'
import type { FeatureCollection, Position } from 'geojson'
import {
  geojsonToGraph,
  findShortestPath,
  findNearestNodes,
} from '../utils/graph'

export const useRouteCalculation = (
  geojson: FeatureCollection | null,
  points: Position[]
): Position[] => {
  return useMemo(() => {
    if (!geojson || points.length !== 2) return []

    const graph = geojsonToGraph(geojson)
    const from: [number, number] = [points[0][1], points[0][0]]
    const to: [number, number] = [points[1][1], points[1][0]]

    const N = 10 // количество ближайших вершин для перебора
    const fromIds = findNearestNodes(graph, from, N)
    const toIds = findNearestNodes(graph, to, N)

    for (const fromId of fromIds) {
      for (const toId of toIds) {
        if (!fromId || !toId) continue
        const path = findShortestPath(graph, fromId, toId)
        if (path.length > 0) {
          return path
        }
      }
    }
    return []
  }, [geojson, points])
}
