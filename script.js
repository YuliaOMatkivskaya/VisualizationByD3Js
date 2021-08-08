//база данных
let baseJson = `[{
        "title":"Котельная",
        "planing":[
            {"name":"Монтаж0","date":"2016-01-28T12:00:00.000Z"},
            {"name":"Монтаж1","date":"2017-05-23T12:00:00.000Z"}
            ],
            "doing":[
            {"name":"Монтаж0","date":"2016-01-25T12:00:00.000Z"},
            {"name":"Монтаж1","date":"2017-10-02T12:00:00.000Z"}
            ]
        }, 
        {
        "title":"Трансформаторная будка",
        "planing":[
            {"name":"Монтаж0","date":"2017-11-13T12:00:00.000Z"},
            {"name":"Монтаж1","date":"2021-10-10T12:00:00.000Z"}
            ],
            "doing":[
            {"name":"Монтаж0","date":"2017-12-05T12:00:00.000Z"},
            {"name":"Монтаж1","date":"2021-09-04T12:00:00.000Z"}
            ]
        }
        ]`;

let baseOfData = JSON.parse(baseJson, function (key, value) {
    if (key == 'date') return new Date(value);
    return value;
});

//установка значений по умолчанию и фильтрации по годам с сохранением в локальное хранилище

let itemYearStart = document.querySelector("#itemYearStart");
let itemYearFinish = document.querySelector("#itemYearFinish");
let sendYear = document.querySelector("#sendYear");
let removeYear = document.querySelector("#removeYear");
function YearsAreCorrect() {
    if (localStorage.getItem("yearStart") == null || localStorage.getItem("yearFinish") < localStorage.getItem("yearStart") || localStorage.getItem("yearStart") < 2016) {
        itemYearStart.value = 2016;
        localStorage.setItem("yearStart", itemYearStart.value);
    } else {
        itemYearStart.value = localStorage.getItem("yearStart");
    }

    if (localStorage.getItem("yearFinish") == null || localStorage.getItem("yearFinish") < localStorage.getItem("yearStart") || localStorage.getItem("yearFinish") > 2024 || localStorage.getItem("yearFinish") < 2016) {
        itemYearFinish.value = 2024;
        localStorage.setItem("yearFinish", itemYearFinish.value);
    } else {
        itemYearFinish.value = localStorage.getItem("yearFinish");
    }
}

function addItemsYears() {

    localStorage.setItem("yearStart", itemYearStart.value);
    localStorage.setItem("yearFinish", itemYearFinish.value);

    setTimeout(() => {
        window.location.reload();
    });
    YearsAreCorrect();
}

function removeItemsYears() {
    itemYearStart.value = 2016;
    itemYearFinish.value = 2024;
    localStorage.setItem("yearStart", itemYearStart.value);
    localStorage.setItem("yearFinish", itemYearFinish.value);
    setTimeout(() => {
        window.location.reload();
    });
}

sendYear.addEventListener("click", addItemsYears);
removeYear.addEventListener("click", removeItemsYears);

//поиск и выбор совпадений по названию объекта

let text = document.querySelector("#SearchText");
let sendText = document.querySelector("#sendText");
let removeText = document.querySelector("#removeText");

function addItemsText() {
    let val = text.value;
    localStorage.setItem("searchText", val);
    setTimeout(() => {
        window.location.reload();
    });

}

function removeItemsText() {
    localStorage.removeItem("searchText");
    text.value = "";
    setTimeout(() => {
        window.location.reload();
    });
}

sendText.addEventListener("click", addItemsText);
removeText.addEventListener("click", removeItemsText);


//текст, по которому фильтруются названия обьектов
let valTxt = localStorage.getItem("searchText");
let regexp = new RegExp(valTxt, 'ig');

//года, по которым отфильтровать данные
let yearStart = localStorage.getItem("yearStart") || 2016;
let yearFinish = localStorage.getItem("yearFinish") || 2024;

//сохранение визуализации в PDF
let buttonPDF = document.querySelector("#savePDF");

function generatePDF() {
    const element = document.querySelector("#conteiner");
    html2pdf()
        .from(element)
        .save();
}

buttonPDF.addEventListener("click", generatePDF);

//графическое изображение данных
let width = 780;
let height = 250;
let heightOfLegend = 45;
let markerWidth = 20;
let startDiagramX = 85;
let widthCell = 77;
let posLineDoingY = 200;
let posLinePlaingY = 90;

//пояснение к маркерам
let svg1 = d3.select("#conteiner").append("svg");

svg1.attr("height", heightOfLegend)
    .attr("width", width)
    .style("margin-left", "5px")
    .style("margin-right", "5px")
    .style("margin-top", "5px");

svg1.append("text")
    .attr("x", 300)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .style("font-size", "22px")
    .text("Описание маркеров");

//вывод данных


for (let obj of baseOfData) {


    function objectIsAdded() {
        let svg = d3.select("#conteiner")
            .append("div")
            .attr("class", "box")
            .append("svg");

        svg.style("margin-top", "10px")
            .style("margin-left", "5px")
            .style("margin-right", "5px")
            .attr("height", height)
            .attr("width", width);

        svg.append("line")
            .style("stroke", "gray")
            .style("stroke-width", "1")
            .style("stroke-opacity", "0.4")
            .attr("x1", startDiagramX)
            .attr("y1", 145)
            .attr("x2", width)
            .attr("y2", 145);

        //промежуточные деления и блоки под годы
        for (let i = 0; i < 9; i++) {
            svg.append("line")
                .style("stroke", "gray")
                .style("stroke-width", "1")
                .style("stroke-opacity", "0.4")
                .attr("x1", startDiagramX + i * widthCell)
                .attr("y1", 0)
                .attr("x2", startDiagramX + i * widthCell)
                .attr("y2", height);

            svg.append("rect")
                .style("fill", "white")
                .style("stroke", "rgb(114, 114, 241)")
                .style("stroke-width", "1")
                .attr("x", startDiagramX + i * widthCell)
                .attr("y", 0)
                .attr("width", widthCell)
                .attr("height", 40);
            //годы на блоках
            let dateInBlock = 2016 + i;

            svg.append("text")
                .attr("x", startDiagramX +widthCell/2 + i * widthCell)
                .attr("y", 25)
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .style("fill", "gray")
                .text(dateInBlock);
        }
        svg.append("line")
            .style("stroke", "gray")
            .style("stroke-width", "2")
            //.style("stroke-dasharray", "4 2") //прерывистая линия
            .attr("x1", startDiagramX)
            .attr("y1", posLinePlaingY)
            .attr("x2", width)
            .attr("y2", posLinePlaingY);

        svg.append("line")
            .style("stroke", "gray")
            .style("stroke-width", "2")
            .attr("x1", startDiagramX)
            .attr("y1", posLineDoingY)
            .attr("x2", width)
            .attr("y2", posLineDoingY);

        /*let g = svg.append("g");
        // добавляем путь
        g.append("circle")
            .style("fill", "none")
            .style("stroke", "steelblue")
            .style("stroke-width", "2") 
            .attr("cx", 100)
            .attr("cy", 100)
            .attr("r", 50);
            
        g.append("rect")
            .style("fill", "none")
            .style("stroke", "steelblue")
            .style("stroke-width", "2")
            .attr("x", 30)
            .attr("y", 20)
            .attr("width", 100) 
            .attr("height", 100)
            .attr("rx", 5);

    */

        //отрисовывание точек с фильтрацией по годам
        for (let j = 0; j < obj["doing"].length; j++) {

            let dateOfDoing = obj["doing"][j]["date"];
            let partOfYearDoing = (30 * dateOfDoing.getMonth() + dateOfDoing.getDate()) / 365; //прошедшая доля текущего года для точки из выполнения
            let dateOfPlaning = obj["planing"][j]["date"];
            let NowDate = new Date();
            let posMarkerXDoing = (startDiagramX + (dateOfDoing.getFullYear() - 2016 + partOfYearDoing) * widthCell);


            if (dateOfDoing.getFullYear() >= yearStart && dateOfDoing.getFullYear() <= yearFinish) {
                //рисуем точку
                console.log(obj["title"]);
                console.log("точка из выполненных");
                let color;

                function AddColorMarker(color) {
                    //условия окрашивания маркера
                    if (dateOfDoing <= dateOfPlaning && !(NowDate <= dateOfPlaning)) {
                        // в срок - маркер зеленый
                        alert("маркер зеленый");
                        return color = "green";
                    } else if (dateOfDoing > dateOfPlaning || NowDate > dateOfPlaning) {
                        // срыв - маркер красный
                        alert("маркер красный");
                        return color = "red";
                    } else if (NowDate <= dateOfPlaning) {
                        // в работе - маркер серый
                        alert("маркер серый");
                        return color = "gray";
                    }
                }
                svg.append("rect")
                    .style("fill", AddColorMarker(color))
                    .style("stroke", "steelblue")
                    .style("stroke-width", "2")
                    .attr("x", posMarkerXDoing-markerWidth/2)
                    .attr("y", posLineDoingY-markerWidth/2)
                    .attr("width", markerWidth)
                    .attr("height", markerWidth)
                    //.attr("transform", "rotate(45,100,100)")
                    .attr("rx", 5);


            }
        }

        for (let k = 0; k < obj["planing"].length; k++) {

            let dateOfPlaning = obj["planing"][k]["date"];
            let partOfYearPlaning = (30 * dateOfPlaning.getMonth() + dateOfPlaning.getDate()) / 365; //прошедшая доля текущего года для точки из плана
            let posMarkerXPlaning = (startDiagramX + (dateOfPlaning.getFullYear() - 2016 + partOfYearPlaning) * widthCell);
            if (dateOfPlaning.getFullYear() >= yearStart && dateOfPlaning.getFullYear() <= yearFinish) {
                //рисуем точку
                svg.append("rect")
                .style("fill", "blue")
                .style("stroke", "steelblue")
                .style("stroke-width", "2")
                .attr("x", posMarkerXPlaning-markerWidth/2)
                .attr("y", posLinePlaingY-markerWidth/2)
                //.attr("transform", "rotate(45,75,75)")
                .attr("width", markerWidth)
                .attr("height", markerWidth)
                .attr("rx", 5);

                console.log(obj["title"]);
                console.log("точка из запланированных");
            }
        }
        //вывод названия объекта
        svg.append("text")
            .attr("x", 10)
            .attr("y", 55)
            .style("font-size", "16px")
            .style("fill", "black")
            .text(obj["title"]);
    }
    //фильтр по названию (ищет совпадения с введенным текстом)
    if (regexp.exec(obj["title"])) {
        objectIsAdded();
        // Если нашло, то выполнить это
        console.log(obj["title"]);
        console.log('Совпадения есть');
    } else if (!valTxt) {
        objectIsAdded();
        // Если нет фильтра, то выполнить это
        console.log('Фильтр не включен');
    } else {
        console.log(obj["title"]);
        console.log('Совпадений нет');
    }

}