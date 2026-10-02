importScripts('engine.js');
onmessage = function (e) {
  var d = e.data;
  postMessage({ id: d.id, r: search(d.P, d.o) });
};
