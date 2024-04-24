const radioButtons = document.querySelectorAll('input[name="selectType"]');
const textInput = document.querySelector('input#enterVes');

let inputText = 0;
let radioSelect = 'ves';
let cal = 0, bel = 0, zhir = 0, ugl = 0, calculate = {cal:1, bel:1, zhir:1, ugl:1};


const handleInputChange = ({type,value}) => {
    if(type==='text') {
        inputText = Number(value); 
    } else if(type==="radio") {
        radioSelect = value;
    }

    if(inputText===0) {
        return;
    }

    switch(radioSelect) {
        case "ves": calculate = {cal:30, bel:1.5, zhir:1, ugl:3}; break;
        case "massa": calculate = {cal:40, bel:2, zhir:1, ugl:5}; break;
        case "fat": calculate = {cal:24, bel:2.5, zhir:0.5, ugl:1.5}; break;
        default: calculate = calculate;
    }

    cal = inputText * calculate.cal;
    bel = inputText * calculate.bel;
    zhir = inputText * calculate.zhir;
    ugl = inputText * calculate.ugl;

    document.querySelector('span#cal').innerText = cal;
    document.querySelector('span#bel').innerText = bel;
    document.querySelector('span#zhir').innerText = zhir;
    document.querySelector('span#ugl').innerText = ugl;

    // console.log({cal, bel, zhir, ugl});
}

textInput.addEventListener('input', (e)=>{
    handleInputChange({type:'text',value:e.target.value});
});
radioButtons.forEach((radioButton)=> {
    radioButton.addEventListener('change', (e) => {
        // Получаем значение выбранной радиокнопки
        handleInputChange({type:'radio',value:e.target.value});
    });
});

function loadJSON(filePath) {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open('GET', filePath, false);
    xhr.send(null);
    if (xhr.status === 200) {
        return JSON.parse(xhr.responseText);
    } else {
        throw new Error('Ошибка загрузки JSON файла');
    }
}

var jsonData = loadJSON('list.json');
jsonData.forEach((json,key)=>document.querySelector('tbody#showList').insertAdjacentHTML("afterbegin",`
    <tr>
        <td>${json.title}</td>
        <td>
            <div class="form-check">
                <input type="radio" name="selectArgument" class="form-check-input" id="list_${key}" value="${key}" checked>
                <label class="form-check-label" for="list_${key}">Выбрать</label>
            </div>
        </td>
    </tr>
`));

let selectList = [];

let calEnter = 0, belEnter = 0, zhirEnter = 0, uglEnter = 0;

function mergeObjects(arr) {
    const mergedObject = {};
    arr.forEach(obj => {
        Object.keys(obj).forEach(key => {
            if (typeof obj[key] !== 'string') {
                mergedObject[key] = (mergedObject[key] || 0) + obj[key];
            }
        });
    });
    return mergedObject;
}

function updateValueByIndex(arr, indexToFind, multiplier) {
    return arr.map((obj, index) => {
        if (index === indexToFind) {
            const updatedObj = {};
            for (const key in obj) {
                if (typeof obj[key] === 'number') {
                    // Всегда обновляем значение, даже если multiplier остается одинаковым
                    updatedObj[key] = obj[key] * multiplier;
                } else {
                    updatedObj[key] = obj[key];
                }
            }
            return updatedObj;
        } else {
            return obj;
        }
    });
}





let newSelectList;


document.querySelector('button#selectValue').addEventListener('click', () => {
    // Находим все радиокнопки с именем 'selectArgument'
    const radioButtons = document.querySelectorAll('input[name="selectArgument"]:checked');

    // Проверяем, что была выбрана хотя бы одна радиокнопка
    if (radioButtons.length > 0) {
        // Получаем значение выбранной радиокнопки
        const selectedValue = radioButtons[0].value;

        // Извлекаем соответствующие данные из jsonData
        const selectedData = jsonData[selectedValue];

        // Теперь у вас есть выбранные данные, которые можно использовать
        selectList.push(selectedData);
        const time = new Date().getTime();
        // console.log(selectedData);
        
        document.querySelector("tbody#displayList").insertAdjacentHTML("afterbegin",`
            <tr data-deleteTo="${time}">
                <td class="col-6">${selectedData.title}</td>
                <td class="col-4">
                    <div>
                        <input type="number" data-control="select" data-object='${JSON.stringify(selectedData)}' data-result='${JSON.stringify(selectedData)}' class="form-control bg-light" placeholder="Укажите грамм" name="enterGramm" value="1">
                    </div>
                </td>
                <td class="col-2">
                    <button type="button" data-del="start" data-delete="${time}" class="btn btn-danger">Удалить</button>
                </td>
            </tr>
        `);
        dataControl();
        dataUpdate();
        dataDelete();

    } else {
        // Если радиокнопка не была выбрана, вы можете обработать эту ситуацию здесь
        console.log('Не выбрана радиокнопка');
    }
});

function multiplyValues(obj, n) {
    for (let key in obj) {
        if (key !== 'title' && typeof obj[key] === 'number') {
            obj[key] *= n;
        }
    }
}

function dataDelete() {
    document.querySelectorAll("button[data-del]").forEach(del=>{
        del.addEventListener("click",(event)=>{
            console.log("clicked");
            const deleteData = event.target.getAttribute("data-delete");
            const dataDeleteTo = document.querySelector(`[data-deleteTo="${deleteData}"]`);
            if(dataDeleteTo) {
                dataDeleteTo.innerHTML = "";
                dataUpdate();
            }
        });
    })
}

function dataControl() {
    document.querySelectorAll("input[data-control]").forEach((control)=>{
        control.addEventListener("input",(event)=>{
            const objectData = JSON.parse(event.target.getAttribute("data-object"));
            const valueData = Number(event.target.value); // Преобразование в число, т.к. input.value всегда строка
            multiplyValues(objectData, valueData);
            event.target.setAttribute("data-result", JSON.stringify(objectData));
            dataUpdate();
        });
    });
}

function dataUpdate() {
    const result = {"A":0,
    "D":0,
    "E":0,
    "K":0,
    "C":0,
    "B1":0,
    "B2":0,
    "B3":0,
    "B5":0,
    "B6":0,
    "B9":0,
    "B12":0,
    "Ca":0,
    "Mg":0,
    "Ka":0,
    "Fe":0,
    "I":0,
    "Zn":0,
    "Se":0,
    "Cu":0,
    "Cr":0,
    "F":0,
    "cal":0,
    "bel":0,
    "zhir":0,
    "ugl":0}; // Объект для хранения итоговых данных
    document.querySelectorAll("input[data-control]").forEach(control => {
        const dataResult = JSON.parse(control.getAttribute("data-result"));
        for (const key in dataResult) {
            if (key !== 'title') { // Игнорируем свойство 'title'
                if (!(key in result)) {
                    result[key] = 0; // Инициализируем ключ, если его еще нет в итоговом объекте
                }
                result[key] += dataResult[key]; // Суммируем значения
            }
        }
    });
    for (const key in result) {
        const element = document.getElementById(key + "_Enter");
        if (element) {
            let roundedValue;
            if (Number.isInteger(result[key])) {
                roundedValue = result[key]; // Оставить целые числа без изменений
            } else {
                roundedValue = parseFloat(result[key]).toFixed(1); // Округлить десятичные числа до двух знаков после запятой
            }
            element.innerText = roundedValue;
        }
    }
    // console.log(result);
}
