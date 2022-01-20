let domElement, container, progressElement, descriptionElement;

function setup(htmlElement) {
  domElement = htmlElement;
}

function init() {
  container = document.createElement("div");
  container.classList.add("__loading-container");

  container.innerHTML = `
  <div class="wrapper">
    <h3 class="__title">Loading Assets</h3>
    <progress value="0" max="1" min="0" step="0.001"></progress>
    <p class="__description"></p>
  </div>
  `;

  progressElement = container.querySelector("progress");
  descriptionElement = container.querySelector(".__description");

  domElement.appendChild(container);
}

function update(progress) {
  progressElement.value = progress;
}

function updateDescription(description) {
  descriptionElement.textContent = description;
}

function remove() {
  container.parentElement.removeChild(container);
}

export default { setup, init, update, updateDescription, remove };
