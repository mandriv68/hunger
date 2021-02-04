export default class TabsWidget {
  constructor(widgetSelector, tabSelector, tabContentSelector) {
    this.widget = document.querySelector(widgetSelector);
    this.tabs = this.widget.querySelectorAll(tabSelector);
    this.tabsContent = this.widget.querySelectorAll(tabContentSelector);
    this.tabContentActiveClass = `${tabContentSelector.slice(1)}--active`;
    this.tabsMap = new Map();
    this.tabContentActive = null;
    this.tabActive = null;
  }

  changeActiveTab(currentTab) {
    this.tabActive.dataset.active = '';
    // eslint-disable-next-line no-param-reassign
    currentTab.dataset.active = '1';
    this.tabActive = currentTab;
  }

  changeActiveTabContent(currentTab) {
    this.tabContentActive.classList.remove(this.tabContentActiveClass);
    this.tabContentActive = this.tabsMap.get(currentTab);
    this.tabContentActive.classList.add(this.tabContentActiveClass);
  }

  tabHandler(event) {
    const currentTab = event.target;
    if (currentTab === this.tabActive) return;
    this.changeActiveTab(currentTab);
    this.changeActiveTabContent(currentTab);
  }

  init() {
    this.tabs.forEach((tab, index) => {
      if (tab.dataset.active) {
        this.tabActive = tab;
        this.tabContentActive = this.tabsContent[index];
        this.tabContentActive.classList.add(`${this.tabContentActive.classList[0]}--active`);
      }
      this.tabsMap.set(tab, this.tabsContent[index]);

      tab.addEventListener('click', this.tabHandler.bind(this));

      tab.addEventListener('focus', this.tabHandler.bind(this));
    });
  }
}
