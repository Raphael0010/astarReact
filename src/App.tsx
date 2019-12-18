import React, { useState, useCallback, useEffect } from "react";
import { PathFinder, Node } from "./utils/Pathfinder";
import GithubCorner from "react-github-corner";
import { useKeyPress } from "./hooks";

const widthGrid = 30;
type State = "Start" | "Finish" | "Wall" | "Value";
const App: React.FC = () => {
  const [path, setPath] = useState<Node[]>([]);
  const [grid, setGrid] = useState<number[][]>([]);
  const [start, setStart] = useState<[number, number] | undefined>();
  const [end, setEnd] = useState<[number, number] | undefined>();
  const [state, setState] = useState<State>("Start");

  const isPressStart = useKeyPress("s");
  const isPressFinish = useKeyPress("f");
  const isPressWall = useKeyPress("w");
  const isPressValue = useKeyPress("v");

  useEffect(() => {
    if (isPressStart && state !== "Start") {
      setState("Start");
    }
    if (isPressFinish && state !== "Finish") {
      setState("Finish");
    }
    if (isPressWall && state !== "Wall") {
      setState("Wall");
    }
    if (isPressValue && state !== "Value") {
      setState("Value");
    }
  }, [state, isPressStart, isPressFinish, isPressWall, isPressValue]);

  const onChangeGrid = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const row = parseInt(event.target.value);
      if (isNaN(row) || row > 20) {
        return;
      }
      setGrid(
        Array(row)
          .fill(1)
          .map(() => Array(row).fill(1))
      );
      setPath([]);
      setStart(undefined);
      setEnd(undefined);
    },
    []
  );

  const selectState = useCallback(
    (rowIndex: number, colIndex: number) => (
      event: React.MouseEvent<SVGRectElement, MouseEvent>
    ) => {
      switch (state) {
        case "Start":
          setStart([rowIndex, colIndex]);
          break;
        case "Finish":
          setEnd([rowIndex, colIndex]);
          break;
        case "Wall":
          const gridCopy = [...grid];
          if (grid[rowIndex][colIndex] === 0) {
            gridCopy[rowIndex][colIndex] = 1;
          } else {
            gridCopy[rowIndex][colIndex] = 0;
          }
          setGrid(gridCopy);
          break;
        case "Value":
          const value = parseInt(prompt("Choisi la valeur") || "");
          if (!isNaN(value)) {
            const gridCopy = [...grid];
            gridCopy[rowIndex][colIndex] = value;
            setGrid(gridCopy);
          }
          break;
        default:
          break;
      }
    },
    [state, grid]
  );

  const findPath = useCallback(() => {
    if (start && end) {
      setPath(PathFinder(grid, start, end));
    }
  }, [grid, start, end]);

  const colorCell = useCallback(
    (rowIndex: number, colIndex: number) => {
      if (start && start[0] === rowIndex && start[1] === colIndex) {
        return "rgb(0,255,0)";
      }
      if (end && end[0] === rowIndex && end[1] === colIndex) {
        return "rgb(255,0,0)";
      }
      if (grid[rowIndex][colIndex] === 0) {
        return "rgb(30,30,30)";
      }
      return path.find(cell => cell.x === colIndex && cell.y === rowIndex)
        ? "rgb(0,0,255)"
        : "rgb(220,220,220)";
    },
    [path, start, end, grid]
  );

  return (
    <div className="App">
      <GithubCorner href="https://github.com/Raphael0010/astarReact" />
      Selected mode : <b>{state}</b>
      <br />
      Press <b>S</b> to select the start
      <br />
      Press <b>F</b> to select the end
      <br />
      Press <b>W</b> to place wall
      <br />
      <p>
        Select number of square <input onChange={onChangeGrid} />
        {start && end && <button onClick={findPath}>FindPath</button>}
      </p>
      <br />
      <svg width={widthGrid * grid.length} height={widthGrid * grid.length}>
        {grid.map((rowGrid, rowIndex) =>
          rowGrid.map((value, colIndex) => (
            <g key={rowIndex + "-" + colIndex}>
              <rect
                onClick={selectState(rowIndex, colIndex)}
                x={widthGrid * colIndex}
                y={widthGrid * rowIndex}
                width={widthGrid}
                height={widthGrid}
                stroke="blue"
                fill={colorCell(rowIndex, colIndex)}
              />
              <text
                x={widthGrid * colIndex + 20}
                y={widthGrid * rowIndex + 25}
                fontFamily="Verdana"
                fontSize="8"
                fill="white"
              >
                {value}
              </text>
            </g>
          ))
        )}
      </svg>
    </div>
  );
};

export default App;
