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

export {createHtmlElement, hideElement, toggleElement};