const arrowLeft = document.querySelector(".arrow-left");
const arrowRight = document.querySelector(".arrow-right");
const contentLeft = document.querySelector(".content-left");
const pictureDot = document.querySelector(".dot-btn");
const datetimeInput = document.querySelectorAll(".datetime-input");
const productCount = document.querySelector(".product-count");
const costNum = document.querySelector(".cost-number");
const selectMorning = document.querySelector(".select-time-morning");
const selectAfternoon = document.querySelector(".select-time-afternoon");
const descriptionFont = document.querySelector(".description-font");
const address = document.querySelector(".address-name");
const transport = document.querySelector(".transport");
const bookingMessage = document.querySelector(".booking-message");
const darker = document.querySelector(".darker");
const bookingMessageClose = document.querySelector(".booking-message-btn");
const bookingMessageFont = document.querySelector(".booking-message-font");
const title = document.querySelector(".title");
const category = document.querySelector(".category");
const pcBackground = document.querySelector(".pc-background");
const preloadingPc = document.querySelector(".lds-dual-ring");



let url = "/api" + window.location.pathname;
let allRadio, allPc, radio, pcCount;
let pcPosition = 0;
let orderBtn = document.querySelector(".order-btn");
let date = document.querySelector(".date");
let datetime = new Date();
let year, month, day, time, orderData, price;
let id = location.pathname.replace("/attraction/", "");





//點擊下面圓圓切換圖片
function clickDotToChangePc() {
    radio = document.querySelectorAll(".dot");
    for (let i = 0; i < radio.length; i++) {//讓每個點點 添加click事件
        radio[i].addEventListener("click", function () {
            allRadio = document.querySelectorAll(".dot");
            allPc = document.querySelectorAll(".content-pc");
            for (let k = 0; k < allRadio.length; k++) {
                if (allPc[k]) {
                    if (allPc[k].style.display === "block") {
                        allPc[k].style.display = "none";
                    }
                }

                if (allRadio[k].checked === true) {
                    if (k != 0) { //一開始載入畫面第0個圖是block，要先把它關掉
                        allPc[0].style.display = "none";
                    }
                    pcPosition = k;
                }

            }
            if (allPc[pcPosition]) {
                allPc[pcPosition].style.display = "block";
            }

        })
    }
}

//取得圖片並加入點點
fetch(url)
    .then((response) => {
        return response.json()
    })
    .then((data) => {
        data = data["data"];
        pcCount = data["images"].length;
        for (let i = 0; i < data["images"].length; i++) {
            let newDot = document.createElement("input");
            newDot.type = "radio";
            newDot.name = "control";
            newDot.className = "dot";
            newDot.style.display = "none";
            pictureDot.appendChild(newDot);
            let newImg = document.createElement("img");
            newImg.onload = () => {
                contentLeft.insertBefore(newImg, arrowLeft);
                if (i === data["images"].length - 1) {
                    console.log("ok")
                    document.querySelector(".content-pc").style.display = "block";
                    pcBackground.style.display = "none";
                    arrowLeft.style.display = "block";
                    arrowRight.style.display = "block";
                    document.querySelectorAll(".dot").forEach(element => {
                        element.style.display = "block";
                    })
                }



            }

            newImg.src = data["images"][i];
            newImg.className = "content-pc";



            newImg.style.display = "none";


        }

        year = datetime.getFullYear();
        month = datetime.getMonth() + 1;
        day = datetime.getDate();
        if (datetime.getDate() < 10) {
            day = `0${day}`;
        }
        if (datetime.getMonth() < 9) {
            month = `0${month + 1}`;
        }
        date.value = `${year}-${month}-${day}`;  //設定input type="datetime" 的初始值
        document.title = data["name"];
        radio = document.querySelector(".dot");
        radio.checked = true;  //先讓圓圓在第一個
        title.innerHTML = data["name"];
        category.innerHTML = `${data["category"]} at ${data["mrt"]}`;
        descriptionFont.innerHTML = data["description"];
        address.innerHTML = data["address"];
        transport.innerHTML = data["transport"];


    })
    .then(() => {
        clickDotToChangePc();
    })
    .then(() => {
        //圖片轉播圖
        arrowRight.addEventListener("click", function () {
            allPc = document.querySelectorAll(".content-pc");
            allRadio = document.querySelectorAll(".dot");
            if (pcPosition === allPc.length - 1) {
                allPc[pcPosition].style.display = "none";
                allPc[0].style.display = "block";
                allRadio[0].checked = true;
                pcPosition = 0;
                return;
            }
            allPc[pcPosition].style.display = "none";
            allPc[pcPosition + 1].style.display = "block";
            allRadio[pcPosition + 1].checked = true;
            pcPosition++;
        });


        arrowLeft.addEventListener("click", () => {
            allPc = document.querySelectorAll(".content-pc");
            allRadio = document.querySelectorAll(".dot");
            if (pcPosition === 0) {
                allPc[pcPosition].style.display = "none";
                allPc[allPc.length - 1].style.display = "block";
                allRadio[allPc.length - 1].checked = true;
                pcPosition = allPc.length - 1;
                return;

            }
            allPc[pcPosition].style.display = "none";
            allPc[pcPosition - 1].style.display = "block";
            allRadio[pcPosition - 1].checked = true;
            pcPosition--;
        })

    })




//點擊預定行程
orderBtn.addEventListener("click", () => {
    if (datetimeInput[0].checked == true) {
        time = "morning";
        price = "2000元"
    } else {
        time = "afternoon";
        price = "2500元";
    }
    fetch("/api/booking", {
        method: "POST",
        body: JSON.stringify({
            "attractionId": `${id}`,
            "date": `${date.value}`,
            "time": time,
            "price": price
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if ("ok" in data) {
                bookingMessage.style.display = "block";
                darker.style.display = "block";
                fetch("/api/booking") //取得購物車訂單數量
                    .then((response) => {
                        return response.json()
                    })
                    .then((data) => {
                        productCount.innerHTML = data.data.length;
                    })

            }
            if ("error" in data && data.message === "日期輸入錯誤") {
                bookingMessage.style.display = "block";
                darker.style.display = "block";
                bookingMessageFont.innerHTML = "日期輸入錯誤";

            }
            if ("error" in data && data.message === "尚未登入") {
                bookingMessage.style.display = "block";
                darker.style.display = "block";
                bookingMessageFont.innerHTML = "請先登入再預約";

            }
            if ("error" in data && data.message === "伺服器內部錯誤") {
                bookingMessage.style.display = "block";
                darker.style.display = "block";
                bookingMessageFont.innerHTML = "請再重試一次";

            }
        })

})



bookingMessageClose.addEventListener("click", () => {
    bookingMessage.style.display = "none";
    darker.style.display = "none";
    if (bookingMessageFont.innerHTML === "日期輸入錯誤") {
        location.reload();
    }
})

//顯示費用
selectMorning.addEventListener("click", () => {
    costNum.innerHTML = "2000元";
})

selectAfternoon.addEventListener("click", () => {
    costNum.innerHTML = "2500元";
})


