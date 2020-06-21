String.prototype.removeAllNonNucleotide = function() {
  var target = this;
  return target.replace(/[^AaCcTtGg]/g, '').toUpperCase();
};

var scriptFlag = false;
var editor = ace.edit('editor');
editor.setTheme('ace/theme/monokai');
editor.session.setMode("ace/mode/text");
editor.setOptions({
  fontSize: 18,
  printMargin: false,
  indentedSoftWrap: false,
  wrap: "free"
});
editor.session.gutterRenderer = {
  getWidth: function(session, lastLineNumber, config) {
    var nextLineNumberLength = (((lastLineNumber) * editor.session.getWrapLimit()) + 1).toString().length;
    var currLineNumberLength = (((lastLineNumber - 1) * editor.session.getWrapLimit()) + 1).toString().length;
    if (nextLineNumberLength > currLineNumberLength) {
      return nextLineNumberLength * config.characterWidth;
    }
    return currLineNumberLength * config.characterWidth;
  },
  getText: function(session, row) {
    return (row * editor.session.getWrapLimit()) + 1;
  }
};

var renderDoc = function() {
  if (!scriptFlag) {
    var doc = editor.session.getValue().removeAllNonNucleotide();
    doc = doc.replace(/\n/g, '');
    var lines = doc.match(new RegExp(`.{1,${editor.session.getWrapLimit()}}`, 'g'));
    if (lines == null) {
      editor.session.getDocument().setValue('');
      return;
    }
    console.log(lines);
    doc = lines.join('\n');
    scriptFlag = true;
    editor.session.getDocument().setValue(doc);
  }
  else {
    scriptFlag = false;
  }
};

editor.session.on('change', (e) => {
  console.log(e);
  if (e.action === 'insert') {
    renderDoc();
  }
});
editor.session.on('changeWrapLimit', renderDoc);

//TODO: Fix undos since we're messing with the doc so much