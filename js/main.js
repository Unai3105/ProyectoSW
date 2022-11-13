import { folder, leftArrow } from "./fragments.js";
import { fetchJSON } from "./loaders.js";
import { setupRows } from "./rows.js"
function differenceInDays(date1) {
  // YOUR CODE HERE
  let todayDate = new Date(Date.now())
  //Quitamos las horas del dia de hoy
  let todayDateWithoutHours = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate())
  //Restar 1 al mes (detecta 1 menos nose por qué)
  let dateToCompare = new Date(date1.getFullYear(), date1.getMonth() - 1, date1.getDate())
  let diffDays = Math.abs(todayDateWithoutHours - dateToCompare)
  return Math.trunc(diffDays / (1000 * 60 * 60 * 24))
}

let difference_In_Days = differenceInDays(new Date("08-18-2022"));

window.onload = function () {
  document.getElementById(
    "gamenumber"
  ).innerText = difference_In_Days.toString();
  document.getElementById("back-icon").innerHTML = folder + leftArrow;
};

let game = {
  guesses: [],
  solution: {},
  players: [],
  leagues: []
};

function getSolution(players, solutionArray, difference_In_Days) {
  // YOUR CODE HERE
  let longitudSolutionJSON = Object.keys(solutionArray).length
  //En el caso de que la diferencia de dias sea mayor que el número de elementos de solution.json se vuelve a empezar (evitamos nullPointerException)
  while (longitudSolutionJSON <= difference_In_Days) {
    difference_In_Days -= longitudSolutionJSON
    //console.log(difference_In_Days)
  }
  return players.filter(e => e.id == solutionArray[difference_In_Days].id)
}

Promise.all([fetchJSON("fullplayers"), fetchJSON("solution")]).then(
  (values) => {

    let solution;

    [game.players, solution] = values;

    game.solution = getSolution(game.players, solution, difference_In_Days);

    console.log(game.solution);

    document.getElementById(
      "mistery"
    ).src = `https://playfootball.games/media/players/${game.solution.map(e => e.id) % 32
    }/${game.solution.map(e => e.id)}.png`;

    // YOUR CODE HERE
    //game.guesses = 
    let addRow = setupRows( game );
    // get myInput object...
    let boton = document.getElementById("myInput")
    // when the user types a number an press the Enter key:
    let idPlayer
    boton.addEventListener("keydown", e => {
      if (e.keyCode == 13 && boton.value != ""){
        /* the ID of the player, where is it? */
        idPlayer = boton.value
        //console.log(boton.value)
        addRow(idPlayer)
      }
    })
  
  }
);
