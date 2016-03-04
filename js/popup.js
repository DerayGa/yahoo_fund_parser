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

  $(fundDiv).show();
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

function loadFund(link, fund){
  var fundDiv = createFundDiv();
  $(fundDiv).hide();

  if (fund.owned)
    $(fundDiv).addClass('have');

  $('.fundInfo').append(fundDiv);

  $(fundDiv).click(function() {
    openTab(link + fund.key);
  });

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
    },
    /*error: function(data) {
        console.log(data);
    }*/
  });
}

document.addEventListener('DOMContentLoaded', function() {
  var link = 'https://tw.money.yahoo.com/fund/history/';

  $('footer .options').html(chrome.i18n.getMessage("options"));

  restore_options(function(items){
    $.each(items.fundList, function(index, fund){
      if(!fund.key) return;

      loadFund(link, fund);
    });

  });
});
