window.onload = function () {
    let $todolist, $form, $btnEdit, $btnSave, $btnNewTodo, $formControls, $tableHeaders, $buttons, $formError;


    const init = (() => {
        getTodoListAPI();

        $form           = document.querySelector('#todoForm');
        $formControls   = [
                            { id: 'todoReference',   check: ['required', 'unique'] }, 
                            { id: 'todoTitle',       check: ['required', 'unique'] }, 
                            { id: 'todoDescription', check: ['required'] },
                            { id: 'id',              check: [] }
                        ];
        $tableHeaders   = ['todoReference', 'todoTitle', 'todoDatetimestamp', '_id'];
        $buttons        = ['Delete', 'View']; 
        $btnEdit        = document.querySelector('#btnEdit');
        $btnSave        = document.querySelector('#btnSave');
        $btnNewTodo     = document.querySelector('#btnNewTodo');
    })();

    async function getTodoListAPI() {
        const raw   = await fetch('http://localhost:3000/api/getTodos', {
                        headers: {
                            'Accept': 'application/json'
                        },
                        method: 'GET'
                    });
        const result = await raw.json();

        if (result.success) {
            $todolist = result.data.results;
            arrangeTableData();
        }
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
        const retrievedData = $todolist.find(data => {
            return data._id === id;
        });

        $btnSave.setAttribute('hidden', true);
        $btnEdit.removeAttribute('hidden');
        $btnNewTodo.removeAttribute('hidden');

        $btnNewTodo.innerHTML = 'BACK';

        setFormTitle('VIEW');
        populate(retrievedData);
    }

    async function deleteTodo(id) {
        const result = await deleteTodoAPI(id);

        if(result.data.results.deletedCount){
            const i = $todolist.findIndex(todo => {
                return todo.id === id;
            });
            $todolist.splice(i, 1);

            document.getElementById(id).remove();
        }
    }

    async function deleteTodoAPI(id) {
        const raw    = await fetch('http://localhost:3000/api/deleteTodo', {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        method: 'POST',
                        body: JSON.stringify({ id })
                     });
        const result = await raw.json();

        return result;
    }

    function arrangeTableData() {
        $todolist.forEach(todo => { // loops to all object of an array
            addTableRow(todo);
        });
    }

    function addTableRow(todo) {
        const tr = document.createElement('tr'); //creates element "<tr>"
        tr.id = todo._id;

        $tableHeaders.forEach(tableHeader => {
            const keyvaluepair = Object.entries(todo); // makes key value pair become array from this "{x: 2}" to this "['x', 2]"
            const td = document.createElement('td'); // creates element "<td>"

            for (const [key, value] of keyvaluepair) { // loops on each array
                if (tableHeader == key) {  // filters listed in tableHeader 

                    if (tableHeader == '_id') {

                        $buttons.forEach(name => {
                            const btn = document.createElement('button'); // creates element "<button>"
                                // sets properties
                            btn.innerHTML = name;
                            btn.className = 'button';
                            btn.onclick = () => btnFn(name, value);

                            td.append(btn); // appends to "<td>"" results into "<td><button>View</button></td>"
                        })
                    } else {
                        td.innerHTML = value;
                    }
                }
            }

            tr.append(td); // appends each "<td>" to "<tr>"
        });

        document.getElementById('todo-list').appendChild(tr); // appends each "<tr>" to "#todo-list"
    
    }

    async function saveTodoAPI(formData) {
        const raw = await fetch('http://localhost:3000/api/saveTodo', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(formData)
        });
        const result = await raw.json();

        return result;
    }

    async function errorChecker() {
        let error = false;

        for await (const control of $formControls) {
            const input = document.getElementById(control.id);
            const small = document.getElementById('errMsg_' + control.id);
            const i = $formControls.map(object => object.id).indexOf(control.id);

            if (control.check.includes('required')) { //when form control has required checker
                if (!input.value) {  
                    error = true;
                    input.style.borderColor = 'red';
                    small.innerHTML = 'This is required field.';
                } else {
                    input.style.borderColor = 'black';
                    small.innerHTML = '';
                }
            }
            if (control.check.includes('unique')) { //when form control has unique checker
                let exists = input.value ? await checkExists(control.id, document.getElementById(control.id).value) : false;
                
                if (input.value && exists) {
                    error = true;
                    input.style.borderColor = 'red';
                    small.innerHTML = 'This is already taken.';
                } else if (!error) {
                    input.style.borderColor = 'black';
                    small.innerHTML = '';
                }
            }
        }

        return error; 
    }

    async function checkExists(control, value) {
        let exists;
            switch (control) {
                case 'todoTitle':
                     exists = await checkTitleExistsAPI(value);
                    break;
                case 'todoReference':
                    exists = await checkReferenceExistsAPI(value);
                    break;
            }
        return exists;
    }

    async function checkTitleExistsAPI(value) {
        const params = { title : value };
        const raw = await fetch('http://localhost:3000/api/checkTitleExists' + '?' + (new URLSearchParams(params)).toString(), {
            headers: {
                'Accept': 'application/json'
            },
            method: 'GET'
        });
        const result = await raw.json();

        if (result.success) {
            return result.data.results ? true : false;
        }
    }
    async function checkReferenceExistsAPI(value) {
        const params = { reference: value };
        const raw = await fetch('http://localhost:3000/api/checkReferenceExists' + '?' + (new URLSearchParams(params)).toString(), {
            headers: {
                'Accept': 'application/json'
            },
            method: 'GET'
        });
        const result = await raw.json();

        if (result.success) {
            return result.data.results ? true : false;
        }
    }

    function setFormTitle(name) { // sets the form title
        const title = document.getElementById('formTitle');
        title.innerHTML = name;
    }

    function populate(data) { // populates the forms when viewing
        const objects = Object.entries(data); // converts the props and keys into an array

        for (const [key, value] of objects) { // loops the array
            const input = document.getElementById(key);

            $formControls.forEach(control => {
                if(control.id == key) { //sets the input field depends to the list of form controls array
                    input.value = value;
                }
            })
        }

        disabledInputs();
    }

    function disabledInputs() {
        $formControls.forEach(control => { //disables the input field depends to the list of form controls array
            const input = document.getElementById(control.id);
            input.setAttribute('disabled', true);
        });
    }

    function enabledInputs() {
        $formControls.forEach(control => { //enables the input field depends to the list of form controls array
            const input = document.getElementById(control.id);
            input.removeAttribute('disabled')
        });
    }

    function clearInputs() {
        $formControls.forEach(control => { //clears the input field depends to the list of form controls array
            const input = document.getElementById(control.id);
            input.value = '';
        });
    }

    $form.addEventListener('submit', async (e) => {
        e.preventDefault();

        let error = await errorChecker();
   
        if (!error) {
            let form = {};
            $formControls.forEach(control => {
                form[control.id] =  document.getElementById(control.id).value;
            })

            if(!form.id){ //means new data
                const result = await saveTodoAPI(form);
                
                if(result.data.results._id){  //pushes to the array when added successfully
                    $todolist.push(result.data.results);

                    addTableRow(result.data.results); // adds "<tr>" to the "<table>"
                }
            }else { // means for update

            }
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