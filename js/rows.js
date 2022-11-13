// YOUR CODE HERE :  
// .... stringToHTML ....
import { stringToHTML } from "./fragments.js"
// .... setupRows .....
export { setupRows}

const delay = 350;
const attribs = ['nationality', 'leagueId', 'teamId', 'position', 'birthdate']


let setupRows = function (game) {


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

    function setContent(guess) {
        return [
            `<img src="https://playfootball.games/who-are-ya/media/nations/${guess.nationality.toLowerCase()}.svg" alt="" style="width: 60%;">`,
            `<img src="https://playfootball.games/media/competitions/${leagueToFlag(guess.leagueId)}.png" alt="" style="width: 60%;">`,
            `<img src="https://cdn.sportmonks.com/images/soccer/teams/${guess.teamId % 32}/${guess.teamId}.png" alt="" style="width: 60%;">`,
            `${guess.position}`,
            `${getAge(guess.birthdate)}`
        ]
    }

    function showContent(content, guess) {
        let fragments = '', s = '';
        for (let j = 0; j < content.length; j++) {
            s = "".concat(((j + 1) * delay).toString(), "ms")
            fragments += `<div class="w-1/5 shrink-0 flex justify-center ">
                            <div class="mx-1 overflow-hidden w-full max-w-2 shadowed font-bold text-xl flex aspect-square rounded-full justify-center items-center bg-slate-400 text-white ${check(attribs[j], guess[attribs[j]]) == 'correct' ? 'bg-green-500' : ''} opacity-0 fadeInDown" style="max-width: 60px; animation-delay: ${s};">
                                ${content[j]}
                            </div>
                         </div>`
        }

        let child = `<div class="flex w-full flex-wrap text-l py-2">
                        <div class=" w-full grow text-center pb-2">
                            <div class="mx-1 overflow-hidden h-full flex items-center justify-center sm:text-right px-4 uppercase font-bold text-lg opacity-0 fadeInDown " style="animation-delay: 0ms;">
                                ${guess.name}
                            </div>
                        </div>
                        ${fragments}`

        let playersNode = document.getElementById('players')
        playersNode.prepend(stringToHTML(child))
    }

    return /* addRow */ function (playerId) {

        let guess = getPlayer(playerId)
        console.log(guess)

        let content = setContent(guess)
        showContent(content, guess)
    }
}
