'use strict';

var $ = function $(query) {
  var res = document.querySelectorAll(query);

  if (res.length === 1) {
    return res[0];
  }

  return res;
};

var get = function get(url, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
      callback(xmlHttp.responseText);
    }
  };
  xmlHttp.open('GET', url, true); // true for asynchronous
  xmlHttp.send(null);
};

var $things = $('.thing');
var $events = void 0;
var filtered = void 0;

// const landing = $('.landing-wrapper');
// const modal = $('.modal-wrapper');
// const main = $('main.stay');
// let vHeight = $('.bg1').clientHeight;

// let lastPos = 0;
// let ticking = false;

var $reset = $('.filtered-things .reset');
var $ww = $('.waypoints-wrapper');
var $addedWPs = $('.waypoints .added');
var $container = $('.filtered-things ul');
var waypoints = [];

var radioToggled = false;

var removeChildren = function removeChildren(c) {
  while (c.firstChild) {
    c.removeChild(c.firstChild);
  }
};

var reset = function reset() {
  var resetString = function resetString() {
    $('span.time-sensitive').classList.add('hidden');
    $('span.activity').innerText = 'Things to do';
    if ($('span.activity').classList.contains('lc')) {
      $('span.activity.lc').classList.remove('lc');
    }
    $('span.district').innerText = 'Austin';

    var actAc = document.querySelectorAll('.active.activity');
    var actDis = document.querySelectorAll('.active.district');

    if (actAc.length > 0) {
      actAc[0].classList.remove('active');
    }

    if (actDis.length > 0) {
      actDis[0].classList.remove('active');
    }
  };

  var resetThings = function resetThings() {
    removeChildren($container);
    _.map($things, function (elem) {
      $container.appendChild(elem);
    });
  };

  resetString();
  resetThings();

  filtered = undefined;
};

var source = $('#thing-template').innerHTML;
var template = Handlebars.compile(source);

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

$('.filtered-things ul').addEventListener('click', function (e) {
  var addToWaypoints = function addToWaypoints(thing) {
    var addedContainsThing = waypoints.indexOf(thing) >= 0;

    if (!addedContainsThing) {
      var wp = document.createElement('LI');
      wp.innerText = thing;

      var iconSpan = document.createElement('SPAN');
      var icon = document.createElement('IMG');
      icon.src = 'dist/images/icons/check.png';

      iconSpan.appendChild(icon);
      wp.appendChild(iconSpan);
      $addedWPs.appendChild(wp);

      waypoints.push(thing);

      $ww.classList.add('pulse');
      window.setTimeout(function () {
        $ww.classList.remove('pulse');
      }, 300);
    }
  };

  if (e.target && e.target.nodeName === 'IMG') {
    var article = e.target.parentNode.parentNode;
    article = article.querySelector('article');
    article.classList.toggle('hidden');
    article.classList.toggle('fadeIn');
  } else if (e.target && e.target.nodeName === 'H3') {
    var figcaption = e.target.parentNode;
    if (e.offsetX > figcaption.offsetWidth) {
      addToWaypoints(e.target.innerText);
    }
  } else {
    setTimeout(Function.prototype, 1000);
  }
});

$('div.districts').addEventListener('click', function (e) {
  var district = e.target.dataset.district;
  var updateThings = function updateThings() {
    var filter = function filter(elem) {
      var loc = elem.querySelector('h5');
      if (loc.innerText.toLowerCase().indexOf(district) >= 0) {
        return elem;
      }
      return null;
    };

    if (filtered === undefined) {
      filtered = _.filter($things, filter);
    } else {
      filtered = _.filter(filtered, filter);
    }

    removeChildren($container);
    _.map(filtered, function (elem) {
      $container.appendChild(elem);
    });
  };

  var updateString = function updateString() {
    var string = $('span.district');

    string.classList.add('active');
    string.innerText = district;

    if ($reset.classList.contains('hidden')) {
      $reset.classList.remove('hidden');
    }
  };

  if (e.target && e.target.nodeName === 'IMG') {
    updateThings();
    updateString();
    $('div.districts').classList.toggle('hidden');
    $('.dropdown.districts').classList.remove('active');
  }
});

$('div.activities').addEventListener('click', function (e) {
  var activity = e.target.dataset.activity;
  var updateThings = function updateThings() {
    var filter = function filter(elem) {
      var acs = elem.dataset.activity;
      if (acs.toLowerCase().indexOf(activity) >= 0) {
        return elem;
      }
      return null;
    };

    if (filtered === undefined) {
      filtered = _.filter($things, filter);
    } else {
      filtered = _.filter(filtered, filter);
    }

    removeChildren($container);
    _.map(filtered, function (elem) {
      $container.appendChild(elem);
    });
  };

  var updateString = function updateString() {
    var string = $('span.activity');

    string.classList.add('active');
    string.innerText = activity;

    if ($reset.classList.contains('hidden')) {
      $reset.classList.remove('hidden');
    }
  };

  if (e.target && e.target.nodeName === 'IMG') {
    updateThings();
    updateString();
    $('div.activities').classList.toggle('hidden');
    $('.dropdown.activities').classList.remove('active');
  }
});

$('nav .districts.dropdown').addEventListener('click', function () {
  var actDropdown = $('div.activities');
  if (!actDropdown.classList.contains('hidden')) {
    actDropdown.classList.add('hidden');
    $('.dropdown.activities').classList.remove('active');
  }
  $('div.districts').classList.toggle('hidden');
  $('.dropdown.districts').classList.toggle('active');
});

$('nav .activities.dropdown').addEventListener('click', function () {
  var disDropdown = $('div.districts');
  if (!disDropdown.classList.contains('hidden')) {
    disDropdown.classList.add('hidden');
    $('.dropdown.districts').classList.remove('active');
  }
  $('div.activities').classList.toggle('hidden');
  $('.dropdown.activities').classList.toggle('active');
});

$('nav .radio-input').addEventListener('click', function () {
  var updateThings = function updateThings() {
    var filter = function filter(elem) {
      return elem.classList.contains('time-sensitive');
    };

    if (filtered === undefined) {
      filtered = _.filter($things, filter);
    } else {
      filtered = _.filter(filtered, filter);
    }

    removeChildren($container);
    _.map(filtered, function (elem) {
      $container.appendChild(elem);
    });
  };

  var updateString = function updateString() {
    $('span.time-sensitive').classList.remove('hidden');
    $('span.activity').classList.add('lc');

    if ($reset.classList.contains('hidden')) {
      $reset.classList.remove('hidden');
    }
  };
  var showOnlyTimeSensitive = function showOnlyTimeSensitive() {
    updateThings();
    updateString();
  };

  var resetEvents = function resetEvents() {
    var c = $('.events ul');
    removeChildren(c);
    _.map($events, function (elem) {
      c.appendChild(elem);
    });
  };

  radioToggled = !radioToggled;
  $('nav .range').classList.toggle('hidden');

  if (radioToggled) {
    showOnlyTimeSensitive();
  } else {
    reset();
    resetEvents();
  }
  $('nav .radio-input span').classList.toggle('active');
});

$ww.addEventListener('click', function () {
  $('div.waypoints').classList.toggle('hidden');
});

$reset.addEventListener('click', reset);

$('.waypoints .added').addEventListener('click', function (e) {
  var removeFromAdded = function removeFromAdded(it) {
    it.parentNode.removeChild(it);
  };

  var addToVisited = function addToVisited(it) {
    $('.waypoints .visited').appendChild(it);
  };

  var changeImage = function changeImage(img) {
    img.src = 'dist/images/icons/undo.png';
  };

  var moveFromAddedToVisited = function moveFromAddedToVisited(item) {
    removeFromAdded(item);
    addToVisited(item);
    changeImage(item.querySelector('img'));
  };

  if (e.target) {
    if (e.target.nodeName === 'SPAN') {
      moveFromAddedToVisited(e.target.parentNode);
    } else {
      moveFromAddedToVisited(e.target.parentNode.parentNode);
    }
  }
});

$('.waypoints .recommended').addEventListener('click', function (e) {
  var removeFromRecommended = function removeFromRecommended(it) {
    it.parentNode.removeChild(it);
  };

  var addToAdded = function addToAdded(it) {
    $('.waypoints .added').appendChild(it);
    waypoints.push(it.innerText);
  };

  var changeImage = function changeImage(img) {
    img.src = 'dist/images/icons/check.png';
  };

  var moveFromRecommendedToAdded = function moveFromRecommendedToAdded(item) {
    removeFromRecommended(item);
    addToAdded(item);
    changeImage(item.querySelector('img'));
  };

  if (e.target) {
    if (e.target.nodeName === 'SPAN') {
      moveFromRecommendedToAdded(e.target.parentNode);
    } else {
      moveFromRecommendedToAdded(e.target.parentNode.parentNode);
    }
  }
});

$('.waypoints .visited').addEventListener('click', function (e) {
  var removeFromVisited = function removeFromVisited(it) {
    it.parentNode.removeChild(it);
  };

  var addToAdded = function addToAdded(it) {
    $('.waypoints .added').appendChild(it);
    waypoints.push(it.innerText);
  };

  var changeImage = function changeImage(img) {
    img.src = 'dist/images/icons/check.png';
  };

  var moveFromVisitedToAdded = function moveFromVisitedToAdded(item) {
    removeFromVisited(item);
    addToAdded(item);
    changeImage(item.querySelector('img'));
  };

  if (e.target) {
    if (e.target.nodeName === 'SPAN') {
      moveFromVisitedToAdded(e.target.parentNode);
    } else {
      moveFromVisitedToAdded(e.target.parentNode.parentNode);
    }
  }
});

// document.addEventListener('DOMContentLoaded', () => (event) {
//
// });


(function () {
  var updateEvents = function updateEvents(date) {
    var filter = function filter(elem) {
      // I only care about the first date in the range
      var eDate = elem.querySelector('h6').innerText.split('-')[0];
      console.log('eDate = ' + eDate + ' and date = ' + date);
      var eMon = parseInt(eDate.split('/')[0]);
      var eDay = parseInt(eDate.split('/')[1]);
      var eYear = parseInt('20' + eDate.split('/')[2]);

      var mon = parseInt(date.split('/')[0]);
      var day = parseInt(date.split('/')[1]);
      var year = parseInt(date.split('/')[2]);

      // console.log('year <= eYear: ' + year <= eYear + ', mon <= eMon: ' + mon <= eMon + ', day <= eDay: ' + day <= eDay);

      return year <= eYear && mon <= eMon && day <= eDay;
    };

    var $evs = $('.event');

    var $filtered = _.filter($evs, filter);

    var $c = $('.events ul');
    removeChildren($c);

    _.map($filtered, function (elem) {
      $c.appendChild(elem);
    });
  };

  var addEventToDoc = function addEventToDoc(elem) {
    var name = elem.querySelector('strong').innerText;
    var time = elem.innerText.substring(0, elem.innerHTML.indexOf('<br>'));
    var place = elem.querySelector('em').innerText;
    var link = elem.querySelector('a').getAttribute('href').toString();
    var blurb = elem.querySelector('span').innerHTML;

    var context = {
      name: name,
      time: time,
      link: link,
      place: place,
      blurb: blurb
    };

    var html = template(context);
    $('.events ul').innerHTML += html;
  };

  var eventsURL = 'events/oct-nov.html';
  get(eventsURL, function (res) {
    var container = document.createElement('div');
    container.innerHTML = res;
    var events = container.querySelectorAll('.main_container p');
    _.map(events, addEventToDoc);
    $events = $('.event');
  });

  $('nav .range').flatpickr({
    'clickOpens': true,
    'wrap': true,
    'onChange': function onChange(dateObj, dateStr, instance) {
      var date = dateStr.split('-');
      var dateF = [date[1], date[2], date[0]].join('/');

      instance.input.value = dateF;

      updateEvents(dateF);
    }
  });
})();
//# sourceMappingURL=main.js.map
