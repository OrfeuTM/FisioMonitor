const exercise = document.getElementById("exercise-1");
const checkboxes = exercise.querySelectorAll(".set-checkbox");

checkboxes.forEach(checkbox => {
  checkbox.addEventListener("change", checkCompletion);
});

function checkCompletion() {
  const allChecked = Array.from(checkboxes)
    .every(checkbox => checkbox.checked);

  if (allChecked) {
    exercise.classList.add("completed");
  } else {
    exercise.classList.remove("completed");
  }
}
