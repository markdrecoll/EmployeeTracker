// get dependencies such as inquirer and mysql
const inquirer = require('inquirer');
const mysql = require('mysql');
const util = require('util');
//let allEmp = [];
// this creates a connection to the local database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '19cavalryarcher',
    database: 'employeetracker_db'
})
// connection.connect();
// connection.query = util.promisify(connection.query);



let showEmployeeByDepartmentQuestion = [
    {
        type: 'list',
        message: "What department do you want employees from?",
        name: 'department_id',
        choices: []
    }
]
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
           // allEmp = addEmployeeQuestions[3].choices;
            // returns an error if there are no employees
            if (!employees) {
                console.log('no employees error')
            }

            //return employees;
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

////////////////////////////////////////////////////////// EMPLOYEE BY DEPARTMENT
// THIS IS BEING WORKED ON

// this function gets all the employees
async function getAllDepartments() {
    try {
        const departments = await connection.query('SELECT * FROM department', (err, res) => {
            if (err) throw err;

            // the fourth add employee question has the choices array populated with employees
            showEmployeeByDepartmentQuestion[0].choices = [];
            //console.log('Here is the list of all the departments', res)
            // each department is pushed to the choices
            for (let i = 0; i < res.length; i++) {
                
                showEmployeeByDepartmentQuestion[0].choices.push(`${i+1}.${res[i].name}`);
            }
           // allEmp = addEmployeeQuestions[3].choices;
            // returns an error if there are no employees
            if (!departments) {
                console.log('no departments error')
            }

            //return employees;
        })
    } catch (err) {
        throw err;
    }
//    console.log(await connection.query('SELECT * FROM department'));
}


// this function displays all the employees
async function showAllEmployeesByDepartment() {
    // console.log('Before getting all departments')
    // //const departments = await getAllDepartments();
    // await getAllDepartments();

    try {
        // get all departments from SQL database
        const departments = await connection.query('SELECT * FROM department');

        // clears out the department options in case this has been called before
        showEmployeeByDepartmentQuestion[0].choices = [];

         // each department is pushed to the choices
        for (let i = 0; i < departments.length; i++) {
            showEmployeeByDepartmentQuestion[0].choices.push({name: `${departments[i].name}`, value: `${departments[i].id}`});
        }
    } catch (err) {
        throw err;
    }

    let departmentChoice;

    inquirer
        .prompt(showEmployeeByDepartmentQuestion)
        .then((response) => {            
            console.log(response);
            // departmentChoice = parseInt(response.charAt(0));
        })
        .catch((err) => {
            console.log(err);
    //     })

    // connection.query(`Select * from employee where id = ${departmentChoice}`, (err, res)=>{
    //      if (err){
    //          console.log(err);
    //      }else {
    //         console.table(res);
    //      }
    // })

    userInteractionPrompt();
        })
 }

 //////////////////////////////////////////// END OF EMPLOYEE BY DEPARTMENT

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

 ////////////////////////////////////////////////////

  // this function displays all the employees
function showAllRoles() {
    connection.query('Select * from role', (err, res)=>{
         if (err){
             console.log(err)
         }else {
             console.table(res)
         }
     })
 }

  // this function displays all the employees
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
                  
                }
            })

        }).catch(err => {
            console.log(err);
        })
        // userInteractionPrompt();
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