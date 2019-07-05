// These two functions come from Chai, our assertion library. Unlike Jasmine, the test framework we're using in this project doesn't come with assertions built-in, so we need to get assertions from another library.
const { expect } = require('chai');

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
}

/***************************
 *   SLICE 1 STARTS HERE
 ***************************/

describe('Slice 1: Clicking & Incrementing Coffee', function() {
  beforeEach('reset the fake DOM', function() {
    resetJSDOM();
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
  });

  describe('The updateCoffeeView function', function() {
    it('calls document.getElementById() or document.querySelector()', function() {
      const spyOnGetElementById = sinon.spy(document, 'getElementById');
      const spyOnQuerySelector = sinon.spy(document, 'querySelector');
      code.updateCoffeeView(); // this is where we actually run your code
      const wereFnsCalled =
        spyOnGetElementById.called || spyOnQuerySelector.called;
      expect(wereFnsCalled).to.equal(true);
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
          { id: 'producer A', price: 50, unlocked: false },
          { id: 'producer B', price: 200, unlocked: false },
          { id: 'producer C', price: 500, unlocked: false }
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

  describe.only('The getUnlockedProducers function', function() {
    let data;
    beforeEach('initialize some fake data', function() {
      data = {
        coffee: 0,
        producers: [
          { id: 'producer A', price: 50, unlocked: true },
          { id: 'producer B', price: 200, unlocked: false },
          { id: 'producer C', price: 500, unlocked: false }
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
    xit('returns a string', function() {
      expect(true).to.equal(false);
    });
    xit('transforms its input string from snake_case to Title Case', function() {
      expect(true).to.equal(false);
    });
  });

  describe('The updatePrice function', function() {
    xit('returns an integer, not a float', function() {
      expect(true).to.equal(false);
    });
    xit('returns 125% of the input price, rounded down', function() {
      expect(true).to.equal(false);
    });
  });

  describe('The makeProducerDiv function', function() {
    xit('returns a DOM element', function() {
      expect(true).to.equal(false);
    });
    xit('correctly fills in template string', function() {
      expect(true).to.equal(false);
    });
  });

  // We don't test for this, but here you should be calling  unlockProducers,
  // getUnlockedProducers, and makeProducerDiv
  describe('The renderProducers function', function() {
    xit('calls document.getElementById() or document.querySelector()', function() {
      expect(true).to.equal(false);
    });
    xit('appends some elements to the producer container', function() {
      expect(true).to.equal(false);
    });
    // That is, you need to call unlockProducers, assuming that function is working
    xit('unlocks any locked producers which need to be unlocked', function() {
      expect(true).to.equal(false);
    });
    xit('does not append locked producers', function() {
      expect(true).to.equal(false);
    });
    xit('appends all of the unlocked producers', function() {
      expect(true).to.equal(false);
    });
    xit("deletes the producer container's children before appending new producers", function() {
      expect(true).to.equal(false);
    });
  });
});

/***************************
 *   SLICE 3 STARTS HERE
 ***************************/

describe('Slice 3: Buying Producers & Tick', function() {
  describe('The getProducerById function', function() {
    xit('returns an object', function() {
      expect(true).to.equal(false);
    });
    xit('uses the .find() array method', function() {
      expect(true).to.equal(false);
    });
    xit('returns the correct producer object', function() {
      expect(true).to.equal(false);
    });
  });
  describe('The canAffordProducer function', function() {
    xit('returns a boolean', function() {
      expect(true).to.equal(false);
    });
    xit('returns true if the player can afford the producer', function() {
      expect(true).to.equal(false);
    });
    xit('returns false if the player cannot afford the producer', function() {
      expect(true).to.equal(false);
    });
  });

  describe('The updateCPSView function', function() {
    xit('calls document.getElementById() or document.querySelector()', function() {
      expect(true).to.equal(false);
    });
    xit('updates the total cps indicator to display the current total cps', function() {
      expect(true).to.equal(false);
    });
  });

  describe('The attemptToBuyProducer function', function() {
    xit('returns a boolean', function() {
      expect(true).to.equal(false);
    });
    xit('returns false if the player cannot afford the producer', function() {
      expect(true).to.equal(false);
    });
    xit('returns true if the player can afford the producer', function() {
      expect(true).to.equal(false);
    });

    xit('increments the quantity of the producer in question if the player can afford it', function() {
      expect(true).to.equal(false);
    });
    xit("decrements the player's coffee by the *current* price of the producer if the player can afford it", function() {
      expect(true).to.equal(false);
    });
    // hint: use a function already written
    xit('updates the price of the producer to 125% of the previous price, rounded down, if the player can afford the producer', function() {
      expect(true).to.equal(false);
    });
    // hint: use a function already written
    xit('updates the total CPS, if the player can afford the producer', function() {
      expect(true).to.equal(false);
    });
    xit("does not modify data if the player tries to buy something they can't afford", function() {
      expect(true).to.equal(false);
    });
  });

  describe('The updateViewAfterPurchase function', function() {
    xit('renders the producers to the DOM, showing an updated quantity', function() {
      expect(true).to.equal(false);
    });
    xit('renders the producers to the DOM, showing an updated cost', function() {
      expect(true).to.equal(false);
    });
    xit('updates the coffee count on the DOM, reflecting that coffee has been spent', function() {
      expect(true).to.equal(false);
    });
    xit("updates the total CPS on the DOM, reflecting that the new producer's CPS has been added", function() {
      expect(true).to.equal(false);
    });
    xit('does not mutate the data (it changes only the DOM)', function() {
      expect(true).to.equal(false);
    });
  });

  describe('The buyButtonClick function', function() {
    // hint: check event.target.tagName
    xit("does not modify data if the event passed in doesn't represent a click on a button element", function() {
      expect(true).to.equal(false);
    });
    // hint: use the function you've already written!
    xit('mutates the data only if the player can afford the producer', function() {
      expect(true).to.equal(false);
    });
    // hint: see https://developer.mozilla.org/en-US/docs/Web/API/Window/alert
    xit('shows an alert box if the player cannot afford the producer', function() {
      expect(true).to.equal(false);
    });
    // hint: use the function you've already written!
    xit('updates the dom if only the player can afford the producer', function() {
      expect(true).to.equal(false);
    });
  });

  describe('The tick function', function() {
    xit('increases coffee count by the total CPS', function() {
      expect(true).to.equal(false);
    });
    // hint: use what you've written! The tick function can be very short
    xit('updates the dom to reflect this new coffee count', function() {
      expect(true).to.equal(false);
    });
    xit('updates the dom to reflect any newly unlocked producers', function() {
      expect(true).to.equal(false);
    });
  });
});
