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
      if (mail != undefined) {
        $(".field").each(function() {
          console.log($(".field"))
          handler(this,mail);
        })
      }
    }
    catch (e) {}
  })

  request.fail(function (textStatus,jqXHR,errorThrown) {
    console.log(errorThrown);
  })

  function createField(field) {
    const res = $('<div class="field" >\n' +
      '    <div class="field__button"><h2 class="field__buttonText">Поле lorem ipsum </h2></div>\n' +
      '    <div class="field__container">\n' +
      '      <div class="regionCard__wrapper">\n' +
      '      </div>\n' +
      '    </div>\n' +
      '  </div>')
    res.attr("id",field.id);
    res.children(".field__button").on('click', handler.bind(this,res))
    res.children(".field__button").children(".field__buttonText").text("Поле " + field.id);
    //console.log(res);
    return res;
  }

  function handler(fieldDom, id = -1) {

    fieldDom = $(fieldDom)
    console.log(id);
    if (fieldDom.hasClass("loaded")) return;
    fieldDom.addClass("loaded");
    request = $.ajax({
      type:'Get',
      url:'http://91.223.199.62:8093/api/fields/list/'
    })

    request.done(async function (response,textStatus,jqXHR) {
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
        '          <div class="list__button" id="lst__fourth"><p class="list__button-text">Работники:</p></div>\n' +
        '          <div class="list__button" id="lst__fifth"><p class="list__button-text">История действий:</p></div>\n' +
        '        </div>')
      res.attr("id",id);
      res.children(".regionCard__title").text("Участок " + response.id);
      res.children("#lst__first").text("Сорт: " + response.variety.name);
      res.children("#lst__second").text("Особенность сорта: " + response.variety.description);
      res.children("#lst__third").text("Особенность почвы: " + response.soil.description);
      console.log(response);
      res.children(".regionCard__imageContainer").children(".regionCard__image").attr("src", "http://91.223.199.62:8093/api/resource/" + response.photo.id)

      //res.children("#lst__fourth")....;
      //res.children("#lst__fifth")....;
      //TODO РАЗРАБОТАТЬ POPUP ДЛЯ РАБОТНИКИ И ИСТОРИЯ ДЕЙСТВИЙ

      res.children("#lst__fifth").on('click', showPopup.bind(this,response.id,response.manualWorks));

      if (id == checkId) {
        res.addClass("chosen");
        setTimeout(function() {
          res.removeClass("chosen");
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
    $(".list").children(".added").remove();
  })
  function showPopup(id, manualWorks) {
    const popup = $(".section-popup");
    popup.removeClass("hidden");
    $("#popup__titleText").text("Участок: " + id);

    for (let i = 0; i < manualWorks.length;i++) {
      console.log(manualWorks)
      const res = $('<div class="list__elemPopup added">\n' +
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
})
