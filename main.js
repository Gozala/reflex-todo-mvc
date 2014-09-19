"use strict";

var run = require("reflex/app/runner").run
var AppWorker = require("reflex/app/worker").AppWorker

run(new AppWorker("./js/todo.js"), document.getElementById("app"))
