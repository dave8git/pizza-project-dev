/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  class Product {
    constructor(id, data){
      const thisProduct = this;
      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.renderInMenu(); 
      thisProduct.initAccordion();
      //console.log('new Product:', thisProduct);
    }
    renderInMenu() {
      const thisProduct = this;
      const generatedHTML = templates.menuProduct(thisProduct.data);
      thisProduct.element = utils.createDOMFromHTML(generatedHTML); // stworzony element DOM zapisujemy od razu jako właściwość naszej instancji, dzięki temu będziemy mieli do niego dostęp również w innych metodach instancji
      //console.log('generatedHTML', generatedHTML);
      const menuContainer = document.querySelector(select.containerOf.menu); // używamy querySelector do znalezienia kontenera produktów, którego selector zapisany jest w 'select.containerOf.menu, znaleziony element zapisujemy w stałej menuContainer
      menuContainer.appendChild(thisProduct.element);
      //console.log(thisProduct.element);
    }
    initAccordion() { // WAŻNE Ta pętli uruchamia się 4 razy, raz dla każdego produktu! 
      const thisProduct = this;
      const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable); //wyszukujemy element do klikania tylko w tym jednym produkcie (pamiętaj, że constructor wywoła tę funkcję dla każdej instancji produktu)
      clickableTrigger.addEventListener('click', function(event)  { // z racji tego, że funkcja odpali sie dla każdego produktu, doda listener na click dla każdego produktu
        event.preventDefault(); 
        thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
        const allProducts = document.querySelectorAll(select.all.menuProducts); //szukamy w całym dokumencie, czyli we wszystkich produktach
        allProducts.forEach(product => {  //iterujemy po każdym produkcie znalezionym w document, patrz wyżej ^ dla każdego produktu sprawdzamy czy ma klasę 'active'
          if(product != thisProduct.element){ // pętla przechodzi przez wszystkie produkty, i jeżeli to nie jest ten produkt który kliknąłem to zdejmuje z niego klasę 'active'
            product.classList.remove(classNames.menuProduct.wrapperActive); // jak zakomentujemy ifa, to po kliknięciu opcje sie nie otworzą, bo nadaje ale potem w pętli forEach momentalnie odbiera klasę 'active'
          } 
        });
      })
    };
  }
  const app = {
    initMenu: function(){
      const thisApp = this; 

      console.log('thisApp.data:', thisApp.data);
      for(let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]);
      }
    },
    initData: function(){
      const thisApp = this;

      thisApp.data = dataSource;
    },
    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData(); 
      thisApp.initMenu(); 
    },
  };
  
  app.init();
}
