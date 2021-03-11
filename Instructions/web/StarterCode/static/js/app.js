var globalData;

d3.json("samples.json") .then((data)=> {
    globalData = data;
    d3.select("#selDataset")
    .selectAll("option")
    .data(data.names.map(x => x))
    .enter()
    .append("option")
    .text(d =>d)
    .attr("value", d => d);
    
    optionChanged("940");


});

function optionChanged(selectedValue){
    let dataSet = globalData.samples.filter(x => x.id == selectedValue)[0];
    _log(data);
    let barChartDataFormatted = [];
    for (let i = 0; i < dataSet.otu_ids.length; i++ ){
        barChartDataFormatted.push({"otu_id":dataSet.otu_ids[i], "sample_value":dataSet.sample_values[i]});
    }

    barChartDataFormatted = barChartDataFormatted.sort( (a, b)=> b.sample_value - a.sample);
    barChartDataFormatted = barChartDataFormatted.slice(0, 10);
    var data = [{
        type: 'bar',
        x: barChartDataFormatted.map(x => x.sample_value).reverse(),
        y: barChartDataFormatted.map(x => "OTU " + x.otu_id).reverse(),
        orientation: 'h'
    }];


    Plotly.newPlot('bar', data);



    var trace1 = {
        x: barChartDataFormatted.map(x => +x.otu_id),
        y: barChartDataFormatted.map(x => x.sample_value),
        mode: 'markers',
        marker: {
            color: barChartDataFormatted.map(x => +x.otu_id),
            size: barChartDataFormatted.map(x => x.sample_value)
          }
        };

        var data = [trace1];

        var layout = {
          title: '',
          showlegend: false,
          height: window.innerHeight/1.5,
          width: window.innerWidth/1.5  
        };


        
        Plotly.newPlot('bubble', data, layout);

        let [personalInfo] = globalData.metadata.filter(x => +x.id == +selectedValue);
        let personalHtml = d3.select("#sample-metadata");
        personalHtml.html(null);
        personalHtml.append("div").text("Id: " + personalInfo.id);
        personalHtml.append("div").text("Ethnicity: " + personalInfo.ethnicity);
        personalHtml.append("div").text("Gender: " + personalInfo.gender);
        personalHtml.append("div").text("Location: " + personalInfo.location);
        personalHtml.append("div").text("bbtype: " + personalInfo.bbtype);
        personalHtml.append("div").text("wfreq: " + personalInfo.wfreq);
    }

    function _log(str){
        console.log(str);
    }
 