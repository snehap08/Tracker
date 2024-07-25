const socket = io();

//check if your browser supports geoocation or not aur phir use 'watchposition' which takes three things that is position, error, and the things like timeout highaccuracy and maximumage in the third part
//acha ek baat aur ye navigator window object ka hi function hogta hai jo ki browser me installed hota hai 
if(navigator.geolocation){
    navigator.geolocation.watchPosition(
        (position)=> {
            const {latitude, longitude} = position.coords;
            socket.emit("send-location", {latitude,longitude }); //emit the latitude and longitude via socket with send-location variable
        },
        (error) =>{
            console.log(error);  //log any errors
        },
        {
            enableHighAccuracy : true,
            timeout : 5000,  //will update location inevery 5 sec
            maximumAge : 0,  //turns off the caching taaki wo live data collect kare whenever needed
        }   
    );
}


const map = L.map("map").setView([0,0],15);//by leaflet humne coords set kiyaa 0,0 that is duniya ka center an humne 10 level zoom swt kiya hai


L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
        attribution:"Sneha Pandey"
}).addTo(map)


const markers = {};

socket.on("receive-location", (data)=>{
    const {id, latitude, longitude} = data;
    map.setView([latitude,longitude]);//this will atleast set your location at delhi with 15 times zoom at your location instead of center of the duniya
    if (markers[id]){
        markers[id].setLatLng([latitude,longitude]);//agr marker ki id ye hai to unka lat lang set krdo
    }else{
        markers[id] = L.marker([latitude, longitude]).addTo(map); //agr marker nhi hai to usey is lat lang pe bnai and then usey map me add krdo 
    }
});


socket.on("user-disconnected",(id) => {
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});



// const socket = io();

// if (navigator.geolocation) {
//     navigator.geolocation.watchPosition(
//         (position) => {
//             const { latitude, longitude } = position.coords;
//             console.log(`Latitude: ${latitude}, Longitude: ${longitude}`); // Log coordinates for debugging
//             socket.emit("send-location", { latitude, longitude });
//         },
//         (error) => {
//             console.log(error);
//         },
//         {
//             enableHighAccuracy: true,
//             timeout: 5000,
//             maximumAge: 0,
//         }
//     );
// }

// const map = L.map("map").setView([0,0], 15); // Set initial view to New Delhi for example

// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution: "Sneha Pandey"
// }).addTo(map);

// const markers = {};

// socket.on("receive-location", (data) => {
//     const { id, latitude, longitude } = data;
//     console.log(`Received location: Latitude: ${latitude}, Longitude: ${longitude}`); // Log received coordinates
//     map.setView([latitude, longitude], 15); // Update map view to user's location with zoom 15
//     if (markers[id]) {
//         markers[id].setLatLng([latitude, longitude]);
//     } else {
//         markers[id] = L.marker([latitude, longitude]).addTo(map);
//     }
// });

// socket.on("user-disconnected", (id) => {
//     if (markers[id]) {
//         map.removeLayer(markers[id]);
//         delete markers[id];
//     }
// });
