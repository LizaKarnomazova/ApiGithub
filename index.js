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

function debounceFn() {
    if (!userInput.value) {
        clearChildren(searchList);
        return
    }
    fetch("https://api.github.com/search/repositories?q="+userInput.value.toLowerCase())
        .then(response => {
            return response.json();
        })
        .then(repos => {
            clearChildren(searchList);
            repos.items.forEach(repo => {
                console.log(repo.full_name.includes(userInput.value.toLowerCase()));
                if (repo.full_name.includes(userInput.value.toLowerCase()) &&
                    userInput.value != false &&
                    searchList.childElementCount < 5) {
                    const searchItem = createElement('li', repo.full_name, 'searchForm__item', searchList);
                    console.log(repo);
                    searchItem.addEventListener('click', () => {
                        clearChildren(searchList)
                        userInput.value = '';
                        const repoItem = document.createElement('li');
                        repoItem.classList.add('repository__item');
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
        })
        .catch(err => console.log(err));
}

userInput.addEventListener('input', debounce(debounceFn, 400));