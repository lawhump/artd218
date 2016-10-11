'use strict';

const $ = (query) => {
  var res = document.querySelectorAll(query);

  if (res.length === 1) {
    return res[0];
  }

  return res;
};

const $things = $('.thing');
let filtered;

const landing = $('.landing-wrapper');
const modal = $('.modal-wrapper');
const main = $('main.stay');
let vHeight = $('.bg1').clientHeight;

const $reset = $('.filtered-things .reset');

let lastPos = 0;
let ticking = false;

const $ww = $('.waypoints-wrapper');
const $addedWPs = $('.waypoints .added');
const waypoints = [];

const $container = $('.filtered-things ul');

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
  let addToWaypoints = (thing) => {
    let addedContainsThing = waypoints.indexOf(thing) >= 0;

    if (!addedContainsThing) {
      let wp = document.createElement('LI');
      wp.innerText = thing;

      let iconSpan = document.createElement('SPAN');
      let icon = document.createElement('IMG');
      icon.src = 'dist/images/icons/check.png';

      iconSpan.appendChild(icon);
      wp.appendChild(iconSpan);
      $addedWPs.appendChild(wp);

      waypoints.push(thing);

      $ww.classList.add('pulse');
      window.setTimeout(() => {
        $ww.classList.remove('pulse');
      }, 300);
    }
  };

  if(e.target && e.target.nodeName === 'IMG') {
    let article = e.target.parentNode.parentNode;
    article = article.querySelector('article');
    article.classList.toggle('hidden');
    article.classList.toggle('fadeIn');
  }

  else if (e.target && e.target.nodeName === 'H3') {
    let figcaption = e.target.parentNode;
    if (e.offsetX > figcaption.offsetWidth) {
      addToWaypoints(e.target.innerText);
    }
  }

  else {
    console.log('bink');
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
  let actDropdown = $('div.activities');
  if (!(actDropdown.classList.contains('hidden'))) {
    actDropdown.classList.add('hidden');
  }
  $('div.districts').classList.toggle('hidden');
});

$('nav .activities.dropdown').addEventListener('click', () => {
  let disDropdown = $('div.districts');
  if (!(disDropdown.classList.contains('hidden'))) {
    disDropdown.classList.add('hidden');
  }
  $('div.activities').classList.toggle('hidden');
});

$('nav .radio-input').addEventListener('click', () => {
  $('nav .radio-input span').classList.toggle('active');
});

$ww.addEventListener('click', () => {
  // $('.waypoints-wrapper .icon').classList.toggle('hidden');
  // $ww.classList.toggle('active');
  // $ww.querySelector('.waypoints').classList.toggle('hidden');
  $('div.waypoints').classList.toggle('hidden');
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

  filtered = undefined;
});

$('.waypoints .added').addEventListener('click', (e) => {
  let removeFromAdded = (it) => {
    it.parentNode.removeChild(it);
  };

  let addToVisited = (it) => {
    $('.waypoints .visited').appendChild(it);
  };

  let changeImage = (img) => {
    img.src = 'dist/images/icons/undo.png';
  };

  let moveFromAddedToVisited = (item) => {
    removeFromAdded(item);
    addToVisited(item);
    changeImage(item.querySelector('img'));
  };

  if (e.target) {
    if (e.target.nodeName === 'SPAN') {
      moveFromAddedToVisited(e.target.parentNode);
    }
    else {
      moveFromAddedToVisited(e.target.parentNode.parentNode);
    }
  }
});

$('.waypoints .recommended').addEventListener('click', (e) => {
  let removeFromRecommended = (it) => {
    it.parentNode.removeChild(it);
  };

  let addToAdded = (it) => {
    $('.waypoints .added').appendChild(it);
    waypoints.push(it.innerText);
  };

  let changeImage = (img) => {
    img.src = 'dist/images/icons/check.png';
  };

  let moveFromRecommendedToAdded = (item) => {
    removeFromRecommended(item);
    addToAdded(item);
    changeImage(item.querySelector('img'));
  };

  if (e.target) {
    if (e.target.nodeName === 'SPAN') {
      moveFromRecommendedToAdded(e.target.parentNode);
    }
    else {
      moveFromRecommendedToAdded(e.target.parentNode.parentNode);
    }
  }
});

$('.waypoints .visited').addEventListener('click', (e) => {
  let removeFromVisited = (it) => {
    it.parentNode.removeChild(it);
  };

  let addToAdded = (it) => {
    $('.waypoints .added').appendChild(it);
    waypoints.push(it.innerText);
  };

  let changeImage = (img) => {
    img.src = 'dist/images/icons/check.png';
  };

  let moveFromVisitedToAdded = (item) => {
    removeFromVisited(item);
    addToAdded(item);
    changeImage(item.querySelector('img'));
  };

  if (e.target) {
    if (e.target.nodeName === 'SPAN') {
      moveFromVisitedToAdded(e.target.parentNode);
    }
    else {
      moveFromVisitedToAdded(e.target.parentNode.parentNode);
    }
  }
});
