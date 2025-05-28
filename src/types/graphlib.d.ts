declare module 'graphlib' {
  export class Graph {
    constructor(options?: { directed?: boolean })
    setNode(id: string, value?: Position): void
    setEdge(a: string, b: string, value?: number): void
    hasNode(id: string): boolean
    node(id: string): Position
    edge(a: string, b: string): number
    nodes(): string[]
  }
  export namespace alg {
    function dijkstra(
      graph: Graph,
      source: string,
      weightFn?: (edge: { v: string; w: string }) => number
    ): Record<string, { distance: number; predecessor?: string }>
  }
}
