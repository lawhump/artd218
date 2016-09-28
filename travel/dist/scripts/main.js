'use strict';

var $ = function $(query) {
  var res = document.querySelectorAll(query);

  if (res.length === 1) {
    return res[0];
  }

  return res;
};

var $things = $('.thing');
var filtered = void 0;

var landing = $('.landing-wrapper');
var vHeight = $('.bg1').clientHeight;
var modal = $('.modal-wrapper');
var main = $('main.stay');

var $reset = $('.filtered-things .reset');

var lastPos = 0;
var ticking = false;

var $ww = $('.waypoints-wrapper');

var $container = $('.filtered-things ul');

var removeChildren = function removeChildren() {
  while ($container.firstChild) {
    $container.removeChild($container.firstChild);
  }
};

window.addEventListener('scroll', function () {
  var checkView = function checkView(pos) {
    var goingDown = function goingDown() {
      return lastPos < pos;
    };

    if (goingDown) {
      if (pos > .45 * vHeight) {
        modal.classList.add('right');
      }

      if (pos > vHeight + 100) {
        landing.classList.add('inactive');
        modal.classList.add('inactive');
        main.classList.remove('stay');
      }
    } else {
      if (pos < vHeight) {
        modal.classList.remove('right');
      }

      if (pos < vHeight + 99) {
        landing.classList.remove('inactive');
      }
    }
  };

  lastPos = window.scrollY;
  if (!ticking) {
    window.requestAnimationFrame(function () {
      checkView(lastPos);
      ticking = false;
    });
  }
  ticking = true;
});

$('.filtered-things ul').addEventListener('click', function (e) {
  if (e.target && e.target.nodeName === 'IMG') {
    var article = e.target.parentNode.parentNode;
    article = article.querySelector('article');
    article.classList.toggle('hidden');
    article.classList.toggle('fadeIn');
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

    removeChildren();
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

    removeChildren();
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
  }
});

$('nav .districts.dropdown').addEventListener('click', function () {
  $('div.districts').classList.toggle('hidden');
});

$('nav .activities.dropdown').addEventListener('click', function () {
  $('div.activities').classList.toggle('hidden');
});

$ww.addEventListener('click', function (e) {
  $ww.classList.toggle('active');
  $ww.querySelector('.waypoints').classList.toggle('hidden');
});

$reset.addEventListener('click', function (e) {
  var resetString = function resetString() {
    $('span.activity').innerText = 'What to do';
    $('span.district').innerText = 'Austin';

    var actAc = $('.active.activity');
    var actDis = $('.active.district');

    if (actAc != undefined) {
      actAc.classList.remove('active');
    }

    if (actDis != undefined) {
      actDis.classList.remove('active');
    }
  };

  var resetThings = function resetThings() {
    removeChildren();
    _.map($things, function (elem) {
      $container.appendChild(elem);
    });
  };

  resetString();
  resetThings();
});
//# sourceMappingURL=main.js.map
