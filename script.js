/* eslint-disable no-alert */


/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
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

// You shoulnd't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
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

function updateCPSView(cps) {
  const cpsDiv = document.getElementById('cps');
  cpsDiv.innerText = cps;
}

function attemptToBuyProducer(data, producerId) {
  if (canAffordProducer(data, producerId)) {
    const producer = getProducerById(data, producerId);
    data.coffee -= producer.price;
    producer.qty += 1;
    producer.price = updatePrice(producer.price);
    data.totalCPS += producer.cps;
    return true;
  } else {
    return false;
  }
}

function buyButtonClick(event, data) {
  if (event.target.tagName === 'BUTTON') {
    const producerId = event.target.id.slice(4);
    const result = attemptToBuyProducer(data, producerId);
    if (!result) {
      window.alert('Not enough coffee!');
    } else {
      renderProducers(data);
      updateCoffeeView(data.coffee);
      updateCPSView(data.totalCPS);
    }
  }
}

function tick(data) {
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/*************************
 *  Start your engines!
 *************************/

// First, a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to do all of these things.
if (typeof process === 'undefined') {
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
} else if (process) {
  // This exports the code written here so we can import and test it in Mocha
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick
  };
}
