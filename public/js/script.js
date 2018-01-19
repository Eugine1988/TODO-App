 // GLOBAL VARIABLES
let navbar = document.getElementById('navbar');
let heading = document.getElementById('heading');
let items = document.getElementById('items');
let data;


// Window onload
window.onload = () => {
    document.getElementById('frmSave').addEventListener('submit', saveData);
    useAJAX('GET', '/data', 'text/json', null, (res) => {
        data = JSON.parse(res); // Save data in global variable
        loadNavbar();   // Load Nav-Bar
        getContent(1);  // Load Page Content
    });
};

//  Before Closing the Window
window.onbeforeunload = () => {
    // Send msg to sevrer indicating window closed
    useAJAX('POST', 'http://localhost:3000/msg', 'text/plain', 'exit', () => { });
};


// Load the Nav-Bar Content
let loadNavbar = () => {
    let content = `<li><a href="javascript: getContent(0)">TODO App</a></li>`;

    for (let i = 1; i < data[0].items.length; i++)
        content += `<li><a href="javascript: getContent(${i})">${data[0].items[i].name}</a></li>`;

    navbar.innerHTML = content;
};


// Load items for a specified page
let getContent = (id) => {
    // Change page heading
    heading.innerText = data[0].items[id].name;

    // Change list of content items
    let content = `<dl id="items">`;
    let i = 0;
    if(id == 0) i = 1;
    for (; i < data[id].items.length; i++) {
        content += `
                <dt><b>${data[id].items[i].name}</b></dt>
                <dd>
                    <button onclick="btnOnClick(${id}, ${i}, 'up')">up</button>
                    <button onclick="btnOnClick(${id}, ${i}, 'down')">down</button>
                    <button onclick="btnOnClick(${id}, ${i}, 'delete')">remove</button>
                </dd>
                <br>
            `;
    }

    content += `
        <dt>
            <input type="text" id="inputAdd" tabindex="1">
            <button id="btnAdd" onclick="btnOnClick(${id}, 0, 'add')" tabindex="2">Add</button>
        </dt>
        </dl>
    `;
    
    items.innerHTML = content;
};

// onclick for buttons: 'up', 'down', 'delete', 'add'
let btnOnClick = (category, element, btn) => {

    // Try move element in content up
    if(btn === 'up' && element > 0) {
        // If this is the "Category" page
        if(category === 0) {
            if(element > 1) {
                // Swap elements in category 0
                swapElements(data[category].items, element, element - 1);
                // Swap pages of lists of elements
                swapElements(data, element, element - 1);
            }
        } else {
            swapElements(data[category].items, element, element - 1);
        }
    
    } else if(btn === 'down' && element < data[category].items.length - 1) {
        if(category === 0) {
            swapElements(data[category].items, element, element + 1);
            swapElements(data, element, element + 1);
        } else {
            swapElements(data[category].items, element, element + 1);
        }
    
    } else if(btn === 'delete') {
        data[category].items.splice(element, 1);
        if(category === 0) {
            data.splice(element, 1);
        }
    
    } else if(btn === 'add') {
        let input = document.getElementById('inputAdd').value;
        data[category].items.push({ name: input });
        if(category === 0) {
            data.push({ items: [] });
        }
    }

    getContent(category);
    if(category === 0) { loadNavbar(); }
};

// Send data to sevrer and save it
let saveData = (e) => {
    // Prevent form from reloading the page
    e.preventDefault();

    useAJAX('POST', 'http://localhost:3000/data', 'text/json', data, (res) => {
        console.log(`${res}`);
    });
};


// Use AJAX to send or recieve (JSON or Plain Text) data from server
let useAJAX = (method, url, type, postData, callback) => {
    var xhr = new XMLHttpRequest();

    xhr.open(method, url, true);
    if(method === 'POST') {
        xhr.setRequestHeader('Content-Type', type);
    }

    xhr.onload = () => {
        callback(xhr.responseText);
    };

    xhr.onerror = () => {
        callback("Error using AJAX");
    };

    if(method === 'POST') {
        if(type === 'text/plain')
            xhr.send(postData);
        else if(type === 'text/json')
            xhr.send(JSON.stringify(postData, null, 4));
        else
            callback('Unckown Content-Type');
    } else {
        xhr.send();
    }
};

// Takes any array and exchanges it's i & j elements
let swapElements = (array, i, j) => {
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
    return array;
};