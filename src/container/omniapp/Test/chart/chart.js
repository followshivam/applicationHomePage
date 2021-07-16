
  export const HeatChartData ={
    series: [{
      name: 'Monday',
      data: [{x:"Alexander",y:"10",},{x:"Marie",y:"92",},{x:"Maximilian",y:"35",},{x:"Sophia",y:"72",},{x:"Lukas",y:"38",}]
    },
    {
      name: 'Tuesday',
      data: [{x:"Alexander",y:"19",},{x:"Marie",y:"58",},{x:"Maximilian",y:"15",},{x:"Sophia",y:"132",},{x:"Lukas",y:"5",}]
    },
    {
      name: 'Wednesday',
      data: [{x:"Alexander",y:"8",},{x:"Marie",y:"78",},{x:"Maximilian",y:"123",},{x:"Sophia",y:"114",},{x:"Lukas",y:"8",}]
    },
    {
      name: 'Thursday',
      data: [{x:"Alexander",y:"24",},{x:"Marie",y:"117",},{x:"Maximilian",y:"64",},{x:"Sophia",y:"19",},{x:"Lukas",y:"117",}]
    },
    {
      name: 'Friday',
      data: [{x:"Alexander",y:"67",},{x:"Marie",y:"48",},{x:"Maximilian",y:"52",},{x:"Sophia",y:"16",},{x:"Lukas",y:"115",}]
    }
    ],

    options: {
      chart: {
        // height: 350,
        type: 'heatmap',
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        heatmap: {
          enableShades: true,
          shadeIntensity: 1,
          radius: 0,
          useFillColorAsStroke: false,
          colorScale: {
            ranges: [{
                from: 0,
                to: 25,
                color: '#FFFFFF'
              },{
                from: 25,
                to: 50,
                color: '#e0eefb'
              },
              {
                from: 50,
                to: 75,
                color: '#c0dbf6'
              },
              {
                from: 75,
                to: 100,
                color: '#bbd9f5'
              },
              {
                from: 100,
                to: 125,
                color: '#99c5f0'
              },
              {
                from: 125,
                to: 150,
                color: '#8cbeee'
              }
            ]
          }
        }
      },
      responsive: [{
        breakpoint: 450,
        options: {
          chart: {
            // height: 250,
            toolbar: {
              show: false,
            },          },
        },
    }],
      xaxis: {
        title: {
          text: 'Employee'
        }
      },
        yaxis: {
        title: {
          text: 'Days'
        }
      },
      dataLabels: {
        enabled: true,
        style: {
        colors: ['#000000']
       }
      },
        colors: ["#00FF00"],
        title: {
          // text: 'Sales per employee per weekday',
          text: '',
          align: 'center'
        },
    
    },
  };
    
    