function createBar2(selectedCountry, selectedOption, consistentColor, selectedyear) {

  var filteredData

  d3.csv('https://raw.githubusercontent.com/shaukat-2/DataVisualizationProject/main/top10CountriesMonthly.csv')
    .then(function (data) {
      filteredData = data.filter(function (d) {
        console.log(selectedyear)
        return (d["Country"] === selectedCountry && d["year"] === selectedyear)
      })
      var selection = d3.select("#selectmenu").style("left", "80%").style("top", "30%")

      CasesY = filteredData.map(function (d) { return parseInt(d.New_cases) })
      DeathsY = filteredData.map(function (d) { return parseInt(d.New_deaths) })
      MonthX = filteredData.map(function (d) { return d.monthname })
      df = filteredData
      UpdateBar2(selectedOption, selectedCountry, filteredData, consistentColor, selectedyear, CasesY, DeathsY, MonthX)

    }
    )
    .catch(function (error) {
      console.log(error)
    })
}

function UpdateBar2(selectedOption, selectedCountry, filteredData, consistentColor, selectedyear, CasesY, DeathsY, MonthX) {
  d3.selectAll("svg").remove();

  if (selectedOption == 0) { ss = 'Cases' } else { ss = "Deaths" }
  s2 = "<h4>This bar chart shows monthly distribution of confirmed " + ss + " in " + selectedCountry + " for the year " + selectedyear + "</h4>"
  s1 = "<h1>Year: " + selectedyear + " Distribution of COVID " + ss + " for " + selectedCountry + "</h1>"
  s3 = "<h4 style='color:"+consistentColor+"'>Hover on bars to find out more!!!</h4>"
  heading = s1 + s2 + s3
  d3.select("#description").html(heading)

  var ys
  if (selectedOption == 0) { ys = d3.scaleLinear().domain([0, d3.max(CasesY)]).range([height, 0]); }
  else {
    ys = d3.scaleLinear().domain([0, d3.max(DeathsY)]).range([height, 0]);
  }

  var svg = d3.select("#my_dataviz").append("svg").attr("width", window.innerWidth).attr("height", window.innerHeight)

  label_annotate = "Click on any bar to end.";

  const annotations = [
    {
      type: d3.annotationCalloutElbow,
      note: {
        label: label_annotate,
        wrap: 250
      },
      connector: {
        end: "arrow"
      },
      x: 900,
      y: 350,
      //data: { date: "18-Sep-09", close: 185.02 },
      dy: -60,
      dx: 60
    }].map(function (d) { d.color = consistentColor.darker(1); return d });

  const makeAnnotations = d3.annotation()
    .type(d3.annotationLabel)
    .annotations(annotations);

  svg
    .append("g").attr("transform", "translate(" + 250 + "," + 80 + ")")
    .attr("class", "annotation-group")
    .call(makeAnnotations)

  var xs = d3.scaleBand().domain(MonthX).range([0, width]).padding(.1);
  var color = consistentColor;

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
    .selectAll("text")
    .style("font-weight", "bold;")
    .style("font-size", "12px;");

  d3.select("svg")
    .append("g")
    .attr("transform", "translate(" + margin2 + "," + (height + margin) + ")")
    .call(d3.axisBottom(xs))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-1em")
    .attr("dy", "-0.5em")
    .attr("transform", "rotate(-60)")
    .style("font-weight", "bold;")
    .style("font-size", "12px;");


  var dots = d3.select("svg")
    .append("g")
    .attr("transform", "translate(" + margin2 + "," + margin + ")")

  rects = dots.selectAll('rect')
    .data(df)
    .enter()
    .append('rect')
    .attr('x', function (d, i) { return xs(d.monthname); })
    .attr('width', xs.bandwidth())
    .attr("y", d => { return height; })
    .attr("height", 0)
  rects.transition()
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
    .attr("fill", color)
    .text(d => d.value)


  var texts = dots.selectAll(".myLabels")
    .data(filteredData)
    .enter()
    .append("text")
    .attr("class", "myLabels");

  texts.attr('x', function (d, i) { return xs(d.monthname); })
    .attr('width', xs.bandwidth())
    .attr("y", d => { return height; })
    .attr("height", 0)
    .attr("text-anchor", "middle")
    .style("font-weight", "bold;")
    .attr("fill", function (d) {
      nColor = d3.rgb(color);
      var bright_or_dark = 0.2126 * nColor.r + 0.7152 * nColor.g + 0.0722 * nColor.b;
      if (bright_or_dark <= 200) {
        return nColor
      }
      else {
        return nColor.darker(1)
      }
    });

  texts.transition()
    .duration(750)
    .delay(function (d, i) {
      return i * 150;
    })
    .text(function (d) {
      f = d3.format(".2s"); if (selectedOption == 0) { return f(d.New_cases); } else { return f(d.New_deaths) }
    })
    .attr("x", function (d, i) {
      return xs(d.monthname) + (xs.bandwidth() / 2);
    })
    .attr("y", function (d) {
      if (selectedOption == 0) { return ys(d.New_cases) - 2; } else { return ys(d.New_deaths) - 2 };
    })
    .attr('height', function (d) {
      return 0
    })
    .attr("text-anchor", "middle")
    .style("font-weight", "bold;")
    .attr("fill", function (d) {
      nColor = d3.rgb(color);
      var bright_or_dark = 0.2126 * nColor.r + 0.7152 * nColor.g + 0.0722 * nColor.b;
      if (bright_or_dark <= 200) {
        return nColor
      }
      else {
        return nColor.darker(1)
      }
    });




  rects.on("mouseover", function (d) {
    prevColor = this.style.fill;
    newColor = d3.rgb(d3.select(this).attr("fill"));
    consistentColor = newColor;
    newColor = newColor.darker(1);
    d3.select(this)
      .style('fill', newColor)
    f = d3.format(".2s")
    if (selectedOption == 0) {
      tip_s = "Confirmed " + ss + ":" + f(d.New_cases)
    }
    else {
      tip_s = "Confirmed " + ss + ":" + f(d.New_deaths)
    }
    // tooltip.select("p").html(d.Country + "<br />Cases: " + f(d.New_cases) + "<br />Deaths: " + f(d.New_deaths)+ "<br />Click to drill."); return tooltip.style("visibility", "visible")})
    tooltip.select("p").html(tip_s); return tooltip.style("visibility", "visible")
  })
    .on("mousemove", function () { return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px"); })
    .on("mouseout", function () {
      d3.select(this).style('fill', prevColor)
      return tooltip.style("visibility", "hidden")
    })
    .on("click", function (d, i) {
      d3.selectAll("div").html("")
      d3.select("#my_dataviz").html("<h1>Thank you, press the button below to restart.<h1>")
      d3.select("#my_dataviz").style("left", "80%").append("input")
        .attr("type", "button")
        .attr("class", "button")
        .attr("name", "Refresh")
        .attr("value", "Restart")
        .attr("onclick", "togglePressed()");
    })




  d3.select("#option-selector")
    .on("change", function (d) {
      UpdateBar2(this.value, selectedCountry, filteredData, consistentColor, selectedyear, CasesY, DeathsY, MonthX)
    })






}

