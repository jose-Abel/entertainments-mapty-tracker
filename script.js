'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.entertainments');
const inputType = document.querySelector('.form__input--type');
const inputActivity = document.querySelector('.form__input--activities');
const inputDuration = document.querySelector('.form__input--duration');
const inputPrice = document.querySelector('.form__input--price');
const inputDances = document.querySelector('.form__input--nightclub-dances');

let map, mapEvent;


if (navigator.geolocation)
{
  navigator.geolocation.getCurrentPosition(function(position){

    const {latitude} = position.coords;
    const {longitude} = position.coords;

    console.log(`https://www.google.com.do/maps/@${latitude},${longitude}`);

    const coords = [latitude, longitude];

    map = L.map('map').setView(coords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    // Handling clicks on map
    map.on('click', function(mapE){
      mapEvent = mapE;
      form.classList.remove("hidden");
    });

  }, function(){
    alert("Could not get your position")
  });
};

form.addEventListener('submit', function(e) {
  e.preventDefault();

  // Clear Input fields

  inputDuration.value = inputPrice = "";

  // Display marker

  const {lat, lng} = mapEvent.latlng

  L.marker([lat, lng]).addTo(map)
  .bindPopup(L.popup({
    maxWidth: 250,
    minWidth: 100,
    autoClose: false,
    closeOnClick: false,
    className: "running-popup",
  })).setPopupContent("Entertainment")
  .openPopup();

});

inputType.addEventListener("change", function() {
  inputDances.closest('.form__row').classList.toggle("form__row--hidden");

  inputActivity.closest('.form__row').classList.toggle("form__row--hidden");
});

