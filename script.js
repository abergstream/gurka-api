const apiKey = "AndreasHemligaNyckel";
const url = `https://andreasb.se/gurka/api/?apikey=${apiKey}`;

const wrapper = document.querySelector(".wrapper");
async function fetchResult() {
  try {
    const response = await fetch(url);
    const data = await response.json();

    // Loop through each game
    for (const game of data.games) {
      const { gameID, date } = game;
      const gameDiv = createGameDiv(date);

      // Filter players for this game
      const players = data.game_results.filter(
        (result) => result.gameID === gameID
      );

      // Sort each game by result
      players.sort((a, b) => b.result - a.result);
      // Loop through players and append to gameDiv
      players.forEach((player) => {
        const playerName = getPlayerName(data.users, player.userID);
        const playerDiv = createPlayerDiv(playerName, player.result);
        gameDiv.appendChild(playerDiv);
      });

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

function getPlayerName(users, userID) {
  const user = users.find((user) => user.userID === userID);
  return user ? user.name : "Unknown Player";
}

function createPlayerDiv(name, result) {
  const playerDiv = document.createElement("div");
  playerDiv.textContent = `${name} (${result})`;
  playerDiv.classList.add("player");
  return playerDiv;
}

fetchResult();
