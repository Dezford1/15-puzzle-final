document.addEventListener("DOMContentLoaded", loadLeaderboard);

function loadLeaderboard() {
  fetch("api/getScores.php")
    .then((response) => response.json())

    .then((scores) => {
      const tableBody = document.getElementById("leaderboard-body");

      tableBody.innerHTML = "";

      if (scores.length === 0) {
        tableBody.innerHTML = `
                    <tr>
                        <td colspan="5">No scores yet.</td>
                    </tr>
                `;

        return;
      }

      scores.forEach((score, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${score.player_name}</td>
                    <td>${score.theme}</td>
                    <td>${score.moves}</td>
                    <td>${formatTime(score.completion_time)}</td>
                `;

        tableBody.appendChild(row);
      });
    })

    .catch((error) => {
      console.log("Database unavailable.");

      const scores = getLocalScores();

      const tableBody = document.getElementById("leaderboard-body");

      tableBody.innerHTML = "";

      if (scores.length === 0) {
        tableBody.innerHTML = `
        <tr>
            <td colspan="5">
                No scores available.
            </td>
        </tr>
        `;

        return;
      }

      scores.forEach((score, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${score.player_name}</td>
            <td>${score.theme}</td>
            <td>${score.moves}</td>
            <td>${formatTime(score.completion_time)}</td>
        `;

        tableBody.appendChild(row);
      });
    });
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);

  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
