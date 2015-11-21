javascript:
(function(w){
  var address = 'mizzz.work';
  var flg = Boolean(w.File && w.FileReader && w.FileList);
  if (!flg) {
    alert('Not Supported');
    return;
  }
  var d = w.document,
      h = d.getElementsByTagName('head')[0],
      s = d.createElement('script');
  s.src = 'http://' + address + '/oblaat/oblaat.js';
  s.type = 'text/javascript';
  h.appendChild(s);
})(window);
