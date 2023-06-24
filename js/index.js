
//получение api 2gis + инициализация карты
$.getScript("https://maps.api.2gis.ru/2.0/loader.js?pkg=full")
  .done(() => {
    //alert("Успешно");
    $(document).ready(setTimeout(start,500));
  })
  .fail(() => {alert("Ошибка")} )
function start () {
  var map = DG.map('map', {
    center: [54.98, 82.89],
    zoom: 13
  });

  drawFields(map);

  // привязка событий к кнопкам

  $("#button1").on("click", function(event) {
    map.remove();
    map = DG.map('map', {
      center: [54.98, 82.89],
      zoom: 13
    });
    DG.then(drawFields.bind(this,map));
  })

  $("#button2").on("click", function(event) {
    map.remove();
    map = DG.map('map', {
      center: [54.98, 82.89],
      zoom: 13
    });
    DG.then(drawRegions.bind(this,map));
  })
};

// функция отрисовки полей, запрос в бд
function drawFields(map) {
  var polygons = DG.featureGroup();

  request = $.ajax({
    type:'Get',
    url:'http://91.223.199.62:8093/api/fields'
  })

  request.done(function (response,textStatus,jqXHR) {
    console.log(response);

    for (let i = 0; i < response.length;i++) {
      const arr = [];
      for (let j = 0; j < response[i].points.length;j++) {
        arr.push([response[i].points[j].lon,response[i].points[j].lat])
      }
      DG.polygon(arr, {color: calculateRandomColor()})
        .on('click', function() {
          showPopup(response[i].id);
          //alert(response[i].id);
        })
        .addTo(polygons);
    }

    // Добавление группы на карту
    polygons.addTo(map);

    // Подстройка границ карты
    map.fitBounds(polygons.getBounds());
  })

  request.fail(function (textStatus,jqXHR,errorThrown) {
    //console.log(errorThrown);
  })
};

// функция отрисовки участков, запрос в бд
function drawRegions(map) {
  var polygons = DG.featureGroup();

  request = $.ajax({
    type:'Get',
    url:'http://91.223.199.62:8093/api/fields'
  })

  request.done(function (response,textStatus,jqXHR) {
    //console.log(response);

    for (let k = 0; k < response.length;k++) {
      for (let i = 0; i < response[k].regions.length;i++) {
        const arr = [];
        for (let j = 0; j < response[k].regions[i].length;j++) {
          arr.push([response[k].regions[i].points[j].lon,response[k].regions[i].points[j].lat])
        }
        DG.polygon(arr, {color: calculateRandomColor()})
          .on('click', function() {
            //alert(response[i].id);
            showPopup(response[k].regions[i].id);
          })
          .addTo(polygons);
      }
    }

    // Добавление группы на карту
    polygons.addTo(map);

    // Подстройка границ карты
    map.fitBounds(polygons.getBounds());
  })

  request.fail(function (textStatus,jqXHR,errorThrown) {
    console.log(errorThrown);
  })
};

// генерация рандомного цвета, удалить!!!!!!!!!!!!!!!!!!!!!!

const hexDecimalArr = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function calculateRandomColor() {
  let resultColor = '#';
  for (let i = 0; i < 6;i++) resultColor+=hexDecimalArr[getRandomInt(16)];
  return resultColor;
}

function showPopup(id) {
  const popup = $(".section-popup");
  popup.removeClass("hidden");
  $("#popup__titleText").text("Участок: " + id);
}
