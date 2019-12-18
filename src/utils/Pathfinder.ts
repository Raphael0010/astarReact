export class Node {
  x: number;
  y: number;
  cost: number = 0;
  heuristic: number = 0;
  value: number;
  nodeParent: Node | null;
  constructor(x: number, y: number, value: number, nodeParent: Node | null) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.cost = 0;
    this.heuristic = 0;
    this.nodeParent = nodeParent;
  }

  showYou(): string {
    let current: Node | null = this.nodeParent;
    let result: string = " -> " + this.y + "," + this.x;
    while (current !== null) {
      result += " -> " + current.y + "," + current.x;
      current = current.nodeParent;
    }
    return result;
  }
}

function findPath(current: Node) {
  const result: Node[] = [];
  let curr = current;

  while (curr.nodeParent) {
    result.push(curr);
    curr = curr.nodeParent;
  }
  result.push(curr);

  return result.reverse();
}

function findNeighbours(node: Node, graph: Node[][]): Node[] {
  const row = node.y;
  const col = node.x;
  let neighbours: Node[] = [];

  if (graph[row + 1] !== undefined && graph[row + 1][col].value !== 0) {
    neighbours.push(graph[row + 1][col]);
  }

  if (graph[row][col + 1] !== undefined && graph[row][col + 1].value !== 0) {
    neighbours.push(graph[row][col + 1]);
  }

  if (graph[row - 1] !== undefined && graph[row - 1][col].value !== 0) {
    neighbours.push(graph[row - 1][col]);
  }
  if (graph[row][col - 1] !== undefined && graph[row][col - 1].value !== 0) {
    neighbours.push(graph[row][col - 1]);
  }

  return neighbours;
}

function compareTwoNode(node1: Node, node2: Node): number {
  return node2.heuristic - node1.heuristic;
}

function shortestPath(graph: Node[][], start: Node, goal: Node): Node[] {
  let closeList: Node[] = [];
  let openList: Node[] = [];

  openList.push(start);

  while (openList.length > 0) {
    let current = openList.sort(compareTwoNode).shift();

    if (!current) {
      throw new Error("Path does not exists");
    }
    if (current === goal) {
      return findPath(current);
    }
    let neighbours: Node[] = findNeighbours(current, graph);

    for (const n of neighbours) {
      //const isIn = openList.find(e => e === n);

      //console.log("1", openList.find(e => e && e === n)?.cost);
      //console.log("2", isIn && isIn.cost >= 0 && isIn.cost < n.cost);
      if (
        closeList.includes(n) ||
        openList.find(e => e && e === n)?.cost ||
        Infinity < n.cost
      ) {
        continue;
      } else {
        n.cost = current.cost + current.value;
        n.heuristic =
          n.heuristic + (Math.abs(n.x - goal.x) + Math.abs(n.y - goal.y));
        n.nodeParent = current;
        openList.push(n);
      }
    }

    closeList.push(current);
  }
  throw new Error("No way exists");
}

export function PathFinder(
  array: number[][],
  start: [number, number],
  end: [number, number]
): Node[] {
  let arrayNode: Node[][] = [];

  for (let y = 0; y < array.length; y++) {
    arrayNode[y] = [];
    for (let x = 0; x < array[y].length; x++) {
      arrayNode[y][x] = new Node(x, y, array[y][x], null);
    }
  }

  return shortestPath(
    arrayNode,
    arrayNode[start[0]][start[1]],
    arrayNode[end[0]][end[1]]
  );
  /*
  .reduce(
    (ac, c) => `${ac}${c.y},${c.x}`,
    ""
  )
  */
}
