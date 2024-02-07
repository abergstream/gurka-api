const apiKey = "AndreasHemligaNyckel";
const url = `https://andreasb.se/gurka/api/?apikey=${apiKey}`;

const wrapper = document.querySelector(".wrapper");
async function fetchResult() {
  try {
    const response = await fetch(url);
    const data = await response.json();

    // Sort by newest game first
    const newestFirst = data.games.reverse();
    // Loop through each game
    for (const game of newestFirst) {
      const { gameID, date } = game;
      const gameDiv = createGameDiv(date);

      // Filter players for this game
      const players = data.game_results.filter(
        (result) => result.gameID === gameID
      );
      // Sort each game by result
      // players.sort((a, b) => b.result - a.result);
      // Loop through players and append to gameDiv
      const scoreContainer = createContainer("score-row", players.length);
      const playerContainer = createContainer("players-row", players.length);

      let topScore = getMaxScore(players);

      players.forEach((player) => {
        const playerName = getPlayerName(data.users, player.userID);
        const playerDiv = createPlayerDiv(playerName);
        const scoreDiv = createScoreDiv(
          player.result,
          topScore,
          players.length
        );
        scoreContainer.appendChild(scoreDiv);
        playerContainer.appendChild(playerDiv);
      });
      gameDiv.appendChild(scoreContainer);
      gameDiv.appendChild(playerContainer);
      wrapper.appendChild(gameDiv);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function createGameDiv(date) {
  const gameDiv = document.createElement("div");
  gameDiv.classList.add("game");

  const dateDiv = document.createElement("div");
  dateDiv.classList.add("date");
  dateDiv.textContent = date;

  gameDiv.appendChild(dateDiv);
  return gameDiv;
}
function createScoreDiv(content, scoreRange) {
  const divContainer = document.createElement("div");
  divContainer.classList.add("score-container");
  const scoreBarDiv = document.createElement("div");
  const scoreDiv = document.createElement("div");
  scoreDiv.classList.add("score");
  scoreDiv.innerText = content;

  const percentPerScore = 100 / scoreRange;
  let score = content;
  let cssClass = "score-bar--plus";
  if (score < 0) {
    cssClass = "score-bar--minus";
    score = score * -1;
  }

  const heightPercentage = (percentPerScore * parseFloat(score)) / 2;
  scoreBarDiv.style.height = heightPercentage + "%";
  scoreBarDiv.classList.add("score-bar", cssClass);

  if (content < 0) {
    scoreDiv.style.top = 52 + parseFloat(heightPercentage) + "%";
  } else {
    scoreDiv.style.bottom = 52 + parseFloat(heightPercentage) + "%";
  }
  // scoreBarDiv.innerText = content;
  divContainer.appendChild(scoreBarDiv);
  divContainer.appendChild(scoreDiv);

  return divContainer;
}
function getPlayerName(users, userID) {
  const user = users.find((user) => user.userID === userID);
  return user ? user.name : "Unknown Player";
}
function createContainer(cssClass, numberOfPlayers) {
  const container = document.createElement("div");
  container.classList.add(cssClass);
  if (numberOfPlayers) {
    container.classList.add("grid-" + numberOfPlayers);
  }
  return container;
}
function createPlayerDiv(name) {
  const playerDiv = document.createElement("div");
  playerDiv.textContent = `${name}`;
  playerDiv.classList.add("player");
  return playerDiv;
}
function getMaxScore(players) {
  let topScore = [];
  players.forEach((score) => {
    topScore.push(parseFloat(score.result));
  });
  topScore.sort((a, b) => a - b);
  let lowest = topScore[0] * -1;
  let highest = topScore[topScore.length - 1];
  let numberRange = lowest;
  if (highest > lowest) {
    numberRange = highest;
  }
  if (numberRange % 5 != 0) {
    return parseFloat(numberRange) + 5 - (numberRange % 5);
  } else {
    return parseFloat(numberRange);
  }
}
fetchResult();
