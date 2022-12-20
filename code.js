async function get_element(html_name) {
  try {
    let response = await fetch('/template/'+html_name); // Gets a promise
    return await response.text(); // Replaces body with response
  } catch (err) {
    console.log('Fetch error:' + err); // Error handling
  }
}

async function load_element(class_name, html_name) {
    try {
        let response = await fetch('/template/'+html_name); // Gets a promise
        document.querySelector(class_name).innerHTML = await response.text(); // Replaces body with response
        document.querySelector(class_name).style.animation='fade-in 1s forwards';
    } catch (err) {
        console.log('Fetch error:' + err); // Error handling
    }
}

async function clear_element(class_name) {
    document.querySelector(class_name).style.animation='fade-out 1s forwards';
}

function load_home() {
    load_element('header','login-bar.html')
    load_element('nav','search.html')
    load_element('aside','sidebar.html')
    load_element('main','main.html')
}

const str_close_line = "close-line 1s forwards";
const str_open_line = "open-line 1s forwards";

function switch_login() {
  sessionStorage.next_page = "login"
  document.querySelectorAll('article .signup .line')[2].style.animation=str_close_line;
  document.querySelectorAll('article .signup .line')[3].style.animation=str_close_line;
  // document.querySelectorAll('.item.form.line')[2].style
  document.querySelector('article .signup .submit').textContent="התחבר";
  document.querySelector('article .signup .message').textContent="התחברות למשתמש קיים";
  document.querySelector('article .signup .extra-options').innerHTML="\n" +
      "        <a href=\"#\" class=\"link account-forgot\">שכחתי סיסמה</a>\n" +
      "        <br><br>\n" +
      "        <a href=\"#\" class=\"link account-forgot\" onclick=\"switch_register()\">הרשם עכשיו</a>";
}

function switch_register() {
  sessionStorage.next_page = "register"
  document.querySelectorAll('article .signup .line')[2].style.animation=str_open_line;
  document.querySelectorAll('article .signup .line')[3].style.animation=str_open_line;
  document.querySelector('article .signup .submit').textContent="הרשם";
  document.querySelector('article .signup .message').textContent="הרשמה עם משתמש חדש";
  document.querySelector('article .signup .extra-options').innerHTML="<a href=\"#\" class=\"link account-exist\" onclick=\"switch_login()\">אני כבר רשום</a>"
}

function open_login() {
  document.querySelectorAll('article .signup .line')[0].style.animation=str_open_line;
  document.querySelectorAll('article .signup .line')[1].style.animation=str_open_line;
  document.querySelector('article .signup .submit').textContent="התחבר";
  document.querySelector('article .signup .message').textContent="התחברות למשתמש קיים";
  document.querySelector('article .signup .extra-options').innerHTML="\n" +
      "        <a href=\"#\" class=\"link account-forgot\">שכחתי סיסמה</a>\n" +
      "        <br><br>\n" +
      "        <a href=\"#\" class=\"link account-forgot\" onclick=\"switch_register()\">הרשם עכשיו</a>";
}

function open_register() {
  document.querySelectorAll('article .signup .line')[0].style.animation=str_open_line;
  document.querySelectorAll('article .signup .line')[1].style.animation=str_open_line;
  switch_register();
}

function start_page() {
  if(sessionStorage.next_page === "login")// || sessionStorage.next_page !== "register")
    open_login();
  if(sessionStorage.next_page === "register")
    open_register();
}

function select_login() {
  sessionStorage.next_page = "login"
}

function select_register() {
  sessionStorage.next_page = "register"
}

function callbackFunction(event) {
    event.preventDefault();
    const myFormData = new FormData(event.target);

    const formDataObj = Object.fromEntries(myFormData.entries());
    console.log(formDataObj);
    sessionStorage.account_name = formDataObj.name
    console.log(sessionStorage.account_name);
}

const form = document.querySelector('article .signup');
form.addEventListener('submit', callbackFunction);


function getLocation() {
  if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(showPosition);
}

function showPosition(position) { //save user location in storage
    sessionStorage.user_latitude = position.coords.latitude;
    sessionStorage.user_longitude = position.coords.longitude;
}

function getDistance(lat1, lon1) { //calculate distance from user to a lat-lon position
      getLocation();
      let lat2 = sessionStorage.user_latitude;
      let lon2 = sessionStorage.user_longitude;
    var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 +
          c(lat1 * p) * c(lat2 * p) *
          (1 - c((lon2 - lon1) * p))/2;

  return Math.round(12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
}
async function search_results(input) {
    let x = document.querySelector('article');
    if (input == null)
        input = document.getElementById('searchbar').value
    else document.getElementById('searchbar').value = input;
    if (input === "") {
        x.innerHTML = ""
        load_element('header', 'login-bar.html')
        document.querySelector('nav').style.animation = 'lower-search 1s forwards'
        load_element('aside', 'sidebar.html')
        load_element('main', 'main.html')
        return
    }
    clear_element('main');
    load_element('aside', 'filter.html')
    document.querySelector('nav').style.animation = 'raise-search 1s forwards'
    input = input.toLowerCase();
    x.innerHTML = ""

    let response = await fetch("../results.json")
    let event_list = await response.json();
    let template = await get_element('result.html')
    for (i = 0; i < event_list.length; i++) {
        let obj = event_list[i];

        if (obj.title.toLowerCase().includes(input) ||
            obj.owner.toLowerCase().includes(input) ||
            obj.info.toLowerCase().includes(input)) {
            let result = template.replace('_title_', obj.title)
                .replace('_owner_', obj.owner)
                .replace('_info_', obj.info)
                .replace('_score_', `דירוג ${obj.score}`)
                .replace('_size_', `גודל ${obj.size}`)
                .replace('_price_', `${obj.price} ש"ח`)
                .replace('_distance_', `${getDistance(obj.latitude, obj.longitude)} מטר`)
            x.innerHTML += result
        }
    }
}

