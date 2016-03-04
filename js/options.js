function createFund(fund) {
  var fundDiv = $('<div class="fund">' +
    '<input class="key" type="text" value=""></input>' +
    '<label><input class="owned" type="checkbox" checked>' +
    chrome.i18n.getMessage("owned") +
    '</label>' +
    '</div>');

  if (fund) {
    $('.key', fundDiv).val(fund.key);
    $('.owned', fundDiv).prop('checked', fund.owned);
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
    //add default
    if(items.fundList.length == 0){
      items.fundList.push({
        key: 'F0GBR04ARJ:FO', //礦業
        owned: true
      });
      items.fundList.push({
        key: 'F000000KVC:FO', //巴西
        owned: true
      });
      items.fundList.push({
        key: 'F0GBR064C4:FO', //馬來西亞
        owned: true
      });
      items.fundList.push({
        key: 'F0GBR064TY:FO', //俄羅斯
        owned: true
      });
      items.fundList.push({
        key: 'F00000O2YN:FO', //A6
        owned: true
      });
      items.fundList.push({
        key: 'F00000PLRX:FO', //A8
        owned: true
      });
      items.fundList.push({
        key: 'F0GBR060HM:FO', //印度
        owned: false
      });
      items.fundList.push({
        key: 'F0GBR04SN7:FO', //中國
        owned: false
      });
      items.fundList.push({
        key: 'F0GBR064C0:FO', //日本
        owned: false
      });
      items.fundList.push({
        key: 'F0GBR060KK:FO', //菲律賓
        owned: false
      });
    }

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
  document.title = chrome.i18n.getMessage("options_title");
  $('header').html(chrome.i18n.getMessage("fund_list"));
  $('#save').html(chrome.i18n.getMessage("save")).click(save_options);
  $('#add').html(chrome.i18n.getMessage("add_fund")).click(function() {
    $(fundList).append(createFund());
  });

  restore_options();
});