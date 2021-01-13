import {createHtmlElement} from './domHelper';
import { projectDisplayer } from './project';
import {projectsManager} from './projectsManager';

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
export {todo, todoDisplayer};

