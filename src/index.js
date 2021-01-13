import {project, projectDisplayer} from './project';
import {todo, todoDisplayer} from './todo';
import {hideElement} from './domHelper';
import {projectsManager} from './projectsManager';

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
