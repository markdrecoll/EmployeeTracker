// get dependencies such as inquirer and mysql
const inquirer = require('inquirer');
const mysql = require('mysql');
const util = require('util');

// this creates a connection to the local database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '19cavalryarcher',
    database: 'employeetracker_db'
})

// these are the options for what action the user wants to take
const whatWouldUserLikeToDoArray = [
    {
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View Departments',
            'View Roles',
            'View Employees',
            'View Employees by Department',
            // 'View Employees by Manager',
            'Add Department',
            'Add Role',
            'Add Employee',
            // 'Remove Department',
            // 'Remove Role',
            // 'Remove Employee',
            'Update Employee Role',
            // 'Update Employee Manager',
            // 'View budget of a Department',
            'Exit'],
        name: 'whatWouldUserLikeToDo'
    }
]

// this is the show employees by department prompt question
let showEmployeeByDepartmentQuestion = [
    {
        type: 'list',
        message: "What department do you want employees from?",
        name: 'department_choice',
        choices: []
    }
]

// this prompts for add department info
let addDepartmentQuestion = [
    {
        type: 'input',
        message: "What is the name of the department you would like to add?",
        name: 'name'
    }
]

// this prompts for add role info
let addRoleQuestions = [
    {
        type: 'input',
        message: "What is the name of the role you would like to add?",
        name: 'title'
    },
    {
        type: 'input',
        message: "What is the salary for the role?",
        name: 'salary'
    },
    {
        type: 'list',
        message: "What department would you like to add this role to?",
        choices: [],
        name: 'department_id'
    }
]

// this is an array of questions when adding a new employee
let addEmployeeQuestions = [
    {
        type: 'input',
        message: "What is the employee's first name?",
        name: 'first_name'
    },
    {
        type: 'input',
        message: "What is the employee's last name?",
        name: 'last_name'
    },
    {
        type: 'list',
        message: "What is the employee's role?",
        choices: ['1.Sales Lead', '2.Salesperson', '3.Lead Engineer', '4.Software Engineer', '5.Accountant', '6.Legal Team Lead', '7.Attorney'],
        name: 'role_id'
    },
    {
        type: 'list',
        message: "Who is the employee's manager?",
        choices: [],
        name: 'manager_id'
    }
]

// this function displays all the departments
function showDepartments() {
    connection.query('Select * from department', (err, res) => {
        if (err) {
            console.log(err)
        } else {
            console.table(res)
        }
    })
    userInteractionPrompt();
}

// this function displays all the roles
function showRoles() {
    connection.query('Select * from role', (err, res) => {
        if (err) {
            console.log(err)
        } else {
            console.table(res)
        }
    })
    userInteractionPrompt();
}

// this function displays all the employees
function showAllEmployees() {
    connection.query('Select * from employee', (err, res) => {
        if (err) {
            console.log(err)
        } else {
            console.table(res)
        }
    })
    userInteractionPrompt();
}

// this function displays all the employees in a given department
async function showAllEmployeesByDepartment() {

    // create connection
    let promiseConn = connection;
    promiseConn.query = util.promisify(promiseConn.query);

    try {
        // get all departments from SQL database
        const departments = await promiseConn.query('SELECT * FROM department');
    } catch (err) { throw err; }

    // ask the user what department they would like to see employees from
    inquirer
        .prompt(showEmployeeByDepartmentQuestion)
        .then(async (response) => {

            // the users response is what department is chosen
            let departmentChoice = (response.department_choice);

            // get all employees where their department id is equal to what was chosen (utilize two left joins)
            const employeesFromDepartment = await promiseConn.query(`SELECT * FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department on role.department_id = department.id WHERE department.id = ?;`, departmentChoice)
            console.table(employeesFromDepartment);
        })
        .catch((err) => {
            console.log(err);
        })

    // after action is complete, return to user menu
    // userInteractionPrompt();
}

// this function displays all the employees with a given manager
function showAllEmployeesByManager() { }

// this function adds a department
function addDepartment() {

    // ask the user for info on the department being added then insert that department into database
    inquirer
        .prompt(addDepartmentQuestion)
        .then((response) => {
            console.log(response);
            connection.query("INSERT INTO department SET ?", response, (err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log('Department added.');
                    userInteractionPrompt();
                }
            })
        }).catch(err => { console.log(err); })
}

// this function adds a role
async function addRole() {

    // create connection
    let promiseConn = connection;
    promiseConn.query = util.promisify(promiseConn.query);

    // initialize empty array for departments
    let departments = [];

    // get all departments from SQL database
    departments = await promiseConn.query('SELECT * FROM department');

    // clears out the department options in case this has been called before
    addRoleQuestions[2].choices = [];

    // each department is pushed to the choices
    for (let i = 0; i < departments.length; i++) {
        addRoleQuestions[2].choices.push({ name: `${departments[i].name}`, value: `${departments[i].id}` });
    }

    // prompt user the addRoleQuestions and insert response into database
    inquirer
        .prompt(addRoleQuestions)
        .then((response) => {

            // create connection to database, add in the new role
            connection.query("INSERT INTO role SET ?", response, (err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log('Role added.');
                    userInteractionPrompt();
                }
            })
        }).catch(err => { console.log(err); })
}

// this function gets all the employees for the add employees
async function getAllEmployees() {
    try {
        const employees = await connection.query('SELECT * FROM employee', (err, res) => {
            if (err) throw err;

            // the fourth add employee question has the choices array populated with employees
            addEmployeeQuestions[3].choices = [];

            // each employee is pushed to the manager question of the add employee questions
            for (let i = 0; i < res.length; i++) {
                addEmployeeQuestions[3].choices.push(`${i + 1}.${res[i].first_name} ${res[i].last_name}`);
            }

            // returns an error if there are no employees
            if (!employees) {
                console.log('no employees error')
            }
        })
    } catch (err) {
        throw err;
    }
}

// this function adds an employee
async function addEmployee() {

    // get all available employees, and make that the choices array
    let allEmployees = getAllEmployees();
    addEmployeeQuestions[3].choices = allEmployees;

    // ask the user for info on the employee being added
    inquirer
        .prompt(addEmployeeQuestions)
        .then((response) => {

            // establish a new employee with given data
            let newEmployee = {
                first_name: response.first_name,
                last_name: response.last_name,
                role_id: parseInt(response.role_id.charAt(0)),
                manager_id: parseInt(response.manager_id.charAt(0))
            }

            // insert the employee into the database
            connection.query("INSERT INTO employee SET ?", newEmployee, (err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log('Employee Added');
                    userInteractionPrompt();
                }
            })
        }).catch(err => { console.log(err); })
}

// this function deletes a department
function deleteDepartment() { }

// this function deletes a role
function deleteRole() { }

// this function deletes an employee
function deleteEmployee() { }

// this function updates an employee's role
function updateEmployeeRole() {
    userInteractionPrompt();
}

// this function updates an employee's manager
function updateEmployeeManager() { }

// this function views the sum of the salaries in a department
function viewDepartmentBudget() { }

// this function is the main menu for what the user would like to do
function userInteractionPrompt() {
    inquirer
        .prompt(whatWouldUserLikeToDoArray)
        .then((response) => {

            // this long if statement has all user choice options

            if (response.whatWouldUserLikeToDo === 'View Departments') {
                showDepartments();
            }
            else if (response.whatWouldUserLikeToDo === 'View Roles') {
                showRoles();
            }
            else if (response.whatWouldUserLikeToDo === 'View Employees') {
                showAllEmployees();
            }
            else if (response.whatWouldUserLikeToDo === 'View Employees by Department') {
                showAllEmployeesByDepartment();
            }
            // else if (response.whatWouldUserLikeToDo === 'View Employees by Manager'){
            //     showAllEmployeesByManager();
            // }
            else if (response.whatWouldUserLikeToDo === 'Add Department') {
                addDepartment();
            }
            else if (response.whatWouldUserLikeToDo === 'Add Role') {
                addRole();
            }
            else if (response.whatWouldUserLikeToDo === 'Add Employee') {
                addEmployee();
            }
            // else if (response.whatWouldUserLikeToDo === 'Remove Department'){
            //     deleteDepartment();
            // }
            // else if (response.whatWouldUserLikeToDo === 'Remove Role'){
            //     deleteRole();
            // }
            // else if (response.whatWouldUserLikeToDo === 'Remove Employee'){
            //     deleteEmployee();
            // }
            else if (response.whatWouldUserLikeToDo === 'Update Employee Role') {
                updateEmployeeRole();
            }
            // else if (response.whatWouldUserLikeToDo === 'Update Employee Manager'){
            //     updateEmployeeManager();
            // }
            // else if (response.whatWouldUserLikeToDo === 'View budget of a Department'){
            //     viewDepartmentBudget();
            // }
            else if (response.whatWouldUserLikeToDo !== 'Exit') {
                // console.log("User choice selected.");
                userInteractionPrompt();
            }
        }
        );
}

// initiate program by prompting the user
userInteractionPrompt();