//選取DOM

var cm = document.querySelector('.height');//選取文字欄位
var kg = document.querySelector('.weight');//選取文字欄位
var showResult = document.querySelector('.show');
var resultBtn = document.getElementById('resultBtn');//選取按鈕id
var list = document.querySelector('.record');//選取UL
var delAllBtn = document.getElementById('delAllBtn');
var dataList = JSON.parse(localStorage.getItem('data')) || [];//設變數-[]儲存輸入的事項

//bmi狀態
var bmiStatus = {
    danger: {
        class: 'danger',
    },
    middanger: {
        class: 'middanger',
    },
    lightendanger: {
        class: 'lightendanger',
    },
    overweight: {
        class: 'overweight',
    },
    normal: {
        class: 'normal',
    },
    underweight: {
        class: 'underweight',
    }
}


//監聽
resultBtn.addEventListener('click', getInfo, false);//綁按鈕點擊
list.addEventListener('click', deletList, false); //綁UL點擊delete
delAllBtn.addEventListener('click', deleteAll, false); 
updateList();




function getInfo(e) {
    e.preventDefault();
    if (cm.value == '' || kg.value == '') {
        alert('請輸入相關資料');//判斷文字欄位是否有輸入數值
        return
    }
    // resultBtn.className += ' active';//增加active狀態，但一點擊會會一直疊加
    resultBtn.classList.toggle('active');//用toggle偵測有沒有active

    //取得日期時間
    var today = new Date();
    var currentDateTime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '(' + today.getHours() + ':' + today.getMinutes() + ')';
    // console.log(currentDateTime);

    //建立物件存放BMI各數值，要push到loalstorage
    var userData = {
        // status: userStatus,
        
        weight: kg.value,
        height: cm.value,
        date: currentDateTime
    }

    // 將 userData 物件 push到 dataList 陣列
    dataList.push(userData);
    // 上傳到 localStorage
    localStorage.setItem('data', JSON.stringify(dataList));
    // 將資料更新至網頁
    updateList();

    // 按鈕狀態切換
    BMIStyle();
}

function updateList() {
    var str = '';
    var len = dataList.length;

    for (var i = 0; i < len; i++) {
        var bmi = BMI(dataList[i]);//呼叫BMI function，且丟入dataList[i]第i筆資料下去跑，會回傳return理想
        var content = dataList[i].body;
        // console.log(bmi);//理想
        // console.log(content);//normal
        // console.log(dataList[i]);
        console.log(bmiStatus[content].class);
        
        localStorage.setItem('data', JSON.stringify(dataList));// 上傳到 localStorage
        str += '<li  data-num="' + i + '" class="' + 'record-item ' + 'border-left-' + bmiStatus[content].class + ' ">'
            + '<p>' + bmi + '</p>'
            + ' <p> <span>' + 'BMI' + '</span>' + dataList[i].BMI + '</p>'
            + ' <p> <span>' + 'weight' + '</span>' + dataList[i].weight + 'kg' + '</p>'
            + '<p> <span>' + 'height' + '</span>' + dataList[i].height + 'cm' + '</p>'
            + '<p>' + dataList[i].date + '</p>'
            + '<a href="#" class="delete far fa-minus-square"></a>'
            + '</li >'

    }
    list.innerHTML = str;

    //用if來判斷陣列是否為空陣列，空陣列則刪除全部的按鈕隱藏，有資料則會出現刪除全部的按鈕
    if (dataList.length == 0) {
        delAllBtn.classList.add('d-none');
    } else {
        delAllBtn.classList.remove('d-none');
    }

}


function BMIStyle() {

    resultBtn.classList.toggle('d-none');//增加d-none

    // 顯示BMI數值及狀態
    var len = dataList.length;

    for (var i = 0; i < len; i++) {
        var bmi = BMI(dataList[i]);
        var content = dataList[i].body;
        showResult.innerHTML = '<div class="' + 'result-icon ' + bmiStatus[content].class + '"' + 'id="showBmi"' + '>'
            + '<h4>' + dataList[i].BMI + '</h4>'
            + '<h6>BMI</h6>'
            + '<a href="' + '#" class=' + '"result-reset ' + 'bg-' + bmiStatus[content].class + '"' + 'id="' + 'reset"' + '></a>'
            + '</div >'
            + '<p class="' + ' showstatus ' + bmiStatus[content].class + '"' + 'id="showStatus"' + '>' + bmi + '</p>';
    }
    //寫重新整理功能
    // reset 按鈕，監聽是否點擊
    var resetBtn = document.getElementById('reset');//重新整理按鈕
    resetBtn.addEventListener('click', function () {
        cm.value = '';//清空文字欄位
        kg.value = '';//清空文字欄位
        document.getElementById("showBmi").classList.toggle("d-none");
        document.getElementById("showStatus").classList.toggle("d-none");
        document.getElementById("resultBtn").classList.toggle("d-none");
        document.getElementById("resultBtn").classList.remove("active");
    });


}

function BMI(item) {
    var meter = item.height / 100;
    var result = (item.weight / (meter * meter)).toFixed(2);
    switch (true) {
        case result < 18.5:
            item.BMI = result;
            item.body = 'underweight';
            return '過輕'
        case result >= 18.5 && result < 25:
            item.BMI = result;
            item.body = 'normal';
            return '理想'
        case result >= 25 && result < 30:
            item.BMI = result;
            item.body = 'overweight';
            return '過重'
        case result >= 30 && result < 35:
            item.BMI = result;
            item.body = 'lightendanger';
            return '輕度肥胖'
        case result >= 35 && result < 40:
            item.BMI = result;
            item.body = 'middanger';
            return '中度肥胖'
        case result > 40:
            item.BMI = result;
            item.body = 'danger';
            return '重度肥胖'
        default:
            return 'ERROR'
    }
}




//刪除紀錄
function deletList(e) {
    console.log(e.target.nodeName);
    if (e.target.nodeName == "A") {
        e.preventDefault();
        var num = e.target.parentNode.dataset.num;
        // console.log(num);
        dataList.splice(num, 1);

    }
    // 把變更後的陣列上傳到localstorage
    var dataListString = JSON.stringify(dataList);
    localStorage.setItem('data', dataListString);

    updateList();   //更新網頁內容 
}

//全部刪除清空
function deleteAll(e) {

    dataList.splice(0, dataList.length);//清空
    // 把變更後的陣列上傳到localstorage
    var dataListString = JSON.stringify(dataList);
    localStorage.setItem('data', dataListString);

    updateList();   //更新網頁內容 


}

