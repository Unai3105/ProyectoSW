//API gratuita: https://www.football-data.org/
//Token API: 4bc4dbd10706438a8d8b5e788a6252e4

import fs from 'fs'

window.onload = function () {

    console.log(getBigFiveCompetitions())

}

//Obtener todas las competiciones de la API
async function getCompetitions() {

    let competitions = await fetch('http://api.football-data.org/v4/competitions')
        .then(response => response.json())
        .catch(error => document.write(error))

    return competitions
}

//Ejercicio 3.1.1. Obtener las competiciones con Id = '2014'
function getId2014() {
    let competitions = getCompetitions()
    let id2014 = competitions.competitions.filter(comp => comp.id == '2014')

    return id2014
}

//Ejercicio 3.1.2. Obtener las competiciones que pertenecen a 'TIER_ONE'
function getTierOneCompetitions() {
    let competitions = getCompetitions()
    let tierOneCompetitions = competitions.competitions.filter(comp => comp.plan == 'TIER_ONE')

    return tierOneCompetitions
}

//Ejercicio 3.1.3. Obtener las competiciones españolas
function getSpanishCompetitions() {
    let competitions = getCompetitions()
    let spanishCompetitions = competitions.competitions.filter(comp => comp.area.code == 'ESP')

    return spanishCompetitions
}

//Ejercicio 3.1.4. Obtener las competiciones españolas, alemanas, inglesas, francesas e italianas del 'TIER_ONE'
function getSomeTierOneCompetitions() {
    let competitions = getCompetitions()
    let someTierOneCompetitions = competitions.competitions.filter(comp => comp.plan == 'TIER_ONE' && (comp.area.code == 'ESP'
        || comp.area.code == 'DEU'
        || comp.area.code == 'ENG'
        || comp.area.code == 'FRA'
        || comp.area.code == 'ITA'))

    return someTierOneCompetitions
}

//Ejercicio 3.1.5. Obtener las 5 grandes competiciones
function getBigFiveCompetitions() {
    let competitions = getCompetitions()
    let bigFiveCompetitions = competitions.competitions.filter(comp => comp.plan == 'TIER_ONE' && (comp.area.code == 'ESP'
        || comp.area.code == 'DEU'
        || comp.area.code == 'ENG'
        || comp.area.code == 'FRA'
        || comp.area.code == 'ITA')
        && comp.name != 'Championship')

    return bigFiveCompetitions
}

//Ejercicio 3.1.6. Obtener los Id de las 5 grandes competiciones
function getIdFromBigFive() {
    let bigFive = getBigFiveCompetitions()
    let bigFiveID = bigFive.map(comp => comp.id)

    return bigFiveID
}

//Ejer 4. LLamada http con IntelliJ, entrar en Tools > HTTP Client > Create Request in HTTP Client

//En este caso 2021 indica el Id de la competición 'Premiere Ligue'
/*
GET https://api.football-data.org/v4/competitions/2021/teams
Accept: application/json
X-Auth-Token: 4bc4dbd10706438a8d8b5e788a6252e4
*/

//https://www.youtube.com/watch?v=Y2FpY61h5Z8
/**
 * It takes two arguments, the first one is the name of the file to be created, and the second one is
 * the data to be written in the file
 * @param jsonName - The name of the file to be created (newFile.json, newFile.txt, ...).
 * @param jsonData - The data that will be written to the file, must be a json.
 */
function generateFile(jsonName, jsonData) {
    jsonData = JSON.stringify(jsonData)
    jsonName = `./bd/${jsonName}`
    fs.writeFile(jsonName, jsonData, (error) => {
        if (error) {
            console.log(`Error: ${error}`)
        } else {
            console.log("Archivo generado correctamente")
        }
    })
}

/**
 * It gets the name of a competition by its id, then it returns the teams of that competition.
 * @param compId - The id of the competition
 * @returns An array of objects.
 */
function getTeamsByCompId(compId) {
    let comp = JSON.parse(fs.readFileSync(`./bd/bigFiveCompetitions.json`))
    let compName = comp.filter(e => e.id == compId).map(e => e.name).join()
    let teams = JSON.parse(fs.readFileSync(`./bd/${compName}.json`))
    return teams.teams
}

/**
 * It takes a competition id and a team name and returns the squad of that team belong to that competition.
 * @param compId - The competition ID
 * @param teamName - The team name
 * @returns An array of arrays of objects.
 */
function getSquadByTeamName(compId, teamName) {
    let teams = getTeamsByCompId(compId)
    let squad = teams.teams.filter(e => e.name == teamName)
    return squad.map(e => e.squad)
}

/**
 * It takes a competition ID and returns the name of the competition.
 * @param compId - The id of the competition
 * @returns The name of the competition.
 */
function getCompNameById(compId) {
    let comp = JSON.parse(fs.readFileSync(`./bd/bigFiveCompetitions.json`))
    let compName = comp.filter(e => e.id == compId).map(e => e.name).join()
    return compName
}

/**
 * It takes a compId, gets the compName from the compId, then gets the comps from the compName.
 * @param compId - The id of the competition
 * @returns An array of objects.
 */
function getCompById(compId) {
    let compName = getCompNameById(compId)
    let comps
    try {
        comps = JSON.parse(fs.readFileSync(`./bd/${compName}.json`))
    } catch (error) {
        console.log(`${error}`)
    }
    return comps
}

//Ejer 5.1. Asignar a cada miembro de los equipos el id de su equipo y el de su liga (Premier League)
/**
 * It takes a competition id, gets the competition object, gets the teams array, gets the squad array,
 * and adds the team id and league id to each player.
 * @param compId - The id of the competition
 * @returns the comp object with the teamId and leagueId added to the players.
 */
function addTeamIdAndLeagueIdToPlayers(compId) {
    let teamsId = getTeamsByCompId(compId).map(e => e.id)
    let comp = getCompById(compId)
    let i = 0
    comp.teams.map(e => {
        e.squad.map(e => {
            e.teamId = teamsId[i]
            e.leagueId = compId
        })
        i++
    })
    return comp
}//Faltaría actualizar el archivo json con generateFile()

//Ejer 5.2. Modificar nombre de atributos
//Cambiar atributo dateOfBirth por birthDate
/**
 * It takes a competition, finds the teams, finds the squad, finds the attribute to delete, deletes it,
 * and then creates a new attribute with the same value.
 * @param compId - the id of the competition
 * @param attributeToDelete - "position"
 * @param newAttribute - the new attribute name
 * @returns The comp object with the new attribute name.
 */
function changePlayersAttributeName(compId, attributeToDelete, newAttribute) {
    let comp = getCompById(compId)
    comp.teams.map(e => {
        e.squad.map(e => {
            let temporal = e[attributeToDelete]
            delete e[attributeToDelete]
            e[newAttribute] = temporal
        })
    })
    return comp
}//Faltaría actualizar el archivo json con generateFile()

//Ejer 5.3. Modificar valores de atributos
//Offence -> FW
//GoalKeeper -> GK
//Midfield -> MF
//Defence -> DF
/**
 * It takes a competition object, loops through the teams, loops through the players, and changes the
 * position value to a shorter version.
 * @param compId - The id of the competition you want to change the players position value.
 * @returns the modified comp object.
 */
function changePlayersPositionValue(compId) {
    let comp = getCompById(compId)
    comp.teams.map(e => {
        e.squad.map(e => {
            switch (e.position) {
                case "Goalkeeper":
                    e.position = "GK"
                    break
                case "Defence":
                    e.position = "DF"
                    break
                case "Midfield":
                    e.position = "MF"
                    break
                case "Offence":
                    e.position = "FW"
                    break
            }
        })
    })
    return comp
}//Faltaría actualizar el archivo json con generateFile()

//Ejer 5.4. Hacer los 3 apartados anteriores con js (ya realizado)

//Ejer 6.1.1
/**
 * It takes a date as a parameter and returns the number of days between that date and today.
 * @param base - The date to compare with today's date
 * @returns The difference in days between the current date and the date passed as a parameter.
 */
function differenceInDays(base) {
    let todayDate = new Date(Date.now())
    //Quitamos las horas del dia de hoy
    let todayDateWithoutHours = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate())
    //Restar 1 al mes (detecta 1 menos nose por qué)
    let dateToCompare = new Date(base.getFullYear(), base.getMonth() - 1, base.getDate())
    let diffDays = Math.abs(todayDateWithoutHours - dateToCompare)
    return Math.trunc(diffDays / (1000 * 60 * 60 * 24))
}

//Ejer 6.1.2
/**
 * It reads a JSON file and returns it as a JavaScript object.
 * @param path - The path to the JSON file.
 * @returns The JSON.parse() method parses a JSON string, constructing the JavaScript value or object
 * described by the string. An optional reviver function can be provided to perform a transformation on
 * the resulting object before it is returned.
 */
function fetchJSON(path) {
    return JSON.parse(fs.readFileSync("./bd/" + path + ".json"))
}

//Ejer 6.1.3
/**
 * It takes the players array, the solution array and the difference in days between the current date
 * and the start date and returns the player that should be the solution for that day.
 * @param players - Array of players
 * @param solutionArray - [{id: 1, name: "Juan"}, {id: 2, name: "Pedro"}, {id: 3, name: "Pablo"}]
 * @param difference_In_Days - The difference in days between the current date and the date of the
 * first match.
 * @returns An array of objects.
 */
function getSolution(players, solutionArray, difference_In_Days) {
    // YOUR CODE HERE
  let longitudSolutionJSON = Object.keys(solutionArray).length
  //En el caso de que la diferencia de dias sea mayor que el número de elementos de solution.json se vuelve a empezar (evitamos nullPointerException)
  while (longitudSolutionJSON < difference_In_Days) {
    difference_In_Days -= longitudSolutionJSON
  }
  return players.filter(p=>p.id == solutionArray[difference_In_Days].id)
}

//Ejer 6.1.4
//style="--tw-blur:blur(9px);" cambiar a 0 pixeles para que no se vea pixelado.

//Ejer 7.1.1
/**
 * If the current month is less than the birth month, or if the current month is the same as the birth
 * month but the current day is less than the birth day, then subtract one from the age.
 * @param dateString - The date string to be parsed.
 * @returns The age of the person.
 */
function getAge(dateString) {
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
//Ejer 7.1.2
/**
 * It takes two parameters, the first one is the key of the object you want to check, the second one is
 * the value you want to check against.
 * The function returns a string with the result of the check.
 * @param theKey - the key of the object you want to check
 * @param theValue - the value that the user has entered
 * @returns a string with the value "correct", "higher" or "lower" depending on the value of theKey and
 * theValue.
 */
function check(theKey, theValue) {
    let jugador = getSolution(fetchJSON("fullplayers"), fetchJSON("solution"), differenceInDays(new Date(2022, 8, 18)))
    let rdo = ""
    switch (theKey) {
        case "birthdate":
            let diff = new Date(jugador.map(e => e[theKey])) - new Date(theValue)
            if (diff == 0) {
                rdo = "correct"
            } else if (diff > 0) {
                rdo = "higher"
            } else rdo = "lower"
            break

        default:
            if (jugador.map(e => e[theKey]) == theValue) {
                rdo = "correct"
            } else rdo = "incorrect"
            break
    }

    return rdo
}

//Ejer 7.1.3
/**
 * It takes a playerId, and returns a promise that resolves to an array of players that match the
 * playerId.
 * @param playerId - The id of the player you want to get.
 * @returns An array of objects.
 */
function getPlayer(playerId) {
    return fetchJSON("fullplayers").filter(e => e.id == playerId)
}

//Ejer 7.1.4
/**
 * It takes a leagueId, fetches the JSON, filters it to find the leagueId, maps it to the id, and joins
 * it.
 * @param leagueId - The ID of the league you want to get the flag of.
 * @returns The leagueId is being returned.
 */
function leagueToFlag(leagueId){
    return fetchJSON("leagueId").filter(e=>e.id == leagueId).map(e=>e.id).join()
}

//Ejer 7.1.5
//Función stringToHTML añadida y exportada desde fragments.js e importada en rows.js

//Ejer 7.1.6
//Función setupRows exportada desde rows.js e importada en main.js
//FALTA LA SEGUNDA PARTE DEL APARTADO

//Ejer 7.1.7
//Todas las funciones añadidas

//Ejer 8.1.1 Completed
//Ejer 8.1.2 Completed
//Ejer 8.1.3 Completed
//Ejer 8.1.4 Completed

//Ejer 9.1.1
//Ejer 9.1.2
//Ejer 9.1.3
//Ejer 9.1.4
//Ejer 9.1.5
//Ejer 9.1.6
//Ejer 9.1.7

//Ejer 10.1.1
//Ejer 10.1.2
//Ejer 10.1.3
//Ejer 10.1.4
//Ejer 10.1.5
//Ejer 10.1.6
//Ejer 10.1.7
//Ejer 10.1.8

//Ejer 11.1.1
//Ejer 11.1.2
//Ejer 11.1.3

//Ejer 12.1.1
//Ejer 12.1.2

//Ejer 13.1.1
//Ejer 13.1.2
//Ejer 13.1.3

