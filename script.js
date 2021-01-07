'use strict';

class Entertainment {
  date = new Date();
  id = (Date.now() + "").slice(-10);

  constructor(coords, cost, duration) {
    this.coords = coords;
    this.cost = cost;
    this.duration = duration;
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
  }
}

class Getaway extends Entertainment {

  constructor(coords, cost, duration, locationType, activityName) {
    super(coords, cost, duration);
    this.type = locationType;
    this.activityName = activityName;
    this._setDescription();
  }
}

class Nightclub extends Entertainment { 
  type = "nightclub";
  constructor(coords, cost, duration, dance) {
    super(coords, cost, duration);
    this.dance = dance;
    this._setDescription();
  }
}

////////////////////////////////////////////
// APPLICATION ARCHITECTURE

const form = document.querySelector('.form');
const containerEntertainments = document.querySelector('.entertainments');
const inputType = document.querySelector('.form__input--type');
const inputActivity = document.querySelector('.form__input--activities');
const inputDuration = document.querySelector('.form__input--duration');
const inputPrice = document.querySelector('.form__input--price');
const inputDances = document.querySelector('.form__input--nightclub-dances');


class App {
  #map;
  #mapZoomLevel = 13;
  #mapEvent;
  #entertainments = [];

  constructor() {
    // Get user's position
    this._getPosition();

    // Get data from local storage
    this._getLocalStorage();

    // Attach event handlers
    form.addEventListener('submit', this._newEntertainment.bind(this));

    inputType.addEventListener("change", this._toggleDanceField);

    containerEntertainments.addEventListener('click', this._moveToPopup.bind(this));
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
  
      this.#map = L.map('map').setView(coords, this.#mapZoomLevel);
  
      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.#map);
  
      // Handling clicks on map
      this.#map.on('click', this._showForm.bind(this));

      this.#entertainments.forEach(ent => {
        this._renderEntertainmentMarker(ent);
      });
  }

  _showForm(mapE){
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
  }

  _hideForm() {
    // Empty inputs
    inputDuration.value = inputPrice.value = "";

    form.style.display = 'none';

    form.classList.add("hidden");

    setTimeout(()=> form.style.display = "grid", 1000);
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

  _newEntertainment(e) {

    const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp));

    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    e.preventDefault();

    const getawayArr = ["beach", "river", "mountain", "lodge", "resort"];
    
    // Get data from form
    const type = inputType.value;

    const duration = +inputDuration.value;

    const price = +inputPrice.value;

    const {lat, lng} = this.#mapEvent.latlng

    let entertainment;
      
    // If Entertainment is Getaway create getaway object
    if (getawayArr.includes(type)) {
      const activity = inputActivity.value;
      // Check if data is valid
      if(!validInputs(duration, price) || !allPositive(duration, price)) return alert("duration and price has to be positive numbers!");

      entertainment = new Getaway([lat, lng], price, duration, type, activity);
    }

    // If Entertainment is Nightclub create nightclub object
    if (type === "nightclub") {
      const dance = inputDances.value;

      if(!validInputs(duration, price) || !allPositive(duration, price)) return alert("duration and price has to be positive numbers!");

      entertainment = new Nightclub([lat, lng], price, duration, dance);
    }

    // Add new object to Entertainment array
    this.#entertainments.push(entertainment);

    // Render entertainment on map as marker
    this._renderEntertainmentMarker(entertainment);

    // Render new entertainment on list
    this._renderEntertainment(entertainment);

    // Hide form + clear input fields
    this._hideForm();

    // Set local storage to all entertainments
    this._setLocalStorage();
  }

  _renderEntertainmentMarker(ent) {
    L.marker(ent.coords).addTo(this.#map)
    .bindPopup(L.popup({
      maxWidth: 250,
      minWidth: 100,
      autoClose: false,
      closeOnClick: false,
      className: `${ent.type}-popup`,
    })).setPopupContent(`${ent.type === 'nightclub' ? '💃' : '⛱'} ${ent.description}`)
    .openPopup();
  }

  _renderEntertainment(ent) {
    let html = `
    <li class="entertainment entertainment--${ent.type}" data-id="${ent.id}">
    <h2 class="entertainment__title">${ent.description}</h2>
    <div class="entertainment__details">
      <span class="entertainment__icon">${ent.type === 'nightclub' ? '🎉' : '⛱'}</span>
      <span class="entertainment__value"> ${ent.cost}</span>
      <span class="entertainment__unit">💸</span>
    </div>
    <div class="entertainment__details">
      <span class="entertainment__icon">⏱</span>
      <span class="entertainment__value">${ent.duration}</span>
      <span class="entertainment__unit">hours</span>
    </div>`;

    if(ent.type !== 'nightclub') {
      html += `
      <div class="entertainment__details">
        <span class="entertainment__icon">🏖 </span>
        <span class="entertainment__value">${ent.activityName}</span>
      </div>
    </li>`;
    }

    if (ent.type === 'nightclub') {
      html += `
      <div class="entertainment__details">
        <span class="entertainment__icon">💃</span>
        <span class="entertainment__value">${ent.dance}</span>
      </div>
    </li>`;
    }

    form.insertAdjacentHTML('afterend', html);
  }

  _moveToPopup(e) {
    const entertainmentEl = e.target.closest('.entertainment');

    if(!entertainmentEl) return;

    const entertainment = this.#entertainments.find(ent => ent.id === entertainmentEl.dataset.id);

    this.#map.setView(entertainment.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      }
    });
  }

  _setLocalStorage() {
    localStorage.setItem('entertainments', JSON.stringify(this.#entertainments));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('entertainments'))

    if(!data) return;

    this.#entertainments = data;

    this.#entertainments.forEach(ent => {
      this._renderEntertainment(ent);
    });
  }
}

const app = new App();


