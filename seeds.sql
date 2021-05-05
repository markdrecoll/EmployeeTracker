INSERT INTO department (name) VALUES ('Sales');
INSERT INTO department (name) VALUES ('Engineering');
INSERT INTO department (name) VALUES ('Finance');
INSERT INTO department (name) VALUES ('Legal');

INSERT INTO role (title, salary, department_id) VALUES ('Sales Lead', '95000', 1);
INSERT INTO role (title, salary, department_id) VALUES ('Salesperson', '85000', 1);
INSERT INTO role (title, salary, department_id) VALUES ('Lead Engineer', '145000', 2);
INSERT INTO role (title, salary, department_id) VALUES ('Software Engineer', '110000', 2);
INSERT INTO role (title, salary, department_id) VALUES ('Accountant', '115000', 3);
INSERT INTO role (title, salary, department_id) VALUES ('Legal Team Lead', '240000', 4);
INSERT INTO role (title, salary, department_id) VALUES ('Attorney', '170000', 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Arnold', 'Schwartzenegger', 1, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Sylvester', 'Stallone', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Jean-Claude', 'VanDamme', 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Bruce', 'Willis', 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Steven', 'Seagal', 5, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Mel', 'Gibson', 6, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Jason', 'Statham', 7, 6);