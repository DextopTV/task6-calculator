'use strict'// Суворий режим.

// Функція пошуку елемента по id.
const get = id => document.getElementById(id);

// Калькулятор
// Оголошення змінних.
let strResult = '',  // Результат однієї дії.
oper = '',
a,
b,
m = 0,
// Стан значення кнопки'mrc'.
mFlag = false,
// Стан калькулятора On/Of.
onCalculate = false,
strShowResult,   // Загальний результат який бачить користувач.
strShowM = '';   // Результат службового дісплею який бачить користувач.


// Клавіатура калькулятора.
const keys = get("keys");

//Слухач подій "клік" на калькуляторі.  
keys.addEventListener("click", (e) => {
    // Як-що клік на "UL" та "LI" - ігноруємо натиск.
    if(e.target.tagName === "UL" || e.target.tagName === "LI"){
        return;
    }
    // Як-що клік на кнопку передаємо на функцію "Фільтр та перемикач подій".
    else if(eventFilter(e.target)){
        // Якщо перевірка не пройдена - ігноруємо натиск.
        e.preventDefault();
    };
});


// Функція виводу результату на дісплей.
const showDisplay = (result) => { get("show-display").value = result };

// Функції арефметичних дій.
const add = (a, b) => { return a + b };
const multiple = (a, b) => { return a * b };
const mul = (a, b) => {
    if (b == 0) {
        return "Error.";
    }
    else return a / b;
};
const minus = (a, b) => { return a - b };

// Функція валідації данних.
const volidate = (p, v) => p.test(v);

// Регулярні вирази для функції.
//[0-9.]/,  Перевірка на числа.
// /[^mrc]/, Чи натиснута кнопка окрім mrc
// /^\d+\.\d+[1-9]$/,  Перевірка на число після коми 10.012"0".

// Обробник арефмитичних дій.
const operRenewal = (operArg) => {
    // Запис змінної "Операція".
    oper = operArg;
    // Запис значення в змінну "А".
    a = Number(strShowResult);
    // Очищення змінної "strResult".
    strResult = '';
    // Активація кнопки "=".
    get("equal").disabled = false;
};

// Обробник дії "=".
const operRenewalEqual = () => {
    // Запис значення в змінну "В".
    b = Number(strShowResult);
    // Виклик функції "Арефметичної дії".
    strResult = oper(a, b);
    //Вивід результату на основний дісплей
    strShowResult = strResult;
    showDisplay(strShowResult);
    // Очищення змінних.
    b = '';
    oper = '';
    // Блокування кнопки "="
    get("equal").disabled = true;
};

// Функція фільтр та перемикач подій калькулятора.
const eventFilter = (el) => {
    // Вмикає калькулятор
    if(el.value === 'C' && !onCalculate){
        strShowResult = '0';
        showDisplay(strShowResult);
        onCalculate = true;
    }
    // Очищення дісплея
    else if(el.value === 'C'){
        a = '';
        b = '';
        if (strShowM === 'mr') {
            strShowM = 'm';
            get('show-sekond-display').value = strShowM;
        }
        strResult = '';
        strShowResult = '0';
        showDisplay(strShowResult);
        return;
    };

    // Як що калькулятор в стані On
    if(onCalculate){
        if (strShowResult === "Error."){
            strResult = '';
            return;
        };

        // Перемикач 'mr' на 'm'.
        if (volidate(/[^mrc]/,el.value) && strShowM === 'mr') {
            strShowM = 'm';

            get('show-sekond-display').value = strShowM;
        };

        // Перевірка на число до крапки.
        if (el.value === '.' && strResult.length === 0) {
            strResult += '0';
            strResult += el.value;
            strShowResult = strResult
            showDisplay(strShowResult);
            return
        }
        // Перевірка на число до крапки дві крапки в числі.
        else if (el.value === '.' && volidate(/[.]/,strResult)) {
            return;
        }
        // Перевірка на "0" на початку числа.
        else if (el.value === '0' && strResult.length === 0) {
            strShowResult = '0';
            showDisplay(strShowResult);
            return;
        }
        // Перевірка на "0" в кінці числа після коми.
        else if (el.value === '0' && volidate(/^\d+\.\d+[^0]$/,strResult)) {
            return;
        }
        // Як-що все добре дозволити виконувати дії
        else if (volidate(/[0-9.]/,el.value)) {
            strResult += el.value;
            strShowResult = strResult
            showDisplay(strShowResult);
        }

        // Операція "Ділення"
        else if (el.value === '/') {
            // Виклик функції оновлення змінних.
            operRenewal(mul);
        }
         // Операція "Множення"
         else if (el.value === '*') {
            // Виклик функції оновлення змінних.
            operRenewal(multiple);
        }
        // Операція "Мінус"
        else if (el.value === '-') {
             // Виклик функції оновлення змінних.
            operRenewal(minus);
        }
        // Операція "Додавання"
        else if (el.value === '+') {
            // Виклик функції оновлення змінних.
            operRenewal(add);
        }
        // Операція "Дорівнює"
        else if(el.value === '='){
            operRenewalEqual();
            // Очищення змінних.
            strResult = '';
        }
        // Операція "m+".
        else if(el.value === 'm+'){
            // Додає 'm' на службовий дісплей
            strShowM = 'm';
            get('show-sekond-display').value = strShowM;
            //  Як-що перед 'm+'є арефметична дія.
            if(oper !== ''){
                operRenewalEqual();
            }
            // Запис значення в змінну "m".
            m = add(m,Number(strShowResult));
            // Очищення змінних.
            strResult = '';
            //Перемикач значення "m"
            mFlag = true;
        }

        // Операція "m-".
        else if(el.value === 'm-'){
            // Додає 'm' на службовий дісплей.
            strShowM = 'm';
            get('show-sekond-display').value = strShowM;
            //  Як-що перед 'm+'є арефметична дія.
            if(oper !== ''){
                operRenewalEqual();
            }
            // Запис значення в змінну "m".
            m = minus(m,Number(strShowResult));
             // Очищення змінних.
            strResult = '';
            //Перемикач значення "m"
            mFlag = true;;
        }

         // Операція "mrc" перший клік.
        else if(el.value === 'mrc' && strShowM === 'm'){
            // Змінює 'm' на "mrc" на службовому дісплеї.
            strShowM = 'mr';
            get('show-sekond-display').value = strShowM;
           //Вивід значення 'm' на основний дісплей.
            showDisplay(m);
            //Перемикач значення "m"
            mFlag = false;
            // Очищення змінних.
            strResult = '';
            oper = '';
        }
        // Операція "mrc" другий клік.
        else if(el.value === 'mrc' && !mFlag){
             // Вимикає "mrc" на службовому дісплеї.
             strShowM = '';
             get('show-sekond-display').value = strShowM;
             // Очищення змінних.
            m = 0;
            a = '';
            b = '';
            oper = '';
            strResult = '';
            //Вивід значення '0' на основний дісплей.
            strShowResult = '0';
            showDisplay(strShowResult); 
        };
    };
};