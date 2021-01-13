import {project} from './project';
import {todo} from './todo';

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

export {projectsManager};