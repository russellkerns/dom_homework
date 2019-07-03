/* eslint-disable no-shadow */
/* eslint-disable no-alert */

/**
 * QUESTIONS / TODO
 * make one render function? Maybe. Or slices?
 * Slice 1 click coffee
 * Slice 2 unlock producers
 * Slice 3 buy button
 * Slice 4 tick
 *
 * store total cps in state?
 *
 * Do we care about purity / mutation, at this stage?
 * Consider making style less functional-light and more imperative?
 * Solution should probably give pre-written makeProducerDiv.
 * In light of this consider not using the complex child selectors in the css, instead hard-code some class names into makeProducerDiv
 * Starting point would leave all function defs in place but clear out their content?
 * How to simplify? Remove producer unlock mechanism?
 */

const updateCoffeeView = data => {
  const coffeeCounterDiv = document.getElementById('coffee_counter');
  coffeeCounterDiv.innerText = data.coffee;
};

const calculateTotalCPS = data => {
  return data.producers.reduce((total, producer) => {
    return total + producer.cps * producer.qty;
  }, 0);
};

const updateCPSView = data => {
  const cpsDiv = document.getElementById('cps');
  cpsDiv.innerText = calculateTotalCPS(data);
};

const getUnlockedProducers = data => {
  return data.producers.filter(producer => producer.unlocked);
};

const unlockProducers = data => {
  data.producers.forEach(producer => {
    if (data.coffee >= producer.initialPrice / 2) {
      producer.unlocked = true;
    }
  });
};

const makeDisplayNameFromId = id => {
  return id
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const calculateProducerCost = producer => {
  return Math.floor(producer.initialPrice * Math.pow(1.15, producer.qty));
};

const getProducerById = (data, producerId) => {
  return data.producers.find(producer => producerId === producer.id);
};

const canAffordProducer = (data, producerId) => {
  const producer = getProducerById(data, producerId);
  return calculateProducerCost(producer) <= data.coffee;
};

const makeProducerDiv = producer => {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = calculateProducerCost(producer);
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
};

const renderProducers = data => {
  unlockProducers(data);
  const producerContainer = document.getElementById('producer_container');
  producerContainer.innerHTML = '';
  const unlockedProducers = getUnlockedProducers(data);
  unlockedProducers.forEach(producer => {
    const producerDiv = makeProducerDiv(producer);
    producerContainer.appendChild(producerDiv);
  });
};

const clickCoffee = data => {
  data.coffee += 1;
  updateCoffeeView(data);
  renderProducers(data);
};

const buyButtonClick = (event, data) => {
  if (event.target.tagName === 'BUTTON') {
    const producerId = event.target.id.slice(4);
    if (canAffordProducer(data, producerId)) {
      const producer = getProducerById(data, producerId);
      data.coffee -= calculateProducerCost(producer);
      producer.qty += 1;
      unlockProducers(data);
      renderProducers(data);
      updateCoffeeView(data);
      updateCPSView(data);
    } else {
      window.alert('Not enough coffee!');
    }
  }
};

const tick = data => {
  data.coffee += calculateTotalCPS(data);
  renderProducers(data);
  updateCoffeeView(data);
};

/*************************
 *  Start your engines!
 *************************/

// Get our data from the window
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

// Call the tick function, passing in data, every second
setInterval(() => tick(data), 1000);
