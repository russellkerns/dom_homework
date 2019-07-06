// These two functions come from Chai, our assertion library. Unlike Jasmine, the test framework we're using in this project doesn't come with assertions built-in, so we need to get assertions from another library.
const { expect, assert } = require('chai');

// JSDOM lets us pretend we're in a web browser even through we're running this code in Node. Here, we import JSOM and create fake document and window objects. We assign these to global so they're available to your code, when we run it.
const { JSDOM } = require('jsdom');
const { window } = new JSDOM(`<!DOCTYPE html><body></body>`).window;
const { document } = window;
global.window = window;
global.document = document;

// Sinon is a framework which provides helper functions for writing tests-- you've seen it beofre in foundations. We'll be using it's built-in `spy` method to check whether you're calling functions.
const sinon = require('sinon');

// This imports your code so we can test it
const code = require('./script.js');

// this is a helper function to reset the fake dom
function resetJSDOM() {
  document.body.innerHTML = '';

  const coffeeCounter = document.createElement('div');
  coffeeCounter.id = 'coffee_counter';
  document.body.appendChild(coffeeCounter);

  const producerContainer = document.createElement('div');
  producerContainer.id = 'producer_container';
  document.body.appendChild(producerContainer);

  const cpsDisplay = document.createElement('div');
  cpsDisplay.id = 'cps';
  document.body.appendChild(cpsDisplay);

  const bigCoffee = document.createElement('div');
  bigCoffee.id = 'big_coffee';
  document.body.appendChild(bigCoffee);
}

/***************************
 *   SLICE 1 STARTS HERE
 ***************************/

describe('Slice 1: Clicking & Incrementing Coffee', function() {
  beforeEach('reset the fake DOM', function() {
    resetJSDOM();
  });

  describe('The updateCoffeeView function', function() {
    it('calls document.getElementById() or document.querySelector()', function() {
      const spyOnGetElementById = sinon.spy(document, 'getElementById');
      const spyOnQuerySelector = sinon.spy(document, 'querySelector');
      code.updateCoffeeView(); // this is where we actually run your code
      const wereFnsCalled =
        spyOnGetElementById.called || spyOnQuerySelector.called;
      expect(wereFnsCalled).to.equal(true);
      spyOnGetElementById.restore();
      spyOnQuerySelector.restore();
    });

    it('updates the coffee counter to display the current coffee count', function() {
      const coffeeCounter = document.getElementById('coffee_counter');
      code.updateCoffeeView(4000);
      expect(coffeeCounter.innerText).to.equal(4000);
      code.updateCoffeeView(4);
      expect(coffeeCounter.innerText).to.equal(4);
    });
  });

  describe('The clickCoffee function', function() {
    it('increments the coffee count by one', function() {
      const data = { coffee: 0, producers: [] };
      code.clickCoffee(data);
      expect(data.coffee).to.equal(1);
    });
    // Here, we're not checking to see that you call updateCoffeeView, the
    // function you wrote above. But it would be a good idea to do so!
    it('updates the coffee counter element with the incremented value', function() {
      const coffeeCounter = document.getElementById('coffee_counter');
      const data = { coffee: 50, producers: [] };
      code.clickCoffee(data);
      expect(coffeeCounter.innerText).to.equal(51);
    });
  });
});

/***************************
 *   SLICE 2 STARTS HERE
 ***************************/

describe('Slice 2: Unlocking & Rendering Producers', function() {
  describe('The unlockProducers function', function() {
    let data;
    beforeEach('initialize some fake data', function() {
      data = {
        coffee: 0,
        producers: [
          { id: 'producer_A', price: 50, unlocked: false },
          { id: 'producer_B', price: 200, unlocked: false },
          { id: 'producer_C', price: 500, unlocked: false }
        ]
      };
    });

    it("changes `unlocked` to `true` when the player's coffee count is equal to or larger than half the initial price of the producer", function() {
      data.coffee = 100;
      code.unlockProducers(data.producers, data.coffee);
      expect(data.producers[0].unlocked).to.equal(true);
      expect(data.producers[1].unlocked).to.equal(true);
      expect(data.producers[2].unlocked).to.equal(false);
    });

    it('does not set `unlocked` to `false` once a producer has been unlocked, even if the coffee count drops again', function() {
      data.coffee = 100;
      code.unlockProducers(data.producers, data.coffee);
      data.coffee = 0;
      code.unlockProducers(data.producers, data.coffee);
      expect(data.producers[0].unlocked).to.equal(true);
      expect(data.producers[1].unlocked).to.equal(true);
      expect(data.producers[2].unlocked).to.equal(false);
    });
  });

  describe('The getUnlockedProducers function', function() {
    let data;
    beforeEach('initialize some fake data', function() {
      data = {
        coffee: 0,
        producers: [
          { id: 'producer_A', price: 50, unlocked: true },
          { id: 'producer_B', price: 200, unlocked: false },
          { id: 'producer_C', price: 500, unlocked: false }
        ]
      };
    });

    it('returns an array of producer objects', function() {
      const results = code.getUnlockedProducers(data);
      expect(results).to.be.an('array');
      results.forEach(element => {
        expect(element).to.be.an('object');
        expect(element).to.have.property('id');
        expect(element).to.have.property('price');
        expect(element).to.have.property('unlocked');
      });
    });

    it('filters out producer objects which are not unlocked', function() {
      let results = code.getUnlockedProducers(data);
      expect(results).to.have.lengthOf(1);

      // let's make sure you didn't hardcode the solution...
      data.producers[2].unlocked = true;
      results = code.getUnlockedProducers(data);
      expect(results).to.have.lengthOf(2);
    });

    it('does not mutate the data', function() {
      const snapshot = JSON.stringify(data);
      code.getUnlockedProducers(data);
      expect(JSON.stringify(data)).to.equal(snapshot);
    });
  });

  describe('The makeDisplayNameFromId function', function() {
    it('returns a string', function() {
      const result = code.makeDisplayNameFromId('input_string');
      expect(result).to.be.a('string');
    });

    it('transforms its input string from snake_case to Title Case', function() {
      const testStrings = [
        'input_string',
        'mr._coffee',
        'Mr._Coffee',
        '10_gallon_urn'
      ];
      const results = testStrings.map(code.makeDisplayNameFromId);
      expect(results[0]).to.equal('Input String');
      expect(results[1]).to.equal('Mr. Coffee');
      expect(results[2]).to.equal('Mr. Coffee');
      expect(results[3]).to.equal('10 Gallon Urn');
    });
  });

  describe('The makeProducerDiv function', function() {
    const producer = {
      id: 'producer_A',
      price: 57,
      unlocked: true,
      cps: 100,
      qty: 5
    };

    it('returns a DOM element', function() {
      const result = code.makeProducerDiv(producer);
      expect(result).to.be.an('HTMLDivElement');
    });

    it('correctly fills in template string', function() {
      // Here, we make a tiny fake DOM local to this test so we can
      // append the element returned by makeProducerdiv to it. Then,
      // we query this tiny DOM to make some assertions about it.
      const result = code.makeProducerDiv(producer);
      const doc = new JSDOM(`<!DOCTYPE html><body></body>`).window.document;
      doc.body.appendChild(result);

      const titleDiv = doc.getElementsByClassName('producer-title');
      expect(titleDiv[0].innerHTML).to.equal('Producer A');

      const buttonEl = doc.getElementById('buy_producer_A');
      expect(buttonEl.innerHTML).to.equal('Buy');

      const rightColumn = doc.getElementsByClassName('producer-column')[1];
      const qtyDiv = rightColumn.children[0];
      const cpsDiv = rightColumn.children[1];
      const costDiv = rightColumn.children[2];
      expect(qtyDiv.innerHTML).to.equal('Quantity: 5');
      expect(cpsDiv.innerHTML).to.equal('Coffee/second: 100');
      expect(costDiv.innerHTML).to.equal('Cost: 57 coffee');
    });
  });

  // Inside renderProducers you should probaboyl be calling *three*
  // functions you previously wrote
  describe('The renderProducers function', function() {
    // Clear out our fake DOM
    beforeEach('reset the fake DOM', function() {
      resetJSDOM();
    });

    // Set up some fake data
    let data;
    beforeEach('initialize some fake data', function() {
      data = {
        coffee: 100,
        producers: [
          { id: 'producer_A', price: 50, unlocked: false },
          { id: 'producer_B', price: 200, unlocked: false },
          { id: 'producer_C', price: 500, unlocked: false }
        ]
      };
    });

    // We're giving you a big hint, here
    it('calls document.getElementById() or document.querySelector()', function() {
      const spyOnGetElementById = sinon.spy(document, 'getElementById');
      const spyOnQuerySelector = sinon.spy(document, 'querySelector');
      code.renderProducers(data);
      const wereFnsCalled =
        spyOnGetElementById.called || spyOnQuerySelector.called;
      expect(wereFnsCalled).to.equal(true);
      spyOnGetElementById.restore();
      spyOnQuerySelector.restore();
    });

    it('appends some elements to the producer container', function() {
      code.renderProducers(data);
      const producerContainer = document.getElementById('producer_container');
      assert.isAbove(producerContainer.childNodes.length, 0);
    });

    // Hint: call the function written to do this!
    it('unlocks any locked producers which need to be unlocked', function() {
      code.renderProducers(data);
      expect(data.producers[0].unlocked).to.be.equal(true);
      expect(data.producers[1].unlocked).to.be.equal(true);
      expect(data.producers[2].unlocked).to.be.equal(false);
    });

    it('only appends unlocked producers', function() {
      code.renderProducers(data);
      const producerContainer = document.getElementById('producer_container');
      expect(producerContainer.childNodes.length).to.be.equal(2);
    });

    it("deletes the producer container's children before appending new producers", function() {
      const producerContainer = document.getElementById('producer_container');
      const fakeProducer = document.createElement('div');
      producerContainer.appendChild(fakeProducer);
      code.renderProducers(data);
      expect(producerContainer.childNodes.length).to.be.equal(2);
    });

    it('is not hardcoded to pass the tests', function() {
      data.producers.push({ id: 'producer_D', price: 1, unlocked: true });
      const producerContainer = document.getElementById('producer_container');
      code.renderProducers(data);
      expect(producerContainer.childNodes.length).to.be.equal(3);
    });
  });
});

/***************************
 *   SLICE 3 STARTS HERE
 ***************************/

describe('Slice 3: Buying Producers & Tick', function() {
  describe('The getProducerById function', function() {
    // Set up some fake data
    let data;
    beforeEach('initialize some fake data', function() {
      data = {
        producers: [
          { id: 'producer_A', price: 50 },
          { id: 'producer_B', price: 200 },
          { id: 'producer_C', price: 500 }
        ]
      };
    });

    it('returns an object', function() {
      const result = code.getProducerById(data, 'producer_A');
      expect(result).to.be.an('object');
    });
    it('returns the correct producer object', function() {
      const testIDs = ['producer_A', 'producer_B', 'producer_C'];
      const results = testIDs.map(testID => code.getProducerById(data, testID));
      expect(results[0].price).to.be.equal(50);
      expect(results[1].price).to.be.equal(200);
      expect(results[2].price).to.be.equal(500);
    });
    it('is not hardcoded to pass the tests', function() {
      // Just like the last test, but we've reversed the order of the producers in the data
      data.producers = data.producers.reverse();
      const testIDs = ['producer_A', 'producer_B', 'producer_C'];
      const results = testIDs.map(testID => code.getProducerById(data, testID));
      expect(results[0].price).to.be.equal(50);
      expect(results[1].price).to.be.equal(200);
      expect(results[2].price).to.be.equal(500);
    });
  });

  describe('The canAffordProducer function', function() {
    // Set up some fake data
    let data;
    beforeEach('initialize some fake data', function() {
      data = {
        coffee: 100,
        producers: [
          { id: 'producer_A', price: 50 },
          { id: 'producer_B', price: 200 },
          { id: 'producer_C', price: 500 }
        ]
      };
    });

    it('returns a boolean', function() {
      const result = code.canAffordProducer(data, 'producer_A');
      expect(result).to.be.a('boolean');
    });
    it('returns true if the player can afford the producer', function() {
      const result = code.canAffordProducer(data, 'producer_A');
      expect(result).to.be.equal(true);
    });
    it('returns false if the player cannot afford the producer', function() {
      const result = code.canAffordProducer(data, 'producer_B');
      expect(result).to.be.equal(false);
    });
  });

  describe('The updateCPSView function', function() {
    // Clear out our fake DOM
    beforeEach('reset the fake DOM', function() {
      resetJSDOM();
    });

    it('calls document.getElementById() or document.querySelector()', function() {
      const spyOnGetElementById = sinon.spy(document, 'getElementById');
      const spyOnQuerySelector = sinon.spy(document, 'querySelector');
      code.updateCPSView(100);
      const wereFnsCalled =
        spyOnGetElementById.called || spyOnQuerySelector.called;
      expect(wereFnsCalled).to.equal(true);
      spyOnGetElementById.restore();
      spyOnQuerySelector.restore();
    });

    it('updates the total cps indicator to display the current total cps', function() {
      const cpsIndicator = document.getElementById('cps');

      code.updateCPSView(50);
      expect(cpsIndicator.innerText).to.equal(50);

      code.updateCPSView(100);
      expect(cpsIndicator.innerText).to.equal(100);
    });
  });

  describe('The updatePrice function', function() {
    it('returns an integer, not a float', function() {
      const result = code.updatePrice(501);
      expect(result).to.be.a('number');
      expect(result % 1).to.be.equal(0);
    });
    it('returns 125% of the input price, rounded down', function() {
      const result = code.updatePrice(501);
      expect(result).to.be.equal(626);
    });
  });

  describe('The attemptToBuyProducer function', function() {
    // Set up some fake data
    let data;
    beforeEach('initialize some fake data', function() {
      data = {
        coffee: 100,
        totalCPS: 0,
        producers: [
          { id: 'producer_A', price: 50, cps: 5, qty: 0 },
          { id: 'producer_B', price: 200, cps: 10, qty: 0 },
          { id: 'producer_C', price: 500, cps: 20, qty: 0 }
        ]
      };
    });

    it('returns a boolean', function() {
      const result = code.attemptToBuyProducer(data, 'producer_A');
      expect(result).to.be.a('boolean');
    });

    it('returns false if the player cannot afford the producer', function() {
      const result = code.attemptToBuyProducer(data, 'producer_B');
      expect(result).to.be.equal(false);
    });
    it('returns true if the player can afford the producer', function() {
      const result = code.attemptToBuyProducer(data, 'producer_A');
      expect(result).to.be.equal(true);
    });

    it('increments the quantity of the producer in question only if the player can afford it', function() {
      code.attemptToBuyProducer(data, 'producer_A');
      expect(data.producers[0].qty).to.be.equal(1);

      code.attemptToBuyProducer(data, 'producer_B');
      expect(data.producers[1].qty).to.be.equal(0);
    });

    it("decrements the player's coffee by the *current* price of the producer, but only if the player can afford it", function() {
      code.attemptToBuyProducer(data, 'producer_B');
      expect(data.coffee).to.be.equal(100);

      code.attemptToBuyProducer(data, 'producer_A');
      expect(data.coffee).to.be.equal(50);
    });
    // hint: use a function already written
    it('updates the price of the producer to 125% of the previous price, rounded down, but only if the player can afford the producer', function() {
      code.attemptToBuyProducer(data, 'producer_A');
      expect(data.producers[0].price).to.be.equal(62);

      code.attemptToBuyProducer(data, 'producer_B');
      expect(data.producers[1].price).to.be.equal(200);
    });
    // hint: use a function already written
    it('updates the total CPS, but only if the player can afford the producer', function() {
      code.attemptToBuyProducer(data, 'producer_A');
      expect(data.totalCPS).to.be.equal(5);

      code.attemptToBuyProducer(data, 'producer_B');
      expect(data.totalCPS).to.be.equal(5);
    });
    it("does not modify data in any way if the player tries to buy something they can't afford", function() {
      const snapshot = JSON.stringify(data);
      code.attemptToBuyProducer(data, 'producer_B');
      expect(JSON.stringify(data)).to.equal(snapshot);
    });
  });

  describe('The buyButtonClick function', function() {
    // JSDOM doesn't have window.alert, so we'll roll our own
    window.alert = alertString => {
      console.log('window.alert() called with:', alertString);
    };

    // Clear out our fake DOM
    beforeEach('reset the fake DOM', function() {
      resetJSDOM();
    });

    // Set up some fake data
    let data;
    beforeEach('initialize some fake data', function() {
      data = {
        coffee: 100,
        totalCPS: 0,
        producers: [
          { id: 'producer_A', price: 50, cps: 5, qty: 0 },
          { id: 'producer_B', price: 200, cps: 10, qty: 0 },
          { id: 'producer_C', price: 500, cps: 20, qty: 0 }
        ]
      };
    });

    // hint: use the function you've already written!
    it('mutates the data only if the player can afford the producer', function() {
      // buyButtonClick accepts a browser event argument.
      // Here we simulate this by creating an event object ourselves.
      // We'll only give that fake event bject the properties that
      // are relevant for our purposes

      // this purchase should suceed
      const snapshot = JSON.stringify(data);
      const event = { target: { tagName: 'BUTTON', id: 'buy_producer_A' } };
      code.buyButtonClick(event, data);
      expect(JSON.stringify(data)).to.not.be.equal(snapshot);

      // this purchase should fail
      const snapshot2 = JSON.stringify(data);
      const event2 = { target: { tagName: 'BUTTON', id: 'buy_producer_B' } };
      code.buyButtonClick(event2, data);
      expect(JSON.stringify(data)).to.be.equal(snapshot2);
    });

    // hint: see https://developer.mozilla.org/en-US/docs/Web/API/Window/alert
    it('shows an alert box with the message "Not enough coffee!" only if the player cannot afford the producer', function() {
      const spyOnAlert = sinon.spy(window, 'alert');

      // this purchase should fail
      const event = { target: { tagName: 'BUTTON', id: 'buy_producer_B' } };
      code.buyButtonClick(event, data);
      expect(spyOnAlert.called).to.equal(true);

      // this purchase should not fail
      spyOnAlert.called = false;
      const event2 = { target: { tagName: 'BUTTON', id: 'buy_producer_A' } };
      code.buyButtonClick(event2, data);
      expect(spyOnAlert.called).to.equal(false);

      spyOnAlert.restore();
    });

    // Notice that at the bottom of script.js we attach an event listener
    // that calls `buyButtonClick` not just to a buy button but to
    // the entire producer container. Here we test that you filter clicks
    // so that the function pays attention only to clicks on buy buttons
    it("does not modify data or show an alert box if the event passed in doesn't represent a click on a button element", function() {
      const spyOnAlert = sinon.spy(window, 'alert');
      const snapshot = JSON.stringify(data);

      // this represents a click on something other than a button
      const event = { target: { tagName: 'DIV' } };
      code.buyButtonClick(event, data);

      // now let's check to make sure this didn't do anything
      expect(spyOnAlert.called).to.equal(false);
      expect(JSON.stringify(data)).to.equal(snapshot);
    });

    // hint: call a function you've already written!
    it('renders the updated producers when a purchase succeeds', function() {
      const event = { target: { tagName: 'BUTTON', id: 'buy_producer_A' } };
      code.buyButtonClick(event, data);
      const producerContainer = document.getElementById('producer_container');
      expect(producerContainer.childNodes.length).to.be.equal(1);
    });

    // hint: call a function you've already written!
    it('updates the coffee count on the DOM, reflecting that coffee has been spent, when a purchase succeeds', function() {
      const event = { target: { tagName: 'BUTTON', id: 'buy_producer_A' } };
      code.buyButtonClick(event, data);
      const coffeeCounter = document.getElementById('coffee_counter');
      expect(coffeeCounter.innerText).to.equal(50);
    });

    // hint: call a function you've already written!
    it("updates the total CPS on the DOM, reflecting that the new producer's CPS has been added", function() {
      const event = { target: { tagName: 'BUTTON', id: 'buy_producer_A' } };
      code.buyButtonClick(event, data);
      const cpsIndicator = document.getElementById('cps');
      expect(cpsIndicator.innerText).to.equal(5);
    });
  });

  describe.only('The tick function', function() {
    // Clear out our fake DOM
    beforeEach('reset the fake DOM', function() {
      resetJSDOM();
    });

    // Set up some fake data
    let data;
    beforeEach('initialize some fake data', function() {
      data = {
        coffee: 90,
        totalCPS: 10,
        producers: [
          { id: 'producer_A', price: 50, cps: 5, qty: 0 },
          { id: 'producer_B', price: 200, cps: 10, qty: 1 },
          { id: 'producer_C', price: 500, cps: 20, qty: 0 }
        ]
      };
    });

    it('increases coffee count by the total CPS', function() {
      code.tick(data);
      expect(data.coffee).to.be.equal(100);
    });

    // hint: use what you've written already! The tick function can be just a few lines
    it('updates the dom to reflect this new coffee count', function() {
      code.tick(data);
      const coffeeCounter = document.getElementById('coffee_counter');
      expect(coffeeCounter.innerText).to.equal(100);
    });

    it('updates the dom to reflect any newly unlocked producers', function() {
      code.tick(data);
      const producerContainer = document.getElementById('producer_container');
      expect(producerContainer.childNodes.length).to.be.equal(2);
    });
  });
});
