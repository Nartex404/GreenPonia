
const firebaseConfig = {
    apiKey: "AIzaSyBm2atJDKZpTvpfFUZcVvlqF9yP0LaoKvs",
    authDomain: "greenponia-b8a97.firebaseapp.com",
    projectId: "greenponia-b8a97",
    storageBucket: "greenponia-b8a97.appspot.com",
    messagingSenderId: "352633184413",
    appId: "1:352633184413:web:69c661fc0100f9ed20f474",
    measurementId: "G-CFJZGNQWJ1"
};
firebase.initializeApp(firebaseConfig);

// Obtener la colección "agroclima" de Firestore
const db = firebase.firestore();
const agroclimaCollection = db.collection('agroclima');
//console.log("Console1:"+JSON.stringify(agroRef));
//var agroclimaCollection = agroRef.where("ph","<","6.5");
//console.log("Console2:"+JSON.stringify(agroclimaCollection));

/*db.collection("agroclima").where("ph", "<", 6.5)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });*/

Apex.grid = {
  padding: {
    right: 0,
    left: 0
  }
}

Apex.dataLabels = {
  enabled: false
}

var randomizeArray = function (arg) {
  var array = arg.slice();
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// data for the sparklines that appear below header area
var sparklineData = [47, 45, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53, 61, 27, 54, 43, 19, 46];

// the default colorPalette for this dashboard
//var colorPalette = ['#01BFD6', '#5564BE', '#F7A600', '#EDCD24', '#F74F58'];
var colorPalette = ['#00D8B6','#008FFB',  '#FEB019', '#FF4560', '#775DD0']



agroclimaCollection.get().then((querySnapshot) => {
  //const data = querySnapshot.docs.map((doc) => doc.data());
  //const idElement = querySnapshot.docs.map((doc) => doc.id);

  const data = [];
  const realData = [];
  const date = [];
  let html ="";
  querySnapshot.forEach((doc) => {
    var phSeg = Number(doc.data().ph).toFixed(2);
    var condSeg = Number(doc.data().cond).toFixed(2);
      if (doc.id !== 'realtime'){
        const date = new Date(parseInt(doc.id));
        const getYear = date.toLocaleString("default", { year: "numeric" });
        const getMonth = date.toLocaleString("default", { month: "2-digit" });
        const getDay = date.toLocaleString("default", { day: "2-digit" });
        const timestamp = getMonth +"-"+getDay;
        const a = data.find(x=>x.date == timestamp)
        /*if(!a){
          data.push({
            id: doc.id,
            cond: condSeg,
            crec: doc.data().crec,
            hum: doc.data().hum ,
            ph: phSeg,
            temp: doc.data().temp,
            date: timestamp
          });
        }*/

        
        

        if(timestamp ==  '06-05')
        {
          data.push({
            id: doc.id,
            cond: condSeg,
            crec: doc.data().crec,
            hum: doc.data().hum ,
            ph: phSeg,
            temp: doc.data().temp,
            date: getDay
          });
        }
     
      //console.log(data.map((d) => d.date));
      }else{
        realData.push({
        id: doc.id,
        cond: condSeg,
        crec: doc.data().crec,
        hum: doc.data().hum ,
        ph: phSeg,
        temp: doc.data().temp,
      });
        //console.log(doc.id);
      }

  });



  

  var spark1 = {
    chart: {
      id: 'sparkline1',
      group: 'sparklines',
      type: 'area',
      height: 160,
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
        cssClass: 'apexcharts-yaxis-title'
      }
    },
    subtitle: {
      text: 'PH',
      offsetX: 30,
      style: {
        fontSize: '14px',
        cssClass: 'apexcharts-yaxis-title'
      }
    }
  }
  
  var spark2 = {
    chart: {
      id: 'sparkline2',
      group: 'sparklines',
      type: 'area',
      height: 160,
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
      data: data.map((d) => d.cond)
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
        cssClass: 'apexcharts-yaxis-title'
      }
    },
    subtitle: {
      text: 'Conductividad',
      offsetX: 30,
      style: {
        fontSize: '14px',
        cssClass: 'apexcharts-yaxis-title'
      }
    }
  }
  
  var spark3 = {
    chart: {
      id: 'sparkline3',
      group: 'sparklines',
      type: 'area',
      height: 160,
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
      data: data.map((d) => d.hum)
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
      text: realData.map((d) => d.hum),
      offsetX: 30,
      style: {
        fontSize: '24px',
        cssClass: 'apexcharts-yaxis-title'
      }
    },
    subtitle: {
      text: 'Humedad',
      offsetX: 30,
      style: {
        fontSize: '14px',
        cssClass: 'apexcharts-yaxis-title'
      }
    }
  }

  var spark4 = {
    chart: {
      id: 'sparkline3',
      group: 'sparklines',
      type: 'area',
      height: 160,
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
      data: data.map((d) => d.hum)
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
      text: realData.map((d) => d.hum),
      offsetX: 30,
      style: {
        fontSize: '24px',
        cssClass: 'apexcharts-yaxis-title'
      }
    },
    subtitle: {
      text: 'Humedad',
      offsetX: 30,
      style: {
        fontSize: '14px',
        cssClass: 'apexcharts-yaxis-title'
      }
    }
  }

  var spark5 = {
    chart: {
      id: 'sparkline3',
      group: 'sparklines',
      type: 'area',
      height: 160,
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
      data: data.map((d) => d.hum)
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
      text: realData.map((d) => d.hum),
      offsetX: 30,
      style: {
        fontSize: '24px',
        cssClass: 'apexcharts-yaxis-title'
      }
    },
    subtitle: {
      text: 'Humedad',
      offsetX: 30,
      style: {
        fontSize: '14px',
        cssClass: 'apexcharts-yaxis-title'
      }
    }
  }
  
  var monthlyEarningsOpt = {
    chart: {
      type: 'area',
      height: 260,
      background: '#eff4f7',
      sparkline: {
        enabled: true
      },
      offsetY: 20
    },
    stroke: {
      curve: 'straight'
    },
    fill: {
      type: 'solid',
      opacity: 1,
    },
    series: [{
      data: randomizeArray(sparklineData)
    }],
    xaxis: {
      crosshairs: {
        width: 1
      },
    },
    yaxis: {
      min: 0,
      max: 130
    },
    colors: ['#dce6ec'],
  
    title: {
      text: 'Total Earned',
      offsetX: -30,
      offsetY: 100,
      align: 'right',
      style: {
        color: '#7c939f',
        fontSize: '16px',
        cssClass: 'apexcharts-yaxis-title'
      }
    },
    subtitle: {
      text: '$135,965',
      offsetX: -30,
      offsetY: 100,
      align: 'right',
      style: {
        color: '#7c939f',
        fontSize: '24px',
        cssClass: 'apexcharts-yaxis-title'
      }
    }
  }
  
  
  new ApexCharts(document.querySelector("#spark1"), spark1).render();
  new ApexCharts(document.querySelector("#spark2"), spark2).render();
  new ApexCharts(document.querySelector("#spark3"), spark3).render();
  new ApexCharts(document.querySelector("#spark4"), spark4).render();
  new ApexCharts(document.querySelector("#spark5"), spark5).render();
  
  var monthlyEarningsChart = new ApexCharts(document.querySelector("#monthly-earnings-chart"), monthlyEarningsOpt);
  
  

  const optionsArea = {
    chart: {
      type: "area",
      height: 380,
      width: '100%',
      stacked: true,
    },
    title: {
      floating: false,
      text: 'Conductividad',
      align: 'left',
      style: {
        fontSize: '18px'
      }
    },
    dataLabels: {
      enabled: false
    },
    series: [
      {
        name: "Conductividad",
        data: data.map((d) => d.cond),
      }
    ],
    colors: ["#66DA26"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100]
      }
    },
    markers: {
      size: 5,
      colors: ["#66DA26"],
      strokeColor: "#00BAEC",
      strokeWidth: 3
    },
    xaxis: {
      categories: data.map((d) => d.date)
    }
  }
  const chartArea = new ApexCharts(document.querySelector('#area'), optionsArea);

//var chartArea = new ApexCharts(document.querySelector('#area'), optionsArea);
chartArea.render();

console.log("DATALENGHT",data.length)
console.log("paletENGHT",colorPalette.length)
const colorSequence = [];
    for (let i = 0; i < data.length; i++) {
      const colorIndex = i % colorPalette.length;
      colorSequence.push(colorPalette[colorIndex]);
    }

    console.log("DATALENGHT",colorSequence.length)

var optionsBar = {
  chart: {
    type: 'bar',
    height: 380,
    width: '100%',
    stacked: true,
  },
  colors: [function({ value, seriesIndex, w }) {
    if (value > 6) {
        return '#7E36AF'
    } else {
        return '#D9534F'
    }
  }],
  series: [{
    name: 'PH',
    data: data.map((item) => item.ph),
  }],
  labels: data.map((item) => item.date),
  xaxis: {
    labels: {
      show: false
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
  },
  yaxis: {
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    labels: {
      style: {
        colors: '#78909c'
      }
    }
  },
  title: {
    text: 'Control de PH',
    align: 'left',
    style: {
      fontSize: '18px'
    }
  }

}

var chartBar = new ApexCharts(document.querySelector('#bar'), optionsBar);
chartBar.render();


var optionDonut = {
  chart: {
    type: "area",
    height: 380,
    width: '100%',
    stacked: true,
  },
  title: {
    floating: false,
    text: 'Humedad',
    align: 'left',
    style: {
      fontSize: '18px'
    }
  },
  dataLabels: {
    enabled: false
  },
  series: [
    {
      name: "Humedad",
      data: data.map((d) => d.hum),
    }
  ],
  colors: ["#FEB019"],
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      stops: [0, 90, 100]
    }
  },
  markers: {
    size: 5,
    colors: ["#775DD0"],
    strokeColor: "#FF4560",
    strokeWidth: 3
  },
  xaxis: {
    categories: data.map((d) => d.date)
  }
}

var donut = new ApexCharts(
  document.querySelector("#donut"),
  optionDonut
)
donut.render();


/*function trigoSeries(cnt, strength) {
  var data = [];
  for (var i = 0; i < cnt; i++) {
      data.push((Math.sin(i / strength) * (i / strength) + i / strength+1) * (strength*2));
  }

  return data;
}*/



var optionsLine = {
  chart: {
    height: 380,
    type: 'line',
    zoom: {
      enabled: false
    }
  },
  plotOptions: {
    stroke: {
      width: 4,
      curve: 'smooth'
    },
  },
  colors: colorPalette,
  series: [
    {
      name: "Crecimiento",
      data: data.map((d) => d.crec),
    }
  ],
  title: {
    floating: false,
    text: 'Crecimiento',
    align: 'left',
    style: {
      fontSize: '18px'
    }
  },
  subtitle: {
    text: realData.map((d) => d.crec),
    align: 'center',
    margin: 30,
    offsetY: 40,
    style: {
      color: '#222',
      fontSize: '24px',
    }
  },
  markers: {
    size: 0
  },

  grid: {

  },
  labels: data.map((item) => item.date),
  xaxis: {
    labels: {
      show: false
    },
    axisTicks: {
      show: false
    },
    tooltip: {
      enabled: false
    }
  },
  yaxis: {
    tickAmount: 2,
    labels: {
      show: false
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false
    },
    min: 0,
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    offsetY: -20,
    offsetX: -30
  }

}

var chartLine = new ApexCharts(document.querySelector('#line'), optionsLine);

// a small hack to extend height in website sample dashboard
chartLine.render().then(function () {
  var ifr = document.querySelector("#wrapper");
  if (ifr.contentDocument) {
    ifr.style.height = ifr.contentDocument.body.scrollHeight + 20 + 'px';
  }
});


// on smaller screen, change the legends position for donut
var mobileDonut = function() {
  if($(window).width() < 768) {
    donut.updateOptions({
      plotOptions: {
        pie: {
          offsetY: -15,
        }
      },
      legend: {
        position: 'bottom'
      }
    }, false, false)
  }
  else {
    donut.updateOptions({
      plotOptions: {
        pie: {
          offsetY: 20,
        }
      },
      legend: {
        position: 'left'
      }
    }, false, false)
  }
}

$(window).resize(function() {
  mobileDonut()
});


});




function convertirFechaUnix(fechaUnix) {
  const fecha = new Date(fechaUnix * 1000); // Multiplicamos por 1000 para convertir los segundos a milisegundos
  return fecha;
}
