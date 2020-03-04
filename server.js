const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "",
  database: "employee_db"
});

connection.connect(function(err) {
  if (err) throw err;
  runSearch();
});

function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Welcome to the employee_db manager. How can I help you?",
      choices: [
        "View all employees",
        "View employees by department",
        "View employees by role",
        "Add employee to database",
        "Update employee role"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "View all employees":
          viewEmployees();
          break;
        case "View employees by department":
          viewByDepartment();
          break;
        case "View employees by role":
          viewByRole();
          break;
        case "Add employee to database":
          addEmployee();
          break;
        case "Update employee role":
          updateRole();
          break;
      }
    });
}

// function viewEmployees() {

// };

function viewByDepartment() {
  inquirer
    .prompt({
      name: "department",
      type: "list",
      message: "Which department would you like to view?",
      choices: ["Sales", "Engineering", "Finance", "Legal"]
    })
    .then(function(answer) {
      console.log(answer);
    });
}

function viewByRole() {
  inquirer
    .prompt({
      name: "role",
      type: "list",
      message: "Which role would you like to view?",
      choices: [
        "Sales Lead",
        "Sales Person",
        "Lead Engineer",
        "Software Engineer",
        "Accountant",
        "Legal Team Lead",
        "Lawyer"
      ]
    })
    .then(function(answer) {
      console.log(answer);
    });
}

function addEmployee() {
  inquirer
    .prompt({
      name: "firstname",
      type: "input",
      message: "What is the first name?"
    })
    .then(function(answer) {
      console.log(answer);
      inquirer
        .prompt({
          name: "lastname",
          type: "input",
          message: "What is your last name?"
        })
        .then(function(answer) {
          inquirer.prompt({
            name: "role",
            type: "list",
            message: "What is this Employees role?",
            choices: [
              "Sales Lead",
              "Sales Person",
              "Lead Engineer",
              "Software Engineer",
              "Accountant",
              "Legal Team Lead",
              "Lawyer"
            ]
          })
          .then(function(answer) {
            console.log(answer);
          })
        });
    });
}

// function updateRole() {

// };
