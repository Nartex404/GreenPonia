// Initialize and add the map
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
            marker.addListener("click", () => {
                var mapContent = document.getElementById("map");
                var markerContent = document.getElementById("info-marker");
                mapContent.style.width = "70%";
                markerContent.style.width = "30%";
                markerContent.style.display = 'block';
                var titleCrop = document.getElementById("title-crop");
                titleCrop.innerHTML = doc.data().name;
                var realtime = db.collection("agroclima").doc("realtime");
                realtime.get().then((doc) => {
                    var dat = doc.data();
                    document.getElementById("text-ph").innerHTML = dat.ph;
                    document.getElementById("text-cond").innerHTML = dat.cond;
                    document.getElementById("text-hum").innerHTML = dat.hum;
                    document.getElementById("text-temp").innerHTML = dat.temp;
                    document.getElementById("text-crec").innerHTML = dat.crec;
                })
            })

            map.setZoom(12);
        });
    });
}
  
window.initMap = initMap;