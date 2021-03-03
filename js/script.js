document.addEventListener("DOMContentLoaded", () => {
  // ТАБЫ
  const tabContents = document.querySelectorAll('.tabcontent'),
        tabheaderItems = document.querySelectorAll('.tabheader__item'),
        tabheaderItemsBlock = document.querySelector('.tabheader__items');

  // Скрывать табы и items
  const hideTabContent = () => {
    tabContents.forEach( item => item.style.display = 'none' );
    tabheaderItems.forEach( item => item.classList.remove('tabheader__item_active') );
  };
  // Показывать табы и items
  const showTabContent = (i) => {
    tabContents[i].style.display = '';
    tabheaderItems[i].classList.add('tabheader__item_active');
  };

  hideTabContent();
  showTabContent(0);
        
  
  tabheaderItemsBlock.addEventListener('click', event => {

      const target = event.target;
      
      if (target && target.classList.contains('tabheader__item')) {
        tabheaderItems.forEach((item, i) => {
          if (item == target) {
            hideTabContent();
            showTabContent(i);
          } 
        });
      }
    });
  
  // ТАЙМЕР
  
  const deadline = '2021-05-20';

  const getTimeRemaining = endtime => {

    let total = Date.parse(endtime) - Date.parse(new Date());
    let d = Math.floor( (total / (1000 * 60 * 60 * 24)) );
    let h = Math.floor( (total / (1000 * 60 * 60) % 24) ); // общее количество часов делем сколько в одном дне часов
    let m = Math.floor( (total / (1000 * 60) % 60) );
    let s = Math.floor( (total / 1000) % 60);
    
    return {
      'total': total,
      'd': d,
      'h': h,
      'm': m,
      's': s
    };
  };

  const getZero = num => {

    num = (num >= 0 && num < 10) ? `0${num}` : num;
    return num;
  };

  const setClock = (selector, endtime) => {
    
    const timer = document.querySelector(selector),
          days = timer.querySelector('#days'),
          hours = timer. querySelector('#hours'),
          minutes = timer.querySelector('#minutes'),
          seconds = timer.querySelector('#seconds'),
          timeInterval = setInterval(updateClock, 1000);
    
    updateClock();

    function updateClock() {
      const t = getTimeRemaining(endtime);

      days.textContent = getZero(t.d);
      hours.textContent = getZero(t.h);
      minutes.textContent = getZero(t.m);
      seconds.textContent = getZero(t.s);
      
      if (t.total <= 0) {
        clearInterval(timeInterval);
        days.textContent = getZero(0);
        hours.textContent = getZero(0);
        minutes.textContent = getZero(0);
        seconds.textContent = getZero(0);
      }
    }
    
  };

  setClock('.timer', deadline);

  // МОДАЛ

  const modalBtns = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

  
  const closeModal = () => {
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
    clearTimeout(modalTimeId);
  };

  const openModal = () => {
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
  };

  const showModalByScroll = () => {
    if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
      openModal();
      window.removeEventListener('scroll', showModalByScroll);
    }
  };

  const modalTimeId = setTimeout(openModal, 50000);

  modalBtns.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target.getAttribute('data-close') == '') {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });

  window.addEventListener('scroll', showModalByScroll);

  // Использование класса - render MenuCard

  class MenuCard {
    constructor (src, alt, title, descr, price, parentSelector, ...classes) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.classes = classes;
      this.parent = document.querySelector(parentSelector);
      this.transfer = 27;
      this.changeToUAH();
    }

    changeToUAH () {
      this.price *= this.transfer; 
    }

    render() {
      const div = document.createElement('div');

      if (this.classes.length === 0) {
        this.class = 'menu__item';
        div.classList.add(this.class);
      } else {
        this.classes.forEach( className => div.classList.add(className) );
      }

      div.innerHTML = `
        <img src=${this.src} alt=${this.alt}>
        <h3 class="menu__item-subtitle">${this.title}</h3>
        <div class="menu__item-descr">${this.descr}</div>
        <div class="menu__item-divider"></div>
        <div class="menu__item-price">
            <div class="menu__item-cost">Цена:</div>
            <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
        </div>
      `;

      this.parent.append(div);
    }
  }

  const getMenu = async (url) => {
    let res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Ошибка по адресу: ${url}, статус ${res.status}!`);a
    }

    return await res.json();
  };

  getMenu('http://localhost:3000/menu')
    .then(data => {
      data.forEach( ({img, altimg, title, descr, price}) => {
        new MenuCard(
          img,
          altimg,
          title,
          descr,
          price,
          '.menu .container'
        ).render();
      });
    });

  // axios.get('http://localhost:3000/menu')
  //   .then(response => console.log(response.data));

  // 2 спопсоб рендерить карты
  // getMenu('http://localhost:3000/menu')
  //   .then(data => createCard(data));
  // function createCard(data) {
  //   data.forEach(({img, altimg, title, descr, price}) => {
  //     const element = document.createElement('div');
  //     element.classList.add('menu__item');
  //     element.innerHTML = `
  //       <img src=${img} alt=${altimg}>
  //       <h3 class="menu__item-subtitle">${title}</h3>
  //       <div class="menu__item-descr">${descr}</div>
  //       <div class="menu__item-divider"></div>
  //       <div class="menu__item-price">
  //         <div class="menu__item-cost">Цена:</div>
  //         <div class="menu__item-total"><span>${price}</span> грн/день</div>
  //       </div>`;
  //     document.querySelector('.menu .container').append(element);
  //   });
  // }
  
  // ФОРМЫ

  const forms = document.querySelectorAll('form');

  const message = {
    loading: "icons/spinner.svg",
    success: 'Спасибо! Скоро мы с вами свяжемся!',
    failure: 'Что-то пошло не так...'
  };

  const thanksMessage = (message) => {
    const modalDialog = document.querySelector('.modal__dialog');
    modalDialog.classList.add('hide');

    openModal();

    const div = document.createElement('div');
    div.classList.add('modal__dialog');
    div.innerHTML = `
      <div class="modal__content">
        <div data-close class="modal__close">&times;</div>
        <div class="modal__title">${message}</div>
      </div>
    `;

    document.querySelector('.modal').append(div);
    setTimeout(() => {
      div.remove();
      // modalDialog.classList.add('show');
      modalDialog.classList.remove('hide');
      closeModal();
    }, 2000);
  };

  const postData = async (url, data) => {
    let res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=utf-8'
      },
      body: data,
    });

    return await res.json();
  };

  const bindPostData = (form) => {

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let statusMessage = document.createElement('img');
      statusMessage.style.cssText = `
        display: block;
        margin: 10px auto 0;
      `;
      statusMessage.src = message.loading;
      form.insertAdjacentElement('afterend', statusMessage);

      // Используем без JSON - не пишем headers, и не перебераем formData в объект
      // Используем JSON
      const formData = new FormData(form);
      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      postData('http://localhost:3000/requests', json)
      .then((data) => {
        console.log(data);
        thanksMessage(message.success);
      })
      .catch(() => thanksMessage(message.failure))
      .finally(() => {
        form.reset();
        statusMessage.remove();
      });
    });
  };

  forms.forEach(form => bindPostData(form));

  // Слайдер - 1 вариант
  // const total = document.querySelector('#total'),
  //       current = document.querySelector('#current'),
  //       offerSlide = document.querySelectorAll('.offer__slide'),
  //       offerSliderBtns = document.querySelector('.offer__slider-counter');

  // let index = 0;

  // total.textContent = getZero(offerSlide.length);

  // const hideSlider = () => {
  //   offerSlide.forEach(slide => {
  //     slide.classList.add('hide');
  //     slide.classList.remove('show');
  //   });
  // };

  // const showSlider = (i) => {
  //   offerSlide[i].classList.remove('hide');
  //   offerSlide[i].classList.add('show');
  //   current.textContent = getZero(index + 1);
  // };

  // offerSliderBtns.addEventListener('click', (e) => {
  //   const target = e.target;
    
  //   if (target.closest('.offer__slider-prev')) {
  //     (index <= 0) ? index = offerSlide.length - 1 : index--;
  //     hideSlider();
  //     showSlider(index);
  //   } else if (target.closest('.offer__slider-next')) {
  //     (index >= offerSlide.length - 1) ? index = 0 : index++;
  //     hideSlider();
  //     showSlider(index);
  //   }
  // });

  // hideSlider();
  // showSlider(index)

  // Слайдер - 2 вариант

  const total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        offerSlide = document.querySelectorAll('.offer__slide'),
        offerSlider = document.querySelector('.offer__slider'),
        offerSliderInner = document.querySelector('.offer__slider-inner'),
        offerSliderWrapper = document.querySelector('.offer__slider-wrapper'),
        offerSliderBtns = document.querySelector('.offer__slider-counter'),
        width = window.getComputedStyle(offerSliderWrapper).width;
  
  let index = 1;
  let offset = 0;

  total.textContent = getZero(offerSlide.length);
  current.textContent = getZero(index);

  offerSliderInner.style.cssText = `
    width: ${100 * offerSlide.length}%;
    display: flex;
    transition: all 0.4s ease;
  `;
  offerSliderWrapper.style.overflow = 'hidden';
  offerSlide.forEach(slide => slide.style.width = width);
  offerSlider.style.position = 'relative';

  const indicators = document.createElement('ol');
  const dots = [];
  // indicators.classList.add('carousel-indicators');
  indicators.style.cssText = `
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 15;
      display: flex;
      justify-content: center;
      margin-right: 15%;
      margin-left: 15%;
      list-style: none;
  `; // Если хотите - добавьте в стили, но иногда у нас нет доступа к стилям
  offerSlider.append(indicators);

  for (let i = 0; i < offerSlide.length; i++) {
    const dot = document.createElement('li');

    dot.setAttribute('data-slide-to', i + 1);
    dot.style.cssText = `
      box-sizing: content-box;
      flex: 0 1 auto;
      width: 30px;
      height: 6px;
      margin-right: 3px;
      margin-left: 3px;
      cursor: pointer;
      background-color: #fff;
      background-clip: padding-box;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      opacity: .5;
      transition: opacity .6s ease;
    `;

    if (i == 0) dot.style.opacity = '1';

    indicators.append(dot);
    dots.push(dot);
  }

  const showSlide = (offset, index) => {
    offerSliderInner.style.transform = `translateX(${-offset}px)`;    
    current.textContent = getZero(index);
    dots.forEach(dot => dot.style.opacity = '.5');
    dots[index - 1].style.opacity = '1';
  };

  const deleteNotDigits = (str) => +str.replace(/\D/g, '');

  offerSliderBtns.addEventListener('click', (e) => {
    const target = e.target;

    if (target.closest('.offer__slider-prev')) {

      if (offset == 0) offset = deleteNotDigits(width) * (offerSlide.length - 1);
      else offset -= deleteNotDigits(width);

      if (index == 1) index = offerSlide.length;
      else index--;

      showSlide(offset, index);
    }

    if (target.closest('.offer__slider-next')) {

      if (offset == deleteNotDigits(width) * (offerSlide.length - 1)) offset = 0;
      else offset += deleteNotDigits(width);

      if (index == offerSlide.length) index = 1;
      else index++;

      showSlide(offset, index);
    }

  });

  dots.forEach(dot => {
    dot.addEventListener('click', e => {
      const slideTo = e.target.getAttribute('data-slide-to');
      
      index = slideTo;
      offset = deleteNotDigits(width) * (slideTo - 1);

      showSlide(offset, index);
    });
  });

  // Калькулятор
  const result = document.querySelector('.calculating__result span');

  let sex, height, weight, age, ratio;

  if (localStorage.getItem('sex')) {
    sex = localStorage.getItem('sex');
  } else {
    localStorage.setItem('sex', 'female');
    sex = 'female';
  }

  if (localStorage.getItem('ratio')) {
    ratio = localStorage.getItem('ratio');
  } else {
    localStorage.setItem('ratio', 1.375);
    ratio = 1.375;
  }

  const initLocalSettings = (selector, activeClass) => {
    const elems = document.querySelectorAll(selector);

    elems.forEach(elem => {
      if (elem.getAttribute('data-sex') === localStorage.getItem('sex')) elem.classList.add(activeClass);

      if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) elem.classList.add(activeClass);
    });
  };

  const calcTotal = () => {
    if (!sex || !height || !weight || !age || !ratio) { 
      result.textContent = '____';
      return;
    }

    if (sex == 'female') {
      result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
    } else {
      result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
    }
  };

  const getStaticInformation = (selector, activeClass) => {
    const elems = document.querySelectorAll(selector);

    elems.forEach(elem => {
      elem.addEventListener('click', (e) => {
        if (e.target.getAttribute('data-ratio')) {
          ratio = e.target.getAttribute('data-ratio');
          localStorage.setItem('ratio', ratio)
        }

        if (e.target.getAttribute('data-sex')) {
          sex = e.target.getAttribute('data-sex');
          localStorage.setItem('sex', sex);
        }

        elems.forEach(elem => elem.classList.remove(activeClass));
        e.target.classList.add(activeClass);

        calcTotal();
      });
    });
  };

  const getDynamicInformation = (selector) => {
    const input = document.querySelector(selector);

    input.addEventListener('input', () => {

      if (input.value.match(/\D/g)) {
        input.style.border = '1px solid red';
      } else {
        input.style.border = 'none';
      }

      switch (input.getAttribute('id')) {
        case 'height':
          height = +input.value;
          break;
        case 'weight':
          weight = +input.value;
          break;
        case 'age':
          age = +input.value;
          break;
      }

      calcTotal();
    });
  };

  calcTotal();
  initLocalSettings('#gender div', 'calculating__choose-item_active');
  initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');
  getStaticInformation('#gender div', 'calculating__choose-item_active');
  getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');
  getDynamicInformation('#height');
  getDynamicInformation('#weight');
  getDynamicInformation('#age');
});
