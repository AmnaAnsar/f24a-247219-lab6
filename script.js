const loadButton = document.querySelector("#loadButton");
const message = document.querySelector("#message");
const itemsElement = document.querySelector("#items");
const loadedElement = document.querySelector("#loaded");
const dearestElement = document.querySelector("#dearest");
const sumElement = document.querySelector("#sum");
const itemCountElement = document.querySelector("#itemCount");

const itemIcons = {
  pen: "✎",
  copy: "▤",
  tea: "☕"
};

function showEmptyShelf() {
  itemsElement.innerHTML = `
    <article class="empty-card">
      <div class="empty-icon">✦</div>
      <h3>Your shelf is empty</h3>
      <p>Load the shelf to see the items here.</p>
    </article>`;
  itemCountElement.textContent = "0 items";
  loadedElement.textContent = "0";
  dearestElement.textContent = "0";
  sumElement.textContent = "0";
}

function showItems(prices) {
  itemsElement.innerHTML = "";

  prices.forEach(function (item) {
    const card = document.createElement("article");
    card.className = "item-card";
    card.innerHTML = `
      <div class="item-top">
        <div class="item-icon">${itemIcons[item.item] || "•"}</div>
        <span class="item-tag">IN STOCK</span>
      </div>
      <h3 class="item-name">${item.item}</h3>
      <div class="item-bottom">
        <span class="item-price">${item.price}</span>
        <span class="item-caption">price units</span>
      </div>`;
    itemsElement.appendChild(card);
  });

  loadedElement.textContent = prices.length;
  dearestElement.textContent = prices.length
    ? Math.max(...prices.map(function (item) { return item.price; }))
    : 0;
  sumElement.textContent = prices.reduce(function (total, item) {
    return total + item.price;
  }, 0);
  itemCountElement.textContent = prices.length + (prices.length === 1 ? " item" : " items");
}

async function loadShelf() {
  loadButton.disabled = true;
  message.className = "message";
  message.textContent = "Loading…";
  showEmptyShelf();

  const names = ["pen", "copy", "tea"];

  try {
    const results = await Promise.all(names.map(async function (name) {
      const response = await fetch("/api/price?item=" + encodeURIComponent(name));
      if (!response.ok) {
        throw new Error("Could not load " + name);
      }
      const data = await response.json();
      return { item: data.item, price: data.price };
    }));

    showItems(results);
    message.className = "message success";
    message.textContent = "Shelf loaded successfully. All 3 items are ready.";
  } catch (error) {
    showEmptyShelf();
    message.className = "message error";
    message.textContent = "The server is not answering.";
  } finally {
    loadButton.disabled = false;
  }
}

loadButton.addEventListener("click", loadShelf);
