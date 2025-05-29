import { FeatureCollection, LineString, Position } from 'geojson'
import { Graph, alg } from 'graphlib'

/**
 * Получает идентификатор вершины на основе координат
 * @param coord - Координаты вершины
 * @returns Идентификатор вершины
 * @example
 * getNodeId([38.8400712, 44.88531140047879]) // '38.8400712,44.88531140047879'
 */
const getNodeId = (coord: Position): string => coord.join(',')

/**
 * Добавляет вершину в граф, если она отсутствует
 * @param graph - Граф
 * @param id - Идентификатор вершины
 * @param coord - Координаты вершины
 * @example
 * addNodeIfAbsent(graph, '1', [38.8400712, 44.88531140047879])
 */
const addNodeIfAbsent = (graph: Graph, id: string, coord: Position): void => {
  if (!graph.hasNode(id)) {
    graph.setNode(id, coord)
  }
}

/**
 * Преобразует градусы в радианы
 * @param degrees - Градусы
 * @returns Радианы
 * @example
 * degreesToRadians(180) // Math.PI
 * degreesToRadians(90) // Math.PI / 2
 */
const degreesToRadians = (degrees: number): number => (degrees * Math.PI) / 180

/**
 * Вычисляет расстояние между двумя точками на поверхности Земли с помощью формулы гаверсинуса.
 * @param a - Первая точка [широта, долгота] в градусах
 * @param b - Вторая точка [широта, долгота] в градусах
 * @returns Расстояние в метрах
 * @example
 * haversine([38.8400712, 44.88531140047879], [38.8400712, 44.88531140047879]) // 0
 */
export const haversine = (a: Position, b: Position): number => {
  const [lat1, lon1] = a
  const [lat2, lon2] = b
  const R = 6371000 // радиус Земли в метрах
  const dLat = degreesToRadians(lat2 - lat1)
  const dLon = degreesToRadians(lon2 - lon1)
  const lat1Rad = degreesToRadians(lat1)
  const lat2Rad = degreesToRadians(lat2)

  const aTerm =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(aTerm), Math.sqrt(1 - aTerm))

  return R * c
}

/**
 * Преобразование GeoJSON в граф
 * @param geojson - GeoJSON объект
 * @returns Граф
 * @example
 * geojsonToGraph(geojson) // Graph
 */
export const geojsonToGraph = (geojson: FeatureCollection): Graph => {
  const graph = new Graph()

  for (const feature of geojson.features) {
    if (feature.geometry.type !== 'LineString') continue

    const coords = (feature.geometry as LineString).coordinates
    for (let i = 0; i < coords.length - 1; i++) {
      const [a, b] = [coords[i], coords[i + 1]]
      const aId = getNodeId(a)
      const bId = getNodeId(b)

      addNodeIfAbsent(graph, aId, a)
      addNodeIfAbsent(graph, bId, b)

      const distance = haversine(a, b)
      graph.setEdge(aId, bId, distance)
      graph.setEdge(bId, aId, distance)
    }
  }

  return graph
}

/**
 * Находит ближайшую вершину графа к заданной точке
 * @param graph - Граф для поиска
 * @param point - Точка [широта, долгота]
 * @returns ID ближайшей вершины или null, если граф пуст
 * @example
 * findNearestNode(graph, [38.8400712, 44.88531140047879]) // "node-1"
 */
export const findNearestNode = (
  graph: Graph,
  point: Position
): string | null => {
  return graph.nodes().reduce<{ id: string | null; dist: number }>(
    (nearest, id) => {
      const node = graph.node(id) as Position
      const dist = haversine(node, point)
      return dist < nearest.dist ? { id, dist } : nearest
    },
    { id: null, dist: Infinity }
  ).id
}

/**
 * Находит кратчайший путь между двумя вершинами графа используя алгоритм Дейкстры
 * @param graph - Граф для поиска пути
 * @param fromId - ID начальной вершины
 * @param toId - ID конечной вершины
 * @returns Массив координат вершин пути или пустой массив, если путь не найден
 * @example
 * findShortestPath(graph, "node-1", "node-2") // [[38.8400712, 44.88531140047879], [38.8400712, 44.88531140047879]]
 */
export const findShortestPath = (
  graph: Graph,
  fromId: string,
  toId: string
): Position[] => {
  const distances = alg.dijkstra(graph, fromId, edge =>
    graph.edge(edge.v, edge.w)
  )
  const targetNode = distances[toId]

  if (!targetNode || targetNode.distance === Infinity) {
    return []
  }

  const path: Position[] = []
  let currentNode: string | undefined = toId

  while (currentNode && currentNode !== fromId) {
    path.push(graph.node(currentNode) as Position)
    currentNode = distances[currentNode]?.predecessor
  }

  if (currentNode === fromId) {
    path.push(graph.node(fromId) as Position)
  }

  return path.length > 1 ? path.reverse() : []
}

/**
 * Находит N ближайших вершин графа к заданной точке
 * @param graph - Граф для поиска
 * @param point - Точка [широта, долгота]
 * @param n - Количество ближайших вершин
 * @returns Массив ID ближайших вершин
 */
export const findNearestNodes = (
  graph: Graph,
  point: Position,
  n: number
): string[] => {
  return graph
    .nodes()
    .map(id => ({ id, dist: haversine(graph.node(id) as Position, point) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, n)
    .map(item => item.id)
}
