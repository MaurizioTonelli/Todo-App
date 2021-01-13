import {createHtmlElement, toggleElement, toggleElment} from './domHelper';
import {displayTodos, todoDisplayer} from './todo';
import {projectsManager} from './projectsManager';

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

export {project, projectDisplayer};
