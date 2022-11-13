// YOUR CODE HERE :  
// .... stringToHTML ....
import { stringToHTML } from "./fragments.js"
// .... fetchJSON ....
//import { fetchJSON } from "./loaders.js";
// .... higher, lower ....
import { higher, lower } from "./fragments.js";
// .... initState ....
import { initState } from "./stats.js"
// .... updateStats .....
import { updateStats } from "./stats.js";
// .... statsgameOver .....
import { stats, headless, toggle } from "./fragments.js"
// .... setupRows .....
export { setupRows, getTime, showTime }

const delay = 350;
const attribs = ['nationality', 'leagueId', 'teamId', 'position', 'birthdate']

function getTime() {
    let dateHoy = new Date(Date.now())
    let dateMañana = new Date(dateHoy.getFullYear(), dateHoy.getMonth(), dateHoy.getDate() + 1)
    let diff = dateMañana - dateHoy
    let horas = Math.trunc(diff / (1000 * 60 * 60))
    let mins = Math.trunc(diff / (1000 * 60)) - horas * 60
    let sec = Math.trunc(diff / (1000)) - horas * 60 * 60 - mins * 60
    let time = []
    return time = [horas, mins, sec]
}

function showTime() {
    let time = getTime()
    let horas = time[0]
    if (horas < 10) horas = "0" + horas
    let mins = time[1]
    if (mins < 10) mins = "0" + mins
    let sec = time[2]
    if (sec < 10) sec = "0" + sec

    document.getElementById("nextPlayer").innerHTML = `${horas}:${mins}:${sec}`
}

let setupRows = function (game) {
    // console.log(game.solution.map(e=>e.id).join())
    let [state, updateState] = initState('WAYgameState', game.solution.map(e => e.id).join())

    function leagueToFlag(leagueId) {
        // YOUR CODE HERE
        const leagues = ["564", "8", "82", "384", "301"]
        const leaguesFlag = ["es1", "en1", "de1", "it1", "fr1"]
        return leaguesFlag[leagues.indexOf(leagueId)]
    }


    function getAge(dateString) {
        // YOUR CODE HERE
        let hoy = new Date()
        let fechaNacimiento = new Date(dateString)
        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear()
        let diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth()
        if (
            diferenciaMeses < 0 ||
            (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())
        ) {
            edad--
        }
        return edad
    }

    let getPlayer = function (playerId) {
        // YOUR CODE HERE
        //console.log(game.players.filter(e=>e.id == playerId))
        return game.players.filter(e => e.id == playerId)

    }

    let check = function (theKey, theValue) {
        // YOUR CODE HERE
        let jugador = game.solution

        let rdo = ""
        switch (theKey) {
            case "birthdate":
                let diff = new Date(jugador.map(e => e[theKey])[0]) - new Date(theValue[0])
                if (diff < 31536000000) {
                    diff = 0
                }
                // console.log(diff)
                // console.log(diff == 0)
                if (diff == 0) {
                    rdo = "correct"
                } else if (diff > 0) {
                    rdo = "lower"
                } else rdo = "higher"
                break

            default:
                //console.log(jugador)
                // console.log(jugador.map(e => e[theKey])[0])
                // console.log(theValue)
                if (jugador.map(e => e[theKey])[0] == theValue[0]) {
                    rdo = "correct"
                } else rdo = "incorrect"
                break
        }

        return rdo
    }

    function unblur(outcome) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                document.getElementById("mistery").classList.remove("hue-rotate-180", "blur")
                document.getElementById("combobox").remove()
                let color, text
                if (outcome == 'success') {
                    color = "bg-blue-500"
                    text = "Awesome"
                } else {
                    color = "bg-rose-500"
                    text = "The player was " + game.solution.map(e => e.name)
                }
                document.getElementById("picbox").innerHTML += `<div class="animate-pulse fixed z-20 top-14 left-1/2 transform -translate-x-1/2 max-w-sm shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${color} text-white"><div class="p-4"><p class="text-sm text-center font-medium">${text}</p></div></div>`
                resolve();
            }, "2000")
        })
    }

    function setContent(guess) {
        document.getElementsByClassName("mx-1 overflow-hidden h-full flex items-center justify-center sm:text-right px-4 uppercase font-bold text-lg opacity-0 fadeInDown ").value = guess.map(e => e.name)
        let arrow = ""
        if (check("birthdate", guess.map(e => e.birthdate)) == "higher") {
            arrow = higher
        } else if (check("birthdate", guess.map(e => e.birthdate)) == "lower") {
            arrow = lower
        }
        return [
            `<img src="https://playfootball.games/who-are-ya/media/nations/${guess.map(e => e.nationality).join().toLowerCase()}.svg" alt="" style="width: 60%;">`,
            `<img src="https://playfootball.games/media/competitions/${leagueToFlag(guess.map(e => e.leagueId).join())}.png" alt="" style="width: 60%;">`,
            `<img src="https://cdn.sportmonks.com/images/soccer/teams/${guess.map(e => e.teamId).join() % 32}/${guess.map(e => e.teamId).join()}.png" alt="" style="width: 60%;">`,
            `${guess.map(e => e.position)}`,
            `${getAge(guess.map(e => e.birthdate))}${arrow}`
        ]
    }

    function showContent(content, guess) {
        let fragments = '', s = '';
        for (let j = 0; j < content.length; j++) {
            s = "".concat(((j + 1) * delay).toString(), "ms")
            fragments += `<div class="w-1/5 shrink-0 flex justify-center ">
                            <div class="mx-1 overflow-hidden w-full max-w-2 shadowed font-bold text-xl flex aspect-square rounded-full justify-center items-center bg-slate-400 text-white ${check(attribs[j], guess.map(e => e[attribs[j]])) == 'correct' ? 'bg-green-500' : ''} opacity-0 fadeInDown" style="max-width: 60px; animation-delay: ${s};">
                                ${content[j]}
                            </div>
                         </div>`
        }

        let child = `<div class="flex w-full flex-wrap text-l py-2">
                        <div class=" w-full grow text-center pb-2">
                            <div class="mx-1 overflow-hidden h-full flex items-center justify-center sm:text-right px-4 uppercase font-bold text-lg opacity-0 fadeInDown " style="animation-delay: 0ms;">
                                ${guess.map(e => e.name)}
                            </div>
                        </div>
                        ${fragments}`

        let playersNode = document.getElementById('players')
        playersNode.prepend(stringToHTML(child))
    }

    function showStats() {
        let text = headless(stats(getTime()))
        document.body.appendChild(stringToHTML(text))
        toggle()
    }

    function resetInput() {
        // YOUR CODE HERE
        let input = document.getElementById('myInput')
        let situacion = JSON.parse(localStorage.getItem('situation.json'));
        let tries = situacion.guesses.length
        input.value = `Guess {${tries}} of 8`
    }

    function gameEnded(lastGuess) {
        // YOUR CODE HERE
        // Jugador is the winner player for the current day
        let jugador = game.solution
        // In case the ID of the lastGuess is the same as the ID of the player for the current day, the game is finished
        if (lastGuess === jugador.map(e => e.id).join()) {
            return true
        }

        let situacion = JSON.parse(localStorage.getItem('situation.json'));
        // In case the number of attempts is greater than 8, the game is finished
        // console.log(situacion.guesses.length)
        if (situacion.guesses.length >= 8) {
            return true
        }

        return false
    }

    function success() {
        let input = document.getElementById('myInput')
        unblur("success")
        input.value = "has acertado!"
    }

    function gameOver() {
        let input = document.getElementById('myInput')
        unblur("gameOver")
        input.value = "game over"
    }

    resetInput();

    return /* addRow */ function (playerId) {

        let guess = getPlayer(playerId)
        console.log(guess)

        let content = setContent(guess)

        game.guesses.push(playerId)
        updateState(playerId)

        resetInput();
        // console.log("playerId: " + playerId)
        if (gameEnded(playerId)) {
            updateStats(game.guesses.length, "gameStats");

            if (playerId == game.solution.map(e => e.id)) {
                success();
            }
            // console.log(game.guesses)
            if (game.guesses.length == 8) {
                gameOver();
            }
            document.getElementById("myInput").readOnly = true

            setTimeout(() => {
                showStats()
                document.getElementById("closedialog").addEventListener("click", event => {
                    console.log("hola")
                    location.reload()
                    // document.getElementById("stadisticsContainer").style.display = "block"
                    // document.getElementById("headlessui-dialog-overlay-5").style.opacity = 0
                })

                let interval = setInterval(showTime, 1000)
            }, 2750)

        }

        showContent(content, guess)
    }
}