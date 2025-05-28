import { useMemo } from 'react'
import type { FeatureCollection, Position } from 'geojson'
import {
  geojsonToGraph,
  findNearestNode,
  findShortestPath,
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

    const fromId = findNearestNode(graph, from)
    const toId = findNearestNode(graph, to)

    if (!fromId || !toId) return []

    return findShortestPath(graph, fromId, toId)
  }, [geojson, points])
}
