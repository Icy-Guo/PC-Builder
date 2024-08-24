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
const btnSubmit = document.getElementById('submit');
const budgetDisplay = document.querySelector('.tool__price-budget');

const btnRec = document.getElementById('recommendation');
const textRec = document.querySelectorAll('.tool__select-box p');

const selectBoxes = document.querySelectorAll('.tool__select-box select');
const costDisplay = document.querySelector('.tool__price-cost');

// Compare
const componentSelect = document.getElementById('component');
const model1Select = document.getElementById('model1');
const model2Select = document.getElementById('model2');

const btnCompareModal = document.getElementById('compare-modal');
const compareContainer = document.getElementById('compare-container');
const compareModel1 = document.getElementById('compare-model1');
const compareModel2 = document.getElementById('compare-model2');

// Download
const btnDownload = document.getElementById('download');

// Comment
const rating = document.getElementById('rating');
const comment = document.getElementById('comment');
const btnShare = document.getElementById('share');

// Load options
async function loadOptions(jsonFile, selectElement, defaultOptionText) {
  try {
    const response = await fetch(jsonFile);
    const data = await response.json();

    selectElement.innerHTML = `<option>${defaultOptionText}</option>`;

    data.forEach(item => {
      const option = document.createElement('option');
      option.value = item.Name;
      option.textContent = item.Name;
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error(`Error loading data from ${jsonFile}:`, error);
  }
}

loadOptions('gpu.json', gpuSelect, 'Choose GPU');
loadOptions('cpu.json', cpuSelect, 'Choose CPU');
loadOptions('cooler.json', coolerSelect, 'Choose Cooler');
loadOptions('motherboard.json', motherboardSelect, 'Choose Motherboard');
loadOptions('memory.json', memorySelect, 'Choose Memory');
loadOptions('storage.json', storageSelect, 'Choose Storage');
loadOptions('box.json', caseSelect, 'Choose Case');
loadOptions('powersupply.json', powersupplySelect, 'Choose Power Supply');

// Update budget
btnSubmit.addEventListener('click', function (e) {
  e.preventDefault();
  const budgetValue = budgetInput.value;

  if (budgetValue && budgetValue >= 0) {
    budgetDisplay.textContent = `Budget: $${budgetValue}`;
    checkBudgetExceeded();
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
  fetch('cooler.json').then(response => response.json()),
  fetch('motherboard.json').then(response => response.json()),
  fetch('memory.json').then(response => response.json()),
  fetch('storage.json').then(response => response.json()),
  fetch('box.json').then(response => response.json()),
  fetch('powersupply.json').then(response => response.json()),
])
  .then(
    ([
      gpuData,
      cpuData,
      coolerData,
      motherboardData,
      memoryData,
      storageData,
      boxData,
      powerSupplyData,
    ]) => {
      function updateCost() {
        totalCost = 0;

        selectBoxes.forEach(select => {
          const selectedOption = select.value;
          let selectedItem = null;

          selectedItem =
            gpuData.find(gpu => gpu.Name === selectedOption) ||
            cpuData.find(cpu => cpu.Name === selectedOption) ||
            coolerData.find(cooler => cooler.Name === selectedOption) ||
            motherboardData.find(
              motherboard => motherboard.Name === selectedOption
            ) ||
            memoryData.find(memory => memory.Name === selectedOption) ||
            storageData.find(storage => storage.Name === selectedOption) ||
            boxData.find(box => box.Name === selectedOption) ||
            powerSupplyData.find(
              powerSupply => powerSupply.Name === selectedOption
            );

          if (selectedItem) {
            totalCost += selectedItem.Price;
          }
        });

        costDisplay.textContent = `Cost: $${totalCost}`;

        checkBudgetExceeded();
      }

      selectBoxes.forEach(select => {
        select.addEventListener('change', updateCost);
      });
    }
  )
  .catch(error => console.error('Error loading data:', error));

// Compare budget with cost
function checkBudgetExceeded() {
  const budgetValue = parseFloat(
    budgetDisplay.textContent.replace('Budget: $', '')
  );
  const costValue = parseFloat(costDisplay.textContent.replace('Cost: $', ''));

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

// Compare
componentSelect.addEventListener('change', function () {
  const component = componentSelect.value;
  console.log(component);
  if (component === 'Choose Component') {
    model1Select.innerHTML = '<option>Choose Model-1</option>';
    model2Select.innerHTML = '<option>Choose Model-2</option>';
  }

  const jsonFile = `${component}.json`;

  fetch(jsonFile)
    .then(response => response.json())
    .then(data => {
      model1Select.innerHTML = '<option>Choose Model-1</option>';
      model2Select.innerHTML = '<option>Choose Model-2</option>';

      data.forEach(item => {
        const option1 = document.createElement('option');
        option1.value = item.Name;
        option1.textContent = item.Name;
        model1Select.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = item.Name;
        option2.textContent = item.Name;
        model2Select.appendChild(option2);
      });
    })
    .catch(error => console.error('Error loading JSON data:', error));
});

btnCompareModal.addEventListener('click', function () {
  const selectedModel1 = model1Select.value;
  const selectedModel2 = model2Select.value;

  if (
    componentSelect.value !== 'Choose Component' &&
    selectedModel1 !== 'Choose Model-1' &&
    selectedModel2 !== 'Choose Model-2'
  ) {
    const jsonFile = `${componentSelect.value}.json`;

    fetch(jsonFile)
      .then(response => response.json())
      .then(data => {
        const model1Data = data.find(item => item.Name === selectedModel1);
        const model2Data = data.find(item => item.Name === selectedModel2);

        compareModel1.innerHTML = '<h3>Model-1 Details</h3>';
        compareModel2.innerHTML = '<h3>Model-2 Details</h3>';

        Object.keys(model1Data).forEach(key => {
          if (key !== 'Name') {
            const model1Value = model1Data[key];
            const model2Value = model2Data[key];

            const model1Row = document.createElement('p');
            model1Row.textContent = `${key}: ${model1Value}`;
            compareModel1.appendChild(model1Row);

            const model2Row = document.createElement('p');
            model2Row.textContent = `${key}: ${model2Value}`;
            compareModel2.appendChild(model2Row);

            if (model1Value > model2Value) {
              model1Row.classList.add('bigger');
            } else if (model2Value > model1Value) {
              model2Row.classList.add('bigger');
            }
          }
        });

        compareContainer.classList.remove('hidden');
      })

      .catch(error => console.error('Error comparing models:', error));
  } else {
    alert('Please select a Component, Model-1, and Model-2 to compare.');
  }
});

// Download
function downloadPDF() {
  //Create a new PDF file
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  //Add text to PDF
  doc.text('Thank you for using PC-Builder, below is your choices.', 10, 10);
  doc.autoTable({
    head: [['Component', 'Model']],
    body: [
      ['GPU', chosenGpu.textContent],
      ['CPU', chosenCpu.textContent],
      ['Cooler', chosenCooler.textContent],
      ['Motherboard', chosenMotherboard.textContent],
      ['Memory', chosenMemory.textContent],
      ['Storage', chosenStorage.textContent],
      ['Case', chosenCase.textContent],
      ['Power Supply', chosenPowersupply.textContent],
      ['TOTAL', '$' + totalCost],
    ],
  });
  // Save the PDF and prompt the download
  doc.save('PC_Configuration_List.pdf');
}

function checkFill(){
  if (
    chosenGpu.textContent !== '' &&
    chosenCpu.textContent !== '' &&
    chosenCase.textContent !== '' &&
    chosenCooler.textContent !== '' &&
    chosenMemory.textContent !== '' &&
    chosenMotherboard.textContent !== '' &&
    chosenPowersupply.textContent !== '' &&
    chosenStorage.textContent !== ''
  ) {return true}
  else{return false}
}

btnDownload.addEventListener('click', function () {
  if (checkFill()) {
    downloadPDF();
  } else {
    alert(
      'You can only download your PC Configuration List after you have chosen all components.'
    );
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

btnRec.addEventListener('click', function () {
  const budgetValue = budgetInput.value;

  if (!budgetValue || isNaN(budgetValue)) {
    alert('Please enter a valid budget.');
    return;
  }

  fetch('http://localhost:5000/submit-budget', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ budget: parseFloat(budgetValue) }),
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(error => {
          throw new Error(error.message);
        });
      }
      return response.json();
    })
    .then(data => {
      if (data.status === 'success') {
        // console.log('Result from Python script:', data.result);
        // console.log(data.result.items_selected);
        const items = data.result.items_selected;
        const selectedItemsSpans = document.querySelectorAll('.rec-item');

        if (items.length === selectedItemsSpans.length) {
          items.forEach((item, index) => {
            selectedItemsSpans[index].textContent = item;
          });
        } else {
          console.error(
            'The number of items does not match the number of select boxes.'
          );
        }
      } else {
        alert('Error: ' + data.message);
      }
    })
    .catch(error => console.error('Error:', error));
});

btnShare.addEventListener('click', function () {
  if(checkFill() && rating.value !=='' && comment.value !==''){
    const data = { rating: rating.value, comment: comment.value, 
      gpu: chosenGpu.textContent, 
      cpu: chosenCpu.textContent, 
      box: chosenCase.textContent, 
      cooler: chosenCooler.textContent,
      memory: chosenMemory.textContent,
      motherboard: chosenMotherboard.textContent,
      powersupply: chosenPowersupply.textContent,
      storage: chosenStorage.textContent};
    fetch('http://localhost:5000/submit-comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
     })
    .then(data => {
      console.log('Success:', data.result);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
    alert("Thank you for sharing your story!!!");
  }
  else{
    alert("You can only make comment after you fill all the choices, rating and comment.");
  }
});