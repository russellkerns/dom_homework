/* eslint-disable no-alert */
const data = window.data;

/**
 * QUESTIONS / TODO
 * Do we care about purity / mutation, at this stage?
 * Consider making style less functional-light and more imperative?
 * Solution should probably give pre-written makeProducerDiv.
 * In light of this consider not using the complex child selectors in the css, instead hard-code some class names into makeProducerDiv
 * Starting point would leave all function defs in place but clear out their content?
 * How to simplify? Remove producer unlock mechanism?
 */

const updateCoffeeView = () => {
  const coffeeCounterDiv = document.getElementById('coffee_counter');
  coffeeCounterDiv.innerText = data.coffee;
};

const calculateTotalCPS = () => {
  return data.producers.reduce((total, producer) => {
    return total + producer.cps * producer.qty;
  }, 0);
};

const updateCPSView = () => {
  const cpsDiv = document.getElementById('cps');
  cpsDiv.innerText = calculateTotalCPS();
};

const getUnlockedProducers = () => {
  return data.producers.filter(producer => producer.unlocked);
};

const unlockProducers = () => {
  data.producers.forEach(producer => {
    if (data.coffee >= producer.unlocksAt) {
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

const getProducerById = producerId => {
  return data.producers.find(producer => producerId === producer.id);
};

const canBuyProducer = producerId => {
  const producer = getProducerById(producerId);
  return calculateProducerCost(producer) <= data.coffee;
};

const makeProducerDiv = producer => {
  const containerDiv = document.createElement('div');
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = calculateProducerCost(producer);
  const html = `
  <div>
    <div>${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div>
    <div>Quantity: ${producer.qty}</div>
    <div>Total coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
};

const renderProducers = () => {
  unlockProducers();
  const producerContainer = document.getElementById('producer_container');
  producerContainer.innerHTML = '';
  const unlockedProducers = getUnlockedProducers();
  unlockedProducers.forEach(producer => {
    const producerDiv = makeProducerDiv(producer);
    producerContainer.appendChild(producerDiv);
  });
};

const clickCoffee = () => {
  data.coffee += 1;
  updateCoffeeView();
  renderProducers();
};

const buyButtonClick = event => {
  if (event.target.tagName === 'BUTTON') {
    const producerId = event.target.id.slice(4);
    if (canBuyProducer(producerId)) {
      const producer = getProducerById(producerId);
      data.coffee -= calculateProducerCost(producer);
      producer.qty += 1;
      unlockProducers();
      renderProducers();
      updateCoffeeView();
      updateCPSView();
    } else {
      window.alert('Not enough coffee!');
    }
  }
};

const tick = () => {
  data.coffee += calculateTotalCPS();

  renderProducers();
  updateCoffeeView();
};

/*************************
 *  Start your engines!
 *************************/

const bigCoffee = document.getElementById('big_coffee');
bigCoffee.addEventListener('click', clickCoffee);

const producerContainer = document.getElementById('producer_container');
producerContainer.addEventListener('click', buyButtonClick);

renderProducers();
updateCPSView();

setInterval(tick, 1000);
