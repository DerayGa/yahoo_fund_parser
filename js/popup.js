function createFundDiv() {
  var content = $('<div class="fund">' +
    '<div class="title"></div>' +
    '<hr>' +
    '<div class="info"><span class="value" />' +
    '<span class="diff" /></div>' +
    '<span class="update" />' +
    '</div>');

  return $(content);
}

function updateFundDiv(fundDiv, title, raw) {
  var title = $('div', $(title)).text();

  raw = $(raw);

  $('.title', fundDiv).html(title);
  var value = $('.Fl-start.Fw-b.Fz-30.Pend-10.C-n', raw).text();
  $('.value', fundDiv).text(value);

  var diff = $('.Fl-start.number.rise.Pt-8', raw).text();
  $('.diff', fundDiv).text(diff);

  var update = $('.Ta-end.Mt-16.remark', raw).text();
  $('.update', fundDiv).text(update);

  var v = parseFloat(diff.split('(')[0], 10);
  if (v > 0)
    $('.info', fundDiv).addClass('red');
  else if (v < 0)
    $('.info', fundDiv).addClass('green');

  $(fundDiv).show();
}

document.addEventListener('DOMContentLoaded', function() {
  var myFunds = ['F0GBR04ARJ:FO',  'F000000KVC:FO', 'F0GBR064TY:FO', 'F00000O2YN:FO',
  'F00000PLRX:FO', 'F0GBR064C4:FO']

  var notMyFunds = ['F0GBR064C0:FO', 'F0GBR060KK:FO', 'F0GBR060HM:FO', 'F0GBR04SN7:FO'];

  var link = 'https://tw.money.yahoo.com/fund/history/';

  $.each(myFunds.concat(notMyFunds), function(index, fund){
    var fundDiv = createFundDiv();
    $(fundDiv).hide();

    if($.inArray(fund, myFunds) > -1)
      $(fundDiv).addClass('have');

    $('.fundInfo').append(fundDiv);

    $.get(link + fund, function(data) {
      var i = data.indexOf('<ul class="Grid Pb-2"');
      var j = data.indexOf('</ul>', i) + 5;
      var raw = data.substring(i, j);

      var i = data.indexOf('<li class="Grid-U-3-4">');
      var j = data.indexOf('</li>', i) + 5;
      var title = data.substring(i, j);

      updateFundDiv(fundDiv, title, raw);
    });

  });
});


/*
<li class="Grid-U-3-4">
                <div class="Fw-b Fz-xl C-n">貝萊德世界礦業基金 A2</div>
            </li>

<ul class="Grid Pb-2" id="yui_3_18_1_1_1457055541217_1613">
        <li class="Grid-U-4-5" id="yui_3_18_1_1_1457055541217_1611">
            
            <div class="Fl-start Fw-b Fz-30 Pend-10 C-n">23.07</div>
            
            <div class="Fl-start Fz-m Pend-6 Pt-12">美元</div>
            
            
            
                
                <div class="Fl-start number rise Pt-12">
                  <i class="Icon Fz-l"></i>
                </div>
                <div class="Fl-start number rise Pt-8">
                  <span class="Fz-xl">0.3</span>
                </div>
                
            
            
            
            
            
                
                <div class="Fl-start number rise Pstart-6 Pt-8 Fz-xl">(1.32%)</div>
                
            
            
        </li>
        <li class="Grid-U-1-5">
            <div class="Ta-end Mt-16 remark">2016/03/02更新</div>
        </li>
    </ul>
      */