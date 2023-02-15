const str_expand_comment = "expand 0.5s ease forwards";

function open_textbox() {
    document.querySelector('.write-comment').style.animation=str_expand_comment;
}

var searchBar = document.getElementById('search-bar');
var searchInput = document.getElementById("search-input")
var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

window.addEventListener('scroll', function() {
  //var newScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (window.pageYOffset > 0) {
    searchBar.classList.add('scrolled');
    searchInput.classList.add('scrolled');
  } else {
    searchBar.classList.remove('scrolled');
    searchInput.classList.remove('scrolled');
  }
  scrollTop = newScrollTop;
});

searchBar.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

var form = document.querySelectorAll('.post-btn .like');
// var input = form.querySelector('a');

form.forEach(function(item) {
    var input = item.querySelector('a');
    input.addEventListener('click', function(event) {
        event.preventDefault();
        item.submit();
    });
});    

var navLinks = document.querySelectorAll('a');

navLinks.forEach(function(link) {
  if (link.href === window.location.href) {
    link.classList.add('current');
  }
});