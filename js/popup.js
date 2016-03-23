function createFundDiv() {
  var content = $('<div class="fund">' +
    '<div class="title"></div>' +
    '<hr>' +
    '<div class="info">' +
    '<span class="value" />' +
    '<span class="diff" />' +
    '<span class="update" />' +
    '</div>' +
    '</div>');

  return $(content);
}

function updateFundDiv(fundDiv, title, raw) {
  var title = $('div', $(title)).text();

  raw = $(raw);

  $('.title', fundDiv).html(title);
  var value = $('.Fl-start.Fw-b.Fz-30.Pend-10.C-n', raw).text();
  $('.value', fundDiv).text(value);

  var diff = $('.Fl-start.number.Pt-8', raw);

  var update = $('.Ta-end.Mt-16.remark', raw).text();
  update = update.replace('更新', '');
  $('.update', fundDiv).text(update);

  var symbol = ''
  if ($(diff).hasClass('rise')) {
    $('.info', fundDiv).addClass('red');
    symbol = '▲';
  } else {
    $('.info', fundDiv).addClass('green');
    symbol = '▼';
  }

  $('.diff', fundDiv).text(symbol + diff.text());
}

function openTab(link) {
  chrome.tabs.create({
    url: link
  });
}

function restore_options(callback) {
  chrome.storage.sync.get({
    fundList: []
  }, callback);
}

function restore_fund(key, callback) {
  var json = {};
  json[key] = {};
  chrome.storage.sync.get(json, callback);
}

function getYesterday() {
  var now = new Date();
  var day = now.getDay();

  var num = 1;
  if (day == 0)
    num = 2;
  else if (day == 1)
    num = 3;

  var yesterday = new Date(now.getTime() - 1000 * 60 * 60 * 24 * num);
  var yyyy = yesterday.getFullYear();
  var mm = yesterday.getMonth() + 1;
  var dd = yesterday.getDate();

  return yyyy + '/' + mm + '/' + dd;
}

function loadFund(link, fund){
  var fundDiv = createFundDiv();

  if (fund.owned)
    $(fundDiv).addClass('have');

  $(fundDiv).click(function() {
    openTab(link + fund.key);
  });
  //--------------
  restore_fund(fund.key, function(items) {
    var cache = items[fund.key];
    var yesterday = getYesterday();

    if (cache[yesterday]){
      loadByCache(cache.title, cache[yesterday]);
    } else {
      $(fundDiv).hide();
      loadByAJAX(cache, yesterday);
    }
    $('.fundInfo').append(fundDiv);
  });

  //--------------
  function loadByCache(title, raw) {
    updateFundDiv(fundDiv, title, raw);
  }
  //--------------
  function loadByAJAX(cache, yesterday) {
    $.ajax({
      url: link + fund.key,
      type: 'GET',
      success: function(data) {
        var i = data.indexOf('<ul class="Grid Pb-2"');
        var j = data.indexOf('</ul>', i) + 5;
        var raw = data.substring(i, j);

        var i = data.indexOf('<li class="Grid-U-3-4">');
        var j = data.indexOf('</li>', i) + 5;
        var title = data.substring(i, j);

        updateFundDiv(fundDiv, title, raw);
        $(fundDiv).show();

        //save
        cache.title = title;
        cache[yesterday] = raw;
        var json = {};
        json[fund.key] = cache;
        chrome.storage.sync.set(json, function() {
        });
      },
      /*error: function(data) {
          console.log(data);
      }*/
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  var link = 'https://tw.money.yahoo.com/fund/history/';

  $('footer .options').html(chrome.i18n.getMessage("options"));

  restore_options(function(items){
    var owned = [];
    var other = [];
    $.each(items.fundList, function(index, fund){
      if(!fund.key) return;

      if(fund.owned)
        owned.push(fund);
      else
        other.push(fund);
    });

    $.each(owned.concat(other), function(index, fund){
      loadFund(link, fund);
    });
  });
});
