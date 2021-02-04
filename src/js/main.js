import Slider from './partials/_slider';

import TabsWidget from './partials/_tabsWidget';

// import burger from '../components/burger/_burger';

function testWebP(callback) {
  const webP = new Image();
  webP.src =
    'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  // eslint-disable-next-line no-multi-assign
  webP.onload = webP.onerror = function () {
    callback(webP.height === 2);
  };
}

testWebP(support => {
  if (support) document.body.classList.add('use-webp');
});

const specialtiesSlider = new Slider(
  '.specialties .slider',
  '.slider__list',
  '.slider__slide',
  '.slider__paginationToggle',
);
specialtiesSlider.init();

const tabsWidget = new TabsWidget(
  '.menu__slider',
  '.menu__toggle',
  '.menu__slide',
);
tabsWidget.init();
