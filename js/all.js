//選取DOM

var cm = document.querySelector('.height');//選取文字欄位
var kg = document.querySelector('.weight');//選取文字欄位
var showResult = document.querySelector('.show');
var resultBtn = document.getElementById('resultBtn');//選取按鈕id
var list = document.querySelector('.record');//選取UL

var dataList = JSON.parse(localStorage.getItem('data')) || [];//設變數-[]儲存輸入的事項

//監聽
resultBtn.addEventListener('click', getInfo, false);//綁按鈕點擊
list.addEventListener('click', deletList, false); //綁UL點擊delete
updateList();//預設更新


function getInfo(e) {
    e.preventDefault();
    if (cm.value == '' || kg.value == '') {
        alert('請輸入相關資料');//判斷文字欄位是否有輸入數值
        return
    }
    // resultBtn.className += ' active';//增加active狀態，但一點擊會會一直疊加
    resultBtn.classList.toggle('active');//用toggle偵測有沒有active

    //計算BMI
    var m = cm.value / 100;
    var bmi = kg.value / (m * m);
    var BMI = bmi.toFixed(2);//用 toFixed()指定小數點後幾位數

    if (BMI > 40) {
        var userStatus = '重度肥胖';
        var theme = 'danger'

    } else if (35 < BMI && BMI <= 40) {
        var userStatus = '中度肥胖';
        var theme = 'middanger'


    } else if (30 < BMI && BMI <= 35) {
        var userStatus = '輕度肥胖';
        var theme = 'lightendanger'


    } else if (25 < BMI && BMI <= 30) {
        var userStatus = '過重';
        var theme = 'overweight'


    } else if (18.5 < BMI && BMI <= 25) {
        var userStatus = '理想';
        var theme = 'normal'


    } else if (BMI <= 18.5) {
        var userStatus = '過輕';
        var theme = 'overlighten'

    }
    // console.log(userStatus);
    // console.log(theme);

    //取得日期時間
    var today = new Date();
    var currentDateTime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '(' + today.getHours() + ':' + today.getMinutes() + ')';
    // console.log(currentDateTime);

    //建立物件存放BMI各數值，要push到loalstorage
    var userData = {
        color: theme,
        status: userStatus,
        BMI: BMI,
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
    BMIStatus();
}

//將localstorage資料渲染到網頁
function updateList() {
    var str = '';
    var len = dataList.length;

    for (var i = 0; i < len; i++) {
        str += '<li  data-num="' + i +'" class="' + 'record-item ' + 'border-left-' + dataList[i].color + ' ">'
            + '<p>' + dataList[i].status + '</p>'
            + ' <p> <span>' + 'BMI' + '</span>' + dataList[i].BMI + '</p>'
            + ' <p> <span>' + 'weight' + '</span>' + dataList[i].weight + 'kg' + '</p>'
            + '<p> <span>' + 'height' + '</span>' + dataList[i].height + 'cm' + '</p>'
            + '<p>' + dataList[i].date + '</p>'
            + '<a href="#" class="delete far fa-minus-square"></a>'
            + '</li >'

    }
    list.innerHTML = str;

}

function BMIStatus() {

    resultBtn.classList.toggle('d-none');//增加d-none

    // 顯示BMI數值及狀態
    var len = dataList.length;

    for (var i = 0; i < len; i++) {
        showResult.innerHTML = '<div class="' + 'result-icon ' + dataList[i].color + '"' + 'id="showBmi"' + '>'
            + '<h4>' + dataList[i].BMI + '</h4>'
            + '<h6>BMI</h6>'
            + '<a href="' + '#" class=' + '"result-reset ' + 'bg-' + dataList[i].color + '"' + 'id="' + 'reset"' + '></a>'
            + '</div >'
            + '<p class="' + ' showstatus ' + dataList[i].color + '"' + 'id="showStatus"' + '>' + dataList[i].status + '</p>';
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
