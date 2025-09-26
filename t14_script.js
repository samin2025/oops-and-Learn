const display = document.getElementById('display');
let memory = 0;

// افزودن عدد یا عملگر به نمایشگر
function appendSymbol(symbol) {
    display.value += symbol;
}

// پاک کردن نمایشگر
function clearDisplay() {
    display.value = '';
}

// حذف آخرین کاراکتر
function deleteLast() {
    display.value = display.value.slice(0, -1);
}

// تغییر علامت عدد
function toggleSign() {
    if (display.value) {
        if (display.value.startsWith('-')) {
            display.value = display.value.slice(1);
        } else {
            display.value = '-' + display.value;
        }
    }
}

// محاسبه نتیجه
function calculateResult() {
    try {
        let exp = display.value.replace('÷', '/').replace('×', '*').replace('^', '**').replace('٪', '/100');
        let result = eval(exp);
        display.value = result;
    } catch {
        display.value = ' خطا کردی! ثمین کارت زرد داد.';
        setTimeout(() => display.value = '', 1200);
    }
}

// حافظه: ذخیره
function memoryStore() {
    memory = parseFloat(display.value) || 0;
    alert(`مقدار ${memory} در حافظه ثمین ذخیره شد`);
}

// حافظه: فراخوانی
function memoryRecall() {
    if(memory !== 0){
        display.value += memory;
    } else {
        alert('هیچ مقداری در حافظه ثمین وجود ندارد!');
    }
}

// حافظه: پاک کردن
function memoryClear() {
    memory = 0;
    alert('حافظه ثمین پاک شد');
}