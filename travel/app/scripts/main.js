'use strict';

const $ = (query) => {
  var res = document.querySelectorAll(query);

  if (res.length === 1) {
    return res[0];
  }

  return res;
};

const get = (url, callback) => {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = () => {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
      callback(xmlHttp.responseText);
    }
  };
  xmlHttp.open('GET', url, true); // true for asynchronous
  xmlHttp.send(null);
};

let $things = $('.thing');
let $events;
let filtered;

// const landing = $('.landing-wrapper');
// const modal = $('.modal-wrapper');
// const main = $('main.stay');
// let vHeight = $('.bg1').clientHeight;

// let lastPos = 0;
// let ticking = false;

const $reset = $('.filtered-things .reset');
const $ww = $('.waypoints-wrapper');
const $addedWPs = $('.waypoints .added');
const $container = $('.filtered-things ul');
const waypoints = [];

let radioToggled = false;

const removeChildren = (c) => {
  while (c.firstChild) {
    c.removeChild(c.firstChild);
  }
};

const reset = () => {
  let resetString = () => {
    $('span.time-sensitive').classList.add('hidden');
    $('span.activity').innerText = 'Things to do';
    if ($('span.activity').classList.contains('lc')) {
      $('span.activity.lc').classList.remove('lc');
    }
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
    removeChildren($container);
    _.map($things, (elem) => { $container.appendChild(elem); });
  };


  resetString();
  resetThings();

  filtered = undefined;
};

const source = $('#thing-template').innerHTML;
const template = Handlebars.compile(source);

// window.addEventListener('scroll', () => {
//   let checkView = (pos) => {
//     let goingDown = () => {
//       return (lastPos < pos);
//     };
//
//     if (goingDown) {
//       if (pos > .45 * vHeight) {
//         modal.classList.add('right');
//       }
//
//       if (pos > (vHeight + 100)) {
//         landing.classList.add('inactive');
//         modal.classList.add('inactive');
//         main.classList.remove('stay');
//       }
//     }
//
//     else {
//       if (pos < vHeight) {
//         modal.classList.remove('right');
//       }
//
//       if (pos < (vHeight + 99)) {
//         landing.classList.remove('inactive');
//       }
//     }
//   };
//
//   lastPos = window.scrollY;
//   if (!ticking) {
//     window.requestAnimationFrame(() => {
//       checkView(lastPos);
//       ticking = false;
//     });
//   }
//   ticking = true;
// });

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
    setTimeout(Function.prototype, 1000);
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

    removeChildren($container);
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
    $('.dropdown.districts').classList.remove('active');
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

    removeChildren($container);
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
    $('.dropdown.activities').classList.remove('active');
  }
});

$('nav .districts.dropdown').addEventListener('click', () => {
  let actDropdown = $('div.activities');
  if (!(actDropdown.classList.contains('hidden'))) {
    actDropdown.classList.add('hidden');
    $('.dropdown.activities').classList.remove('active');
  }
  $('div.districts').classList.toggle('hidden');
  $('.dropdown.districts').classList.toggle('active');
});

$('nav .activities.dropdown').addEventListener('click', () => {
  let disDropdown = $('div.districts');
  if (!(disDropdown.classList.contains('hidden'))) {
    disDropdown.classList.add('hidden');
    $('.dropdown.districts').classList.remove('active');
  }
  $('div.activities').classList.toggle('hidden');
  $('.dropdown.activities').classList.toggle('active');
});

$('nav .radio-input').addEventListener('click', () => {
  let updateThings = () => {
    let filter = (elem) => {
      return elem.classList.contains('time-sensitive');
    };

    if (filtered === undefined) {
      filtered = _.filter($things, filter);
    }
    else {
      filtered = _.filter(filtered, filter);
    }

    removeChildren($container);
    _.map(filtered, (elem) => { $container.appendChild(elem); });
  };

  let updateString = () => {
    $('span.time-sensitive').classList.remove('hidden');
    $('span.activity').classList.add('lc');

    if ($reset.classList.contains('hidden')) {
      $reset.classList.remove('hidden');
    }
  };
  let showOnlyTimeSensitive = () => {
    updateThings();
    updateString();
  };

  let resetEvents = () => {
    let c = $('.events ul');
    removeChildren(c);
    _.map($events, (elem) => { c.appendChild(elem); });
  };

  radioToggled = !radioToggled;
  $('nav .range').classList.toggle('hidden');

  if (radioToggled) {
    showOnlyTimeSensitive();
  }

  else {
    reset();
    resetEvents();
  }
  $('nav .radio-input span').classList.toggle('active');
});

$ww.addEventListener('click', () => {
  $('div.waypoints').classList.toggle('hidden');
});

$reset.addEventListener('click', reset);

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

// document.addEventListener('DOMContentLoaded', () => (event) {
//
// });


(() => {
  let updateEvents = (date) => {
    let filter = (elem) => {
      // I only care about the first date in the range
      let eDate = elem.querySelector('h6').innerText.split('-')[0];
      console.log('eDate = ' + eDate + ' and date = ' + date);
      let eMon = parseInt(eDate.split('/')[0]);
      let eDay = parseInt(eDate.split('/')[1]);
      let eYear = parseInt('20' + eDate.split('/')[2]);

      let mon = parseInt(date.split('/')[0]);
      let day = parseInt(date.split('/')[1]);
      let year = parseInt(date.split('/')[2]);

      // console.log('year <= eYear: ' + year <= eYear + ', mon <= eMon: ' + mon <= eMon + ', day <= eDay: ' + day <= eDay);

      return (year <= eYear && mon <= eMon && day <= eDay);
    };

    let $evs = $('.event');

    let $filtered = _.filter($evs, filter);

    let $c = $('.events ul');
    removeChildren($c);

    _.map($filtered, (elem) => { $c.appendChild(elem); });
  };

  let addEventToDoc = (elem) => {
    let name = elem.querySelector('strong').innerText;
    let time = elem.innerText.substring(0, elem.innerHTML.indexOf('<br>'));
    let place = elem.querySelector('em').innerText;
    let link = elem.querySelector('a').getAttribute('href').toString();
    let blurb = elem.querySelector('span').innerHTML;

    let context = {
      name: name,
      time: time,
      link: link,
      place: place,
      blurb: blurb
    };

    let html = template(context);
    $('.events ul').innerHTML += html;
  };

  let eventsURL = '../events/oct-nov.html';
  get(eventsURL, (res) => {
    var container = document.createElement('div');
    container.innerHTML = res;
    let events = container.querySelectorAll('.main_container p');
    _.map(events, addEventToDoc);
    $events = $('.event');
  });

  $('nav .range').flatpickr({
    'clickOpens': true,
    'wrap': true,
    'onChange': (dateObj, dateStr, instance) => {
      let date = dateStr.split('-');
      let dateF = [ date[1], date[2], date[0] ].join('/');

      instance.input.value = dateF;

      updateEvents(dateF);
    }
  });
})();
