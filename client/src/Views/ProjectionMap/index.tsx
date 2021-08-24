import React from "react";
import { useGlobalStore } from "Store";
import { observer } from "mobx-react-lite";
import * as d3 from "d3";
import { useClientRect } from "Hooks";
import { INode } from "Types";

const colors = d3.schemeTableau10;

const ProjectionMap = observer(() => {
  const svgId = "projection-svg";
  const { width, height } = useClientRect({ svgId });
  const padding = { left: 30, top: 30, right: 30, bottom: 30 };

  const store = useGlobalStore();
  const { levelsData, currentLevel } = store;
  if (levelsData.length === 0)
    return <svg id={svgId} width="100%" height="100%"></svg>;

  const { nodes, have_cluster } =
    levelsData[currentLevel];

  const x = d3
    .scaleLinear()
    .domain(d3.extent(nodes, (d) => d.projection[0]) as [number, number])
    .nice()
    .range([padding.left, width - padding.right]);
  const y = d3
    .scaleLinear()
    .domain(d3.extent(nodes, (d) => d.projection[1]) as [number, number])
    .nice()
    .range([padding.top, height - padding.bottom]);

  let color = (node: INode) => colors[0];

  if (have_cluster) {
    const clusterMap = Array.from(
      new Set(nodes.map((node) => node.cluster_id))
    );
    color = (node: INode) => colors[clusterMap.indexOf(node.cluster_id)];
  }

  const size = 5;

  return (
    <svg id={svgId} width="100%" height="100%">
      {nodes.map((node) => {
        const pos = {
          x: x(node.projection[0]),
          y: y(node.projection[1]),
        };
        if (node.type === "target") {
          return (
            <path
              key={node.auto_id}
              d={getStar(pos.x, pos.y, size * 10)}
              fill="red"
            />
          );
        }
        if (node.type === "upper_level") {
          return (
            <path
              key={node.auto_id}
              d={getPolygon(pos.x, pos.y, size * 3, 3)}
              fill={color(node)}
            />
          );
        }
        return (
          <circle
            key={node.auto_id}
            r={size}
            cx={pos.x}
            cy={pos.y}
            fill={color(node)}
            opacity={node.type === 'coarse' ? 0.3 : 0.8}
          />
        );
      })}
    </svg>
  );
});

export default ProjectionMap;

const getStar = (x: number, y: number, width: number) => {
  x = x - width / 2;
  y = y - width / 2 / Math.tan((72 / 180) * Math.PI);
  const coordB = {
    x0: x + width,
    y0: y,
  };
  const coordD = {
    x0:
      x +
      width * Math.sin((36 / 180) * Math.PI) * Math.tan((18 / 180) * Math.PI),
    y0: y + width * Math.sin((36 / 180) * Math.PI),
  };
  const coordA = {
    x0: x + width / 2,
    y0: y - (width / 2) * Math.tan((36 / 180) * Math.PI),
  };
  const coordC = {
    x0: x + width * Math.cos((36 / 180) * Math.PI),
    y0: y + width * Math.sin((36 / 180) * Math.PI),
  };
  //绘制星星
  return `M${x},${y} L${coordB.x0},${coordB.y0} L${coordD.x0},${coordD.y0} L${coordA.x0},${coordA.y0} L${coordC.x0},${coordC.y0} Z`;
};

const getPolygon = (x: number, y: number, r: number, n: number) => {
  const stepAngle = (2 * Math.PI) / n;
  const points = d3
    .range(n)
    .map(
      (i) =>
        `${x + r * Math.sin(stepAngle * i)},${y - r * Math.cos(stepAngle * i)}`
    );
  return `M${points.join("L")}`;
};
