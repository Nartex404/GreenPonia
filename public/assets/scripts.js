
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

var chartHumedad = null;
var chartPh = null;
var chartConductividad = null;
var chartCrecimiento = null;
var chartTemperatura = null;

var searchingData = document.getElementById("searching-data");
var viewGraphs = document.getElementById("view-graphs");
var notFoundData = document.getElementById("not-found-data");

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();
if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;
today = yyyy + '-' + mm + '-' + dd;
//console.log('today', today)
document.getElementById("start-date").setAttribute("max", today);
document.getElementById("start-date").setAttribute("value", today);
document.getElementById("end-date").setAttribute("max", today);
document.getElementById("end-date").setAttribute("value", today);

let btnSearch = document.getElementById("btn-search"); // Encuentra el elemento "p" en el sitio
btnSearch.onclick = searchData;

function searchData() {
  var startDate = `${document.getElementById("start-date").value} 00:00:00`;
  var endDate = `${document.getElementById("end-date").value} 23:59:59`;
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if(start >= end) {
    alert('La fecha inicial no puede ser mayor a final');
  } else {
    if(chartHumedad) chartHumedad.destroy();
    if(chartPh) chartPh.destroy();
    if(chartConductividad) chartConductividad.destroy();
    if(chartCrecimiento) chartCrecimiento.destroy();
    if(chartTemperatura) chartTemperatura.destroy();
    searchingData.style.display = 'flex';
    viewGraphs.style.display = 'none';
    notFoundData.style.display = 'none';
    getDataFirebase(firebase.firestore(), start, end);
  }
}

// Obtener la colección "agroclima" de Firestore
const db = firebase.firestore();
var dateIn = `${today} 00:00:00`;
var dateEnd = `${today} 23:59:59`;
const start = new Date(dateIn).getTime();
const end = new Date(dateEnd).getTime();

db.collection("agroclima").doc("realtime")
  .onSnapshot({
    // Listen for document metadata changes
    includeMetadataChanges: true
  }, (doc) => {
    var phSeg = Number(doc.data().ph).toFixed(2);
    var condSeg = Number(doc.data().cond).toFixed(2);
    var realData = [
      {
        id: doc.id,
        cond: condSeg,
        crec: doc.data().crec,
        hum: doc.data().hum,
        ph: phSeg,
        temp: doc.data().temp,
      }
    ]
    if(doc.data().timestamp) {
      const date = new Date(parseInt(doc.data().timestamp));
      const options = {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true
      };
      var dateStr = date.toLocaleString("default", options);
      document.getElementById("last-update").innerHTML = dateStr
  }
    renderRealData(realData);
  });

getDataFirebase(db, start, end);

function getDataFirebase(db, start, end) {
  //console.log('getDataFirebase', start, ' - ', end);
  db.collection("agroclima").where("timestamp", ">=", start).where("timestamp", "<=", end)
    .onSnapshot({ includeMetadataChanges: true }, (snapshot) => {
    //.get().then((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        var phSeg = Number(doc.data().ph).toFixed(2);
        var condSeg = Number(doc.data().cond).toFixed(2);
        //console.log('doc.id',doc.id);
        if (doc.id != 'realtime' && doc.id != 'start_system') {
          const date = new Date(parseInt(doc.id));
          const getMonth = date.toLocaleString("default", { month: "2-digit" });
          const getDay = date.toLocaleString("default", { day: "2-digit" });
          const getHour = date.toLocaleString("default", { hour: "2-digit" });
          const getMin = date.toLocaleString("default", { minute: "2-digit" });

          data.push({
            id: doc.id,
            cond: condSeg,
            crec: doc.data().crec,
            hum: doc.data().hum,
            ph: phSeg,
            temp: doc.data().temp,
            date: `${getMonth}-${getDay}`,
            hour: `${getHour}:${getMin}`
          });
        }
      })

      //renderRealData(realData);
      renderHumerdad(data);
      renderPh(data);
      renderConductividad(data);
      renderCrecimiento(data);
      renderTemperatura(data);
      setTimeout(() => {
        searchingData.style.display = 'none';
        notFoundData.style.display = data.length > 0 ? 'none' : 'block';
        viewGraphs.style.display = data.length > 0 ? 'block' : 'none';
      }, 2000)
    }, (error) => {
      console.error('onSnapshot error', error);
    });
}

function renderRealData(realData) {
  var sparkPh = document.getElementById("spark-ph");
  var sparkCond = document.getElementById("spark-cond");
  var sparkHum = document.getElementById("spark-hum");
  var sparkCrec = document.getElementById("spark-crec");
  var sparkTemp = document.getElementById("spark-temp");
  sparkPh.innerHTML = `${realData.map((d) => d.ph)}`;
  sparkCond.innerHTML = `${realData.map((d) => d.cond)} µS`;
  sparkHum.innerHTML = `${realData.map((d) => d.hum)} %`;
  sparkCrec.innerHTML = `${realData.map((d) => d.crec)} %`;
  sparkTemp.innerHTML = `${realData.map((d) => d.temp)} °C`;
}

function renderHumerdad(data) {
  //Humedad
  var optionsLine = {
    chart: {
      height: 328,
      type: 'line',
      zoom: {
        enabled: true
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
      name: "Humedad relativa",
      data: data.map((d) => d.hum),
    }
    ],
    title: {
      text: 'Histograma Humedad relativa',
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
      },
      title: {
        text:'Tiempo'
      }
    },
    yaxis: {
      title: {
        text: 'Humedad'
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      offsetY: -20
    }

  }

  chartHumedad = new ApexCharts(document.querySelector('#line-humed'), optionsLine);
  chartHumedad.render();
}

function renderPh(data) {
  //PH2
  var optionsBar = {
    chart: {
      height: 328,
      type: 'line',
      zoom: {
        enabled: true
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
    colors: ["#0396FF"],
    series: [{
      name: "PH",
      data: data.map((d) => d.ph),
    }
    ],
    title: {
      text: 'Histograma PH',
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
      },
      title: {
        text:'Tiempo'
      }
    },
    yaxis: {
      title: {
        text: 'PH'
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      offsetY: -20
    }

  }

  chartPh = new ApexCharts(document.querySelector('#bar'), optionsBar);
  chartPh.render();
}

function renderConductividad(data) {
  //CONDUCTIVIDAD
  var optionsArea = {

    chart: {
      height: 328,
      type: 'line',
      zoom: {
        enabled: true
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
      name: "Conductividad mS",
      data: data.map((d) => d.cond),
    }
    ],
    title: {
      text: 'Histograma conductividad',
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
      },
      title: {
        text:'Tiempo'
      }
    },
    yaxis: {
      title: {
        text: 'Conductividad'
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      offsetY: -20
    }
  }

  chartConductividad = new ApexCharts(document.querySelector('#area'), optionsArea);
  chartConductividad.render();
}

function renderCrecimiento(data) {
  //Crecimiento
  var optionsGrow = {
    chart: {
      height: 328,
      type: 'line',
      zoom: {
        enabled: true
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
    colors: ["#5961F9"],
    series: [{
      name: "Crecimiento",
      data: data.map((d) => d.crec),
    }
    ],
    title: {
      text: 'Porcentaje crecimiento',
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
      },
      title: {
        text:'Tiempo'
      }
    },
    yaxis: {
      title: {
        text: '% Crecimiento'
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      offsetY: -20
    }

  }
  
  chartCrecimiento = new ApexCharts(document.querySelector("#chart-grow"), optionsGrow);
  chartCrecimiento.render();
}

function renderTemperatura(data) {
  //Temperatura
  var temperature = {
    series: [{
      name: 'Temperatura',
      data: data.map((d) => d.temp)
    },],
    chart: {
      height: 350,
      type: 'area'
    },
    dataLabels: {
      enabled: true,
      style: {
        color: '#000'
      }
    },
    stroke: {
      curve: 'smooth'
    },
    labels: data.map((d) => d.date),
    xaxis: {
      tooltip: {
        enabled: false
      },
      title: {
        text:'Tiempo'
      }
    },
    yaxis: {
      title: {
        text: 'Temperatura ºC'
      }
    },
    colors: ["#5FF959"],
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm'
      },
    },

    title: {
      text: 'Histograma temperatura',
      align: 'left',
      style: {
        fontSize: '18px'
      }
    },
  };

  chartTemperatura = new ApexCharts(document.querySelector("#area-temp"), temperature);
  chartTemperatura.render();
}
