function createBar() {
  d3.csv('https://raw.githubusercontent.com/shaukat-2/DataVisualizationProject/main/Top10CountriesStat.csv')
    .then(function (data) {
      var selection = d3.select("#selectmenu").style("left", "70%").style("top", "40%").append("text").attr("class", "label").text("Make Selection: ")
        .append("select")
        .attr("id", "option-selector")
        .selectAll("option")
        .data(selectionValue)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value", (d, i) => i)

      CasesY = data.map(function (d) { return d.New_cases })
      DeathsY = data.map(function (d) { return parseInt(d.New_deaths) })
      CountriesX = data.map(function (d) { return d.Country })
      df = data
      selectedOption = 0
      UpdateData(selectedOption)

    }
    )
    .catch(function (error) {
      console.log(error)
    })
}

function UpdateData(selectedOption) {
  d3.select("svg").remove();
  var ys
  if (selectedOption == 0) { ys = d3.scaleLinear().domain([0, d3.max(CasesY)]).range([height, 0]); }
  else {
    ys = d3.scaleLinear().domain([0, d3.max(DeathsY)]).range([height, 0]);
  }

  s2 = "<h4>This bar plot shows 10 countries with highest number of COVID cases. Drop down menu let's you toggle between confirmed Cases and Deaths stats in these 10 countries.</h4>"
  s1 = "<h1>Top 10 Countries by COVID spread</h1>"
  s3 = "<h4 style='color:chocolate'>Hover on bars to find out more!!!</h4>"
  heading = s1+s2+s3
  d3.select("#description").html(heading)

  var svg = d3.select("#my_dataviz").append("svg").attr("width", window.innerWidth).attr("height", window.innerHeight)

  var xs = d3.scaleBand().domain(CountriesX).range([0, width]).padding(.1);

  var blues = d3.scaleOrdinal(d3.schemeBrBG[10]);

  var prevColor = ''
  var newColor = ''


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


  d3.select("svg")
    .append("g")
    .attr("transform", "translate(" + margin2 + "," + margin + ")")
    .call(d3.axisLeft(ys).tickFormat(d3.format("~s")))

  d3.select("svg")
    .append("g")
    .attr("transform", "translate(" + margin2 + "," + (height + margin) + ")")
    .call(d3.axisBottom(xs))


  var dots = d3.select("svg")
    .append("g")
    .attr("transform", "translate(" + margin2 + "," + margin + ")")
    .selectAll('rect')
    .data(df)
    .enter()
    .append('rect')
    .attr('x', function (d, i) { return xs(d.Country); })
    .attr('width', xs.bandwidth())
    .attr("y", d => { return height; })
    .attr("height", 0)
  dots.transition()
    .duration(750)
    .delay(function (d, i) {
      return i * 150;
    })
    .attr('y', function (d, i) {
      if (selectedOption == 0)
        val = ys(d.New_cases);
      else { val = ys(d.New_deaths); }
      return val
    })
    .attr('height', function (d) {
      if (selectedOption == 0)
        val = height - ys(d.New_cases);
      else { val = height - ys(d.New_deaths); }
      return val
    })
    .attr("fill", function (d) { return blues(d.Country); })
    .text(d => d.value)
  dots.on("mouseover", function (d) {
    prevColor = this.style.fill;
    newColor = d3.rgb(d3.select(this).attr("fill"));
    consistentColor = newColor;
    newColor = newColor.darker(1);
    d3.select(this)
      .style('fill', newColor)
    f = d3.format(".2s")
    // tooltip.select("p").html(d.Country + "<br />Cases: " + f(d.New_cases) + "<br />Deaths: " + f(d.New_deaths)+ "<br />Click to drill."); return tooltip.style("visibility", "visible")})
    tooltip.select("p").html(d.Country + "<br />Click to drill."); return tooltip.style("visibility", "visible")
  })
    .on("mousemove", function () { return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px"); })
    .on("mouseout", function () {
      d3.select(this).style('fill', prevColor)
      return tooltip.style("visibility", "hidden")
    })
    .on("click", function (d, i) {

      selectedCountry = d.Country;
      d3.select("#my_dataviz").html("")
      d3.select("#description").html("")
      createPie(selectedCountry, selectedOption, consistentColor);
    })

  d3.select("#option-selector")
    .on("change", function (d) {

      UpdateData(this.value)
    })
}

