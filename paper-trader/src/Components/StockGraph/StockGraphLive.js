import React, { Component} from "react";
import CanvasJSReact from '../../canvasjs.stock.react';

const CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

let currentTime =  Date.now() -  (86400000 * 2) - (3600000*7)
var temp1 = [], temp2 = [], tempy = []


class StockGraphLive extends Component {

  
  constructor() {
    super();
    this.state = { dataPoints1: [], dataPoints2: [], isLoaded: false};
    this.updateChart = this.updateChart.bind(this);
  }

  
  componentDidMount() {
    fetch("https://api.tdameritrade.com/v1/marketdata/"+this.props.ticker+"/pricehistory?apikey=LSVZWEQEHTTZGGWUYS1ZKNA0OAQCCVDD&periodType=day&period=1&frequencyType=minute&frequency=1&needExtendedHoursData=false")
    .then(res => res.json())
    .then(
      (data) => {
        let dps1 = [], dps2 = [];


        for (var i = 0; i < data.candles.length; i++) {
          if(new Date(data.candles[i].datetime) <= currentTime){
            dps1.push({
              x: new Date(data.candles[i].datetime),
              y: [
                Number(data.candles[i].open),
                Number(data.candles[i].high),
                Number(data.candles[i].low),
                Number(data.candles[i].close)
              ]
            });
  
            dps2.push({x: new Date(data.candles[i].datetime), y: Number(data.candles[i].close)});
  
          }
          
          if(new Date(data.candles[i].datetime) > currentTime){
            tempy.push({
              ary : [
              new Date(data.candles[i].datetime),
              Number(data.candles[i].open),
              Number(data.candles[i].high),
              Number(data.candles[i].low),
              Number(data.candles[i].close)
              ]
            });
          }
           
        }

        temp1 = dps1;
        temp2 = dps2;

        this.setState({
          isLoaded: true,
          dataPoints1: dps1,
          dataPoints2: dps2,
          
        });
      }
    )
    
    // render on 30sec interval
  //  const x = setInterval(() => {
  //     this.updateChart();
  //   }, 30000);
  //   return () => clearInterval(x);
  setTimeout(this.updateChart,1000);
}

  
  updateChart(prevProps) {
    console.log("here");
    let Time =  Date.now() -  (86400000 * 2) - (3600000*7)
    
    
    for (var i = 0; i < tempy.length; i++) {
      if(new Date(tempy[i].ary[0]) <= Time){
       temp1.push({
       x: new Date(tempy[i].ary[0]),
        y: [
          Number(tempy[i].ary[1]),
          Number(tempy[i].ary[2]),
          Number(tempy[i].ary[3]),
          Number(tempy[i].ary[4])
          ]
          });
  
          temp2.push({x: new Date(tempy[i].ary[0]), y: Number(tempy[i].ary[4])});
        }
      }
            
    this.setState({
      isLoaded: true,
      dataPoints1: temp1,
      dataPoints2: temp2,
    });
      
    this.chart.render();
    console.log("updated");
    
    setTimeout(this.updateChart,1000);
  }
 
  render() {
    const options = {
      theme: "light1",
      
      title:{
        text: `${ this.props.title }`,
        fontFamily: 'Arial',
        fontColor: '#484a4d'
      },
      
     
      charts: [{
        
        axisX: {
          lineThickness: 3,
          tickLength: 0,
       
          valueFormatString: "h:mm",
        
          crosshair: {
            enabled: true,
            snapToDataPoint: true,
            valueFormatString: "h:mm",
          }
        },
        axisY: {
          lineThickness: 3,
          title: "Price USD",
          prefix: "$",
          tickLength: 0
        },
        
        data: [{
          borderColor:"black",
          fallingColor: "#DD7E86",
          risingColor:"#33FF4C",
          name: "Price (in USD)",
          yValueFormatString: "$#,###.##",
          type: "candlestick",
          dataPoints : this.state.dataPoints1
        }]
      }],

      rangeSelector: {
        selectedRangeButtonIndex: 2,
        buttons: [{              
          rangeType: "all",
          label: "All" 
        },
        {
          range: 1, 
          rangeType: "hour",
          label: "1 Hour"
        },{            
          range: 30,
          rangeType: "minute",
          label: "30 Min"
        },{     
          range: 10,
          rangeType: "minute",
          label: "10 Min"
        },],
      },
    
     
      navigator: {
        data: [{
          lineColor:"#707C8F",
          fillOpacity: .3,
          dataPoints: this.state.dataPoints2
        }],
        slider: {
        }
      }
    };
    const containerProps = {
      width: "100%",
      height: "60vh",
      margin: "auto",
     
    };
    return (
      <div> 
        <div>
          {
            this.state.isLoaded && 
            <CanvasJSStockChart containerProps={containerProps} options = {options}
            onRef={ref => this.chart = ref}
            />
          }
        </div>
      </div>
    );
  }
}
export default StockGraphLive;  