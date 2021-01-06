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


class Entertainment {
  date = new Date();
  id = (Date.now() + "").slice(-10);

  constructor(coords, cost, duration) {
    this.coords = coords;
    this.cost = cost;
    this.duration = duration;
  }
}

class Getaway extends Entertainment {
  constructor(coords, cost, duration, activityName, activity) {
    super(coords, cost, duration);
    this.activityName = activityName;
    this.activity = activity;
  }
}

class Nightclub extends Entertainment {
  constructor(coords, cost, duration, dance) {
    super(coords, cost, duration);
    this.dance = dance;
  }
}

////////////////////////////////////////////
// APPLICATION ARCHITECTURE
class App {
  #map;
  #mapEvent;

  constructor() {
    this._getPosition();

    form.addEventListener('submit', this._newEntertainment.bind(this));

    inputType.addEventListener("change", this._toggleDanceField);
  }

  _getPosition() {
    if (navigator.geolocation)
    {
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function(){
        alert("Could not get your position")
      });
    };
  }

  _loadMap(position) {
      const {latitude} = position.coords;
      const {longitude} = position.coords;
  
      const coords = [latitude, longitude];
  
      this.#map = L.map('map').setView(coords, 13);
  
      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.#map);
  
      // Handling clicks on map
      this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE){
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
  }

  _toggleDanceField() {
    if (inputType.value === "nightclub") {
      inputDances.closest('.form__row').classList.toggle("form__row--hidden");
  
      inputActivity.closest('.form__row').classList.toggle("form__row--hidden");
    }
    else {
      inputDances.closest('.form__row').classList.add("form__row--hidden");

      inputActivity.closest('.form__row').classList.remove("form__row--hidden");
    }
  }

  _newEntertainment(e){
    e.preventDefault();
    
    // Clear Input fields
    inputDuration.value = inputPrice.value = "";
  
    // Display marker
    const {lat, lng} = this.#mapEvent.latlng
    L.marker([lat, lng]).addTo(this.#map)
    .bindPopup(L.popup({
      maxWidth: 250,
      minWidth: 100,
      autoClose: false,
      closeOnClick: false,
      className: "running-popup",
    })).setPopupContent("Entertainment")
    .openPopup();
  }
}

const app = new App();


