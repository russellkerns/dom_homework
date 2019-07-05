const { expect, assert } = require('chai');
const jsdom = require('jsdom');

describe('Slice 1: Clicking & Incrementing Coffee', function() {
  describe('The updateCoffeeView function', function() {
    it('calls document.getElementById()', function() {});
    it('updates the coffee counter to display the current coffee count', function() {});
  });

  describe('The clickCoffee function', function() {
    it('increments the coffee count by one', function() {});
    it('calls updateCoffeeView, so clicking updates the coffee counter ', function() {});
  });
});

describe('Slice 2: Unlocking & Rendering Producers', function() {
  describe('The unlockProducers function', function() {
    it("changes `unlocked` to `true` when the player's coffee count is over half the initial price of the producer", function() {});
    it('does not set `unlocked` to `false` once a producer has been unlocked, even if the coffee count drops', function() {});
  });

  describe('The getUnlockedProducers function', function() {
    it('returns an array of producer objects', function() {});
    it('filters out producer objects which are not unlocked', function() {});
  });

  describe('The makeDisplayNameFromId function', function() {
    it('returns a string', function() {});
    it('transforms its input string from snake_case to Title Case', function() {});
  });

  describe('The updatePrice function', function() {
    it('returns an integer, not a float', function() {});
    it('returns 125% of the input price, rounded down', function() {});
  });

  describe('The makeProducerDiv function', function() {
    it('', function() {});
    it('', function() {});
  });

  describe('The renderProducers function', function() {
    it('', function() {});
    it('', function() {});
  });
});

describe('Slice 3: Updating Total CPS', function() {
  describe('The calculateTotalCPS function', function() {
    it('returns a number', function() {});
    it("returns the sum of each producer's cps times its quantity", function() {});
  });

  describe('The updateCPSView function', function() {
    it('calls document.getElementById()', function() {});
    it('updates the total cps indicator to display the current total cps', function() {});
  });
});

describe('Slice 4: Buying Producers & Tick', function() {
  describe('The getProducerById function', function() {
    it('', function() {});
    it('', function() {});
  });
  describe('The canAffordProducer function', function() {
    it('', function() {});
    it('', function() {});
  });
  describe('The buyButtonClick function', function() {
    it('', function() {});
    it('', function() {});
  });
  describe('The tick function', function() {
    it('increases coffee count by the total CPS', function() {});
    it('', function() {});
  });
});
