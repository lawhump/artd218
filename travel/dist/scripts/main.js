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

$('.filtered-things').addEventListener('click', function (e) {
  var article = e.target.parentNode.parentNode;
  article = article.querySelector('article');
  article.classList.toggle('hidden');
  article.classList.toggle('fadeIn');
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

    var container = $('.filtered-things ul');

    var removeChildren = function removeChildren(c) {
      while (c.firstChild) {
        c.removeChild(c.firstChild);
      }
    };

    removeChildren(container);
    _.map(filtered, function (elem) {
      container.appendChild(elem);
    });
  };

  var updateString = function updateString() {
    var string = $('span.district');

    string.classList.add('active');
    string.innerText = district;
  };

  if (e.target && e.target.nodeName == 'IMG') {
    updateThings();
    updateString();
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

    var container = $('.filtered-things ul');

    var removeChildren = function removeChildren(c) {
      while (c.firstChild) {
        c.removeChild(c.firstChild);
      }
    };

    removeChildren(container);
    _.map(filtered, function (elem) {
      container.appendChild(elem);
    });
  };

  var updateString = function updateString() {
    var string = $('span.activity');

    string.classList.add('active');
    string.innerText = activity;
  };

  if (e.target && e.target.nodeName == 'IMG') {
    updateThings();
    updateString();
  }
});

$('nav .districts.dropdown').addEventListener('click', function (e) {
  $('div.districts').classList.toggle('hidden');
});

$('nav .activities.dropdown').addEventListener('click', function (e) {
  $('div.activities').classList.toggle('hidden');
});
//# sourceMappingURL=main.js.map
