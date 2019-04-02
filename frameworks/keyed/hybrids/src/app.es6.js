'use strict';

import { html } from 'hybrids';
// import Store, { run, add, update, select, clear, runLots, swapRows } from './store';

var startTime;
var lastMeasure;
var startMeasure = function(name) {
    startTime = performance.now();
    lastMeasure = name;
}
var stopMeasure = function() {
    var last = lastMeasure;
    if (lastMeasure) {
        window.setTimeout(function () {
            lastMeasure = null;
            var stop = performance.now();
            var duration = 0;
            console.log(last+" took "+(stop-startTime));
        }, 0);
    }
}

const danger = 'danger';

function _random(max) {
    return Math.round(Math.random()*1000)%max;
}

const store = {
  buildData: (host, count = 100) => {
    var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
    var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
    var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
    var data = [];
    for (var i = 0; i < count; i++)
      data.push({id: host.id++, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] });
    return data;
  },
  updateData: (host) => {
    // Assigning if not sufficient to re-render
    var newData = [...host.data]
    for (let i=0;i<host.data.length;i+=10) {
      newData[i].label += ' !!!';
    }
    host.data = newData;
  },
  remove: (host, id) => {
    const idx = host.data.findIndex(d => d.id==id);
    host.data = host.data.filter((e,i) => i!=idx);
  },
  run: (host) => {
    host.data = store.buildData(host);
    host.selected = undefined;
  },
  add: (host) => {
    host.data = host.data.concat(store.buildData(host, 1000));
    host.selected = undefined;
  },
  update: (host) => {
    store.updateData(host);
    host.selected = undefined;
  },
  select: (host, id) => {
    host.selected = id;
  },
  runLots: (host) => {
    host.data = store.buildData(host, 10000);
    host.selected = undefined;
  },
  clear: (host) => {
    host.data = [];
    host.selected = undefined;
  },
  swapRows: (host) => {
    if(host.data.length > 998) {
      var data = [...host.data];
      var a = data[1];
      data[1] = data[998];
      data[998] = a;
      host.data = data;
    }
  }
};

function add (host) {
  startMeasure('add');
  store.add(host);
  stopMeasure();
}
function remove (host, id) {
  startMeasure('remove');
  store.remove(host, id);
  stopMeasure();
}
function select (host, id) {
  startMeasure('select');
  store.select(host, id);
  stopMeasure();
}
function run (host) {
  startMeasure('run');
  store.run(host);
  stopMeasure();
}
function update (host) {
  startMeasure('update');
  store.update(host);
  stopMeasure();
}
function runLots (host) {
  startMeasure('runLots');
  store.runLots(host);
  stopMeasure();
}
function clear (host) {
  startMeasure('clear');
  store.clear(host);
  stopMeasure();
}
function swapRows (host) {
  startMeasure('swapRows');
  store.swapRows(host);
  stopMeasure();
}

export default {
  data: [],
  selected: undefined,
  id: 1,
  render: (host) => html`
    <div id='main'>
      <div class="container">
        <div class="jumbotron">
          <div class="row">
            <div class="col-md-6">
              <h1>Hybrids-"keyed"</h1>
            </div>
            <div class="col-md-6">
              <div class="row">
                <div class="col-sm-6 smallpad">
                  <button type='button' class='btn btn-primary btn-block' id='run' onclick="${run}">Create 1,000 rows</button>
                </div>
                <div class="col-sm-6 smallpad">
                  <button type='button' class='btn btn-primary btn-block' id='runlots' onclick="${runLots}">Create 10,000 rows</button>
                </div>
                <div class="col-sm-6 smallpad">
                  <button type='button' class='btn btn-primary btn-block' id='add' onclick="${add}">Append 1,000 rows</button>
                </div>
                <div class="col-sm-6 smallpad">
                  <button type='button' class='btn btn-primary btn-block' id='update' onclick="${update}">Update every 10th row</button>
                </div>
                <div class="col-sm-6 smallpad">
                  <button type='button' class='btn btn-primary btn-block' id='clear' onclick="${clear}">Clear</button>
                </div>
                <div class="col-sm-6 smallpad">
                  <button type='button' class='btn btn-primary btn-block' id='swaprows' onclick="${swapRows}">Swap Rows</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <table class="table table-hover table-striped test-data">
          <tbody id="tbody">
            ${host.data.map((row) => html`
              <tr class="${ (row.id == host.selected) && danger }">
                <td class='col-md-1'>${row.id}</td>
                <td class='col-md-4'>
                  <a onclick=${() => select(host, row.id)}>${row.label}</a>
                </td>
                <td class='col-md-1'>
                  <a onclick=${() => remove(host, row.id)}><span class='glyphicon glyphicon-remove' aria-hidden="true"></span></a>
                </td>
                <td class='col-md-6'></td>
              </tr>
            `.key(row.id))}
          </tbody>
        </table>
        <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
      </div>
    </div>`
}
