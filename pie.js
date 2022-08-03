function createPie(selectedCountry, selectedOption, consistentColor) {

  var filteredData

  d3.csv('https://raw.githubusercontent.com/shaukat-2/DataVisualizationProject/main/top10CountriesYearly.csv')
    .then(function (data) {
      filteredData = data.filter(function (d) {
        return (d["Country"] === selectedCountry)
      })

      // var selection = d3.select("#selectmenu").style("left", "80%").style("top", "30%")

      CasesY = filteredData.map(function (d) { return d.New_cases })
      DeathsY = filteredData.map(function (d) { return parseInt(d.New_deaths) })
      YearsX = filteredData.map(function (d) { return d.year })
      df = filteredData
      UpdatePie(selectedOption, selectedCountry, filteredData, consistentColor)

    }
    )
    .catch(function (error) {
      console.log(error)
    })
}

function UpdatePie(selectedOption, selectedCountry, filteredData, consistentColor) {
  d3.selectAll("svg").remove();

  if (selectedOption == 0) { ss = 'Cases' } else { ss = "Deaths" }
  s2 = "<h4>This pie chart shows year-wise distribution of confirmed " + ss + " in " + selectedCountry + "</h4>"
  s1 = "<h1>Year-Wise Distribution of COVID "+ ss+" for "+ selectedCountry +"</h1>"
  s3 = "<h4 style='color:chocolate'>Hover on slices to find out more!!!</h4>"
  heading = s1+s2+s3
  d3.select("#description").html(heading)

  var bright_or_dark = 0.2126 * consistentColor.r + 0.7152 * consistentColor.g + 0.0722 * consistentColor.b;

  if (bright_or_dark <= 150) {
    consistentColor1 = consistentColor.brighter(1)
    consistentColor2 = consistentColor1.brighter(1)
  }
  else {
    consistentColor1 = consistentColor.darker(1)
    consistentColor2 = consistentColor1.darker(1)
  }

  // ----------------
  // Create a tooltip
  // ----------------
  var tooltip = d3.select("#my_dataviz")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", 10)
    .style("visibility", "hidden");
  tooltip.append("p");

  var color = d3.scaleOrdinal([consistentColor, consistentColor1, consistentColor2]);

  w = window.innerWidth;
  h = window.innerHeight;
  radius = Math.min(width, height) / 2;

  var g = d3.select('#my_dataviz')
    .append("svg").attr("width", w).attr("height", h)
    .append("g")
    .attr("transform", `translate(${w / 2}, ${h / 2})`);

  var pie = d3.pie().value(function (d) {
    if (selectedOption == 0) {
      return d.New_cases;
    }
    else {
      return d.New_deaths;
    }
  });

  var path = d3.arc()
    .outerRadius(radius)
    .innerRadius(0);

  var arc = g.selectAll()
    .data(pie(filteredData))
    .enter()
    .append("g");

  piedots = arc.append("path")
    .attr("d", path)
    .attr("fill", function (d, i) {
      return color(i);
    })
    .attr("stroke", "white")
    .attr("stroke-width", "3px");


  var legend = d3.select("#my_dataviz").append("svg")
    .attr("class", "legend")
    .selectAll("g")
    .data(filteredData)//setting the data as we know there are only two set of data[programmar/tester] as per the nest function you have written
    .enter().append("g")
    .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function (d, i) {
      return color(d.year);
    });

  legend.append("text")
    .attr("x", 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .text(function (d) { return d.year; });




  piedots.on("mouseover", function (d) {
    f = d3.format(",.1~f");
    tooltip.select("p").html("Year: " + d.data.year + "<br />" + f((d.endAngle - d.startAngle) / (2 * Math.PI) * 100) + "%<br/>Click for details."); return tooltip.style("visibility", "visible")
  })
    .on("mousemove", function () { return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px"); })
    .on("mouseout", function () {
      return tooltip.style("visibility", "hidden")
    })
    .on("click", function (d, i) {
      selectedyear = d.data.year;
      console.log(selectedyear)
      prevColor = this.style.fill;
      newColor = d3.rgb(d3.select(this).attr("fill"));
      consistentColor = newColor;
      d3.select("#my_dataviz").html("")
      d3.select("#description").html("")
      createBar2(selectedCountry, selectedOption, consistentColor,selectedyear);
    })

  d3.select("#option-selector")
    .on("change", function (d) {
      UpdatePie(this.value, selectedCountry, filteredData, consistentColor)
    })





}

