"use strict";

var partial = require("functional/partial")

var eventNode = require("reflex/html").eventNode
var node = require("reflex/html").node
var text = require("reflex/html").text

var onInput = require("reflex/event").onInput
var onClick = require("reflex/event").onClick
var onDoubleClick = require("reflex/event").onDoubleClick
var onBlur = require("reflex/event").onBlur
var when = require("reflex/event").when

var action = require("./action")
var Task = require("./model").Task

var isEnterKey = function(event) {
  return event.keyCode === 13
}

var onEnter = function(output, action) {
  return when("keydown", isEnterKey, output, action)
}


// view: Input -> State -> HTML
var view = function(actions, state) {
  return node("div", {className: "todomvc-wrapper",
                      visibility: "hidden"},
              [node("section", {id: "todoapp"},
                    [taskEntry(actions, state.field),
                     taskList(actions, state.visibility, state.tasks),
                     controls(actions, state.visibility, state.tasks)]),
               infoFooter])
}
exports.view = view

// taskEntry: Input -> String -> HTML
var taskEntry = function(actions, value) {
  return node("header", {id: "header"},
             [node("h1", {}, [text("todos")]),
              eventNode("input", {id: "new-todo",
                                  placeholder: "What needs to be done?",
                                  autofocus: "true",
                                  value: value,
                                  name: "newTodo"},
                        [],
                        [onInput(actions, action.UpdateField),
                         onEnter(actions, action.Add)])])
}


var isCompleted = function(task) {
  return task.completed
}

// taskList : Input -> String -> [Task] - HTML
var taskList = function(actions, visibility, tasks) {
  var isVisible = function(task) {
    return visibility === "Completed" ? task.completed :
           visibility === "Active" ? !task.completed :
           true
  }

  var allCompleted = tasks.every(isCompleted)

  return node("section", {id: "main",
                          visibility: tasks.length > 0 ? "visible" : "hidden" },
              [eventNode("input", {id: "toggle-all",
                                   type: "checkbox",
                                   name: "toggle",
                                   checked: allCompleted},
                         [],
                         [onClick(actions, allCompleted ? action.CompleteAll :
                                           action.UncompleteAll)]),
               node("label", {htmlFor: "toggle-all"},
                    [text("Mark all as complete")]),
               node("ul", {id: "todo-list"},
                    tasks.filter(isVisible).map(partial(task, actions)))])
}
exports.taskList = taskList

// task: Input -> Task -> HTML
var task = function(actions, task) {
  var className = (task.completed ? "completed" : "") +
                  " " +
                  (task.editing ? "editing" : "")

  return node("li", {className: className},
              [node("div", {className: "view"},
                    [eventNode("input", {className: "toggle",
                                         type: "checkbox",
                                         checked: task.completed},
                               [],
                               [onClick(actions, action.UpdateCompletion(task.id, !task.completed))]),
                     eventNode("label", {},
                               [text(task.description)],
                               [onDoubleClick(actions, action.EditingTask(task.id, true))]),
                     eventNode("button", {className: "destroy"},
                               [],
                               [onClick(actions, action.Delete(task.id))])]),
               eventNode("input", {className: "edit",
                                   value: task.description,
                                   name: "title",
                                   id: "todo-" + task.id},
                         [],
                         [onInput(actions, action.UpdateTask(task.id)),
                          onBlur(actions, action.EditingTask(task.id, false, false)),
                          onEnter(actions, action.EditingTask(task.id, false))])])
}
exports.task = task

// visibilitySwap : String -> String -> String -> Html
var visibilitySwap = function(actions, uri, visibility, actualVisibility) {
  var className = visibility == actualVisibility ? "selected" : ""
  return eventNode("li", {},
                   [node("a", {className: className,
                               href: uri},
                         [text(visibility)])],
                   [onClick(actions, action.ChangeVisibility(visibility))])
}
exports.visibilitySwap = visibilitySwap

// controls: Input -> String -> [Task] -> HTML
var controls = function(actions, visibility, tasks) {
  var tasksCompleted = tasks.filter(isCompleted).length
  var tasksLeft = tasks.length - tasksCompleted

  return node("footer", {id: "footer",
                         hidden: tasks.length === 0},
              [node("span", {id: "todo-count"},
                    [node("strong", {},
                          [text(tasksLeft),
                           text(" "),
                           text(tasksLeft === 1 ? "item" : "items"),
                           text(" "),
                           text("left")])]),
               node("ul", {id: "filters"},
                    [visibilitySwap(actions, "#/", "All", visibility),
                     text(" "),
                     visibilitySwap(actions, "#/active", "Active", visibility),
                     text(" "),
                     visibilitySwap(actions, "#/completed", "Completed", visibility)]),
               eventNode("button", {className: "clearComplete",
                                    id: "clear-completed",
                                    hidden: tasksCompleted === 0},
                         [text("Clear completed (" + tasksCompleted + ")")],
                         [onClick(actions, action.DeleteComplete)])])
}
exports.controls = controls

var infoFooter = node("footer", {id: "info"},
                      [node("p", {}, [text("Double-click to edit a todo")]),
                       node("p", {}, [text("Created by "),
                                      node("a", {href: "https://github.com/Gozala"},
                                           [text("Irakli Gozalishvili")])]),
                       node("p", {}, [text("Part of "),
                                      node("a", {href: "http://todomvc.com"},
                                           [text("TodoMVC")])])])
exports.infoFooter = infoFooter
