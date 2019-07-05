/* eslint-disable no-shadow */
/* eslint-disable no-alert */
/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  console.log('UPDATING');

  const coffeeCounterDiv = document.getElementById('coffee_counter');
  coffeeCounterDiv.innerText = coffeeQty;
}

function clickCoffee(data) {
  data.coffee += 1;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  producers.forEach(producer => {
    if (coffeeCount >= producer.price / 2) {
      producer.unlocked = true;
    }
  });
}

function getUnlockedProducers(data) {
  return data.producers.filter(producer => producer.unlocked);
}

function makeDisplayNameFromId(id) {
  return id
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function renderProducers(data) {
  unlockProducers(data.producers, data.coffee);
  const producerContainer = document.getElementById('producer_container');
  producerContainer.innerHTML = '';
  const unlockedProducers = getUnlockedProducers(data);
  unlockedProducers.forEach(producer => {
    const producerDiv = makeProducerDiv(producer);
    producerContainer.appendChild(producerDiv);
  });
}

/**************
 *   SLICE 3
 **************/

function calculateTotalCPS(data) {
  data.totalCPS = data.producers.reduce((total, producer) => {
    return total + producer.cps * producer.qty;
  }, 0);
}

function updateCPSView(data) {
  const cpsDiv = document.getElementById('cps');
  cpsDiv.innerText = data.totalCPS;
}

/**************
 *   SLICE 4
 **************/

function getProducerById(data, producerId) {
  return data.producers.find(producer => producerId === producer.id);
}

function canAffordProducer(data, producerId) {
  const producer = getProducerById(data, producerId);
  return producer.price <= data.coffee;
}

function updatePrice(oldPrice) {
  return Math.floor(oldPrice * 1.25);
}

function buyButtonClick(event, data) {
  if (event.target.tagName === 'BUTTON') {
    const producerId = event.target.id.slice(4);
    if (canAffordProducer(data, producerId)) {
      const producer = getProducerById(data, producerId);
      data.coffee -= producer.price;
      producer.qty += 1;
      producer.price = updatePrice(producer.price);
      unlockProducers(data.producers, data.coffee);
      renderProducers(data);
      updateCoffeeView(data.coffee);
      updateCPSView(data);
    } else {
      window.alert('Not enough coffee!');
    }
  }
}

function tick(data) {
  data.coffee += data.totalCPS;
  renderProducers(data);
  updateCoffeeView(data.coffee);
}

/*************************
 *  Start your engines!
 *************************/

// Get starting data from the window object
// (This comes from data.js)
const data = window.data;

// Add an event listener to the giant coffee emoji
const bigCoffee = document.getElementById('big_coffee');
bigCoffee.addEventListener('click', () => clickCoffee(data));

// Add an event listener to the container that holds all of the producers
// Pass in the browser event and our data object to the event listener
const producerContainer = document.getElementById('producer_container');
producerContainer.addEventListener('click', event => {
  buyButtonClick(event, data);
});

// Call the tick function passing in the data object once per second
setInterval(() => tick(data), 1000);
