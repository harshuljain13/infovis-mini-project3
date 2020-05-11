function vis1(data, div) {


// All donors
var donor_country=d3.rollup(data, d=> d3.sum(d.map(d=> d.commitment_amount_usd_constant) ), d=> d.donor)

var donor_amount_sorted = Array.from(donor_country, ([country, amount]) => ({country, amount}))
var donor_set = donor_amount_sorted.slice()
  .sort((a, b) => d3.descending(a.amount, b.amount))
  .slice(0, 20)

var donors=donor_set.map(d => d.country)
// All recipients

var recipient_country=d3.rollup(data, d=> d3.sum(d.map(d=> d.commitment_amount_usd_constant) ), d=> d.recipient)
var recipient_amount_sorted = Array.from(recipient_country, ([country, amount]) => ({country, amount}))

var recipient_set = recipient_amount_sorted.slice()
  .sort((a, b) => d3.descending(a.amount, b.amount))
  .slice(0, 10)

var recipient= recipient_set.map(d => d.country)


aiddataset_filtered_by_donors =data.filter(d=> donors.includes(d.donor) )

aiddataset_recipient_filtered =aiddataset_filtered_by_donors.filter(d=> recipient.includes(d.recipient) )



  // filtered data
  var filtered =d3.rollup(aiddataset_recipient_filtered, d=> d.map(c=>({
    recipient:  c.recipient, amount: c.commitment_amount_usd_constant, 'year': c.year})), d=>d.donor); 

  // filln dataset 
  const filln = Array.from(filtered, ([donor, recipients]) => {
        const temp = d3.rollup(recipients, rec=>d3.sum(rec.map(d=>d.amount)), d=>d.recipient);
        const temp_arr = Array.from(temp, ([recipient, amount])=>({recipient, amount}));
                                    
        return {
          'donor': donor, 
          'recipients': temp_arr,  } } );
  
const no =filln.map(d=>  d.recipients.map(e=> e.amount) )
 
 var donationRange = [];
  var i;
  var j;   
  for( i = 0; i < no.length;i++){
   var value = no[i];

   for( j = 0; j < no[i].length; j++){
      var innerValue = no[i][j];
      donationRange.push(innerValue)
   }
}



// SVG Layout

const margin = {top: 10, right: 30, bottom: 20, left: 40};
width = 500;
height = 400;
const visWidth = width - margin.left - margin.right;
const visHeight = height - margin.top - margin.bottom;

const svg = div.append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)

const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

// add title

g.append("text")
.attr("x", visWidth / 2)
.attr("y", -margin.top)
.attr("text-anchor", "middle")
.attr("dominant-baseline", "hanging")
.attr("font-family", "sans-serif")
.attr("font-size", "8px")
.text("Overview of aids provided");

// add legend
const maxRadius = 6;
const radius = d3.scaleSqrt()
              .domain(d3.extent(donationRange))
              .range([1, maxRadius]);

const legend = g.append("g")
.attr("transform", `translate(${visWidth + margin.right - 30}, 0)`)
.selectAll("g")
.data([100000,10000000, 100000000, 1000000000, 10000000000, 100000000000])
.join("g")
.attr("transform", (d, i) => `translate(0, ${i * 2.5 * maxRadius})`);

legend.append("circle")
.attr("r", d => radius(d))
.attr("fill", "steelblue");

legend.append("text")
.attr("font-family", "sans-serif")
.attr("dominant-baseline", "middle")
.attr("x", maxRadius+5)
.text(d => d/1000000+'M' )
.attr("font-size","4px");

const x = d3.scalePoint()
      .domain(recipient)
      .range([0, visWidth])
      .padding(0.5);

//x axis
const xAxis = d3.axisBottom(x);

g.append("g")
  
  .call(xAxis)
  .attr("transform", `translate(0, ${visHeight/2})`)
  .selectAll("text")	
  .style("text-anchor", "end")
  .attr("font-size","4px")
  .attr("dx", "-.4em")
  .attr("dy", ".10em")
  .attr("transform", "rotate(-65)");
    
  const y = d3.scalePoint()
      .domain(donors)
      .range([0, visHeight/2])
      .padding(0.5);
      //.paddingInner(0.2);


      const yAxis = d3.axisLeft(y);
  
      g.append("g")
          .call(yAxis)
          .selectAll("text")	
          .style("text-anchor", "end")
          .attr("font-size","4px")
          //.call(g => g.selectAll(".domain").remove())
       
          
          

const rows = g.selectAll(".row")
          .data(filln)
          .join("g")
            .attr("transform", d => `translate(0, ${y(d.donor)})`);
        
        
        
            rows.selectAll("circle")
          .data(d => d.recipients)
          .join("circle")
            .attr("cx", d => x(d.recipient))
            .attr("cy", d => 0)
            .attr("fill", "steelblue")
            .attr("r", d => radius(d.amount));    



}