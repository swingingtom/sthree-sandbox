// (.*)(family\=)([A-z+]*)(.*) => $3

let domElement, container;

export default (htmlElement, options = {}) => {
    domElement = htmlElement;

    container = document.createElement("div");
    container.classList.add("__ui-container");

    if (options.description) {
        container.appendChild(_buildDescription(options.description));
    }

    if (options.credits) {
        container.appendChild(_buildCredits(options.credits));
    }

    if (options.git) {
        container.appendChild(_buildGitLink(options.git));
    }

    domElement.appendChild(container);
}

function _buildCredits(htmlContent) {

    const creditsElement = document.createElement('div');
    creditsElement.classList.add('__credits');

    creditsElement.innerHTML = htmlContent;
    _filterHtml(creditsElement);
    _diversityLinks(creditsElement);

    return creditsElement;

}

function _buildDescription(htmlContent) {

    const descriptionElement = document.createElement('div');
    descriptionElement.classList.add('__description');

    descriptionElement.innerHTML = htmlContent;
    _filterHtml(descriptionElement);
    _diversityLinks(descriptionElement);

    return descriptionElement;

}

function _buildGitLink(htmlContent) {

    const gitLink = document.createElement('a');
    gitLink.classList.add('__git');
    gitLink.target = "_blank";
    gitLink.rel = "noopener";
    gitLink.href = htmlContent;
    gitLink.textContent = "{}"
    _filterHtml(gitLink);
    _diversityLink(gitLink);


    return gitLink;
}

function _filterHtml(element) {
    // If the idea of placing links on sandbox is bad, some filtering may occurs.
    // element.textContent = element.textContent;
}


const min = 33;
const max = 225;
const mult = max - min;
let r = min + Math.random() * mult, g = min + Math.random() * mult, b = min + Math.random() * mult;
if (r < b && r < g) {
    r = 0;
} else if (b < r && b < g) {
    b = 0;
} else {
    g = 0;
}

if (r > b && r > g) {
    r = 255;
} else if (b > r && b > g) {
    b = 255;
} else {
    g = 255;
}

function _diversityLinks(element) {
    // because its hard to choose a color, use a random color at launch
    const buttons = element.querySelectorAll('a');
    for (let i = 0; i < buttons.length; i++) {
        _diversityLink(buttons[i]);
    }
}

function _diversityLink(link) {
    link.style.color = `rgb(${r},${g},${b})`;
}