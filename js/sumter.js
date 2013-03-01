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
      // ['symbol', [/positive/], [/negative/]]
      regexes: [
        ['$',
          [/^\$\.?[0-9][0-9,\.]*$/],
          [/^\(\$\.?[0-9][0-9,\.]*\)$/, /^[\-–]\$\.?[0-9][0-9,\.]*$/]
        ],
        ['£',
          [/^£\.?[0-9][0-9,\.]*$/],
          [/^\(£\.?[0-9][0-9,\.]*\)$/, /^[\-–]£\.?[0-9][0-9,\.]*$/]
        ],
        ['€',
          [/^€\.?[0-9][0-9,\.]*$/],
          [/^\(€\.?[0-9][0-9,\.]*\)$/, /^[\-–]€\.?[0-9][0-9,\.]*$/]
        ],
        ['¥',
          [/^\.?[0-9][0-9,\.]*¥$/, /^¥\.?[0-9][0-9,\.]*$/],
          [/^\(\.?[0-9][0-9,\.]*¥\)$/, /^[\-–]\.?[0-9][0-9,\.]*¥$/, /^\(¥\.?[0-9][0-9,\.]*\)$/, /^[\-–]¥\.?[0-9][0-9,\.]*$/]
        ],
        ['',
          [/^\.?[0-9][0-9,\.]*$/],
          [/^\(\.?[0-9][0-9,\.]+\)$/, /^[\-–]\.?[0-9][0-9,\.]+$/]
        ]
      ],
      // Number of decimals to round to
      round: 2
    },
    // Placeholder for current selection
    selection: {},
    // Placeholder for current totals.
    totals: ''
  };

  // Styles for total box.
  var styles = [
    'position: fixed;',
    'top: 0;',
    'right: 20px;',
    'padding: 5px 10px;',
    'color: #333;',
    'background-color: #ff0;',
    'font-family: Helvetica, Arial, sans-serif;',
    'font-weight: bold;',
    'font-size: 16px;',
    'opacity: 0.9;'
  ];

  // Make a little total box that's easy to find.
  var styleAttr = document.createAttribute('style');
      styleAttr.value = styles.join('');
  var sumterDialog = document.createElement('div');
      sumterDialog.setAttributeNode(styleAttr);
      sumterDialog.appendChild(document.createTextNode(sumter.config.title));
  document.body.appendChild(sumterDialog);

  // Make a rounder for the desired number of decimal places.
  for(var i = 0, rounder = '1'; i < sumter.config.round; i++) rounder += '0';
  sumter.config.rounder = parseInt(rounder, 10);

  // Get selection object or selection text string.
  function grabSelection() {
    if(window.getSelection) {
      return window.getSelection();
    } else if(document.getSelection) {
      return document.getSelection();
    } else if(document.selection) {
      return document.selection.createRange().text;
    } else return '';
  }

  // Get all *text* nodes contained in a selection object.
  // Adapted from code by Tim Down.
  // http://stackoverflow.com/questions/4398526/how-can-i-find-all-text-nodes-between-to-element-nodes-with-javascript-jquery
  function getTextNodesBetween(selection) {
    var range = selection.getRangeAt(0), rootNode = range.commonAncestorContainer,
        startNode = range.startContainer, endNode = range.endContainer,
        startOffset = range.startOffset, endOffset = range.endOffset,
        pastStartNode = false, reachedEndNode = false, textNodes = [];
    function getTextNodes(node) {
      var val = node.nodeValue;
      if(node == startNode && node == endNode && node !== rootNode) {
        if(val) textNodes.push(val.substring(startOffset, endOffset));
        pastStartNode = reachedEndNode = true;
      } else if(node == startNode) {
        if(val) textNodes.push(val.substring(startOffset));
        pastStartNode = true;
      } else if(node == endNode) {
        if(val) textNodes.push(val.substring(0, endOffset));
        reachedEndNode = true;
      } else if(node.nodeType == 3) {
        if(val && pastStartNode && !reachedEndNode && !/^\s*$/.test(val)) {
          textNodes.push(val);
        }
      }
      for(var i = 0, len = node.childNodes.length; !reachedEndNode && i < len; ++i) {
        if(node !== sumterDialog) getTextNodes(node.childNodes[i]);
      }
    }
    getTextNodes(rootNode);
    return textNodes;
  }

  // Loop through nodes.
  function processNodes(arr, totals) {
    for(var i = 0; i < arr.length; i++) totals = processText(arr[i], totals);
    return totals;
  }
  function processText(text, totals) {
    var arr = text.split(/\s+/);
    for(var i = 0, sum = 0; i < arr.length; i++) {
      for(var j = 0; j < sumter.config.regexes.length; j++) {
        if(typeof totals[j] === 'undefined') totals[j] = [];
        for(var k = 0, alive = true; alive && k < sumter.config.regexes[j][1].length; k++) {
          if(sumter.config.regexes[j][1][k].test(arr[i])) {
            totals[j].push(parseFloat(arr[i].replace(/[^0-9\.]/g, '')));
            alive = false;
            break;
          }
        }
        for(var l = 0; alive && l < sumter.config.regexes[j][2].length; l++) {
          if(sumter.config.regexes[j][2][l].test(arr[i])) {
            totals[j].push((0 - parseFloat(arr[i].replace(/[^0-9\.]/g, ''))));
            break;
          }
        }
      }
    }
    return totals;
  }


  // Lazy Range object detection.
  function isRange(obj) {
    return ('type' in obj && obj.type === 'Range');
  }

  // Good-enough Range object comparison.
  function rangeChange(data1, data2) {
    return (data1.type !== data2.type || data1.focusNode !== data2.focusNode || data1.focusOffset !== data2.focusOffset);
  }

  // Round a number. *Glares at parseFloat.*
  function roundNumber(num) {
    return Math.round(num * sumter.config.rounder) / rounder;
  }

  // Tally a final total.
  function tallyTotal(arr) {
    var nbsp = String.fromCharCode(160);
    for(var i = 0, totals = [], total = 0; i < arr.length; i++) {
      var len = arr[i].length;
      if(len) {
        for(var j = 0, sum = 0; j < len; j++) sum += arr[i][j];
        totals.push(sumter.config.regexes[i][0] + roundNumber(sum));
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


    // Test for something usable.
    switch(typeof sel) {
      case 'object':
        // is selection object : TRAVERSE DAT DOM HOMIE
        if(isRange(sel)){
          if(rangeChange(sel, sumter.selection)) {
            sumterDialog.innerHTML = sumter.total = tallyTotal(processNodes(getTextNodesBetween(sel), []));
            sumter.selection = { type: sel.type, focusNode: sel.focusNode, focusOffset: sel.focusOffset };
          }
          return false;
        }
        break;
      case 'string':
        // is selection string : FALLBACK, DO DUMB STUFF
        if(sel !== '') {
          if(sel !== sumter.selection) {
            sumterDialog.innerHTML = sumter.total = tallyTotal(processText(sel, []));
            sumter.selection = sel + '';
          }
          return false;
        }
        break;
    }

    // empty selection or selection too young : RESET
    if(sumter.total !== sumter.config.title) {
      sumterDialog.innerHTML = sumter.total = sumter.config.title;
    }

  };

  // Capture mouse and key events.
  document.onmouseup = function(e) {
    document.onmousemove = function(){};
    window.setTimeout(captureSelection, 100);
  };
  document.onmousedown = function(e) { document.onmousemove = captureSelection; };
  document.onkeydown = captureSelection;
  document.onkeyup = captureSelection;

})();
