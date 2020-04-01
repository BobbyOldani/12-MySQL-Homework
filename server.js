const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "cllz1494",
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
        "Update employee role",
        "Exit"
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
        case "Exit":
          connection.end();
          break;
      }
    });
}

//////////////////////////////////////////////////////////////////////////////

function viewEmployees() {
  connection.query(
    "SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name FROM employee as e INNER JOIN role as r on e.rolefk = r.roleid INNER JOIN department as d on r.departmentfk = d.departmentid",
    function(err, result) {
      console.log(result);
      console.table(result);
      nextQuestion();
    }
  );
}

function depQuery(answer) {
  console.log(answer.department);
  let query = `SELECT e.id, e.first_name, e.last_name, d.name FROM employee as e INNER JOIN role as r ON e.rolefk = r.roleid INNER JOIN department as d WHERE r.departmentfk = d.departmentid AND d.name = "${answer.department}"`;
  connection.query(query, function(err, results) {
    if (err) throw err;
    console.log(results);
    console.table(results);
    nextQuestion();
  });
}

function roleQuery(answer) {
  console.log(answer.role);
  let query = `SELECT e.id, e.first_name, e.last_name, r.title FROM employee as e LEFT JOIN role as r ON e.rolefk = r.roleid WHERE r.title = "${answer.role}"`;
  connection.query(query, function(err, results) {
    if (err) throw err;
    console.table(results);
    nextQuestion();
  });
}

//////////////////////////////////////////////////////////////////////////////
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
      depQuery(answer);
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
      roleQuery(answer);
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        name: "firstname",
        type: "input",
        message: "What is the first name?"
      },
      {
        name: "lastname",
        type: "input",
        message: "What is your last name?"
      },
      {
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
      }
    ])
    .then(function(answer) {
      console.log(answer);
      empRoleSearch(answer);
    });
}

function updateRole() {
  var employeeArr;
  connection.query(
    "SELECT e.id, e.first_name, e.last_name FROM employee as e",
    function(err, result) {
      employeeArr = result.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));
      inquirer
        .prompt([
          {
            name: "who",
            message: "Choose an employee to update",
            type: "list",
            choices: employeeArr
          }
        ])
        .then(function(answer) {
          var roleArr;
          connection.query("SELECT roleid, title FROM role", function(
            err,
            result
          ) {
            roleArr = result.map(({ roleid, title }) => ({
              name: title,
              value: roleid
            }));
            inquirer.prompt([
              {
                name: "what",
                message: "Choose a new role",
                type: "list",
                choices: roleArr
              }
            ]).then(function (answer2) {
              console.log("198" + answer2.what);
              console.log(answer.who);
              connection.query("UPDATE employee SET rolefk = ? WHERE id = ?", [answer2.what, answer.who], function(err, result) {
                if (err) throw err
                console.log("201" + result);
              })
              nextQuestion();
            })
          });
        });
    }
  );
}

function empRoleSearch(employee) {
  var roleid;
  connection.query(
    "SELECT roleid FROM role WHERE title = ?",
    employee.role,
    function(err, result) {
      roleid = result[0].roleid;
      console.log(roleid);
      addEmp(employee, roleid);
    }
  );
}

function addEmp(employee, roleid) {
  connection.query(
    "INSERT INTO employee SET ?",
    {
      first_name: employee.firstname,
      last_name: employee.lastname,
      rolefk: roleid
    },
    function(err) {
      if (err) throw err;
      console.log("This is employee: " + employee);
      console.log("New employee successfully added to database!");
      nextQuestion();
    }
  );
}

function nextQuestion() {
  inquirer
    .prompt({
      name: "next",
      type: "list",
      message: "What would you like to do next?",
      choices: ["Main Menu", "Exit"]
    })
    .then(function(answer) {
      switch (answer.next) {
        case "Main Menu":
          runSearch();
          break;
        case "Exit":
          connection.end();
          break;
      }
    });
}
