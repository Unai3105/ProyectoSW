import { getStats } from "./stats.js"

export const folder = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="h-6 w-6" name="folder"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>`;
export const leftArrow = `<svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" class="h-4 w-4 absolute right-0 -bottom-0.5" name="leftArrowInCircle"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"></path></svg>`;

export const higher = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" aria-hidden="true" width="25" style="margin-right: -8px; margin-left: -3px;"><path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>`

export const lower = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" aria-hidden="true" width="25" style="margin-right: -8px; margin-left: -3px;"><path fill-rule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>`

export { stats, toggle, headless}

// YOUR CODE HERE export stringToHTML . Consider to use a single export command instead of one for each const/function

export { stringToHTML }

const stringToHTML = (str) => {
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, 'text/html');
    return doc.body
}
let toggle = function () {
    if (document.getElementById("showHide").nextSibling.firstChild.style.display == 'none') {
        document.getElementById("showHide").innerText = "Hide Guess Distribution"
        document.getElementById("showHide").nextSibling.firstChild.style.display = 'block'
    } else {
        document.getElementById("showHide").innerText = "Show Guess Distribution"
        document.getElementById("showHide").nextSibling.firstChild.style.display = 'none'
    }
}

let headless = function (inner) {
    return `<div id="headlessui-portal-root">
                <div>
                    <div class="fixed z-10 inset-0 overflow-y-auto" id="headlessui-dialog-1" role="dialog" aria-modal="true" aria-labelledby="headlessui-dialog-title-6">
                        <div class="flex items-center justify-center min-h-screen py-10 px-2 text-center sm:block sm:p-0">
                            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" id="headlessui-dialog-overlay-5" aria-hidden="true"></div>
                            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&ZeroWidthSpace;</span>
                            ${inner}
                        </div>
                    </div>
                </div>
            </div>`
}

const stats = function (nextPlayerInterval) {
    const { totalGames, bestStreak, currentStreak, successRate, gamesFailed, winDistribution } = getStats("gameStats");

    let blocks = `<div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6 dark:bg-gray-800" id="stadisticsContainer"><div class="absolute right-4 top-4" id="closedialog"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" class="h-6 w-6 cursor-pointer dark:stroke-white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><div><div class="text-center"><h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" id="headlessui-dialog-title-7">Statistics</h3><div class="mt-2"><div class="flex justify-center my-2"><div class="items-center justify-center m-1 w-1/4 dark:text-white"><div class="text-3xl font-bold">${totalGames}</div><div class="text-xs">Total tries</div></div><div class="items-center justify-center m-1 w-1/4 dark:text-white"><div class="text-3xl font-bold">${successRate}%</div><div class="text-xs">Success rate</div></div><div class="items-center justify-center m-1 w-1/4 dark:text-white"><div class="text-3xl font-bold">${currentStreak}</div><div class="text-xs">Current streak</div></div><div class="items-center justify-center m-1 w-1/4 dark:text-white"><div class="text-3xl font-bold">${bestStreak}</div><div class="text-xs">Best streak</div></div></div><h4 class="cursor-pointer text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" id="showHide">Show Guess Distribution</h4><div class="columns-1 justify-left m-2 text-sm dark:text-white">`

    let sum = winDistribution.reduce(function (previousValue, currentValue) {
        return previousValue + currentValue;
    });

    let time = nextPlayerInterval
    let horas = time[0]
    if(horas<10) horas = "0"+horas
    let mins = time[1]
    if(mins<10) mins = "0"+mins
    let sec = time[2]
    if(sec<10) sec = "0"+sec

    blocks += "<div id='guesscontainer' style='display:none'>"
    for (let i = 1; i <= 8; i++) {
        blocks += `<div class="flex justify-left m-1">
                        <div class="items-center justify-center w-2">${i}</div>
                        <div class="rounded-full w-full ml-2">
                            <div class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 rounded-l-full" style="width: ${Math.ceil(winDistribution[i] / sum * 100)}%;">
                                ${winDistribution[i]}
                            </div>
                        </div>
                    </div>`
    }
    blocks += "</div>"

    blocks += `<div class="mt-2 justify-center items-center space-x-2 dark:text-white">
                    <div>
                        <h5>New footballer:</h5>
                        <span class="text-lg font-medium text-gray-900 dark:text-gray-100" id="nextPlayer">${horas}:${mins}:${sec}</span>
                    </div>
                   <!-- <button type="button" class="rounded-md border border-transparent shadow-sm px-4 pt-1 pb-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm" tabindex="0"><span class="block text-2xl tracking-wide font-bold leading-7">Share</span>
                   <span class="block text-xs tracking-tight font-light">#HashTag</span></button> -->
               </div>
               <div class="mt-3">
                <a class="font-bold dark:text-white text-lg space-x-2 flex items-center justify-center" href="https://www.instagram.com/unairoa_3105/" target="_blank" rel="noreferrer">
                    <svg class="w-6 h-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <img src="instagramIcon.png" width="30" height="30">
                        </svg>
                    <span>Follow on Instagram</span>
                </a>
               </div>
               <a href="https://ikasten.io" class="bg-black/10 dark:bg-white/10 border-t border-t-black/20 dark:border-t-white/20 py-4 sm:pb-6 px-4 sm:px-6 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 flex justify-between items-center mt-3 text-left">
               <div class="dark:text-white">
                   <div class="text-lg font-extrabold text-[#b837c6] dark:text-[#ceff27]" style="color: #ceff27">Sistemas Web</div>
                   <div class="text-sm">Práctica del curso 2022-2023</div>
               </div>
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" class="h-6 w-6 ml-2 cursor-pointer dark:stroke-white">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
               </svg></a>
               
               </div></div></div></div>`

    return blocks
}