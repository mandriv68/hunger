'use strict';

export default class Burger {
  constructor(burgerWidth, burgerHeight, burgerColor, burgerLineThickness, navSelector) {
    this.burger = document.querySelector('.burger');
    this.burgerLine = this.burger.querySelector('.burger__line');
    this.burger.style.width = `${burgerWidth}px`;
    this.burger.style.height = `${burgerHeight}px`;
    this.burger.style.color = `${burgerColor}`;
    this.burgerLine.style.height = `${burgerLineThickness}px`;
    this.navigation = document.querySelector(`.${navSelector}`);
  }

  init() {
    this.burger.addEventListener('click', () => {
      this.burger.classList.toggle('burger--active');
      this.navigation.classList.toggle(`${navSelector}--active`);
    });
    window.addEventListener('click', (event) => {
      if (
        event.target.classList[0] === 'burger'
        || event.target.classList[0] === 'mainNavigation'
      ) return false;
      if (this.burger.classList.contains('burger--active')) this.burger.classList.toggle('burger--active');
      if (this.navigation.classList.contains('mainNavigation__list--active')) this.navigation.classList.toggle('mainNavigation__list--active');
    });
  }
}
