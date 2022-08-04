function createBar() {
  d3.csv('https://raw.githubusercontent.com/shaukat-2/DataVisualizationProject/main/Top10CountriesStat.csv')
    .then(function (data) {
      var selection = d3.select("#selectmenu").style("left", "70%").style("top", "40%").append("text").attr("class", "label").text("Make Selection: ")
      selection.append("select")
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
  heading = s1 + s2 + s3
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

  if (selectedOption == 0) {
    label_annotate = "India is an underdeveloping country while USA is developed. This indicates that COVID Spread rate is not related to how good medical facilities are. Click on bars to drill down.";

    const annotations = [
      {
        type: d3.annotationCalloutElbow,
        note: {
          label: label_annotate,
          wrap: 300
        },
        connector: {
          end: "arrow"
        },
        x: 100,
        y: 170,
        //data: { date: "18-Sep-09", close: 185.02 },
        dy: -60,
        dx: 60
      }].map(function (d) { d.color = "chocolate"; return d });

    const makeAnnotations = d3.annotation()
      .type(d3.annotationLabel)
      .annotations(annotations);

    svg
      .append("g").attr("transform", "translate(" + 250 + "," + 80 + ")")
      .attr("class", "annotation-group")
      .call(makeAnnotations)
  }
  else {
    label_annotate = "Brazil is an under-developing country while USA is first-world country. This indicates that COVID Spread rate is not related to how good medical facilities are. Click on bars to drill down.";

    const annotations = [
      {
        type: d3.annotationCalloutElbow,
        note: {

          label: label_annotate,
          wrap: 300
        },
        connector: {
          end: "arrow"
        },
        x: 180,
        y: 140,
        //data: { date: "18-Sep-09", close: 185.02 },
        dy: -60,
        dx: 60
      }].map(function (d) { d.color = "chocolate"; return d });

    const makeAnnotations = d3.annotation()
      .type(d3.annotationLabel)
      .annotations(annotations);

    svg
      .append("g").attr("transform", "translate(" + 250 + "," + 80 + ")")
      .attr("class", "annotation-group")
      .call(makeAnnotations)
  }

  d3.select("svg")
    .append("g")
    .attr("transform", "translate(" + margin2 + "," + margin + ")")
    .call(d3.axisLeft(ys).tickFormat(d3.format("~s")))
    .selectAll("text")
    .style("font-family", "Calibri, sans-serif;")
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
    .style("font-family", "Calibri, sans-serif;")
    .style("font-weight", "bold;")
    .style("font-size", "12px;");


  var dots = d3.select("svg")
    .append("g")
    .attr("transform", "translate(" + margin2 + "," + margin + ")")

  rects = dots.selectAll('rect')
    .data(df)
    .enter()
    .append('rect')
    .attr('x', function (d, i) { return xs(d.Country); })
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
    .attr("fill", function (d) { return blues(d.Country); })
    .text(d => d.value)


  var texts = dots.selectAll(".myLabels")
    .data(df)
    .enter()
    .append("text")
    .attr("class", "myLabels");

  texts.attr('x', function (d, i) { return xs(d.Country); })
    .attr('width', xs.bandwidth())
    .attr("y", d => { return height; })
    .attr("height", 0)
    .attr("text-anchor", "middle")
    .style("font-family", "Calibri, sans-serif;")
    .style("font-weight", "bold;")
    .style("font-size", "12px;")
    .attr("fill", function (d) {
      nColor = d3.rgb(blues(d.Country));
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
      return xs(d.Country) + (xs.bandwidth() / 2);
    })
    .attr("y", function (d) {
      if (selectedOption == 0) { return ys(d.New_cases) - 2; } else { return ys(d.New_deaths) - 2 };
    })
    .attr('height', function (d) {
      return 0
    })
    .attr("text-anchor", "middle")
    .style("font-family", "Calibri, sans-serif;")
    .style("font-weight", "bold;")
    .style("font-size", "12px;")
    .attr("fill", function (d) {
      nColor = d3.rgb(blues(d.Country));
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
    tooltip.select("p").html(d.Country + "<br />Cases: " + f(d.New_cases) + "<br />Deaths: " + f(d.New_deaths)); return tooltip.style("visibility", "visible")
    //tooltip.select("p").html(d.Country); return tooltip.style("visibility", "visible")
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

