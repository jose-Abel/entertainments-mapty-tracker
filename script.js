'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.entertainments');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--activities');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--nightclub-dances');
const inputElevation = document.querySelector('.form__input--price');

if (navigator.geolocation)
{
  navigator.geolocation.getCurrentPosition(function(position){

    const {latitude} = position.coords;
    const {longitude} = position.coords;

    console.log(`https://www.google.com.do/maps/@${latitude},${longitude}`);

    const coords = [latitude, longitude];

    const map = L.map('map').setView(coords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker(coords).addTo(map)
    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    .openPopup();

  }, function(){
    alert("Could not get your position")
  });
}
