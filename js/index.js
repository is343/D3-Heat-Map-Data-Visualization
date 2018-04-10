const height = 400, width = 800, 
      margin = {
        left: 120, right: 20, top: 20, bottom: 70
      },
      url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json",
      months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      color = ["#5e4fa2", "#3288bd", "#66c2a5", "#abdda4", "#e6f598", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d53e4f", "#9e0142"];


d3.json(url, (error, data) => {
      if (error) {
        throw new Error(console.error);
      }
      else {
    data = data.monthlyVariance;
    data.map((d) => {
      d.month = months[d.month - 1];
      d.year = d3.timeParse(d.year.toString());
    })

    const canvas = d3.select('svg').attrs({
      height: height + margin.top + margin.bottom,
      width: width + margin.left + margin.right
    });

    const group = canvas.append('g').attrs({
      transform: `translate(${margin.left}, ${margin.top})`
    });

    const div = d3.select('.tooltip');

    const xScale = d3.scaleTime().range([0, width]).domain(d3.extent(data, function (data) {
          return data.year;
        }));;
    const yScale = d3.scaleBand().domain(months).rangeRound([0, height]);
    
    const colorScale = d3.scaleQuantize().range(color).domain(d3.extent(data, function (d) {
          return d.variance;
        }));

    const barWidth = width / (data.length / 12)
    const barHeight = height / 12;

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(12);

    group.append('g').attrs({
      class: "xAxis",
      transform: `translate(0, ${(height)})`
    }).call(xAxis);
    group.append('g').attrs({
      class: "yAxis",
      transform: "translate(0,0)",
    }).call(yAxis);
    group.selectAll('g').data(data).enter().append('g').attrs({
      transform: function (data) {
        return `translate(${xScale(data.year)}, ${yScale(data.month)})`;
      }
    }).append('rect').attrs({ 
      width: barWidth,
      height: barHeight
    }).styles({ 
      fill: function (data) {
        return colorScale(data.variance);
      }
    }).on("mouseover", function (d) {
      div.transition().duration(10).style("opacity", 0.8).styles({
        left: `${(d3.event.pageX + 5)}px`,
        top: `${(d3.event.pageY +5)}px`
      });

      div.html(`<p>${d.month}, ${(d.year)}</p></p>${(8.66 + d.variance).toFixed(2)} °C</p>`);
    }).on("mouseout", function (d) {
      div.transition().duration(100).style("opacity", 0);
    });


    const legendSize = 30


        const legend = canvas.append("g").attr("class", "legend")

        legend.selectAll("rect")
          .data(color).enter().append("rect")
          .attr("x", (d, i) => i * legendSize)
          .attr("y", 25)
          .attr("width", legendSize)
          .attr("height", legendSize)
          .attr("fill", d => d)

        const ticks = d3.range(color.length + 1)
        legend.selectAll("text")
          .data(ticks).enter()
          .append("text")
          .text(d => formatLegendText(d))
          .attr("x", d => d * legendSize)
          .attr("y", 65)
          .attr("fill", "black")
          .attr("font-size", 10)
          .attr("text-anchor", "middle")

        legend.attr("transform", `translate(${(width - 250)}, ${(height + 15)})`)


        function formatLegendText(i) {
          const minVar = -6.976
          const maxVar = 5.228
          const spread = (maxVar - minVar) / color.length
          console.log(maxVar, minVar, color.length);
          return ((i) * spread + minVar).toFixed(1)
        }

  }});