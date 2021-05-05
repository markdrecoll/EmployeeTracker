const inquirer = require('inquirer');
const mysql = require('mysql');

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

function userInteractionPrompt() {
    inquirer
        .prompt(whatWouldUserLikeToDoArray)
        .then((response) => {
            if(response.whatWouldUserLikeToDo !== 'Exit'){
                console.log("User choice selected.");
                userInteractionPrompt();
            }
        }
        );
}

userInteractionPrompt();