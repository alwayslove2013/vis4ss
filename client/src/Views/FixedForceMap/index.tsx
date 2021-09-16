import React, { useEffect } from "react";
import { useGlobalStore } from "Store";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import * as d3 from "d3";
import { useClientRect } from "Hooks";
import { INode } from "Types";

const colors = d3.schemeTableau10;

const FixedForceMap = observer(() => {
  const svgId = "projection-svg";
  const { width, height } = useClientRect({ svgId });
  const padding = { left: 30, top: 30, right: 30, bottom: 30 };
  const store = useGlobalStore();
  const { levelsData, currentLevel, targetId } = store;

  // if (levelsData.length === 0) {
  //   return <svg id={svgId} width="100%" height="100%"></svg>;
  // }

  useEffect((): (() => void) => {
    if (levelsData.length === 0) return () => {};

    const x = d3
      .scaleLinear()
      .domain(
        d3.extent(levelsData[currentLevel].nodes, (d) => d.dis) as [
          number,
          number
        ]
      )
      .nice()
      .range([width - padding.right, padding.left]);
    const y = d3
      .scaleLinear()
      .domain(
        d3.extent(levelsData[currentLevel].nodes, (d) => d.projection[1]) as [
          number,
          number
        ]
      )
      .nice()
      .range([padding.top, height - padding.bottom]);

    const r = d3
      .scaleLinear()
      .domain(
        d3.extent(levelsData[currentLevel].nodes, (d) => d.dis) as [
          number,
          number
        ]
      )
      .nice()
      .range([0, height * 0.5]);

    let color = (node: INode) => colors[0];

    if (levelsData[currentLevel].have_cluster) {
      const clusterMap = Array.from(
        new Set(levelsData[currentLevel].nodes.map((node) => node.cluster_id))
      );
      color = (node: INode) => colors[clusterMap.indexOf(node.cluster_id)];
    } else {
      const TypeMap = ["upper_level", "fine", "candidate", "coarse", "target"];
      color = (node: INode) => {
        if (node.type === "target") return "red";
        if (node.type === "upper_level") return "blue";
        if (node.type === "fine") return "yellow";
        if (node.type === "candidate") return "#aaa";
        return "#eee";
      };
    }

    const fixedThreshold = (node: INode) => {
      return true;
      return false;
      return node.type === "coarse";
    };

    const nodes = levelsData[currentLevel].nodes.map((node) =>
      Object.assign(
        {},
        toJS(node),
        { x: 0, y: 0 },
        fixedThreshold(node)
          ? {}
          : {
              fx: x(node.dis),
            }
        // { x: x(node.projection[0]), y: y(node.projection[1]) },
        // { id: node.auto_id }
      )
    );
    const links = levelsData[currentLevel].links
      ?.filter((link) => link[2] >= 3)
      .map((link) => ({
        target: `${link[0]}`,
        source: `${link[1]}`,
        type: link[2],
      }));

    const svg = d3.select(`#${svgId}`);
    svg.selectAll("*").remove();

    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      // .attr("id", (d) => d.auto_id)
      .attr("r", 5)
      .attr("id", (d) => `node-${d.auto_id}`)
      .attr("opacity", 0)
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("fill", color)
      .on("click", (e, d) => console.log(d.auto_id, d));

    d3.select(`#node-target`).attr("opacity", 1);

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => (d as any).auto_id)
          .strength((d) => 1)
      )
      .force(
        "r",
        d3
          .forceRadial(
            (d) => ((d as any).type === "coarse" ? height * 0.5 : r((d as any).dis)) as number,
            width / 2,
            height / 2
          )
          .strength(d => (d as any).type === "coarse" ? 0.1 : 5)
      )
      .force("charge", d3.forceManyBody());
    // .force("center", d3.forceCenter(width / 2, height / 2));

    simulation.on("tick", () => {
      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });

    const linkAnimation = setTimeout(() => {
      const link = svg
        .append("g")
        .attr("stroke", "#999")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-opacity", (link) => 0)
        .attr("stroke-width", (link) => (link.type >= 4 ? 5 : 1))
        .attr("x1", (d) => (d as any).source.x)
        .attr("y1", (d) => (d as any).source.y)
        .attr("x2", (d) => (d as any).target.x)
        .attr("y2", (d) => (d as any).target.y);
      link
        .transition()
        .duration(80)
        .delay((d, i) => i * 80)
        .attr("stroke-opacity", (link) =>
          link.type === 5
            ? (link.source as any).type === "target"
              ? 0
              : 0.8
            : 0.2
        )
        .on("end", (d) => {
          d3.select(`#node-${(d.target as any).auto_id}`).attr("opacity", 1);
          d3.select(`#node-${(d.source as any).auto_id}`).attr("opacity", 1);
        });
    }, 8000);

    return () => {
      simulation.stop();
      clearTimeout(linkAnimation);
    };
  }, [levelsData, currentLevel]);

  return <svg id={svgId} width="100%" height="100%"></svg>;
});

export default FixedForceMap;
