const inquirer = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host:'localhost',
    port: 3306,
    user:'root',
    password: '19cavalryarcher',
    database:'employeetracker_db'
})

// the options for adding another employee or finish adding
const whatWouldUserLikeToDoArray = [
    {
        type: 'list',
        message: 'What would you like to do?',
        choices: [  'View Employees',
                    'View Employees by Department',
                    'View Employees by Manager',
                    'Add Employee',
                    'Add Department',
                    'Remove Employee',
                    'Update Employee Role',
                    'Update Employee Manager',
                    'Exit'],
        name: 'whatWouldUserLikeToDo'
    }
]


const availableEmployeesOnLoad = getAllEmployees();
console.log(availableEmployeesOnLoad);


let addEmployeeQuestions = [
    {
        type: 'input',
        message: "What is the employee's first name?",
        name: 'employeeFirstNameInput'
    },
    {
        type: 'input',
        message: "What is the employee's last name?",
        name: 'employeeLastNameInput'
    },
    {
        type: 'list',
        message: "What is the employee's role?",
        choices: ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Engineer', 'Accountant', 'Legal Team Lead', 'Attorney'],
        name: 'employeeRoleInput'
    },
    {
        type: 'list',
        message: "Who is the employee's manager?",
        choices: [],
        name: 'employeeManagerInput'
    }
]

async function getAllEmployees() {
    try {
        const employees = await connection.query('SELECT * FROM employee', (err, res) => {
            if (err) throw err;

            addEmployeeQuestions[3].choices = [];
            for(let i=0; i<res.length; i++){
                addEmployeeQuestions[3].choices.push(`${res[i].first_name} ${res[i].last_name}`);
            }
            console.log(employees);
            if (!employees) {
                console.log('no employees error')
            }
            return employees;
        })

    } catch (err) {
        throw err;
    }
    
}

function showAllEmployees() {
    const employees = getAllEmployees();
    console.log(employees);

}

async function addEmployee(){
    let allEmployees = getAllEmployees();
    console.log(allEmployees);
    addEmployeeQuestions[3].choices = allEmployees;

    // addEmployeeQuestions[3].choices = await getAllEmployees();

    inquirer
        .prompt(addEmployeeQuestions)
        .then((response) =>{
        console.log(response);
            // console.log(response.employeeFirstNameInput + " " + response.employeeLastNameInput)
        }).catch(err => {
            console.log(err);

        })
}

function userInteractionPrompt() {
    inquirer
        .prompt(whatWouldUserLikeToDoArray)
        .then((response) => {
            if(response.whatWouldUserLikeToDo === 'Add Employee'){
                addEmployee();
            }else if(response.whatWouldUserLikeToDo === 'View All Employees'){
                showAllEmployees();            
            }else if(response.whatWouldUserLikeToDo !== 'Exit'){
                console.log("User choice selected.");
                userInteractionPrompt();
            }
        }
        );
}

userInteractionPrompt();