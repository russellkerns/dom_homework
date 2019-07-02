const data = window.data;

const updateCoffeeView = () => {
  const coffeeCounter = document.getElementById('coffee_counter');
  coffeeCounter.innerText = data.coffee;
};

const coffeeClick = event => {
  event.preventDefault();
  data.coffee += 1;
  updateCoffeeView();
};

const bigCoffee = document.getElementById('big_coffee');
bigCoffee.addEventListener('click', coffeeClick);
