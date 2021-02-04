export default class Slider {
  constructor(
    sliderSelector,
    sliderListSelector,
    slideSelector,
    paginationTogglesSelector,
  ) {
    this.slider = document.querySelector(sliderSelector);
    this.sliderList = this.slider.querySelector(sliderListSelector);
    this.slides = Array.from(this.slider.querySelectorAll(slideSelector));
    this.currentSlide = this.slider.querySelector('.slider__slide--active');
    this.paginationToggles = Array.from(
      this.slider.querySelectorAll(paginationTogglesSelector),
    );
    this.paginationHandlers = {
      onClick: this.onClickPaginationToggle.bind(this),
    };
    // this.touchHandlers = {
    //   onTouchmove: this.onTouchmove.bind(this),
    // };
    // this.swipeStart = 0;
    // this.swipeDistance = 0;
  }

  changeCurrentSlide(index) {
    this.currentSlide.classList.remove('slider__slide--active');
    this.currentSlide = this.slides[index];
    this.currentSlide.classList.add('slider__slide--active');
  }

  // setIndex(index) {
  //   switch (index) {
  //     case -1:
  //       return this.slides.length - 1;
  //     case this.slides.length:
  //       return 0;
  //     default:
  //       return index;
  //   }
  // }

  // switchingSlidesUsingControls(control, index) {
  //   if (control.dataset.nominal === 'prev') {
  //     this.changeCurrentSlide(this.setIndex(index - 1));
  //   } else {
  //     this.changeCurrentSlide(this.setIndex(index + 1));
  //   }
  // }

  // onTouchmove(event) {
  //   event.preventDefault();
  //   const touchObj = event.changedTouches[0];
  //   this.swipeDistance = this.swipeStart - touchObj.clientX;
  //   if (Math.abs(this.swipeDistance) > 10) {
  //     const slideIndex = this.slides.indexOf(this.currentSlide);
  //     (this.swipeDistance < 0)
  //       ? this.changeCurrentSlide(this.setIndex(slideIndex - 1)) : this.changeCurrentSlide(this.setIndex(slideIndex + 1));
  //     this.sliderScreen.removeEventListener('touchmove', this.touchHandlers.onTouchmove);
  //   }
  // }

  // swipeSlider() {
  //   this.sliderScreen.addEventListener('touchstart', (event) => {
  //     event.preventDefault();
  //     if (event.target.closest('.slider__control')) {
  //       const currentControl = event.target.closest('.slider__control');
  //       const currentIndex = this.slides.indexOf(this.currentSlide);
  //       this.switchingSlidesUsingControls(currentControl, currentIndex);
  //     } else {
  //       const touchObj = event.changedTouches[0];
  //       this.swipeStart = touchObj.clientX;
  //       this.sliderScreen.addEventListener('touchmove', this.touchHandlers.onTouchmove);
  //     }
  //   });
  // }

  // onClickControl(event) {
  //   const currentControl = event.currentTarget;
  //   const currentIndex = this.slides.indexOf(this.currentSlide);
  //   this.switchingSlidesUsingControls(currentControl, currentIndex);
  // }

  onClickPaginationToggle(event) {
    const currentToggle = event.target;
    const currentIndex = this.paginationToggles.indexOf(currentToggle);
    this.paginationToggles.forEach(toggle => {
      if (toggle.classList.contains('slider__paginationToggle--active'))
        toggle.classList.remove('slider__paginationToggle--active');
    });
    currentToggle.classList.add('slider__paginationToggle--active');
    this.changeCurrentSlide(currentIndex + 1);
  }

  init() {
    this.paginationToggles.forEach(toggle => {
      toggle.addEventListener('click', this.paginationHandlers.onClick);
    });
  }
}
