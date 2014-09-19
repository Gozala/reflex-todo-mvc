"use strict"

var curry = require("functional/curry")
var identity = require("functional/identity")
var Task = require("./model").Task

var merge = function(a, b) {
  var c = Object.create(Object.getPrototypeOf(a))
  Object.keys(a).forEach(function(key) {
    c[key] = a[key]
  })
  Object.keys(b).forEach(function(key) {
    c[key] = b[key]
  })
  return c
}

// A description of the kinds of actions that can be performed on the state of
// the application. See the following post for more info on this pattern and
// some alternatives: https://gist.github.com/evancz/2b2ba366cae1887fe621

// Each function contains logic of how to step the state forward for any given
// action. Note that each function is curried, so that last argument will be
// applied step function.


exports.NoOp = curry(identity)

exports.Add = curry(function(_, state) {
  return merge(state, {
    uid: state.uid + 1,
    field: "",
    tasks: state.field === "" ? state.tasks :
    state.tasks.concat(Task.make(state.field, state.uid))
  })
})

exports.UpdateField = curry(function(text, state) {
  return merge(state, { field: text })
})


exports.EditingTask = curry(function(id, isEditing, _, state) {
  return merge(state, {
    tasks: state.tasks.map(function(task) {
      return task.id === id ? merge(task, { editing: isEditing }) :
      task
    })
  })
})

exports.UpdateTask = curry(function(id, description, state) {
  return merge(state, {
    tasks: state.tasks.map(function(task) {
      return task.id === id ? merge(task, { description: description }) :
      task
    })
  })
})

exports.Delete = curry(function(id, _, state) {
  return merge(state, {
    tasks: state.tasks.filter(function(task) {
      return task.id !== id
    })
  })
})

exports.DeleteComplete = curry(function(_, state) {
  return merge(state, {
    tasks: state.tasks.filter(function(task) {
      return !task.completed
    })
  })
})

exports.UpdateCompletion = curry(function(id, isComplete, _, state) {
  return merge(state, {
    tasks: state.tasks.map(function(task) {
      return task.id === id ? merge(task, { completed: isComplete }) :
      task
    })
  })
})

var UpdateEveryCompletion = curry(function(isComplete, state) {
  return merge(state, {
    tasks: state.tasks.map(function(task) {
      return merge(task, { completed: isComplete })
    })
  })
})

exports.CompleteAll = curry(function(_, state) {
  return UpdateEveryCompletion(true, state)
})

exports.UncompleteAll = curry(function(_, state) {
  return UpdateEveryCompletion(false, state)
})


exports.ChangeVisibility = curry(function(visibility, _, state) {
  return merge(state, { visibility: visibility })
})
