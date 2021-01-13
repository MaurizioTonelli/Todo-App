/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// CONCATENATED MODULE: ./src/domHelper.js
let createHtmlElement = function(elem, obj = {}){
    let element = document.createElement(elem);
    if(obj.className){
        let classes = obj.className.split(' ');
        classes.forEach(name => {
            element.classList.add(name);
        });
    }
    if(obj.text)
        element.textContent = obj.text;
    return element;
}
let hideElement = function(elem){
    elem.style.display = 'none';
}
let toggleElement = function(elem){
    if(elem.style.display != 'none' && elem.style.display != ''){
        elem.style.display = 'none';
    }else{
        elem.style.display = 'flex';
    }
}


;// CONCATENATED MODULE: ./src/projectsManager.js



let projectsManager = (function(){
    let projectList = [];
    let addProject = proj => projectList.push(proj);
    let deleteProjectById = id => projectList = projectList.filter(x=>x.id!=id);
    let getProjectList = ()=> {
        if(projectList.length > 0)
            return projectList;
        if(localStorage.getItem('projects')){
            let projects = JSON.parse(localStorage.getItem('projects'));
            let p = project('',-1,[],true);
            let t = todo('','','',false);
            projects.forEach(proj => {
                Object.setPrototypeOf(proj, Object.getPrototypeOf(p));
                proj.todos.forEach(todo =>{
                    Object.setPrototypeOf(todo, Object.getPrototypeOf(t));
                });
            });
            projectList = projects;
        }
        return projectList;
    };
    let getProjectById = id => projectList.find(x=>x.id == id);
    let deleteProjectTodo = (projectId, todoId) => {
        getProjectById(projectId).todos = 
          getProjectById(projectId).todos.filter(x => x.id != todoId);
    }
    return {addProject, deleteProjectById, getProjectList, getProjectById, deleteProjectTodo};
})();


;// CONCATENATED MODULE: ./src/todo.js




let todo = function(task, priority, description, finished){
    let proto = {
        getMarkupElement: function(){
            let $todoDiv = createHtmlElement('div',{className:'todo'});
            let $todoTitleDiv = createHtmlElement('div', {className: `todo-title ${this.priority}`});
            if(this.finished) 
                $todoTitleDiv.classList.add('finished');
            else
                $todoTitleDiv.classList.remove('finished');
            let $todoDescriptionDiv = createHtmlElement('div', {className: 'todo-description'});
            let $todoTitleH1 = createHtmlElement('h1',{text: this.task});
            let $todoButtonsDiv = createHtmlElement('div', {className: 'todo-buttons'});
            let todoButtonsHtml = `
                <select id="todo-priority">
                    <option value="low" id="low">Low</option>
                    <option value="medium" id="medium">Medium</option>
                    <option value="high" id="high">High</option>
                    <option value="very-high" id="very-high">Very high</option>
                </select>
                <button id="todo-info"><i class="fa fa-question-circle"></i></button>
                <button id="delete-todo"><i class="fa fa-trash"></i></button>
                <button id="check-todo"><i class="fa fa-check-square"></i></button>
            `;
            $todoButtonsDiv.innerHTML = todoButtonsHtml;
            $todoButtonsDiv.querySelector(`#${this.priority}`).selected = true;
            let $deleteTodoButton = $todoButtonsDiv.querySelector('#delete-todo');
            $deleteTodoButton.addEventListener('click', (e)=>{
                let projectId = $todoDiv.parentElement.parentElement.parentElement.dataset.id;
                projectsManager.deleteProjectTodo(projectId, this.id);
                localStorage.setItem('projects',JSON.stringify(projectsManager.getProjectList()));
                projectDisplayer.displayProjects(projectsManager.getProjectList());
            });
            let $priorityTodoButton = $todoButtonsDiv.querySelector("#todo-priority");
            $priorityTodoButton.addEventListener('change', (e)=>{
                let priority = $priorityTodoButton.value;
                this.priority = priority;
                localStorage.setItem('projects',JSON.stringify(projectsManager.getProjectList()));
                projectDisplayer.displayProjects(projectsManager.getProjectList());
            });
            let $finishedTodoButton = $todoButtonsDiv.querySelector("#check-todo");
            $finishedTodoButton.addEventListener('click', (e)=>{
                this.finished = !this.finished;
                localStorage.setItem('projects',JSON.stringify(projectsManager.getProjectList()));
                projectDisplayer.displayProjects(projectsManager.getProjectList());
            });
            let $todoInfoButton =$todoButtonsDiv.querySelector('#todo-info');
            $todoInfoButton.addEventListener('click', (e)=>{
                let $infoForm = document.querySelector('#todo-description').parentElement;
                $infoForm.style.display = 'block';
                $infoForm.querySelector('#todo-description').textContent = this.description;
            });
            $todoTitleDiv.appendChild($todoTitleH1);
            $todoTitleDiv.appendChild($todoButtonsDiv);
            $todoDiv.appendChild($todoTitleDiv);
            $todoDiv.appendChild($todoDescriptionDiv);
            return $todoDiv;
        }
    };
    return Object.assign(Object.create(proto), {task, priority, description});
}

let todoDisplayer = (function(){
    let getTodosDivByProjectId = function(projectId){
        let $projectDiv = document.querySelector(`[data-id='${projectId}']`);
        let $todosDiv = $projectDiv.querySelector('.todos');
        return $todosDiv;
    }
    let displayTodos = function(todos, projectId){
        let $todosDiv = getTodosDivByProjectId(projectId);
        $todosDiv.innerHTML = '';
        todos.forEach(todo => {
            let $todoDiv = todo.getMarkupElement();
            $todosDiv.appendChild($todoDiv);
        });
    };

    return {displayTodos};
})();



;// CONCATENATED MODULE: ./src/project.js




let toggleTodoFormWithProject = function(projectName, projectId){
    let $createTodoFormDiv = document.querySelector('.add-todo-form');
    let $createTodoForm = document.querySelector('#add-todo-form');
    $createTodoForm.dataset.projectId = projectId;
    let $projectName = document.querySelector('#project-name');
    $projectName.textContent = projectName;
    if($createTodoFormDiv.style.display != 'none' && $createTodoFormDiv.style.display != ''){
        $createTodoFormDiv.style.display = 'none';
    }else{
        $createTodoFormDiv.style.display = 'flex';
    }
}

let project = function(name, id, todos, contentHidden){
    let proto = {
        getNextTodoId: function(){
            return this.todos.reduce((obj, current)=>{
                if(current.id > obj)
                    return current.id;
            }, 0) + 1;
        },
        addTodo: function(todo){
            todo.id = this.getNextTodoId();
            this.todos.push(todo);
        },
        getMarkupElement: function(){
            let $projectDiv = createHtmlElement('div', {className: 'project'});
            $projectDiv.dataset.id = this.id;
            let $projectTitleDiv = createHtmlElement('div', {className: 'project-title'});
            let $arrowIcon = createHtmlElement('i', {className: 'fa fa-chevron-down'});
            let $projectTitleH1 = createHtmlElement('h1',{text: this.name});
            let $projectTitleButton = createHtmlElement('button',{text: '+'});
            let $projectContentDiv = createHtmlElement('div', {className: 'project-content'});
            let $projectContentTodosDiv = createHtmlElement('div', {className: 'todos'});
            if(this.contentHidden) 
                $projectContentDiv.classList.add('hidden');
            else
                $projectContentDiv.classList.remove('hidden');
            let projectOptionsHtml = `
                <button id="edit-project"><i class="fa fa-edit"></i></button>
                <button id="delete-project"><i class="fa fa-trash"></i></button>
            `;
            let $projectOptionsDiv = createHtmlElement('div', {className: 'project-options'});
            $projectOptionsDiv.innerHTML = projectOptionsHtml;
            $projectContentDiv.appendChild($projectContentTodosDiv);
            $projectContentDiv.appendChild($projectOptionsDiv);
            $arrowIcon.addEventListener('click',(e)=>{
                this.contentHidden = !this.contentHidden;
                projectDisplayer.displayProjects(projectsManager.getProjectList());
                localStorage.setItem('projects',JSON.stringify(projectsManager.getProjectList()));
            });
            $projectTitleButton.addEventListener('click', (e)=>{
                toggleTodoFormWithProject($projectTitleButton.parentElement.querySelector('h1').textContent, this.id);
            });
            let $deleteProjectButton = $projectOptionsDiv.querySelector('#delete-project');
            $deleteProjectButton.addEventListener('click',(e)=>{
                projectsManager.deleteProjectById(this.id);
                localStorage.setItem('projects',JSON.stringify(projectsManager.getProjectList()));
                projectDisplayer.displayProjects(projectsManager.getProjectList());
            });
            let $editProjectButton = $projectOptionsDiv.querySelector('#edit-project');
            $editProjectButton.addEventListener('click', (e)=>{
                projectsManager.getProjectById(this.id).name = prompt('Enter new name for this project');
                localStorage.setItem('projects',JSON.stringify(projectsManager.getProjectList()));
                projectDisplayer.displayProjects(projectsManager.getProjectList());
            });
            $projectTitleDiv.appendChild($arrowIcon);
            $projectTitleDiv.appendChild($projectTitleH1);
            $projectTitleDiv.appendChild($projectTitleButton);
            $projectDiv.appendChild($projectTitleDiv);
            $projectDiv.appendChild($projectContentDiv);
            return $projectDiv;
        }
    };
    return Object.assign(Object.create(proto), {name, id, todos, contentHidden});
}

let projectDisplayer = (function(){
    let displayProjects = function(projects){
        let $projectsContainer = document.querySelector('#projects-container');
        $projectsContainer.innerHTML = '';
        projects.forEach(project => {
            let $project = project.getMarkupElement();
            $projectsContainer.appendChild($project);
            todoDisplayer.displayTodos(project.todos, project.id);
        });
    }
    return {displayProjects};
})();



;// CONCATENATED MODULE: ./src/index.js





function toggleAddNewProjectForm(){
    let $form = document.querySelector('#add-project-form');
    if($form.style.display == 'block'){
        $form.style.display = 'none';
    }else{
        $form.style.display = 'block';
    }
}

function getNextId(){
    return projectsManager.getProjectList().reduce((obj, current)=>{
        if(current.id > obj)
            return current.id;
    }, 0) + 1;
}

const $addProjectButton = document.querySelector('#add-project');
$addProjectButton.addEventListener('click', (e)=>{
    e.preventDefault();
    toggleAddNewProjectForm();
});

const $addProjectFormButton = document.querySelector('#add-project-form');
$addProjectFormButton.addEventListener('submit', (e)=>{
    e.preventDefault();
    toggleAddNewProjectForm();
    let name = $addProjectFormButton.parentElement.querySelector('#name').value;
    $addProjectFormButton.parentElement.querySelector('#name').value = '';
    let proj = project(name, getNextId(), [], true);
    projectsManager.addProject(proj);
    localStorage.setItem('projects',JSON.stringify(projectsManager.getProjectList()));
    projectDisplayer.displayProjects(projectsManager.getProjectList());
});

let $closeTodoFormButton = document.querySelector('#close-todo-form');
$closeTodoFormButton.addEventListener('click', (e)=>{
    let $createTodoFormDiv = document.querySelector('.add-todo-form');
    hideElement($createTodoFormDiv);
});

let $addTodoForm = document.querySelector('#add-todo-form');
$addTodoForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    let task = $addTodoForm.querySelector('#task').value;
    let priority = $addTodoForm.querySelector('#priority').value;
    let description = $addTodoForm.querySelector('#description').value;
    let id = $addTodoForm.dataset.projectId;
    projectsManager.getProjectById(id).addTodo(todo(task, priority, description, false));
    localStorage.setItem('projects',JSON.stringify(projectsManager.getProjectList()));
    projectDisplayer.displayProjects(projectsManager.getProjectList());
    hideElement($addTodoForm.parentElement);
    $addTodoForm.querySelector('#task').value = '';
    $addTodoForm.querySelector('#description').value = '';
});

let $closeDescriptionButton = document.querySelector('#close-description');
$closeDescriptionButton.addEventListener('click', (e)=>{
    let $description = document.querySelector('#todo-description').parentElement;
    console.log('asaj');
    hideElement($description);
});

projectDisplayer.displayProjects(projectsManager.getProjectList());

/******/ })()
;