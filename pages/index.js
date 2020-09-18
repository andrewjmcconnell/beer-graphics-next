import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import {
  width,
  svgHeight,
  getCategory,
  checkAvailability,
  renderFlowers
} from "./utils";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [isLoading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [beers, setBeers] = useState(null);
  const [selected, setSelecteed] = useState({
    name: null,
    category: null
  });
  let d3Container = useRef(null);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:4000/?page=${page}`)
      .then(res => res.json())
      .then(res => {
        setLoading(false);
        setNumPages(res.numberOfPages);
        setBeers(res.data);
      });
  }, [page]);

  useEffect(() => {
    if (beers !== null && d3Container.current) {
      const data = renderFlowers(beers);
      const g = d3
        .select(d3Container.current)
        .selectAll("g")
        .data(data, d => d)
        .join(
          enter => {
            const g = enter
              .append("g")
              .attr("opacity", 0)
              .attr("transform", (d, _) => `translate(${d.translate})`);

            g.selectAll("path")
              .data(d =>
                _.times(d.numPetals, i =>
                  Object.assign({}, d, { rotate: i * (360 / d.numPetals) })
                )
              )
              .join("path")
              .attr("fill-opacity", 0.5)
              .attr("d", d => d.path)
              .attr("fill", d => d.color)
              .attr("stroke", d => d.color)
              .transition()
              .duration(1000)
              .attr("transform", d => `rotate(${d.rotate})scale(${d.scale})`);

            g.append("text")
              .attr("text-anchor", "middle")
              .attr("dy", ".35em")
              .style("font-size", ".7em")
              .style("font-style", "italic")
              .text(d => _.truncate(d.title, { length: 20 }));
            return g;
          },
          update => update,
          exit => {
            exit
              .transition()
              .duration(1000)
              .attr("opacity", 0)
              .remove();
          }
        )
        .attr("transform", d => `translate(${d.translate})`)
        .attr("pointer-events", "all")
        .attr("cursor", "pointer");

      g.transition()
        .duration(1000)
        .attr("opacity", 1)
        .attr("transform", (d, i) => `translate(${d.translate})`);

      // e.path[1].__data__ = data of the selected group
      g.on("mouseover", e => setSelecteed(e.path[1].__data__));

      g.selectAll("path")
        .data(d =>
          _.times(d.numPetals, i =>
            Object.assign({}, d, { rotate: i * (360 / d.numPetals) })
          )
        )
        .enter()
        .append("path")
        .attr("transform", d => `rotate(${d.rotate})scale(${d.scale})`)
        .attr("d", d => d.path)
        .attr("fill", d => d.color)
        .attr("stroke", d => d.color)
        .attr("fill-opacity", 0.5)
        .attr("stroke-width", 2);

      g.append("text")
        .text(d => _.truncate(d.name, { length: 22 }))
        .style("font-size", ".7em")
        .style("font-style", "italic")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .attr("pointer-events", "none");
    }
  }, [beers]);

  return (
    <div>
      <Head>
        <title>Beer Graphics - Andrew McConnell</title>
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="Andrew J McConnell" />
        <meta property="og:description" content="Frontend Engineer" />
        <meta
          property="og:image"
          content="https://scontent-ort2-2.xx.fbcdn.net/v/t1.0-9/65228454_10157762281949026_3432995470253752320_n.jpg?_nc_cat=109&_nc_sid=85a577&_nc_ohc=mxu58qOA9RQAX9oNWLg&_nc_ht=scontent-ort2-2.xx&oh=cd79ad4f691cea7ecfafe36c2d50d187&oe=5E982A7E"
        />
        <meta property="og:url" content="https://andrewjmcconnell.com" />
        <meta
          name="twitter:card"
          content="https://scontent-ort2-2.xx.fbcdn.net/v/t1.0-9/65228454_10157762281949026_3432995470253752320_n.jpg?_nc_cat=109&_nc_sid=85a577&_nc_ohc=mxu58qOA9RQAX9oNWLg&_nc_ht=scontent-ort2-2.xx&oh=cd79ad4f691cea7ecfafe36c2d50d187&oe=5E982A7E"
        />
      </Head>

      <div className={styles.window}>
        {isLoading && (
          <img
            src={"/infinity-loader.svg"}
            alt="loading..."
            width={width}
            height={svgHeight}
          />
        )}
        {!isLoading && (
          <svg ref={d3Container} width={width} height={svgHeight} />
        )}
        <div className={styles.description}>
          <strong>Beer Graphics</strong>
          <div>
            <em>By Andrew McConnell</em>
          </div>
          <div>
            <em>Using d3.js and BreweryDB</em>
          </div>
          <br />
          <div>Name: {selected.name}</div>
          <div>
            Category: {getCategory(selected.category || "not recorded")}
          </div>
          <div>ABV: {selected.abv || "not recorded"}</div>
          <div>IBU: {selected.ibu || "not recorded"}</div>
          <div>Availability: {checkAvailability(selected.available)}</div>
        </div>
      </div>
      <div>
        {page > 1 && (
          <button onClick={() => setPage(page - 1)}>{page - 1}</button>
        )}
        <button>{page}</button>
        {page < numPages && (
          <button onClick={() => setPage(page + 1)}>{page + 1}</button>
        )}
      </div>
      <div>
        <input value={page} onChange={e => setPage(Number(e.target.value))} />
        <span> / {numPages}</span>
      </div>
    </div>
  );
}
