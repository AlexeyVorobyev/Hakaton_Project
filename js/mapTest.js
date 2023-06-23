$.getScript("https://maps.api.2gis.ru/2.0/loader.js?pkg=full")
  .done(() => {
    //alert("Успешно");
    $(document).ready(start);
  })
  .fail(() => {alert("Ошибка")} )
function start () {
  var map = DG.map('map', {
    center: [54.98, 82.89],
    zoom: 13
  });

  document.getElementById("button1").addEventListener("click", function(event) {
    map.remove();
    map = DG.map('map', {
      center: [54.98, 82.89],
      zoom: 13
    });
    DG.then(btnClick.bind(this,areas1,map));
  })

  document.getElementById("button2").addEventListener("click", function(event) {
    map.remove();
    map = DG.map('map', {
      center: [54.98, 82.89],
      zoom: 13
    });
    DG.then(btnClick.bind(this,areas2,map));
  })

  document.getElementById("button3").addEventListener("click", function(event) {
    map.remove();
    map = DG.map('map', {
      center: [54.98, 82.89],
      zoom: 13
    });
    DG.then(drawRectangles.bind(this,map));
  })
};


const areas1 = [
  {
    coords:[
      [44.539075773353105, 38.07924227679392],
      [44.53734573481761, 38.08213733893373],
      [44.53666465082239, 38.084654290578165],
      [44.5345616969179, 38.08243493911973],
      [44.53768263025922, 38.07758225030912]
    ],
    id:"1"
  },
  {
    coords: [
      [44.53951577071735, 38.07988993697552],
      [44.54233935330944, 38.08347801337777],
      [44.540954577880385, 38.0856148592933],
      [44.54249233541337, 38.08770427772131],
      [44.54096565383795, 38.09007279951691],
      [44.53692993649394, 38.084892894219145],
      [44.53749444018392, 38.0827039591808]
    ],
    id:"2"
  }
]

const areas2 = [
  {
    coords:[
      [44.53903005199414, 38.07928245488272],
      [44.53771784012628, 38.0776283807665],
      [44.53726488703217, 38.07814235859922],
      [44.53863705763329, 38.07993660848801],
    ],
    id:"3"
  },
  {
    coords:[
      [44.53726488703217, 38.07814235859922],
      [44.5360791990144, 38.08006743920907],
      [44.53753799152538, 38.08180561878883],
      [44.53863705763329, 38.07993660848801],
    ],
    id:"3"
  },
  {
    coords: [
      [44.53951577071735, 38.07988993697552],
      [44.54233935330944, 38.08347801337777],
      [44.540954577880385, 38.0856148592933],
      [44.54249233541337, 38.08770427772131],
      [44.54096565383795, 38.09007279951691],
      [44.53692993649394, 38.084892894219145],
      [44.53749444018392, 38.0827039591808]
    ],
    id:"2"
  }
]

function drawRectangles(map) {
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
      DG.polygon(arr, {color: "blue"})
        .on('click', function() {
          alert(response[i].id);
        })
        .addTo(polygons);
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

const hexDecimalArr = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function calculateRandomColor() {
  let resultColor = '#';
  for (let i = 0; i < 6;i++) resultColor+=hexDecimalArr[getRandomInt(16)];
  return resultColor;
}

function btnClick(areas, map) {
  var polygons = DG.featureGroup();

  for (let i = 0; i < areas.length; i++) {
    DG.polygon(areas[i].coords, {color: calculateRandomColor()})
      .on('click', function() {
        alert(areas[i].id);
      })
      .addTo(polygons);
  }


  // Добавление группы на карту
  polygons.addTo(map);

  // Подстройка границ карты
  map.fitBounds(polygons.getBounds());
};
