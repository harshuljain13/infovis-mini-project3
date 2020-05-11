function legend2(div, color) {
  const size = 10;
  const lineHeight = size * 1.5;

  const svg = div.append("svg");
  
  const rows = svg
    .selectAll("g")
    .data(color.domain())
    .join("g")
    .attr("transform", (d, i) => `translate(0, ${i * lineHeight})`);

  rows
    .append("rect")
    .attr("height", size)
    .attr("width", size)
    .attr("fill", d => color(d));

  rows
    .append("text")
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .attr("dominant-baseline", "hanging")
    .attr("x", lineHeight)
    .text(d => d);
}


function vis2(data2, div) {
 
  purpose =d3.rollup(data2, d=> d,aid=> aid.coalesced_purpose_name)

const fpurpose =Array.from(purpose, ([purpose, pdata]) => {
    return {
     'purpose' : purpose,
      'count' : pdata.length
    }  
  })
  



  top_5 =fpurpose.sort((a,b) => d3.descending(a.count, b.count)).slice(0,5)

 
 
  filtered =d3.rollup(aiddataset_recipient_filtered, d=> d.map(c=>({

    recipient:  c.recipient,
    
    amount: c.commitment_amount_usd_constant,
        'year': c.year
    
    })), d=>d.donor); 



    //filln data set
   
  
      const filln = Array.from(filtered, ([donor, recipients]) => {
        
        const temp = d3.rollup(recipients, rec=>d3.sum(rec.map(d=>d.amount)), d=>d.recipient);
        const temp_arr = Array.from(temp, ([recipient, amount])=>({recipient, amount}));
                                    
        return {
          'donor': donor, 
          'recipients': temp_arr,
        }
        }
        );
     

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
      
     

      color = d3.scaleOrdinal(d3.schemeCategory10)


      path = d3.arc().outerRadius(20 - 2).innerRadius(0)
      

      purpose_array = [...new Set(top_5.map(bill => bill.purpose))]
      

      purpose_filtered =aiddataset_recipient_filtered.filter(d=> purpose_array.includes(d.coalesced_purpose_name) )
     
      
purpose_Filtered_map=Array.from(d3.rollup(purpose_filtered, 
  rec=>Array.from(d3.rollup(rec, r=>r, d=>d.recipient),
                 ([recipient,  purposes])=>{
   
   return {
     recipient: recipient,
     recpt_data: Array.from(d3.rollup(purposes,
                           v=>d3.sum(v.map(w=>w.commitment_amount_usd_constant)), 
                           u=>u.coalesced_purpose_name), 
                            ([purpose, amount])=> ({purpose, amount}))
   }

 }
                                    
                                    
                                   
                                   
), d=> d.donor), ([donor, recipients]) => ({donor, recipients}))
     
pie2 = d3.pie()
	.value(d => d.amount)

//Top donor and recipient

donor_country=d3.rollup(data2, d=> d3.sum(d.map(d=> d.commitment_amount_usd_constant) ), d=> d.donor)

donor_amount_sorted = Array.from(donor_country, ([country, amount]) => ({country, amount}))

donor_set = donor_amount_sorted.slice()
  .sort((a, b) => d3.descending(a.amount, b.amount))
  .slice(0, 20)

  donors=donor_set.map(d => d.country)


  aiddataset_filtered_by_donors =data2.filter(d=> donors.includes(d.donor) )


  recipient_country=d3.rollup(data2, d=> d3.sum(d.map(d=> d.commitment_amount_usd_constant) ), d=> d.recipient)


  recipient_amount_sorted = Array.from(recipient_country, ([country, amount]) => ({country, amount}))

  recipient_set = recipient_amount_sorted.slice()
  .sort((a, b) => d3.descending(a.amount, b.amount))
  .slice(0, 10)


  recipient= recipient_set.map(d => d.country)



  aiddataset_recipient_filtered =aiddataset_filtered_by_donors.filter(d=> recipient.includes(d.recipient) )




//Drawing Graph 

const margin = {top: 5, right: 30, bottom: 50, left: 70};
width = 500;
height = 600;
const visWidth = 500 - margin.left - margin.right;
const visHeight = 600 - margin.top - margin.bottom;

//color
color = d3.scaleOrdinal(d3.schemeCategory10).domain(purpose_array)
legend2(div, color);

const svg = div.append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)

const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

const x = d3.scalePoint()
      .domain(recipient)
      .range([0, visWidth])
      .padding(0.4);

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
    
  const y = d3.scalePoint()
      .domain(donors)
      .range([0, visHeight/2])
      .padding(0.45);
      //.paddingInner(0.2);


      const yAxis = d3.axisLeft(y);
  
      g.append("g")
          .call(yAxis)
          .selectAll("text")	
          .style("text-anchor", "end")
          .attr("font-size","4px")
          //.call(g => g.selectAll(".domain").remove())
       
          const maxRadius = 10;
          const radius = d3.scaleSqrt()
              .domain(d3.extent(donationRange))
              .range([1,2]);



              //path
              path = d3.arc().outerRadius(8 - 2).innerRadius(0)



//pie function

pie2 = d3.pie()
  .value(d => d.amount)
  
const rows = g.selectAll(".row")
    .data(purpose_Filtered_map)
    .join("g")
      .attr("transform", d => `translate(0, ${y(d.donor)})`);
  
let arcgps = rows.selectAll('g').data(d=> d.recipients)
.join('g')
  .attr("transform", d => `translate(${x(d.recipient)}, 0)`);
 
let arc = arcgps.selectAll('.arc').data(d=>pie2(d.recpt_data))
         .join('g')
  .classed('arc', true);
 
 
 arc.append('path')
  	.attr('d', path)
  	.attr('fill', d => color(d.data.purpose))

  //End bracet
      }