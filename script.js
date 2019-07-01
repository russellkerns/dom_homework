const data = {
  resources: [
    { id: 'money', name: '💵 Money', quantity: 0.0 },
    { id: 'pizza', name: '🍕Pizzas', quantity: 0 },
    { id: 'flour', name: '🌾 Flour', quantity: 5 },
    { id: 'sauce', name: '🍅 Sauce', quantity: 5 },
    { id: 'cheese', name: '🧀 Cheese', quantity: 5 }
  ],
  actions: [
    {
      id: 'sell_pizza',
      display: 'Sell Pizza',
      ingredients: { pizza: 1 },
      output: { money: 5.0 }
    },
    {
      id: 'make_pizza',
      display: 'Make Pizza',
      ingredients: { flour: 1, sauce: 1, cheese: 1 },
      output: { pizza: 1 }
    },
    {
      id: 'buy_flour',
      display: 'Buy Flour',
      ingredients: { money: 1 },
      output: { flour: 1 }
    },
    {
      id: 'buy_sauce',
      display: 'Buy Sauce',
      ingredients: { money: 1.5 },
      output: { sauce: 1 }
    },
    {
      id: 'buy_cheese',
      display: 'Buy Cheese',
      ingredients: { money: 2 },
      output: { cheese: 1 }
    }
  ]
};

const buildInventoryRowDiv = resource => {
  const { name, id, quantity } = resource;
  const inventoryRow = document.createElement('tr');
  const inventoryRowTitle = document.createElement('td');
  inventoryRowTitle.innerText = name;
  inventoryRow.appendChild(inventoryRowTitle);
  const inventoryRowQuantity = document.createElement('td');
  inventoryRowQuantity.id = id;
  inventoryRowQuantity.innerText = quantity;
  inventoryRow.appendChild(inventoryRowQuantity);
  return inventoryRow;
};

const renderResources = () => {
  const inventory = document.getElementById('inventory');
  data.resources.map(buildInventoryRowDiv).forEach(row => {
    inventory.appendChild(row);
  });
};

const clearResources = () => {
  const inventory = document.getElementById('inventory');
  while (inventory.childNodes.length) {
    inventory.removeChild(inventory.firstChild);
  }
};

const makeCostString = ingredients => {
  return Object.entries(ingredients)
    .map(entry => `${entry[1]} ${entry[0]}`)
    .join(', ');
};

const buildActionButton = action => {
  const { display, ingredients, id } = action;
  const button = document.createElement('button');
  button.id = id;
  const buttonTitleDiv = document.createElement('div');
  buttonTitleDiv.innerText = display;
  button.appendChild(buttonTitleDiv);
  const buttonCostDiv = document.createElement('div');
  buttonCostDiv.innerText = makeCostString(ingredients);
  button.appendChild(buttonCostDiv);
  return button;
};

const renderActions = () => {
  const actions = document.getElementById('actions');
  data.actions.map(buildActionButton).forEach(button => {
    actions.appendChild(button);
  });
};

const getResource = id => {
  return data.resources.find(resource => resource.id === id);
};

const getAction = id => {
  return data.actions.find(action => action.id === id);
};

const enoughIngredients = actionId => {
  const ingredients = getAction(actionId).ingredients;
  let enough = true;
  Object.entries(ingredients).forEach(ingredient => {
    const resource = getResource(ingredient[0]);
    if (resource.quantity < ingredient[1]) {
      enough = false;
    }
  });
  return enough;
};

const executeAction = actionId => {
  const canPerformAction = enoughIngredients(actionId);
  if (canPerformAction) {
    const ingredients = getAction(actionId).ingredients;
    const output = getAction(actionId).output;
    Object.entries(ingredients).forEach(ingredient => {
      const resource = getResource(ingredient[0]);
      resource.quantity -= ingredient[1];
    });
    Object.entries(output).forEach(ingredient => {
      const resource = getResource(ingredient[0]);
      resource.quantity += ingredient[1];
    });
  }
  clearResources();
  renderResources();
};

const attatchEventListeners = () => {
  data.actions.forEach(action => {
    const button = document.getElementById(action.id);
    button.addEventListener('click', () => executeAction(action.id));
  });
};

// *** MAIN ***
renderResources();
renderActions();
attatchEventListeners();
