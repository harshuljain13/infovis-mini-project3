// Load the datasets and call the functions to make the visualizations

Promise.all([
  d3.csv('data/aiddata.csv', d3.autoType),
  d3.csv('data/aiddata.csv'),
]).then(([data, data2]) => {
  vis1(data, d3.select('#vis1'));
  vis2(data2, d3.select('#vis2'));
});
