export {updateStats, getStats, initState}

let initState = function (what, solutionId) {
    // YOUR CODE HERE
    let data = localStorage.getItem(what);
    let state = JSON.parse(data);
    if (state === null) {
        state = {
            "guesses": [],
            "solutionId": solutionId,
        };
        localStorage.setItem('situation.json', JSON.stringify(state));
    }


    return [state, function (guess) {
        if (guess != null) {
            state.guesses.push(guess);
            localStorage.setItem('situation.json', JSON.stringify(state));
        }
    }]
}

function successRate(e) {
    // YOUR CODE HERE
    let infor = localStorage.getItem(e)
    let data = JSON.parse(infor)
    return data.map(e => e.successRate)
}

let getStats = function (what) {
    // YOUR CODE HERE
    let data = JSON.parse(localStorage.getItem(what))
    if (data === null) {
        data = {
            winDistribution: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            gamesFailed: 0,
            currentStreak: 0,
            bestStreak: 0,
            totalGames: 0,
            successRate: 0,
        }

        localStorage.setItem(what, JSON.stringify(data));
    }

    return data
}


function updateStats(t) {
    // YOUR CODE HERE
    let stats = getStats("gameStats");

    if (t < 8) {
        //stats.winDistribution.push(1)
        stats.winDistribution[t] += 1
        stats.currentStreak += 1

    } else {
        stats.winDistribution.push(0)
        stats.gamesFailed += 1
        stats.currentStreak = 0

    }

    // Streaks
    let streaks = stats.winDistribution.join('').split('0')
    // Calculate bestStreak
    if(stats.currentStreak > stats.bestStreak){
        stats.bestStreak = stats.currentStreak
    }

    // let longest = streaks.sort(function (a, b) { return b.length - a.length })[0];
    // if(longest > stats.winDistribution.bestStreak){
    //     stats.winDistribution.bestStreak = longest.length;
    // }


    // Calculate totalGames
    stats.totalGames += 1;

    // Calculate successRate
    let gamesWin = stats.totalGames - stats.gamesFailed;
    stats.successRate = ((gamesWin / stats.totalGames) * 100).toFixed(0)

    // Save the stats to localStorage
    localStorage.setItem("gameStats", JSON.stringify(stats));
}


let gamestats = getStats('gameStats');



