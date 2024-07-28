const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`); // Log coordinates for debugging
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.log(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );
}

const map = L.map("map").setView([0,0], 15); // Set initial view to New Delhi

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Sneha Pandey"
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    console.log(`Received location: Latitude: ${latitude}, Longitude: ${longitude}`); // Log received coordinates
    map.setView([latitude, longitude], 15); // Update map view to user's location with zoom 15
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});



const button= document.getElementById('get-location-button');

function got (position){
    console.log(position);
}

function ngot(){
    console.log('error');
}

button.addEventListener('click', async()=>{
    navigator.geolocation.getCurrentPosition(got, ngot,
        {
        
                             enableHighAccuracy: true,
                             timeout: 5000,
                             maximumAge: 0,
                       
        }
    )
})
