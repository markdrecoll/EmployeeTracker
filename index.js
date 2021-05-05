const inquirer = require('inquirer');
const mysql = require('mysql');

// the options for adding another employee or finish adding
const whatWouldUserLikeToDoArray = [
    {
        type: 'list',
        message: 'What would you like to do?',
        choices: [  'View All Employees',
                    'View All Employees by Department',
                    'View All Employees by Manager',
                    'Add Employee',
                    'Remove Employee',
                    'Update Employee Role',
                    'Update Employee Manager'   ],
        name: 'whatWouldUserLikeToDo'
    }
]

function init() {
    inquirer
        .prompt(whatWouldUserLikeToDoArray)
        .then((response) => {
            console.log("User choice selected.");
        }
        );
}

init();