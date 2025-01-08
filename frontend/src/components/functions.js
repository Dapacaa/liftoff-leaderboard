var trackData = "";
var playerData = "";
var response; 

async function fetchLeaderboard(mapId,qty) {
    const url = '/api/unity/v0.5/GetCommunityLeaderboard.php';
    const body = JSON.stringify({
        LeaderboardKeyword: {
            ContentId: mapId,
            GamemodeFlags: 1,
            ModifierFlags: 0,
            Timestamp: null,
        },
        PlatformName: "steam",
        FetchAllEntries: false, // Set to false to limit the entries
        FetchRangeEntries: [0, qty], // Limit to the top 250 entries
        FetchUserEntries: [""]
    });

    const headers = new Headers({
        "Host": "liftoff-pro-service.westeurope.cloudapp.azure.com",
        "User-Agent": "UnityPlayer/2022.3.50f1 (UnityWebRequest/1.0, libcurl/8.5.0-DEV)",
        "Accept": "*/*",
        "Accept-Encoding": "deflate, gzip",
        "RequestId": "0",
        "GameVersion": "1.6.8",
        "Application": "liftoff-fpv",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Unity-Version": "2022.3.50f1"
    });

    const requestOptions = {
        method: "POST",
        headers: headers,
        body: body,
        redirect: "follow"
    };

    try {
        response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        //console.log(result);
        trackData = result;
        return result;
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        throw error;
    }
} 

async function buildPlayerList(trackData) {
    // Extract all Steam IDs from trackData
    const steamIDs = trackData.RangeEntries.map(entry => entry[0]).join(',');
  
    // Make the Steam API call
    const apiUrl = `/steam-api/ISteamUser/GetPlayerSummaries/v0002/?key=4437EC8901C6ADDC2EB0BD45BDB89244&steamids=${steamIDs}`;
    const steamApiResponse = await fetch(apiUrl)
      .then(response => response.json())
      .catch(err => {
        console.error("Error fetching Steam API:", err);
        return { response: { players: [] } };
      });
  
    // Map the Steam API response for quick lookup
    const steamDataMap = steamApiResponse.response.players.reduce((map, player) => {
      map[player.steamid] = {
        name: player.personaname,
        profileUrl: player.profileurl,
        avatar: player.avatar
      };
      return map;
    }, {});
  
    // Build the new list with position, Steam ID, time, and player info
    const playerList = trackData.RangeEntries.map(([steamId, raceTime, position]) => {
      const steamInfo = steamDataMap[steamId] || {};
      return {
        position,
        steamId,
        name: steamInfo.name || "Unknown",
        profileUrl: steamInfo.profileUrl || "N/A",
        avatar: steamInfo.avatar || "N/A",
        time: raceTime
      };
    });
    playerData = playerList;
    return playerList;
  }
  
  // Example of how to set values dynamically using JavaScript
function updateLeaderboard(entries) {
    const leaderboard = document.querySelector('.leaderboard');
    leaderboard.innerHTML = ''; // Clear existing entries
  
    entries.forEach(entry => {
      const div = document.createElement('div');
      div.className = 'entry';
      div.innerHTML = `
        <div class="rank">${entry.rank}<sup>${entry.suffix}</sup></div>
        <img src="${entry.avatar}" alt="avatar" class="avatar">
        <div class="name">${entry.name}</div>
        <div class="time">${entry.time}</div>
      `;
      leaderboard.appendChild(div);
    });
  }
  
  


  //export default { buildPlayerList, fetchLeaderboard, updateLeaderboard }
  
  