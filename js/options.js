function createFund(fund) {
  var fundDiv = $('<div class="fund">' +
    '<input class="key" type="text" value=""></input>' +
    '<label><input class="owned" type="checkbox" id="owned">Owned</label>' +
    '</div>');

  if (fund) {
    $('.key', fundDiv).val(fund.key);
    if(fund.owned){
      $('.owned', fundDiv).prop('checked', true);
    }
  }
  return fundDiv;
}

function getFundList() {
  var list = [];
  var funds = $('.fund', $('#fundList'));
  $.each(funds, function(index, fund) {
    var key = $('.key', $(fund)).val();
    var owned = $('.owned', $(fund)).is(":checked");

    if (!key) return;

    list.push({
      key: key,
      owned: owned
    });
  });
  return list;
}

function restore_options() {
  chrome.storage.sync.get({
    fundList: []
  }, function(items) {
    var count = Math.max(items.fundList.length, 3);

    for (var i = 0; i < count; i++) {
      $(fundList).append(createFund(items.fundList[i]));
    }
  });
}

function save_options() {
  chrome.storage.sync.set({
    fundList: getFundList()
  }, function() {
  });
}

document.addEventListener('DOMContentLoaded', function() {
  $('#save').click(save_options);
  $('#add').click(function() {
    $(fundList).append(createFund());
  });

  restore_options();
});