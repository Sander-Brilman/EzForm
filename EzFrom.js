
const inputSelector = '.sb-form .input';
const buttonTypes = '[type="button"],[type="submit"],[type="reset"]';

const getSiblingBySelector = (element, selector) => {
    return element.parentElement.querySelector(selector);
}

const getAttr = (element, attrName) => element.getAttribute(attrName);

const hasAttr = (element, attrName) => element.hasAttribute(attrName) && getAttr(element) != '';


// parse & optimize html
document.querySelectorAll(inputSelector).forEach(container => {


    let inputs = container.querySelectorAll(`input:not(${buttonTypes}), textarea, select`);

    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        let label = getSiblingBySelector(input, 'label');
        
        if (!hasAttr(input, 'placeholder')) {
            input.setAttribute('placeholder', ' ');
        }

    }




    


})



// password button
document.querySelectorAll(`${inputSelector} .reveal`).forEach(button => {
    button.setAttribute('type', 'button');

    button.onclick = () => {
        let input = getSiblingBySelector(button, 'input');
        input.setAttribute('type', input.getAttribute('type') == 'password' ? 'text' : 'password');
    }
}) 



// textarea
const updateTextarea = textarea => {
    let length = textarea.value.length;
    let max = textarea.getAttribute('maxlength');
    max = max == undefined ? '' : ` / ${max}`;
    
    let span = getSiblingBySelector(textarea, '.count');
    if (span == undefined) { return; }
    span.innerHTML = `${length}${max}`;
}
document.querySelectorAll(`${inputSelector} textarea`).forEach(textarea => {
    let interval = null;

    textarea.onfocus = () => {
        interval = setInterval(() => {
            updateTextarea(textarea);
        }, 300)
    }
    
    textarea.onfocusout = () => { clearInterval(interval); }
    textarea.onblur = () => {  clearInterval(interval);  }
    
    updateTextarea(textarea);
})



// validation
const displayErrorMessages = () => {
    document.querySelectorAll(`${inputSelector} :is(input:not([type="button"], [type="reset"], [type="submit"]), textarea, select)`).forEach(input => {
        if (input.checkValidity()) {
            return;
        }

        let span = document.createElement('span')
        span.setAttribute('role', 'alert');
        span.innerText = input.validationMessage;

        input.parentNode.appendChild(span);
    })
}

document.querySelectorAll('form.sb-form').forEach(form => {



    form.onsubmit = function(e) {
        displayErrorMessages()

        

    }


    form.querySelectorAll(`${inputSelector} :is(button:not([type="button"], [type="reset"]), [type="submit"])`).forEach(button => {
        button.onclick = () => { displayErrorMessages() }
    })
})



    

