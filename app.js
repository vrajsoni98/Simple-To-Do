//Selectors
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const todoItem = document.querySelector('.todo');
const filterOption = document.querySelector('.filter-todo');

//Event Handlers

document.addEventListener('DOMContentLoaded', getLocalTodos);
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheckEdit);
filterOption.addEventListener('click', filterTodo);

//Functions

//creates todo item
function addTodo(event) {
  event.preventDefault();

  //check if the input is not empty
  if (todoInput.value.trim().length > 0) {
    createTodoUI(todoInput.value, true);

    //clearing input
    todoInput.value = '';
  } else {
    //flash code

    const html =
      '<div class="alert alert-danger" role="alert"> There is no input </div>';

    document.querySelector('span').innerHTML = html;
    setTimeout(function () {
      document.querySelector('span').innerHTML = '';
    }, 3000);
  }
}

function createTodoUI(todo, localStorage) {
  //Creating Todo Div tag
  const todoDiv = document.createElement('div');
  todoDiv.classList.add('todo');

  //Creating Todo li and span
  const newTodo = document.createElement('li');
  const newTodoSpan = document.createElement('span');
  newTodoSpan.innerText = todo;
  //newTodo.setAttribute('contenteditable', 'true');
  newTodo.classList.add('todo-item');

  //appending span to li
  newTodo.appendChild(newTodoSpan);

  //appending li to div
  todoDiv.appendChild(newTodo);

  if (localStorage) {
    //Save to local storage
    saveLocalTodos(todoInput.value);
  }

  //Adding Check/Mark Button
  const completeButton = document.createElement('buton');
  completeButton.innerHTML = '<i class="fas fa-check"></i>';
  completeButton.classList.add('complete-btn');
  todoDiv.appendChild(completeButton);

  //Adding Trash button
  const trashButton = document.createElement('buton');
  trashButton.innerHTML = '<i class="fas fa-trash"></i>';
  trashButton.classList.add('trash-btn');
  todoDiv.appendChild(trashButton);

  //Appending the whole div to ul
  todoList.appendChild(todoDiv);
}

//Deletes or Check or Edit items
function deleteCheckEdit(event) {
  const item = event.target;
  //as per video instead of using closest he uses CSS
  // .fa-trash, .fa-check{ pointer-events:none; }
  const deleteItem = item.closest('.trash-btn');
  const completeItem = item.closest('.complete-btn');
  const todo = item.closest('.todo-item');

  //Delete To-Do
  if (deleteItem) {
    const todoDelete = deleteItem.parentElement;
    //Animation
    todoDelete.classList.add('fall');
    deleteLocalStorage(todoDelete);
    todoDelete.addEventListener('transitionend', function () {
      todoDelete.remove();
    });
  } else if (completeItem) {
    completeItem.parentElement.classList.toggle('completed');
  } else if (todo) {
    const noOfInput = document.querySelectorAll('input').length;

    //if clicked more than one time then avoids making multiple inputs AND if the list is checked then it avoids editing
    if (
      noOfInput === 1 &&
      !todo.parentElement.classList.contains('completed')
    ) {
      const spanValue = todo.firstChild.textContent;
      todo.firstChild.remove();
      //create new input
      const input = document.createElement('input');
      input.setAttribute('type', 'text');
      input.setAttribute('value', spanValue);
      //input.classList.add('todo-item');

      todo.appendChild(input);

      //selecting the active input i.e. the first input inside any li
      //i had no other way of selecting this
      const activeInput = document.querySelector('li>input');

      activeInput.focus();
      moveCursorToEnd(activeInput);

      todo.firstChild.addEventListener('blur', function () {
        const inputValue = input.value;
        input.remove();
        const span = document.createElement('span');
        span.textContent = inputValue;
        todo.appendChild(span);
        updateLocalTodo(todo, inputValue);
      });
    }
  } else {
    return;
  }
}

//drag and drop

//moving cursor to end of the element
//copied from net
function moveCursorToEnd(el) {
  if (typeof el.selectionStart == 'number') {
    el.selectionStart = el.selectionEnd = el.value.length;
  } else if (typeof el.createTextRange != 'undefined') {
    el.focus();
    var range = el.createTextRange();
    range.collapse(false);
    range.select();
  }
}

//Filters todo list
//not sure if event delegation would work here or not
function filterTodo(e) {
  const todos = todoList.children;
  // console.log(todos);
  [...todos].forEach(function (todo) {
    switch (e.target.value) {
      case 'all':
        todo.style.display = 'flex';
        break;

      case 'completed':
        if (todo.classList.contains('completed')) {
          todo.style.display = 'flex';
        } else {
          todo.style.display = 'none';
        }
        break;

      case 'uncompleted':
        if (!todo.classList.contains('completed')) {
          todo.style.display = 'flex';
        } else {
          todo.style.display = 'none';
        }
        break;
    }
  });
}

function saveLocalTodos(todo) {
  //Check if we already have a thing in there
  let todos = checkLocalTodo();
  //if we have a new todo-item then push it back into todo array
  todos.push(todo);
  //todos.push([todo,false])
  //stores into storage
  localStorage.setItem('todos', JSON.stringify(todos));
}

//gets todos from local storage
function getLocalTodos() {
  let todos = checkLocalTodo();

  todos.forEach(function (todo) {
    createTodoUI(todo, false);
  });
}

function deleteLocalStorage(todo) {
  let todos = checkLocalTodo();

  const todoText = todo.children[0].innerText;
  todos.splice(todos.indexOf(todoText), 1);
  localStorage.setItem('todos', JSON.stringify(todos));
}

function updateLocalTodo(todo, updatedValue) {
  let todos = checkLocalTodo();

  const todoText = todo.children[0].innerText;
  const todoIndex = todos.indexOf(todoText);

  todos.splice(todoIndex, 1, updatedValue);
  localStorage.setItem('todos', JSON.stringify(todos));
}

function completeLocalTodo() {}

//Check if a todo list already exists in local storage or not
//if it exists then retrieve it else createa a new blank one
function checkLocalTodo() {
  let todos;
  if (localStorage.getItem('todos') === null) {
    //if we dont have then create an empty array
    todos = [];
  } else {
    //if we have then converts it into array
    //retrives actual todos from local storage
    todos = JSON.parse(localStorage.getItem('todos'));
  }
  return todos;
}
