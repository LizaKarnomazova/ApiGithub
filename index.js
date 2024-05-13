
const userInput = document.querySelector('input');
let searchList = document.querySelector('.searchForm__list');
let repoList = document.querySelector('.repository__list');

const debounce = (fn, debounceTime) => {
    let timeout;
    return () => {
        clearTimeout(timeout);
        timeout = setTimeout(fn, debounceTime)
    }
};


function getRepo(cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('get', "https://api.github.com/search/repositories?q=Q");

    xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText)
        cb(response);
    });

    xhr.send();
    
}

function createElement(tag, text, className, parent) {
    const child = document.createElement(tag);
    child.textContent = text;
    child.classList.add(className);
    parent.appendChild(child);
    return child;
}

function clearChildren(parent) {
    while (parent.firstChild) {
        parent.firstChild.remove();
    }
}

const debounceFn = () => {
    clearChildren(searchList)
    getRepo(response => {
        response.items.forEach(repo => {
            if (repo.full_name.includes(userInput.value) &&
                userInput.value != false &&
                searchList.childElementCount < 5) {
                const searchItem = createElement('li', repo.full_name, 'searchForm__item', searchList);
                console.log(repo);
                searchItem.addEventListener('click', () => {
                    clearChildren(searchList)
                    userInput.value = '';
                    const repoItem = document.createElement('li');
                    repoItem.classList.add('searchForm');
                    createElement('div', 'Name: ' + repo.full_name, 'repo__text', repoItem);
                    createElement('div', 'Owner: ' + repo.owner.login, 'repo__text', repoItem);
                    createElement('div', 'Stars: ' + repo.watchers, 'repo__text', repoItem);
                    let buttonClose = createElement('button', '', 'repo__button', repoItem);
                    repoList.appendChild(repoItem);
                    buttonClose.addEventListener('click', () => {
                        repoItem.remove();
                    });
                });

            }
        });
    });
}


userInput.addEventListener('input', debounce(debounceFn, 500));
