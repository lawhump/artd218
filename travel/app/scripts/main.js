let $ = (query) => {
  var res = document.querySelectorAll(query);

  if (res.length === 1) {
    return res[0];
  }

  return res;
};

let $things = $('.thing');
let filtered;

$('.filtered-things').addEventListener('click', (e) => {
  let article = e.target.parentNode.parentNode;
  article = article.querySelector('article');
  article.classList.toggle('hidden');
  article.classList.toggle('fadeIn');
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

    let container = $('.filtered-things ul');


    let removeChildren = (c) => {
      while (c.firstChild) {
        c.removeChild(c.firstChild);
      }
    };

    removeChildren(container);
    _.map(filtered, (elem) => { container.appendChild(elem); });
  };

  let updateString = () => {
    let string = $('span.district');

    string.classList.add('active');
    string.innerText = district;
  };

  if(e.target && e.target.nodeName == 'IMG') {
    updateThings();
    updateString();
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

    let container = $('.filtered-things ul');


    let removeChildren = (c) => {
      while (c.firstChild) {
        c.removeChild(c.firstChild);
      }
    };

    removeChildren(container);
    _.map(filtered, (elem) => { container.appendChild(elem); });
  };

  let updateString = () => {
    let string = $('span.activity');

    string.classList.add('active');
    string.innerText = activity;
  };

  if(e.target && e.target.nodeName == 'IMG') {
    updateThings();
    updateString();
  }
});

$('nav .districts.dropdown').addEventListener('click', (e) => {
  $('div.districts').classList.toggle('hidden');
});

$('nav .activities.dropdown').addEventListener('click', (e) => {
  $('div.activities').classList.toggle('hidden');
});
