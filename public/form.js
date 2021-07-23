const form = document.getElementById('form');
const operationName = document.getElementById('operationName');
const extractorMinSpeed = document.getElementById('extractorMinSpeed');
const extractorMaxSpeed = document.getElementById('extractorMaxSpeed');
const targetTemp = document.getElementById('targetTemp');
const heatSources = document.getElementById('heatSources');
const targetHumi = document.getElementById('targetHumi');
const durationActive = document.getElementById('durationActive');
const durationTime = document.getElementById('durationTime');
let allFormItems = document.querySelectorAll('.form-item-wrapper')

var opeArray = [];
opeArray = operationsArray

form.addEventListener('submit', e => {
    e.preventDefault();
});
    operationName.addEventListener('blur', ()=>{
        let nameRegex = /[-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/gi;
        let spaceRegex = /\s/gi
        let operationNameValue = operationName.value.trim();
        if (operationNameValue === '') {
            setErrorFor(operationName, 'Operation Name cannot be blank');
        }
        else if(isFinite(operationNameValue)){
            setErrorFor(operationName, 'Operation Name cannot be Numbers. Alphabets only');
        }
        else if(operationNameValue.match(nameRegex)){
            setErrorFor(operationName, 'Operation Name cannot contain special characters');
        }
        else if(operationNameValue.match(spaceRegex)){
            setErrorFor(operationName, 'Operation Name cannot spaces. Use a single word');
        }
        else {
            let operationExist = false;
            let newOpeArray = JSON.parse(opeArray)
    
            newOpeArray.forEach(operation => {
                if(operation.operationName === operationNameValue){
                    operationExist = true;
                }
            });
            
            if (operationExist){
                setErrorFor(operationName, 'Operation Name already exist. Chose another');
            }
            else{
                setSuccessFor(operationName);
            }
        }
    })

    extractorMinSpeed.addEventListener('blur', ()=>{
        let extractorMinSpeedValue = Number(extractorMinSpeed.value.trim());
        let extractorMaxSpeedValue = Number(extractorMaxSpeed.value.trim());
    
        if (isNaN(extractorMinSpeedValue)) {
            setErrorFor(extractorMinSpeed, 'Extractor fan Speed value must be a number');
        } else if ((extractorMinSpeedValue < 0 || extractorMinSpeedValue > 3000) || (extractorMaxSpeedValue < extractorMinSpeedValue)) {
            setErrorFor(extractorMinSpeed, 'Extractor Speed Minimum value must be in the range of 0 to 3000 rpm');
        }
        else {
            setSuccessFor(extractorMinSpeed);
        }
    })

    extractorMaxSpeed.addEventListener('blur', ()=>{
        let extractorMaxSpeedValue = Number(extractorMaxSpeed.value.trim());
        let extractorMinSpeedValue = Number(extractorMinSpeed.value.trim());
    
         if (isNaN(extractorMaxSpeedValue)) {
            setErrorFor(extractorMaxSpeed, 'Extractor Fan Speed Maximum value must be a number');
        } else if((extractorMaxSpeedValue < 0 || extractorMaxSpeedValue > 3000) || (extractorMaxSpeedValue < extractorMinSpeedValue)) {
            setErrorFor(extractorMaxSpeed, 'Extractor Motor Speed Maxi value must be in the range of 0 to 3000rpm and must be more than Extractor Motor Speed Minimum speed value');
        }
    
        else {
            setSuccessFor(extractorMaxSpeed);
            setSuccessFor(extractorMinSpeed);
        }
    })

    targetHumi.addEventListener('blur', ()=>{
        let targetHumiValue = Number(targetHumi.value.trim());
        if (isNaN(targetHumiValue)) {
            setErrorFor(targetHumi, 'Target humidity value must be a number');
        } else if (targetHumiValue < 1 || targetHumiValue > 100) {
            setErrorFor(targetHumi, 'Target Humidity value must  be a number in the range of 1 to 100 %');
        }
        else {
            setSuccessFor(targetHumi);
        }
    })
     
    durationActive.addEventListener('change', ()=>{
        if (durationActive.value === 'select') {
            setErrorFor(durationActive, 'Please select a valid option to activate the duration time');
        }else if (durationActive.value === 'true'){
            setSuccessFor(durationActive);
            durationTime.disabled = false;
        }
        else{
            setSuccessFor(durationActive);
            durationTime.value = ''
            setSuccessFor(durationTime); 
            durationTime.value = 0;     
            durationTime.addClassList('disabled'); 
        }
    })

    durationTime.addEventListener('blur', ()=>{
        let durationTimeValue = Number(durationTime.value.trim());
        if (isNaN(durationTimeValue)) {
            setErrorFor(durationTime, 'Drying duration time must be a number');
        } else if (durationTimeValue < 1 || durationTimeValue > 1440) {
            setErrorFor(durationTime, 'Duration time Value must be a number in the range of 0 to 1440 minutes');
        }
        else {
            setSuccessFor(durationTime);
        }
    })
 
    targetTemp.addEventListener('blur', ()=>{
        let targetTempValue = Number(targetTemp.value.trim());
        if (isNaN(targetTempValue)) {
            setErrorFor(targetTemp, 'Oven Temperature target value must be a number');
        } else if (targetTempValue < 34 || targetTempValue > 100) {
            setErrorFor(targetTemp, 'Oven Target Value must be a number in the range of 34 to 100 degree celcius');
        }
        else {
            setSuccessFor(targetTemp);
        }
    })
     
    heatSources.addEventListener('change', ()=>{
        if (heatSources.value === 'select') {
            setErrorFor(heatSources, 'Please select a valid option');
        }else {
            setSuccessFor(heatSources);
        }
    })  

function setErrorFor(input, message) {
    let errorSpan = document.createElement('span')

    let formControl = input.parentElement;
    let checkSpan = formControl.querySelector('span')
    if(checkSpan){
        checkSpan.innerText = message;
        submitButton.classList.add('disabled');
    }
    else{
        errorSpan.innerText = message;
        formControl.appendChild(errorSpan)
        submitButton.classList.add('disabled');
    }
}

function setSuccessFor(input) {

    let formControl = input.parentElement;

    let span = formControl.querySelector('span');
        if(span){
            span.remove();
            submitButton.classList.remove('disabled');
            submitButton.classList.add('enabled');
        }
        else{
            submitButton.classList.remove('disabled');
            submitButton.classList.add('enabled');
        }
        
}
let checkInputs=()=>{
    let status;
    let allInputs = document.querySelectorAll('input')

    for(let x=0; x < allInputs.length; x++){
        if([...allInputs][x].value === ''){
            formStatus = false;
            alert('Kindly fill all the form inputs');
            status = false;
            break;
        }
    }
    if(status === false){
        return false;
    }
    else{
        return true;
    }
}

let checkSelectInputs=()=>{
    let status;
    let selectInput = document.querySelectorAll('select');
        for(let x=0; x < selectInput.length; x++){
            if([...selectInput][x].value === 'select'){
                alert('Kindly make a valid selection');
                status = false;
                break;
            }
        }
    if(status === false){
        return false;
    }
    else{
        return true;
    }
}

submitButton.addEventListener('click', ()=>{    

    if(checkSelectInputs() === false){
        submitButton.classList.add('disabled')
    }
    else if(checkInputs() === false){
        submitButton.classList.add('disabled')
    }
    else{
        form.submit();
    }
})


let listGroup = document.querySelector('.list-group');

let createConfigListItems=(()=>{
   
    let opeArray =  JSON.parse(operationsArray) 
    console.log("List of operation", opeArray);

    if(opeArray.length === 0){
        console.log('do nothing')
    }
    else{
         opeArray.map((operation)=>{ 
         
    let configListItem = document.createElement('li')
            configListItem.classList = 'list-group-item d-flex justify-content-between align-items-center'
        let configItemSpan = document.createElement('span')
            configItemSpan.innerText = operation.operationName;

        let buttonsDiv = document.createElement('div');
            buttonsDiv.classList = 'flex-row edit-delete-div';
        
        let editForm = document.createElement('form')
            editForm.setAttribute('action', `/editOperation/${operation.operationName}`)
        
        let editButton = document.createElement('button')
            editButton.id = 'editOperation'
            editButton.setAttribute('type', 'submit')
            editButton.classList = 'btn btn-xs btn-info';
            editButton.innerText = 'Edit'

            editForm.appendChild(editButton)

        let submitForm = document.createElement('form')
            submitForm.setAttribute('action', `/deleteoperation/${operation.operationName}?_method=DELETE`)
            submitForm.setAttribute('onsubmit', "return confirm('Are you sure you want to DELETE this configuration?');")
            submitForm.classList = 'delete-form';
            submitForm.setAttribute('method', 'POST')
        
        let deleteButton = document.createElement('button')
            deleteButton.id = 'deleteOperation'
            deleteButton.classList = 'btn btn-xs btn-danger';
            deleteButton.innerText = 'Delete'

            submitForm.appendChild(deleteButton)

            buttonsDiv.appendChild(editForm)
            buttonsDiv.appendChild(submitForm)
        
        configListItem.appendChild(configItemSpan)
        configListItem.appendChild(buttonsDiv)
        listGroup.appendChild(configListItem)

         }) 
        }
    
})()















