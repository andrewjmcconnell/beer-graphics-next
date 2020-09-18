import * as d3 from "d3";
import * as _ from "lodash";

export const width = 1000;
export const petalColors = [
  "#ffc8f0",
  "#cbf2bd",
  "#afe9ff",
  "#ffb09e",
  "#fe4a49",
  "#2ab7ca",
  "#fed766",
  "#e6e6ea",
  "#f4f4f8",
  "#451e3e",
  "#fe8a71",
  "#009688"
];
const categories = [
  "British Origin Ales",
  "Irish Origin Ales",
  "North American Origin Ales",
  "German Origin Ales",
  "Belgian And French Origin Ales",
  "International Ale Styles",
  "European-germanic Lager",
  "North American Lager",
  "Other Lager",
  "International Styles",
  "Hybrid/mixed Beer",
  "Mead, Cider, & Perry",
  "Other Origin",
  "Malternative Beverages"
];
export const getCategory = index => categories[index - 1];
export const categoryIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
export const colorObj = _.zipObject(categoryIds, petalColors);
colorObj.Other = "#FFF2B4";
export const petalPaths = [
  // "M0 0 C50 50 50 100 0 100 C-50 100 -50 50 0 0",
  "M-35 0 C-25 25 25 25 35 0 C50 25 25 75 0 100 C-25 75 -50 25 -35 0",
  "M0,0 C50,40 50,70 20,100 L0,85 L-20,100 C-50,70 -50,40 0,0",
  "M0 0 C50 25 50 75 0 100 C-50 75 -50 25 0 0"
];
export const pathWidth = 120;
export const perRow = Math.floor(width / pathWidth);
export const svgHeight = (Math.ceil(50 / perRow) + 0.5) * pathWidth;
export const calculateGridPos = i => {
  return [
    ((i % perRow) + 0.5) * pathWidth,
    (Math.floor(i / perRow) + 0.5) * pathWidth
  ];
};
export const availabilityDescriptions = [
  "Year Round",
  "Limited",
  "Unavailable"
];
export const checkAvailability = index => availabilityDescriptions[index - 1];

export const renderFlowers = beers => {
  const colorScale = d3
    .scaleOrdinal()
    .domain(categoryIds)
    .range(petalColors)
    .unknown("#fff2b4");

  const petalScale = d3.scaleOrdinal().range(petalPaths);

  const sizeScale = d3
    .scaleOrdinal()
    .domain(d3.extent(beers, beer => beer.abv))
    .range([0.1, 0.6])
    .unknown(0.35);

  const numPetalsScale = d3
    .scaleQuantize()
    .domain(d3.extent(beers, beer => beer.ibu))
    .range(_.range(5, 10))
    .unknown(5);

  return _.map(beers, (beer, i) => ({
    color: colorScale(beer.category),
    path: petalScale(beer.available), // corresponds to year round, limited, unavailable
    scale: sizeScale(beer.abv),
    numPetals: numPetalsScale(beer.ibu),
    translate: calculateGridPos(i),
    ...beer
  }));
};
