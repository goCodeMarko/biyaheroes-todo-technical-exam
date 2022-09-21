window.onload = function () {
    let $todolist, $form, $btnEdit, $btnSave, $btnNewTodo, $formControls, $tableHeaders, $buttons, $btnClear, $base;


    const init = (() => {
        getTodoListAPI();

        $form           = document.querySelector('#todoForm');
        $formControls   = [
                            { id: 'todoReference',   check: ['required', 'unique'] }, 
                            { id: 'todoTitle',       check: ['required', 'unique'] }, 
                            { id: 'todoDescription', check: ['required'] },
                            { id: 'isoDate',         check: [] },
                            { id: '_id',             check: [] }
                        ];
        $tableHeaders   = ['todoReference', 'todoTitle', 'todoDatetimestamp', '_id'];
        $buttons        = ['Delete', 'View']; 
        $btnEdit        = document.querySelector('#btnEdit');
        $btnSave        = document.querySelector('#btnSave');
        $btnNewTodo     = document.querySelector('#btnNewTodo');
        $btnClear       = document.querySelector('#btnClear');
        $base = 'https://biyaheroes-todo-technical-exam.herokuapp.com/api/';
    })();

    async function getTodoListAPI() {
        const raw = await fetch($base + 'getTodos', {
                        headers: {
                            'Accept': 'application/json'
                        },
                        method: 'GET'
                    });
        const result = await raw.json();


        if (result.success) {
            const formattedResult = result.data.results.map(todo => {
                todo.isoDate = formatDate(todo.todoDatetimestamp, 'ISO');
                todo.todoDatetimestamp = formatDate(todo.todoDatetimestamp, 'MM/DD/YYYY HH:mm');

                return todo
            })
            $todolist = formattedResult;
            console.log($todolist);
            if ($todolist.length <= 1) {
                btnDeleteAll('hide');
            } else {
                btnDeleteAll('show');
            }

            arrangeTableData();
        }
    }

    function formatDate(date, format){
        let dateString = date.toString();
        let newDate = {
            month: dateString.slice(4, 6),
            year: dateString.slice(0, 4),
            day: dateString.slice(6, 8),
            hour: dateString.slice(8, 10),
            minute: dateString.slice(10, 12),
            second: dateString.slice(12, 14),
        }
        let result;

        switch (format) {
            case 'MM/DD/YYYY HH:mm':
                result = `${newDate.month}/${newDate.day}/${newDate.year} ${newDate.hour}:${newDate.minute}`;

                break;
            case 'ISO':
                result = `${newDate.year}-${newDate.month}-${newDate.day}T${newDate.hour}:${newDate.minute}`;

                break;
            default:
                break;
        }

        return result;
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
        clearInputs();

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

            $btnEdit.setAttribute('hidden', true);
            $btnNewTodo.setAttribute('hidden', true);
            $btnSave.removeAttribute('hidden');
            setFormTitle('ADD');
            clearInputs();
            enabledInputs();
            document.getElementById(id).remove();

            if($todolist.length <= 1){
                btnDeleteAll('hide');
            }else {
                btnDeleteAll('show');
            }
        }
    }

    async function deleteTodoAPI(id) {
        const raw = await fetch($base + 'deleteTodo', {
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

    function btnDeleteAll(method) {
        const btn = document.getElementById('btnClear');

        if(method == 'hide') btn.setAttribute('hidden', true);
        else if(method == 'show') btn.removeAttribute('hidden');
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
                        const div = document.createElement('div');
                        div.className = 'button-group';

                        $buttons.forEach(name => {
                            const btn = document.createElement('button'); // creates element "<button>"
                                // sets properties
                            btn.innerHTML = name;
                            btn.className = 'button';
                            btn.onclick = () => btnFn(name, value);

                            div.append(btn);
                            td.append(div); // appends to "<td>"" results into "<td><button>View</button></td>"
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
        const raw = await fetch($base + 'saveTodo', {
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

    async function updateTodo(formData) {
        const raw = await fetch($base + 'updateTodo', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PUT',
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
                const id = document.getElementById('_id').value;
                let exists = input.value ? await checkExists(control.id, input.value, id) : false;
                
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

    async function checkExists(control, value, id) {
        let exists;
            switch (control) {
                case 'todoTitle':
                     exists = await checkTitleExistsAPI(value, id);
                    break;
                case 'todoReference':
                    exists = await checkReferenceExistsAPI(value, id);
                    break;
            }
        return exists;
    }

    async function checkTitleExistsAPI(value, id) {
        const params = { title : value, id};
        const raw = await fetch($base + 'checkTitleExists' + '?' + (new URLSearchParams(params)).toString(), {
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
    async function checkReferenceExistsAPI(value, id) {
        const params = { reference: value, id };
        const raw = await fetch($base + 'checkReferenceExists' + '?' + (new URLSearchParams(params)).toString(), {
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
        const isoDateInput = document.getElementById('dateCreated-container');
        isoDateInput.removeAttribute('hidden');

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

    function enabledInputs(controls = []) {
        $formControls.forEach(control => { //enables the input field depends to the list of form controls array
            if (!controls.includes(control.id)){
                const input = document.getElementById(control.id);
                input.removeAttribute('disabled')
            }
        });
    }

    function clearInputs() {
        const isoDateInput = document.getElementById('dateCreated-container');
        isoDateInput.setAttribute('hidden', true);

        $formControls.forEach(control => { //clears the input field depends to the list of form controls array
            const input = document.getElementById(control.id);
            input.value = '';
            

            if (control.id != '_id' && control.id != 'isoDate') {
                const input = document.getElementById(control.id);
                const small = document.getElementById('errMsg_' + control.id);
                input.style.borderColor = 'black';
                small.innerHTML = '';
            }
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

            if(!form._id){ //means new data
                const result = await saveTodoAPI(form);
                
                if(result.data.results._id){  //pushes to the array when added successfully
                    console.log(result.data.results);
                    result.data.results.isoDate = formatDate(result.data.results.todoDatetimestamp, 'ISO');
                    result.data.results.todoDatetimestamp = formatDate(result.data.results.todoDatetimestamp, 'MM/DD/YYYY HH:mm');
                    $todolist.push(result.data.results);

                    if ($todolist.length <= 1) {
                        btnDeleteAll('hide');
                    } else {
                        btnDeleteAll('show');
                    }

                    addTableRow(result.data.results); // adds "<tr>" to the "<table>"
                    clearInputs();
                }
            }else { // means for update
                const result = await updateTodo(form);

                if(result.data.results.modifiedCount >= 1){
                    // updates "<td>" element
                    const tr = document.getElementById(form._id);
                    const td = tr.getElementsByTagName('td')[1];
                    td.innerHTML = form.todoTitle
                    
                    // updates array of object
                    $todolist.forEach((todo, i) => {
                        if(todo._id == form._id){
                            $todolist[i].todoTitle = form.todoTitle;
                            $todolist[i].todoDescription = form.todoDescription;
                        }
                    });

                    enabledInputs();
                    clearInputs();
                }
            }
        }

    });

    $btnEdit.addEventListener('click', (e) => {
        $btnEdit.setAttribute('hidden', true);
        $btnSave.removeAttribute('hidden');
        $btnNewTodo.innerHTML = 'CANCEL';

        enabledInputs(['todoReference', 'isoDate']);
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

    $btnClear.addEventListener('click', async (e) => {
        const result = await deleteAllAPI();
        console.log(result);
        $btnEdit.setAttribute('hidden', true);
        $btnNewTodo.setAttribute('hidden', true);
        $btnSave.removeAttribute('hidden');

        enabledInputs();
        clearInputs();
        setFormTitle('ADD');
    });

    async function deleteAllAPI() {
        const raw = await fetch($base + 'deleteAll', {
            headers: {
                'Accept': 'application/json'
            },
            method: 'POST'
        });
        const result = await raw.json();

        if(result.data.results.deletedCount){
            btnDeleteAll('hide');

            const rows = document.querySelectorAll("#todo-list tr");

            rows.forEach(element => {
                element.remove();
            })
        }
        
    }
}