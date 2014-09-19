"use strict";

// The full application state of our todo app.
var State = function(tasks, field, uid, visibility) {
  this.tasks = tasks
  this.field = field
  this.uid = uid
  this.visibility = visibility
}
State.empty = function() {
  return new State([], "", 0, "All")
}

exports.State = State



var Task = function(description, completed, editing, id) {
  this.description = description
  this.completed = completed
  this.editing = editing
  this.id = id
}
Task.make = function(description, id) {
  return new Task(description, false, false, id)
}
exports.Task = Task
