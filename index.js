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
        choices: ['View Employees',
            'View Employees by Department',
            'View Employees by Manager',
            'View All Roles',
            'View All Departments',
            'Add Employee',
            'Add Department',
            'Remove Employee',
            'Update Employee Role',
            'Update Employee Manager',
            'Exit'],
        name: 'whatWouldUserLikeToDo'
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

// this is the show employees by department prompt question
let showEmployeeByDepartmentQuestion = [
    {
        type: 'list',
        message: "What department do you want employees from?",
        name: 'department_choice',
        choices: []
    }
]

// this function gets all the employees
async function getAllEmployees() {
    try {
        const employees = await connection.query('SELECT * FROM employee', (err, res) => {
            if (err) throw err;

            // the fourth add employee question has the choices array populated with employees
            addEmployeeQuestions[3].choices = [];
            
            // each employee is pushed to the manager question of the add employee questions
            for (let i = 0; i < res.length; i++) {
                addEmployeeQuestions[3].choices.push(`${i+1}.${res[i].first_name} ${res[i].last_name}`);
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

// this function displays all the employees
function showAllEmployees() {
   connection.query('Select * from employee', (err, res)=>{
        if (err){
            console.log(err)
        }else {
            console.table(res)
        }
    })
    userInteractionPrompt();
}

// this function gets all the employees
async function getAllDepartments() {
    try {
        const departments = await connection.query('SELECT * FROM department', (err, res) => {
            if (err) throw err;

            // clears out the department options in case this has been called before
            showEmployeeByDepartmentQuestion[0].choices = [];

            // each department is pushed to the choices
            for (let i = 0; i < res.length; i++) {
                showEmployeeByDepartmentQuestion[0].choices.push(`${i+1}.${res[i].name}`);
            }

            // returns an error if there are no departments
            if (!departments) {
                console.log('no departments error')
            }
        })
    } catch (err) {throw err;}
}

// this function displays all the employees
async function showAllEmployeesByDepartment() {

    let promiseConn = connection;
    promiseConn.query = util.promisify(promiseConn.query);

    try {
        // get all departments from SQL database
        const departments = await promiseConn.query('SELECT * FROM department');

        // clears out the department options in case this has been called before
        showEmployeeByDepartmentQuestion[0].choices = [];

        // each department is pushed to the choices
        for (let i = 0; i < departments.length; i++) {
            showEmployeeByDepartmentQuestion[0].choices.push({ name: `${departments[i].name}`, value: `${departments[i].id}` });
        }
    } catch (err) {
        throw err;
    }

    // ask the user what department they would like to see employees from
    inquirer
        .prompt(showEmployeeByDepartmentQuestion)
        .then( async (response) => {
            
            console.log(response);

            // the users response is what department is chosen
            departmentChoice = (response);

            // get all employees where their department id is equal to what was chosen (utilize two left joins)
            const employeesFromDepartment = await promiseConn.query(`SELECT * FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department on role.department_id = department.id WHERE department.id = ${departmentChoice}`)
            console.table(employeesFromDepartment);
            
        })
        .catch((err) => {
            console.log(err);    
        })
        
        // after action is complete, return to user menu
        // userInteractionPrompt();
 }

 // this function displays all the employees
function showAllEmployeesByRole(role) {
    connection.query(`Select * from employee where role_id = ${role}`, (err, res)=>{
         if (err){
             console.log(err)
         }else {
             console.table(res)
         }
     })
 }

// this function displays all the roles
function showAllRoles() {
    connection.query('Select * from role', (err, res)=>{
         if (err){
             console.log(err)
         }else {
             console.table(res)
         }
     })
 }

  // this function displays all departments
function showAllDepartments() {
    connection.query(`Select * from employee where role_id = ${mangr}`, (err, res)=>{
         if (err){
             console.log(err)
         }else {
             console.table(res)
         }
     })
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

            let newEmployee = {
                first_name: response.first_name,
                last_name: response.last_name,
                role_id: parseInt(response.role_id.charAt(0)),
                manager_id: parseInt(response.manager_id.charAt(0))
            }

            connection.query("INSERT INTO employee SET ?", newEmployee, (err, res)=>{
                if(err){
                    console.log(err)
                }else {
                    console.log('Employee Added');
                    userInteractionPrompt();
                }
            })
        }).catch(err => {
            console.log(err);
        })
        
}

function userInteractionPrompt() {
    inquirer
        .prompt(whatWouldUserLikeToDoArray)
        .then((response) => {
            console.log(response)
            // user selects what action for the application to take
            if (response.whatWouldUserLikeToDo === 'View Employees') {
                showAllEmployees();
            } 
            
            else if (response.whatWouldUserLikeToDo === 'View Employees by Department') {
                showAllEmployeesByDepartment();


            } else if (response.whatWouldUserLikeToDo === 'View Employees by Manager') {
                showAllEmployeesByManager(x);
            } 

            // else if (response.whatWouldUserLikeToDo === 'View All Roles') {
            //     showAllRoles();
            // } else if (response.whatWouldUserLikeToDo === 'View All Departments') {
            //     showAllDepartments();
            // }
            
            else if (response.whatWouldUserLikeToDo === 'Add Employee') {
                addEmployee();
            } else if (response.whatWouldUserLikeToDo === 'View Employees') {
                showAllEmployees();
            } else if (response.whatWouldUserLikeToDo !== 'Exit') {
                // console.log("User choice selected.");
                userInteractionPrompt();
            }
        }
        );
}

// initiate program by prompting the user
userInteractionPrompt();