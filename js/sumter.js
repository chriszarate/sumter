/*
 * Sumter
 * https://github.com/chriszarate/Sumter
 */

(function(){

  // Let's put some variables in a thing.
  var sumter= {
    config: {
      // Title text
      title: 'Sumter',
      // RegExes describing positive and negative number-like strings
      regexes: [
        {
          showBefore: '$', // Dollar
          showAfter: '',
          pos: [/^\$\.?[0-9][0-9,\.]*$/],
          neg: [/^\(\$\.?[0-9][0-9,\.]*\)$/, /^[\-–]\$\.?[0-9][0-9,\.]*$/]
        },
        {
          showBefore: '£', // Pound
          showAfter: '',
          pos: [/^£\.?[0-9][0-9,\.]*$/],
          neg: [/^\(£\.?[0-9][0-9,\.]*\)$/, /^[\-–]£\.?[0-9][0-9,\.]*$/]
        },
        {
          showBefore: '€', // Euro
          showAfter: '',
          pos: [/^€\.?[0-9][0-9,\.]*$/],
          neg: [/^\(€\.?[0-9][0-9,\.]*\)$/, /^[\-–]€\.?[0-9][0-9,\.]*$/]
        },
        {
          showBefore: '',
          showAfter: '¥', // Yen
          pos: [/^\.?[0-9][0-9,\.]*¥[\.,]?$/, /^¥\.?[0-9][0-9,\.]*$/],
          neg: [/^\(\.?[0-9][0-9,\.]*¥[\.,]?\)$/, /^[\-–]\.?[0-9][0-9,\.]*¥[\.,]?$/, /^\(¥\.?[0-9][0-9,\.]*\)$/, /^[\-–]¥\.?[0-9][0-9,\.]*$/]
        },
        {
          showBefore: '', // plain numbers
          showAfter: '',
          pos: [/^\.?[0-9][0-9,\.]*$/],
          neg: [/^\(\.?[0-9][0-9,\.]+\)$/, /^[\-–]\.?[0-9][0-9,\.]+$/]
        }
      ],
      // Number of decimals to round to
      round: 2,
      // CSS styles for total box.
      styles: [
        'position:fixed;',
        'top:0;',
        'right:20px;',
        'padding:5px 10px;',
        'color:#333;',
        'background-color:#ff0;',
        'font-family:Helvetica,Arial,sans-serif;',
        'font-weight:bold;',
        'font-size:16px;',
        'opacity:0.9;',
        'z-index:9999;'
      ]
    },
    // Placeholder for current selection
    selection: ''
  };

  // Save reference to UI text node.
  sumter.hud = document.createTextNode(sumter.config.title);

  // Make a little box that's easy to find.
  var sumterEl = document.createElement('div'),
      sumterStyleAttr = document.createAttribute('style');
  sumterStyleAttr.value = sumter.config.styles.join('');
  sumterEl.appendChild(sumter.hud);
  sumterEl.setAttributeNode(sumterStyleAttr);
  document.body.appendChild(sumterEl);

  // Make a rounder for the desired number of decimal places.
  for(var i = 0, rounder = '1'; i < sumter.config.round; i++) rounder += '0';
  sumter.config.rounder = parseInt(rounder, 10);

  // Get selection text.
  function grabSelection() {
    if(window.getSelection) {
      return window.getSelection().toString();
    } else if(document.getSelection) {
      return document.getSelection().toString();
    } else if(document.selection) {
      return document.selection.createRange().text;
    } else return '';
  }

  // Loop through text.
  function processText(text, totals) {
    var arr = text.split(/\s+/);
    for(var i = 0, sum = 0; i < arr.length; i++) {
      for(var j = 0; j < sumter.config.regexes.length; j++) {
        if(typeof totals[j] === 'undefined') totals[j] = [];
        for(var k = 0, alive = true; alive && k < sumter.config.regexes[j].pos.length; k++) {
          if(sumter.config.regexes[j].pos[k].test(arr[i])) {
            totals[j].push(parseFloat(arr[i].replace(/[^0-9\.]/g, '')));
            alive = false;
            break;
          }
        }
        for(var l = 0; alive && l < sumter.config.regexes[j].neg.length; l++) {
          if(sumter.config.regexes[j].neg[l].test(arr[i])) {
            totals[j].push((0 - parseFloat(arr[i].replace(/[^0-9\.]/g, ''))));
            break;
          }
        }
      }
    }
    return totals;
  }

  // Round a number. *Glares at parseFloat.*
  function roundNumber(num) {
    return Math.round(num * sumter.config.rounder) / sumter.config.rounder;
  }

  // Tally a final total.
  function tallyTotal(arr) {
    var nbsp = String.fromCharCode(160);
    for(var i = 0, totals = [], total = 0; i < arr.length; i++) {
      var len = arr[i].length;
      if(len) {
        for(var j = 0, sum = 0; j < len; j++) sum += arr[i][j];
        totals.push(sumter.config.regexes[i].showBefore + roundNumber(sum) + sumter.config.regexes[i].showAfter);
        total += sum;
      }
    }
    var tally = totals.join(nbsp + ' + ' + nbsp);
    if(totals.length > 1) tally += nbsp + ' = ' + nbsp + roundNumber(total);
    return tally || sumter.config.title;
  }

  // Text selection handler.
  var captureSelection = function(e) {

    // Grab text selection.
    var sel = grabSelection();

    // Parse selection.
    if(sel !== '') {
      if(sel !== sumter.selection) {
        sumter.hud.nodeValue = sumter.total = tallyTotal(processText(sel, []));
        sumter.selection = sel + '';
      }
    } else if(sumter.total !== sumter.config.title) {
      // Reset.
      sumter.hud.nodeValue = sumter.total = sumter.config.title;
    }

  };

  // Capture mouse and key events.
  document.onmouseup = function(e) {
    document.onmousemove = null;
    window.setTimeout(captureSelection, 100);
  };
  document.onmousedown = function(e) { document.onmousemove = captureSelection; };
  document.onkeydown = captureSelection;
  document.onkeyup = captureSelection;

  // This is awful, but touch text selection events are impossible to capture.
  document.ontouchstart = function(e) {
    document.ontouchstart = null;
    window.setInterval(captureSelection, 100);
  };

  captureSelection();

})();
