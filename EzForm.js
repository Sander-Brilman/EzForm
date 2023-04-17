

// replace common operations with a custom function to save space when compressing

let getSiblingBySelector = (element, selector) => element.parentElement.querySelector(selector);

let getAttr   = (element, attrName) => element.getAttribute(attrName);

let hasAttr   = (element, attrName) => element.hasAttribute(attrName) && getAttr(element, attrName) != '';

let selectAll = (element, selector) => element.querySelectorAll(selector);

let setAttr   = (element, attrName, attrValue) => element.setAttribute(attrName, attrValue);

let createTypeSelector = typeName => `[type=${typeName}]`;

let randomString = () => Math.random().toString(36).substring(2);


// replace common occurring string with a variable to save space when compressing.
let documentElement = document;
let placeholder = 'placeholder';
let type = 'type';
let password = 'password';


// selectors
let parentSelector      = '.sb-form'
let inputSelector       = parentSelector + ` .input`;
let typeButtonSelector  = createTypeSelector('button');
let typeSubmitSelector  = createTypeSelector('submit');
let typeResetSelector   = createTypeSelector('reset');
let buttonTypesSelector = typeButtonSelector + `,${typeSubmitSelector},${typeResetSelector}`;
let textareaSelector    = 'textarea';
let selectSelector      = 'select';
let mainSelector        = `:is(input:not(${buttonTypesSelector}),${textareaSelector},${selectSelector})`;







// parse  html
selectAll(documentElement, inputSelector).forEach(container => {


    let inputs = selectAll(container, mainSelector);


    for (let i = 0; i < inputs.length; i++) {
        let input = inputs[i];
        let label = getSiblingBySelector(input, 'label');

        if (!hasAttr(input, placeholder)) {
            setAttr(input, placeholder, '');
        }

        if (hasAttr(label, 'for')) { continue; }

        let id = hasAttr(input, 'id') ? getAttr(input, 'id') : randomString();

        setAttr(input, 'id', id);
        setAttr(label, 'for', id);
    }


    console.log(' ');

    


})



// password button
selectAll(documentElement, `${inputSelector} .reveal`).forEach(button => {
    setAttr(button, type, 'button')

    button.onclick = e => {
        let input = getSiblingBySelector(button, 'input');
        setAttr(input, type, getAttr(input, type) == password ? 'text' : password)
    }
}) 



// textarea
const updateTextarea = textarea => {
    let length = textarea.value.length;
    let max = getAttr(textarea, 'maxlength');
    max = max == undefined ? '' : ` / ${max}`;
    
    let span = getSiblingBySelector(textarea, '.count');
    if (span == undefined) { return; }
    span.innerHTML = `${length}${max}`;
}

selectAll(documentElement, `${inputSelector} ${textareaSelector}`).forEach(textarea => {
    let interval = null;

    textarea.onfocus = e => {
        interval = setInterval(e => {
            updateTextarea(textarea);
        }, 300)
    }
    
    textarea.onfocusout = e => { clearInterval(interval); }
    textarea.onblur = e => {  clearInterval(interval);  }
    
    updateTextarea(textarea);
})



// validation
const displayErrorMessages = () => {
    selectAll(documentElement, `${inputSelector} ${mainSelector}`).forEach(input => {
        if (input.checkValidity()) {
            return;
        }

        let span = documentElement.createElement('span')
        setAttr(span, 'role', 'alert')
        span.innerText = input.validationMessage;

        input.parentNode.appendChild(span);
    })
}

selectAll(documentElement, `form${parentSelector}`).forEach(form => {



    form.onsubmit = e => {
        displayErrorMessages()

        

    }


    selectAll(form, `${inputSelector} :is(button:not(${typeButtonSelector},${typeResetSelector}),${typeSubmitSelector})`).forEach(button => {
        button.onclick = e => { displayErrorMessages() }
    })
})



    

