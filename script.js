'use strict';
// select
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--compare');
const btnScrollToRecommendations = document.querySelector('#btn--scroll-to-1');
const btnScrollToTool = document.querySelector('#btn--scroll-to-2');
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');
const section3 = document.querySelector('#section--3');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.recommendations__tab');
const tabsContainer = document.querySelector('.recommendations__tab-container');
const tabsContent = document.querySelectorAll('.recommendations__content');

// Intereactive tool select
const gpuSelect = document.getElementById('GPU');
const cpuSelect = document.getElementById('CPU');
const coolerSelect = document.getElementById('Cooler');
const motherboardSelect = document.getElementById('Motherboard');
const memorySelect = document.getElementById('Memory');
const storageSelect = document.getElementById('Storage');
const caseSelect = document.getElementById('Case');
const powersupplySelect = document.getElementById('Powersupply');

const chosenGpu = document.getElementById('chosen-gpu');
const chosenCpu = document.getElementById('chosen-cpu');
const chosenCooler = document.getElementById('chosen-cooler');
const chosenMotherboard = document.getElementById('chosen-motherboard');
const chosenMemory = document.getElementById('chosen-memory');
const chosenStorage = document.getElementById('chosen-storage');
const chosenCase = document.getElementById('chosen-case');
const chosenPowersupply = document.getElementById('chosen-powersupply');

const budgetInput = document.getElementById('budget');
const btnSubmit = document.querySelector('.btn--submit');
const budgetDisplay = document.querySelector('.tool__price-budget');

const btnRec = document.querySelector('.btn--rec');
const textRec = document.querySelectorAll('.tool__select-box p');

const selectBoxes = document.querySelectorAll('.tool__select-box select');
const costDisplay = document.querySelector('.tool__price-cost');

// Fetch data
fetch('gpu.json')
  .then(response => response.json())
  .then(data => {
    gpuSelect.innerHTML = '<option>Choose GPU</option>';

    data.forEach(gpu => {
      const option = document.createElement('option');
      option.value = gpu.Name;
      option.textContent = gpu.Name;
      gpuSelect.appendChild(option);
    });
  })
  .catch(error => console.error('Error loading GPU data:', error));

fetch('cpu.json')
  .then(response => response.json())
  .then(data => {
    cpuSelect.innerHTML = '<option>Choose CPU</option>';

    data.forEach(cpu => {
      const option = document.createElement('option');
      option.value = cpu.Name;
      option.textContent = cpu.Name;
      cpuSelect.appendChild(option);
    });
  })
  .catch(error => console.error('Error loading GPU data:', error));

// Show rec
btnRec.addEventListener('click', function () {
  textRec.forEach(text => {
    text.classList.toggle('hidden');
  });
});

// Update budget
btnSubmit.addEventListener('click', function (e) {
  e.preventDefault();
  const budgetValue = budgetInput.value;

  if (budgetValue && budgetValue >= 0) {
    budgetDisplay.textContent = `Budget: $${budgetValue}`;
  } else {
    alert('Please enter a valid budget.');
  }
});

// Update tool
function updateChoice(selectElement, displayElement) {
  if (!selectElement.value.startsWith('Choose')) {
    displayElement.textContent = selectElement.value;
  } else {
    displayElement.textContent = '';
  }
}

gpuSelect.addEventListener('change', () => updateChoice(gpuSelect, chosenGpu));
cpuSelect.addEventListener('change', () => updateChoice(cpuSelect, chosenCpu));
coolerSelect.addEventListener('change', () =>
  updateChoice(coolerSelect, chosenCooler)
);
motherboardSelect.addEventListener('change', () =>
  updateChoice(motherboardSelect, chosenMotherboard)
);
memorySelect.addEventListener('change', () =>
  updateChoice(memorySelect, chosenMemory)
);
storageSelect.addEventListener('change', () =>
  updateChoice(storageSelect, chosenStorage)
);
caseSelect.addEventListener('change', () =>
  updateChoice(caseSelect, chosenCase)
);
powersupplySelect.addEventListener('change', () =>
  updateChoice(powersupplySelect, chosenPowersupply)
);

updateChoice(gpuSelect, chosenGpu);
updateChoice(cpuSelect, chosenCpu);
updateChoice(coolerSelect, chosenCooler);
updateChoice(motherboardSelect, chosenMotherboard);
updateChoice(memorySelect, chosenMemory);
updateChoice(storageSelect, chosenStorage);
updateChoice(caseSelect, chosenCase);
updateChoice(powersupplySelect, chosenPowersupply);

// Update cost
let totalCost = 0;

Promise.all([
  fetch('gpu.json').then(response => response.json()),
  fetch('cpu.json').then(response => response.json()),
])
  .then(([gpuData, cpuData]) => {
    function updateCost() {
      totalCost = 0;

      selectBoxes.forEach(select => {
        const selectedOption = select.value;
        let selectedItem = null;

        selectedItem =
          gpuData.find(gpu => gpu.Name === selectedOption) ||
          cpuData.find(cpu => cpu.Name === selectedOption);

        if (selectedItem) {
          totalCost += selectedItem.price;
        }
      });

      costDisplay.textContent = `Cost: $${totalCost}`;

      checkBudgetExceeded();
    }

    selectBoxes.forEach(select => {
      select.addEventListener('change', updateCost);
    });
  })
  .catch(error => console.error('Error loading data:', error));

// Compare budget with cost
function checkBudgetExceeded() {
  const budgetValue = parseFloat(
    budgetDisplay.textContent.replace('Budget: $', '')
  );
  const costValue = parseFloat(costDisplay.textContent.replace('Cost: $', ''));

  console.log(costValue, budgetValue);
  if (costValue > budgetValue) {
    costDisplay.style.backgroundColor = '#ff585f';
  } else {
    costDisplay.style.backgroundColor = '#7abb54';
  }
}

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Button scrolling

btnScrollToRecommendations.addEventListener('click', function () {
  section2.scrollIntoView({ behavior: 'smooth' });
});

btnScrollToTool.addEventListener('click', function () {
  section3.scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////
// Tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.recommendations__tab');

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove('recommendations__tab--active'));
  tabsContent.forEach(c =>
    c.classList.remove('recommendations__content--active')
  );

  // Activate tab
  clicked.classList.add('recommendations__tab--active');

  // Activate content area
  document
    .querySelector(`.recommendations__content--${clicked.dataset.tab}`)
    .classList.add('recommendations__content--active');
});

///////////////////////////////////////
// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
  }
};

// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////
// Sticky navigation: Intersection Observer API

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

///////////////////////////////////////
// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

///////////////////////////////////////
// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
