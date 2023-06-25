$(document).ready(function () {
  request = $.ajax({
    type:'Get',
    url:'http://91.223.199.62:8093/api/fields/list'
  })

  request.done(function (response,textStatus,jqXHR) {
    const root = $(".section-1");
    //console.log(response);
    for (let i = 0; i < response.length;i++) {
      //console.log(createField(response[i]),root);
      root.append(createField(response[i]));
    }
    try {
      if (sessionStorage.getItem("id") != null) {
        $(".field").each(function() {
          handler(this,sessionStorage.getItem("id"));
        })
        sessionStorage.clear();
      }
    }
    catch (e) {}
  })

  request.fail(function (textStatus,jqXHR,errorThrown) {
    console.log(errorThrown);
  })

  function createField(field) {
    const res = $('<div class="field" >\n' +
      '    <div class="field__button">' +
      '<h2 class="field__buttonText">Поле lorem ipsum </h2>' +
      '<div class="field__iconContainer"><img class="field__icon" src=""></div>' +
      '</div>\n' +
      '    <div class="field__container">\n' +
      '      <div class="regionCard__wrapper">\n' +
      '      </div>\n' +
      '    </div>\n' +
      '  </div>')
    res.attr("id",field.id);
    res.children(".field__button").on('click', handler.bind(this,res))
    res.children(".field__button").children(".field__buttonText").text("ПОЛЕ " + field.id);
    res.children(".field__button").children(".field__iconContainer").children(".field__icon").attr("src","img/PolygonClose.png");

    //console.log(res);
    return res;
  }

  function handler(fieldDom, id = -1) {
    fieldDom = $(fieldDom)
    console.log(id);
    if (fieldDom.hasClass("loaded")) {
      if (fieldDom.children(".field__container").hasClass("hidden")) {
        fieldDom.children(".field__container").removeClass("hidden");
        fieldDom.children(".field__button").children(".field__iconContainer").children(".field__icon").attr("src","img/PolygonOpen.png");
      }
      else {
        fieldDom.children(".field__container").addClass("hidden");
        fieldDom.children(".field__button").children(".field__iconContainer").children(".field__icon").attr("src","img/PolygonClose.png");
      }
      return;
    }
    fieldDom.addClass("loaded");
    request = $.ajax({
      type:'Get',
      url:'http://91.223.199.62:8093/api/fields/list/'
    })

    request.done(async function (response,textStatus,jqXHR) {
      fieldDom.children(".field__button").children(".field__iconContainer").children(".field__icon").attr("src","img/PolygonOpen.png");
      const root = fieldDom.children(".field__container").children(".regionCard__wrapper");
      console.log(root);
      //console.log(response);
      let flag = false;
      for (let i = 0; i < response.length;i++) {
        if (fieldDom.attr("id") == response[i].id) {
          for (let j = 0; j < response[i].regions.length; j++) {
            const tmp = createRegionCard(response[i].regions[j].id,id)
            //console.log(tmp);
            await tmp;
            //console.log(tmp);
            tmp.then(function (res) {
              root.append(res);
            });
          }
          flag = true;
        }
        if (flag) break;
      }
    })

    request.fail(function (textStatus,jqXHR,errorThrown) {
      console.log(errorThrown);
    })
  }

  async function createRegionCard(id,checkId) {
    console.log(id,checkId);
    let res = null;
    request = $.ajax({
      type:'Get',
      url:'http://91.223.199.62:8093/api/regions/info/' + id,
    })

    await request.done(function (response,textStatus,jqXHR) {
      //console.log(response);
      res = $('<div class="regionCard">\n' +
        '          <div class="regionCard__imageContainer"><img class="regionCard__image" src="" alt="photo"></div>\n' +
        '          <h3 class="regionCard__title">Lorem ipsum</h3>\n' +
        '          <p class="list__elem" id="lst__first">Сорт:</p>\n' +
        '          <p class="list__elem" id="lst__second">Особенность сорта:</p>\n' +
        '          <p class="list__elem" id="lst__third">Особенность почвы:</p>\n' +
        '          <div class="list__buttonContainer">'+
        '          <div class="list__button" id="lst__fourth"><p class="list__button-text">Работники</p></div>\n' +
        '          <div class="list__button" id="lst__fifth"><p class="list__button-text">История действий</p></div>\n' +
        '          </div>' +
        '        </div>')
      res.attr("id",id);
      res.children(".regionCard__title").text("Участок " + response.id);
      res.children("#lst__first").text("Сорт: " + response.variety.name);
      res.children("#lst__second").text("Особенность сорта: " + response.variety.description);
      res.children("#lst__third").text("Особенность почвы: " + response.soil.description);
      console.log(response);
      res.children(".regionCard__imageContainer").children(".regionCard__image").attr("src", "http://91.223.199.62:8093/api/resource/" + response.photo.id)

      res.children(".list__buttonContainer").children("#lst__fourth").on('click', showPopupWorkers.bind(this,response.id));
      res.children(".list__buttonContainer").children("#lst__fifth").on('click', showPopupHistory.bind(this,response.id,response.manualWorks));

      if (id == checkId) {
        setTimeout(function() {
          const coords = res.position();
          scrollBy({
            top:coords.top,
            behavior: 'smooth'
          })
        },1000)
        res.addClass("chosen1");
        res.children(".regionCard__imageContainer").addClass("chosen2");
        setTimeout(function() {
          res.removeClass("chosen1");
          res.children(".regionCard__imageContainer").removeClass("chosen2");
        },10000)
      }

    })

    request.fail(function (textStatus,jqXHR,errorThrown) {
      console.log(errorThrown);
    })
    return res;
  }

  $("#buttonClosePopup").on("click", function () {
    $(".section-popup").addClass("hidden");
    $(".list").children().remove();
  })
  function showPopupHistory(id, manualWorks) {
    const popup = $(".section-popup");
    popup.removeClass("hidden");
    $("#popup__titleTextRegion").text("Участок: " + id);
    $("#popup__titleTextName").text("История выполненных работ");

    const header = $('<div class="list__elemPopup list__elemPopup_history">\n' +
      '          <div class="list__subElem"><p class="list__subElemText workStage">СТАДИЯ РАБОТ</p></div>\n' +
      '          <div class="list__subElem"><p class="list__subElemText date">ДАТА</p></div>\n' +
      '          <div class="list__subElem"><p class="list__subElemText note">ПРИМЕЧАНИЯ</p></div>\n' +
      '        </div>')
    $(".list").append(header)

    for (let i = 0; i < manualWorks.length;i++) {
      console.log(manualWorks)
      const res = $('<div class="list__elemPopup list__elemPopup_history added">\n' +
        '          <div class="list__subElem workStage"><p class="list__subElemText workStage"></p></div>\n' +
        '          <div class="list__subElem date"><p class="list__subElemText date"></p></div>\n' +
        '          <div class="list__subElem note"><p class="list__subElemText note"></p></div>\n' +
        '        </div>')
      res.children(".workStage").children(".workStage").text(manualWorks[i].manualWorkStage);
      res.children(".date").children(".date").text(manualWorks[i].dateAndTime);
      res.children(".note").children(".note").text(manualWorks[i].note);

      $(".list").append(res)
    }
  }

  function showPopupWorkers(id) {
    const popup = $(".section-popup");
    popup.removeClass("hidden");
    $("#popup__titleTextRegion").text("Участок: " + id);
    $("#popup__titleTextName").text("Назначение работников");

    const header = $('<div class="list__elemPopup list__elemPopup_workers">\n' +
      '          <div class="list__subElem"><p class="list__subElemText name">ПОЛНОЕ ИМЯ</p></div>\n' +
      '          <div class="list__subElem"><p class="list__subElemText phone">ТЕЛЕФОН</p></div>\n' +
      '          <div class="list__subElem"><p class="list__subElemText position">ДОЛЖНОСТЬ</p></div>\n' +
      '          <div class="list__subElem"><p class="list__subElemText position"></p></div>\n' +
      '        </div>')
    $(".list").append(header);

    request = $.ajax({
      type:'Get',
      url:'http://91.223.199.62:8093/api/users',
    })

    request.done(function (response,textStatus,jqXHR) {
      for (let i = 0; i < response.length;i++) {
        const res = $('<div class="list__elemPopup list__elemPopup_workers added">\n' +
          '          <div class="list__subElem name"><p class="list__subElemText name"></p></div>\n' +
          '          <div class="list__subElem phone"><p class="list__subElemText phone"></p></div>\n' +
          '          <div class="list__subElem position"><p class="list__subElemText position"></p></div>\n' +
          '          <div class="list__subElem"><button class="list__buttonPopup"><p class="list__subElemText">"ДОБАВИТЬ ПОРУЧЕНИЕ"</p></button></div>\n' +
          '        </div>')
        res.children(".name").children(".name").text(response[i].fullName);
        res.children(".phone").children(".phone").text(response[i].phone);
        res.children(".position").children(".position").text(response[i].roles[0].name);

        const field = $('<div class="list__elemPopupTask hidden">\n' +
          '          <textarea class="list__textArea"></textarea>\n' +
          '          <button class="list__textAreaButton"><p class="list__subElemText">ОТПРАВИТЬ</p></button>\n' +
          '        </div>')

        res.children(".list__subElem").children(".list__buttonPopup").on('click',function () {
          if (field.hasClass("hidden")) field.removeClass("hidden");
          else field.addClass("hidden");
        })

        $(".list").append(res);
        $(".list").append(field);
        }
    })

    request.fail(function (textStatus,jqXHR,errorThrown) {
      console.log(errorThrown);
    })
  }
})
