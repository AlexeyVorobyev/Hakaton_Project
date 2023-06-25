let wndw;
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
    $(".button").removeClass("button_clicked");
    $("#button1").addClass("button_clicked");
  })

  $("#button2").on("click", function(event) {
    map.remove();
    map = DG.map('map', {
      center: [54.98, 82.89],
      zoom: 13
    });
    DG.then(drawRegions.bind(this,map));
    $(".button").removeClass("button_clicked");
    $("#button2").addClass("button_clicked");
  })

  $("#buttonClosePopup").on("click", function () {
    $(".section-popup").addClass("hidden");
    $("#popupButton").off("click",function() {
      const mail = id;
      var nw = window.open('info.html');
      nw.mail = mail;
    })
  })

};

// функция отрисовки полей, запрос в бд
function drawFields(map) {
  var polygons = DG.featureGroup();

  request = $.ajax({
    type:'Get',
    url:'http://91.223.199.62:8093/api/fields/list'
  })

  request.done(function (response,textStatus,jqXHR) {
    console.log(response);

    for (let i = 0; i < response.length;i++) {
      const arr = [];
      for (let j = 0; j < response[i].points.length;j++) {
        arr.push([response[i].points[j].lon,response[i].points[j].lat])
      }
      DG.polygon(arr, {color: "blue"})
        .on('click', function() {
          map.remove();
          map = DG.map('map', {
            center: [54.98, 82.89],
            zoom: 13
          });
          DG.then(drawRegions.bind(this,map));
          //showPopup(response[i]);
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
    url:'http://91.223.199.62:8093/api/fields/list'
  })

  request.done(function (response,textStatus,jqXHR) {
    for (let k = 0; k < response.length;k++) {
      for (let i = 0; i < response[k].regions.length;i++) {
        const arr = [];
        console.log("here");
        for (let j = 0; j < response[k].regions[i].points.length;j++) {
          console.log(response[k].regions[i].points[j]);
          arr.push([response[k].regions[i].points[j].lon,response[k].regions[i].points[j].lat])
        }
        console.log(arr);
        DG.polygon(arr, {color: response[k].regions[i].color})
          .on('click', function() {
            //alert(response[i].id);
            const tmpid = response[k].regions[i].id
            showPopup(tmpid);
            $("#popupButton").off("click",function() {
              const mail = id;
              let nw = window.open('info.html');
              nw.mail = mail;
            })
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

function showPopup(id) {
  const popup = $(".section-popup");
  popup.removeClass("hidden");
  $("#popup__titleText").text("Участок: " + id);

  request = $.ajax({
    type:'Get',
    url:'http://91.223.199.62:8093/api/regions/info/' + id,
  })

  request.done(function (respond,textStatus,jqXHR) {
    console.log(respond);
    $("#lst__first").text("Сорт: " + respond.variety.name);
    $("#lst__second").text("Особенности сорта: " + respond.variety.description);
  })

  request.fail(function (textStatus,jqXHR,errorThrown) {
    console.log(errorThrown);
  })

  $("#popupButton").on("click",function() {
    /*if (wndw == null) {
      wndw = window.open('info.html');
      wndw.mail = id;
    }
    else {
      wndw.open();
      wndw.mail = id;
    }*/
    history.pushState({id:id},'','info.html');
    sessionStorage.setItem("id",id);
    location.reload();
  })
}

