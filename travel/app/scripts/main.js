'use strict';

let $ = (query) => {
  var res = document.querySelectorAll(query);

  if (res.length === 1) {
    return res[0];
  }

  return res;
};

let $things = $('.thing');
let filtered;

let landing = $('.landing-wrapper');
let vHeight = $('.bg1').clientHeight;
let modal = $('.modal-wrapper');
let main = $('main.stay');

let $reset = $('.filtered-things .reset');

let lastPos = 0;
let ticking = false;

let $ww = $('.waypoints-wrapper');

let $container = $('.filtered-things ul');

let removeChildren = () => {
  while ($container.firstChild) {
    $container.removeChild($container.firstChild);
  }
};

window.addEventListener('scroll', () => {
  let checkView = (pos) => {
    let goingDown = () => {
      return (lastPos < pos);
    };

    if (goingDown) {
      if (pos > .45 * vHeight) {
        modal.classList.add('right');
      }

      if (pos > (vHeight + 100)) {
        landing.classList.add('inactive');
        modal.classList.add('inactive');
        main.classList.remove('stay');
      }
    }

    else {
      if (pos < vHeight) {
        modal.classList.remove('right');
      }

      if (pos < (vHeight + 99)) {
        landing.classList.remove('inactive');
      }
    }
  };

  lastPos = window.scrollY;
  if (!ticking) {
    window.requestAnimationFrame(() => {
      checkView(lastPos);
      ticking = false;
    });
  }
  ticking = true;
});

$('.filtered-things ul').addEventListener('click', (e) => {
  if(e.target && e.target.nodeName === 'IMG') {
    let article = e.target.parentNode.parentNode;
    article = article.querySelector('article');
    article.classList.toggle('hidden');
    article.classList.toggle('fadeIn');
  }
});

$('div.districts').addEventListener('click', (e) => {
  let district = e.target.dataset.district;
  let updateThings = () => {
    let filter = (elem) => {
      let loc = elem.querySelector('h5');
      if (loc.innerText.toLowerCase().indexOf(district) >= 0) {
        return elem;
      }
      return null;
    };

    if (filtered === undefined) {
      filtered = _.filter($things, filter);
    }
    else {
      filtered = _.filter(filtered, filter);
    }

    removeChildren();
    _.map(filtered, (elem) => { $container.appendChild(elem); });
  };

  let updateString = () => {
    let string = $('span.district');

    string.classList.add('active');
    string.innerText = district;

    if ($reset.classList.contains('hidden')) {
      $reset.classList.remove('hidden');
    }
  };

  if(e.target && e.target.nodeName === 'IMG') {
    updateThings();
    updateString();
    $('div.districts').classList.toggle('hidden');
  }
});

$('div.activities').addEventListener('click', (e) => {
  let activity = e.target.dataset.activity;
  let updateThings = () => {
    let filter = (elem) => {
      let acs = elem.dataset.activity;
      if (acs.toLowerCase().indexOf(activity) >= 0) {
        return elem;
      }
      return null;
    };

    if (filtered === undefined) {
      filtered = _.filter($things, filter);
    }
    else {
      filtered = _.filter(filtered, filter);
    }

    removeChildren();
    _.map(filtered, (elem) => { $container.appendChild(elem); });
  };

  let updateString = () => {
    let string = $('span.activity');

    string.classList.add('active');
    string.innerText = activity;

    if ($reset.classList.contains('hidden')) {
      $reset.classList.remove('hidden');
    }
  };

  if(e.target && e.target.nodeName === 'IMG') {
    updateThings();
    updateString();
    $('div.activities').classList.toggle('hidden');
  }
});

$('nav .districts.dropdown').addEventListener('click', () => {
  $('div.districts').classList.toggle('hidden');
});

$('nav .activities.dropdown').addEventListener('click', () => {
  $('div.activities').classList.toggle('hidden');
});

$ww.addEventListener('click', () => {
  $ww.classList.toggle('active');
  $ww.querySelector('.waypoints').classList.toggle('hidden');
});

$reset.addEventListener('click', () => {
  let resetString = () => {
    $('span.activity').innerText = 'What to do';
    $('span.district').innerText = 'Austin';

    let actAc = document.querySelectorAll('.active.activity');
    let actDis = document.querySelectorAll('.active.district');

    if (actAc.length > 0) {
      actAc[0].classList.remove('active');
    }

    if (actDis.length > 0) {
      actDis[0].classList.remove('active');
    }
  };

  let resetThings = () => {
    removeChildren();
    _.map($things, (elem) => { $container.appendChild(elem); });
  };


  resetString();
  resetThings();
});
