var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    // console.log(`arrow${event.target.id}`);
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
      document.getElementById(`arrow${event.target.id}`).src="./assets/images/caret-down-fill.svg";
    } else {
      content.style.display = "block";
      document.getElementById(`arrow${event.target.id}`).src="./assets/images/caret-up-fill.svg";
    }
  });
}