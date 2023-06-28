
const firebaseConfig = {
  apiKey: "AIzaSyBm2atJDKZpTvpfFUZcVvlqF9yP0LaoKvs",
  authDomain: "greenponia-b8a97.firebaseapp.com",
  projectId: "greenponia-b8a97",
  storageBucket: "greenponia-b8a97.appspot.com",
  messagingSenderId: "352633184413",
  appId: "1:352633184413:web:69c661fc0100f9ed20f474",
  measurementId: "G-CFJZGNQWJ1"
};
var colorPalette = ['#00D8B6', '#008FFB', '#FEB019', '#FF4560', '#775DD0']
firebase.initializeApp(firebaseConfig);

window.Apex = {
  chart: {
    foreColor: '#ccc',
    toolbar: {
      show: false
    },
  },
  stroke: {
    width: 3
  },
  dataLabels: {
    enabled: false
  },
  tooltip: {
    theme: 'dark'
  },
  grid: {
    borderColor: "#535A6C",
    xaxis: {
      lines: {
        show: true
      }
    }
  }
};

// Obtener la colección "agroclima" de Firestore
const db = firebase.firestore();
db.collection("agroclima")
  .onSnapshot({ includeMetadataChanges: true }, (snapshot) => {

    const data = [];
    const realData = [];
    snapshot.forEach((doc) => {
      var phSeg = Number(doc.data().ph).toFixed(2);
      var condSeg = Number(doc.data().cond).toFixed(2);
      if (doc.id !== 'realtime') {
        const date = new Date(parseInt(doc.id));
        const getYear = date.toLocaleString("default", { year: "numeric" });
        const getMonth = date.toLocaleString("default", { month: "2-digit" });
        const getDay = date.toLocaleString("default", { day: "2-digit" });
        const timestamp = getMonth + "-" + getDay;
        const a = data.find(x => x.date == timestamp)
  
        if (timestamp == '06-20') {
          data.push({
            id: doc.id,
            cond: condSeg,
            crec: doc.data().crec,
            hum: doc.data().hum,
            ph: phSeg,
            temp: doc.data().temp,
            date: getMonth+"/"+getDay
          });
        }
  
        //console.log(data.map((d) => d.date));
      } else {
        realData.push({
          id: doc.id,
          cond: condSeg,
          crec: doc.data().crec,
          hum: doc.data().hum,
          ph: phSeg,
          temp: doc.data().temp,
        });
        //console.log(doc.id);
      }
      //console.log('onSnapshot', doc.id, doc.data());
    })

  var spark1 = {
    chart: {
      id: 'sparkline1',
      group: 'sparklines',
      type: 'area',
      height: 70,
      sparkline: {
        enabled: true
      },
    },
    stroke: {
      curve: 'straight'
    },
    fill: {
      opacity: 1,
    },
    series: [{
      name: 'PH',
      //data: data.map((d) => d.ph)
    }],
    labels: data.map((d) => d.date),
    yaxis: {
      min: 0
    },
    xaxis: {
      type: 'datetime',
    },
    colors: ['#00D8B6'],
    title: {
      text: realData.map((d) => d.ph),
      offsetX: 30,
      style: {
        fontSize: '24px',
        color:  '#000',
        cssClass: 'apexcharts-yaxis-title'
      }
    },
    subtitle: {
      text: 'PH',
      offsetX: 30,
      style: {
        fontSize: '14px',
        color:  '#000',
      }
    }
  }

  var spark2 = {
    chart: {
      id: 'sparkline2',
      group: 'sparklines',
      type: 'area',
      height: 70,
      sparkline: {
        enabled: true
      },
    },
    stroke: {
      curve: 'straight'
    },
    fill: {
      opacity: 1,
    },
    series: [{
      name: 'Conductividad',
      //data: data.map((d) => d.cond)
    }],
    labels: data.map((d) => d.date),
    yaxis: {
      min: 0
    },
    xaxis: {
      type: 'datetime',
    },
    colors: ['#008FFB'],
    title: {
      text: realData.map((d) => d.cond),
      offsetX: 30,
      style: {
        fontSize: '24px',
        color:  '#000',
        cssClass: 'apexcharts-yaxis-title'
      }
    },
    subtitle: {
      text: 'Conductividad',
      offsetX: 30,
      style: {
        fontSize: '14px',
        color:  '#000',
        cssClass: 'apexcharts-yaxis-title'
      }
    }
  }

  var spark3 = {
    chart: {
      id: 'sparkline3',
      group: 'sparklines',
      type: 'area',
      height: 70,
      sparkline: {
        enabled: true
      },
    },
    stroke: {
      curve: 'straight'
    },
    fill: {
      opacity: 1,
    },
    series: [{
      name: 'Humedad',
      //data: data.map((d) => d.hum)
    }],
    labels: data.map((d) => d.date),
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      min: 0
    },
    colors: ['#FEB019'],
    title: {
      text: realData.map((d) => d.hum),
      offsetX: 30,
      style: {
        fontSize: '24px',
        color:  '#000',
        cssClass: 'apexcharts-yaxis-title'
      }
    },
    subtitle: {
      text: 'Humedad',
      offsetX: 30,
      style: {
        fontSize: '14px',
        color:  '#000',
        cssClass: 'apexcharts-yaxis-title'
      }
    }
  }

  var spark4 = {
    chart: {
      id: 'sparkline4',
      group: 'sparklines',
      type: 'area',
      height: 70,
      sparkline: {
        enabled: true
      },
    },
    stroke: {
      curve: 'straight'
    },
    fill: {
      opacity: 1,
    },
    series: [{
      name: 'Crecimiento',
      //data: data.map((d) => d.hum)
    }],
    labels: data.map((d) => d.date),
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      min: 0
    },
    colors: ['#FEB019'],
    //colors: ['#5564BE'],
    title: {
      text: realData.map((d) => d.crec),
      offsetX: 30,
      style: {
        fontSize: '24px',
        color:  '#000',
        cssClass: 'apexcharts-yaxis-title'
      }
    },
    subtitle: {
      text: 'Crecimiento',
      offsetX: 30,
      style: {
        fontSize: '14px',
        color:  '#000',
        cssClass: 'apexcharts-yaxis-title'
      }
    }
  }

  var spark5 = {
    chart: {
      id: 'sparkline5',
      group: 'sparklines',
      type: 'area',
      height: 70,
      sparkline: {
        enabled: true
      },
    },
    stroke: {
      curve: 'straight'
    },
    fill: {
      opacity: 1,
    },
    series: [{
      name: 'Temperatura',
      //data: data.map((d) => d.hum)
    }],
    labels: data.map((d) => d.date),
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      min: 0
    },
    colors: ['#FEB019'],
    //colors: ['#5564BE'],
    title: {
      text: realData.map((d) => d.temp),
      offsetX: 30,
      style: {
        fontSize: '24px',
        color:  '#000',
        cssClass: 'apexcharts-yaxis-title'
      }
    },
    subtitle: {
      text: 'Temperatura',
      offsetX: 30,
      style: {
        fontSize: '14px',
        color:  '#000',
        cssClass: 'apexcharts-yaxis-title'
      }
    }
  }


  new ApexCharts(document.querySelector("#spark1"), spark1).render();
  new ApexCharts(document.querySelector("#spark2"), spark2).render();
  new ApexCharts(document.querySelector("#spark3"), spark3).render();
  new ApexCharts(document.querySelector("#spark4"), spark4).render();
  new ApexCharts(document.querySelector("#spark5"), spark5).render();


  //Humedad
  var optionsLine = {
    chart: {
      height: 328,
      type: 'line',
      zoom: {
        enabled: false
      },
      dropShadow: {
        enabled: true,
        top: 3,
        left: 2,
        blur: 4,
        opacity: 1,
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    colors: ["#FFD3A5"],
    series: [{
        name: "Humedad",
        data: data.map((d) => d.hum),
    }
    ],
    title: {
      text: 'Control de Humedad',
      align: 'left',
      style: {
        fontSize: '18px'
      }
    },
    markers: {
      size: 6,
      strokeWidth: 0,
      hover: {
        size: 9
      }
    },
    grid: {
      show: true,
      padding: {
        bottom: 0
      }
    },
    labels: data.map((d) => d.date),
    xaxis: {
      tooltip: {
        enabled: false
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      offsetY: -20
    }
  }

  var chartLine = new ApexCharts(document.querySelector('#line-humed'), optionsLine);
  chartLine.render();

  //PH    
  var optionsBar = {
    series: [
    {
      data: data.map((item) => item.ph),
    }
  ],
    chart: {
    height: 350,
    type: 'bar',
    zoom: {
      enabled: false
    }
  },
  plotOptions: {
    bar: {
      isDumbbell: false,
      columnWidth: 3,
      dumbbellColors: [['#00E396']]
    }
  },
  
  legend: {
    show: true,
    showForSingleSeries: true,
    position: 'top',
    horizontalAlign: 'left',
    customLegendItems: ['PH']
  },
  fill: {
    type: 'gradient',
    gradient: {
      type: 'vertical',
      gradientToColors: ['#00E396'],
      inverseColors: false
    }
  },
  labels: data.map((item) => item.date),
  title: {
    text: 'Control de PH',
    align: 'left',
    style: {
      fontSize: '18px'
    }
  },
  grid: {
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: false
      }
    }
  },
  xaxis: {
    tickPlacement: 'on'
  }
  };

  var chartBar = new ApexCharts(document.querySelector('#bar'), optionsBar);
  chartBar.render();



 //CONDUCTIVIDAD
 var optionsArea = {
 
 chart: {
  height: 328,
  type: 'line',
  zoom: {
    enabled: false
  },
  dropShadow: {
    enabled: true,
    top: 3,
    left: 2,
    blur: 4,
    opacity: 1,
  }
},
stroke: {
  curve: 'smooth',
  width: 2
},
colors: ["#2AFADF"],
series: [{
    name: "Conductividad",
    data: data.map((d) => d.cond),
}
],
title: {
  text: 'Conductividad',
  align: 'left',
  style: {
    fontSize: '18px'
  }
},
markers: {
  size: 6,
  strokeWidth: 0,
  hover: {
    size: 9
  }
},
grid: {
  show: true,
  padding: {
    bottom: 0
  }
},
labels: data.map((d) => d.date),
xaxis: {
  tooltip: {
    enabled: false
  }
},
legend: {
  position: 'top',
  horizontalAlign: 'right',
  offsetY: -20
}
}

var chartArea = new ApexCharts(document.querySelector('#area'), optionsArea);
chartArea.render();

//Crecimiento      
var optionsGrow = {
  series: [{
  name: 'Crecimiento',
  data: data.map((d) => d.crec)
}],
  chart: {
  type: 'bar',
  height: 350
},
plotOptions: {
  bar: {
    horizontal: false,
    columnWidth: '55%',
    endingShape: 'rounded'
  },
},
title: {
  text: 'Porcentaje de Crecimiento',
  align: 'left',
  style: {
    fontSize: '18px'
  }
},
dataLabels: {
  enabled: false
},
colors: ["#5961F9"],
stroke: {
  show: true,
  width: 2,
  colors: ['transparent']
},
xaxis: {
  categories: data.map((d) => d.date),
},
yaxis: {
  title: {
    text: '% de crecimiento'
  }
},
fill: {
  opacity: 1
},
tooltip: {
  y: {
    formatter: function (val) {
      return val + "%"
    }
  }
}
};

var chartGrow = new ApexCharts(document.querySelector("#chart-grow"), optionsGrow);
chartGrow.render();


//Temperatura

var temperature = {
  series: [{
  name: 'Temperatura',
  data: data.map((d) => d.temp)
}, ],
  chart: {
  height: 350,
  type: 'area'
},
dataLabels: {
  enabled: true
},
stroke: {
  curve: 'smooth'
},
labels: data.map((d) => d.date),
xaxis: {
  tooltip: {
    enabled: false
  }
},
colors: ["#5FF959"],
tooltip: {
  x: {
    format: 'dd/MM/yy HH:mm'
  },
},

title: {
  text: 'Temperatura',
  align: 'left',
  style: {
    fontSize: '18px'
  }
},
};

var areaTemp = new ApexCharts(document.querySelector("#area-temp"), temperature);
areaTemp.render();



 


  }, (error) => {
    console.error('onSnapshot error', error);
  });




function convertirFechaUnix(fechaUnix) {
  const fecha = new Date(fechaUnix * 1000); // Multiplicamos por 1000 para convertir los segundos a milisegundos
  return fecha;
}
