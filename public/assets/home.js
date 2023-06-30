// Initialize and add the map
try {
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
} catch (error) {
    
}

var btnClose = document.getElementById("btn-close"); //grab the element
btnClose.onclick = function() {
    var mapContent = document.getElementById("map");
    var markerContent = document.getElementById("info-marker");
    mapContent.style.width = "100%";
    markerContent.style.width = "0%";
    markerContent.style.display = 'none';
}

function initMap() {
    // The location of Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: { lat: 4.810266, lng: -74.106988 },
    });
    const db = firebase.firestore();
    //actualizarFechas(db);
    const locationCollection = db.collection('location');

    locationCollection.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var latlng = doc.data().mapLocation
            const marker = new google.maps.Marker({
                position: {lat: latlng._lat, lng: latlng._long},
                map: map,
                icon: 'images/pin_map_green.png',
                animation: google.maps.Animation.BOUNCE
            });
            /*marker.addListener("click", () => {
                var mapContent = document.getElementById("map");
                var markerContent = document.getElementById("info-marker");
                mapContent.style.width = "70%";
                markerContent.style.width = "30%";
                markerContent.style.display = 'block';
                var titleCrop = document.getElementById("title-crop");
                titleCrop.innerHTML = doc.data().name;
                db.collection("agroclima").doc("realtime")
                .onSnapshot({
                    // Listen for document metadata changes
                    includeMetadataChanges: true
                }, (doc) => {
                    var dat = doc.data();
                    console.log('data',dat)
                    if(dat.timestamp) {
                        const date = new Date(parseInt(dat.timestamp));
                        const options = {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: false
                        };
                        document.getElementById("text-date").innerHTML = date.toLocaleString("default", options);
                    }
                    document.getElementById("text-ph").innerHTML = dat.ph;
                    document.getElementById("text-cond").innerHTML = dat.cond;
                    document.getElementById("text-hum").innerHTML = dat.hum;
                    document.getElementById("text-temp").innerHTML = dat.temp;
                    document.getElementById("text-crec").innerHTML = dat.crec;
                });
            })*/

            map.setZoom(12);
            map.setCenter({lat: latlng._lat, lng: latlng._long})
        });
    });
}

function actualizarFechas(db) {
    db.collection('agroclima').get().then((querySnapshot) => {
        var i = 100;
        querySnapshot.forEach((doc) => {
            var id = doc.id;
            var data = doc.data();
            if(i > 0 && id != 'realtime' && id != 'start_system' && !data.hasOwnProperty('timestamp')) {
                console.log('update agroclima id', i, id);
                /*db.collection('agroclima').doc(id).set({
                    timestamp: Number(id)
                }, { merge: true });*/
                i--;
            }
            
        })
    })
    
}
  
window.initMap = initMap;