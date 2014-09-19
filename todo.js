"use strict";

var curry = require("functional/curry")
var identity = require("functional/identity")

var Input = require("reflex/signal").Input
var lift = require("reflex/signal").lift
var foldp = require("reflex/signal").foldp

var State = require("./model").State
var view = require("./view").view

var app = require("reflex/app").app

var actions = new Input()

// step: State -> Action -> state
var step = function(state, action) {
  return action(state)
}

var state = foldp(step, State.empty(), actions)

var main = lift(function(snapshot) {
  return view(actions, snapshot)
}, state)
exports.main = main


// Hack: This should not be necessary, worker should set
// this up for us, but for now it's easier than getting
// into worker mess.
app(main)
