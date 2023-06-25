function subm(e) {
  e.preventDefault();
  const login = $('#name');
  const password = $('#password');

  request = $.ajax({
    type:'Get',
    url:'http://91.223.199.62:8093/api/users',
  })

  request.done(function (response,textStatus,jqXHR) {
    for (let i = 0; i < response.length;i++) {
      console.log(response[i]);
      if (response[i].login == login.val() && response[i].password == password.val()) {
        success(response[i]);
        return;
      }
      failure();
    }
  })

  request.fail(function (textStatus,jqXHR,errorThrown) {
    console.log(errorThrown);
  })

  function success(userInfo) {
    $(".container__toHide").addClass("hidden");
    $("#info__name").text("ИМЯ: " + userInfo.fullName);
    $("#info__number").text("ТЕЛЕФОН: " + userInfo.phone);
    $("#info__role").text("ДОЛЖНОСТЬ: " + userInfo.roles[0].name);
    $(".info").removeClass("hidden");
  }

  function failure() {
    $('.form__container').addClass("failure");
    $('#error').removeClass("hidden");
  }
}

$(document).ready(function() {
  $('#form').submit(function (event) {
    subm(event);
  });
})
