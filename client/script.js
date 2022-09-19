window.onload = function () {
    let $form, $btnEdit, $btnSave, $btnNewTodo, $formGroup;


    const init = (() => {
        getTodoList();

        $form = document.querySelector('#todoForm');
        $formGroup = ['todoReference', 'todoDescription', 'todoTitle', 'id'];

        $btnEdit = document.querySelector('#btnEdit');
        $btnSave = document.querySelector('#btnSave');
        $btnNewTodo = document.querySelector('#btnNewTodo');

    })();

    const todolist = [
        {
            todoReference: 'reference1',
            todoTitle: 'title1',
            todoDescription: 'description1',
            todoDatetimestamp: '2022-01-26T19:40',
            id: 7436782
        },
        {
            todoReference: 'reference2',
            todoTitle: 'title2',
            todoDescription: 'description2',
            todoDatetimestamp: '2022-01-26T19:40',
            id: 7436222
        },
        {
            todoReference: 'reference3',
            todoTitle: 'title3',
            todoDescription: 'description3',
            todoDatetimestamp: '2022-01-26T19:40',
            id: 7436734
        }
    ];

    async function getTodoList() {
        const raw = await fetch('https://pokeapi.co/api/v2/pokemon/ditto', {
            method: 'GET'
        });
        const result = await raw.json();

        arrangeTableData();
    }

    function btnFn(type, id) {
        switch (type) {
            case 'Delete':
                deleteTodo(id);
                break;
            case 'View':
                viewTodo(id);
                break;
        }
    }

    function viewTodo(id) {
        const retrievedData = todolist.find(data => {
            return data.id === id;
        });

        $btnSave.setAttribute('hidden', true);
        $btnEdit.removeAttribute('hidden');
        $btnNewTodo.removeAttribute('hidden');

        $btnNewTodo.innerHTML = 'BACK';

        setFormTitle('VIEW');
        populate(retrievedData);
    }

    function deleteTodo(id) {
        const i = todolist.findIndex(todo => {
            return todo.id === id;
        });
        todolist.splice(i, 1);

        document.getElementById(id).remove();
    }

    function populate(data) {
        const objects = Object.entries(data);

        for ([key, value] of objects) {
            const input = document.getElementById(key);
            if (key != 'todoDatetimestamp') {
                input.value = value;
            }

        }

        disabledInputs();
    }

    function disabledInputs() {
        $formGroup.forEach(key => {
            const input = document.getElementById(key);
            input.setAttribute('disabled', true);
        });
    }

    function enabledInputs() {
        $formGroup.forEach(key => {
            const input = document.getElementById(key);
            input.removeAttribute('disabled')
        });
    }

    function clearInputs() {
        $formGroup.forEach(key => {
            const input = document.getElementById(key);
            input.value = '';
        });
    }

    function setFormTitle(name) {
        const title = document.getElementById('formTitle');
        title.innerHTML = name;
    }

    function arrangeTableData() {

        todolist.forEach(todo => {
            const keyvaluepair = Object.entries(todo);
            const tr = document.createElement('tr');
            tr.id = todo.id;

            for (const [key, value] of keyvaluepair) {
                const td = document.createElement('td');

                if (key == 'id') {
                    const buttons = ['Delete', 'View'];

                    buttons.forEach(name => {
                        const btn = document.createElement('button');

                        btn.innerHTML = name;
                        btn.className = 'button';
                        btn.onclick = () => btnFn(name, value);

                        td.append(btn);
                    })

                } else {
                    td.innerHTML = value;
                }

                tr.append(td);
            }

            document.getElementById('todo-list').appendChild(tr);
        });
    }

    function errorChecker(exempted) {
        let result = false;

        $formGroup.forEach(idName => {
            const input = document.getElementById(idName);
            const value = input.value;
            const small = document.createElement('small');
            input.style.borderColor = 'black';

            if (!exempted.includes(idName) && !value) {
                result = true;

                input.style.borderColor = 'red';

                small.style.color = 'red'
                small.innerHTML = 'This is required field.';
                input.after(small);
            }
        });

        return result;
    }

    $form.addEventListener('submit', (e) => {
        e.preventDefault();
        const error = errorChecker(['id']);

        if (!error) {
            const fd = new FormData($form);
        }

    });

    $btnEdit.addEventListener('click', (e) => {
        $btnEdit.setAttribute('hidden', true);
        $btnSave.removeAttribute('hidden');
        $btnNewTodo.innerHTML = 'CANCEL';

        enabledInputs();
        setFormTitle('EDIT');
    });

    $btnNewTodo.addEventListener('click', (e) => {
        $btnEdit.setAttribute('hidden', true);
        $btnNewTodo.setAttribute('hidden', true);
        $btnSave.removeAttribute('hidden');

        enabledInputs();
        clearInputs();
        setFormTitle('ADD');
    });
}