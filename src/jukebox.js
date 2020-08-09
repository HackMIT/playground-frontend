import "./styles/jukebox.scss";

//gets song title from input box
function addSongTile() {
  //add songTile to the queue based on the url input in the input box
  //currently url must be in the format https://youtu.be/++++++++
  //where "++++++++++" is the video code/songID

  //get the tile queue container
  const queueTilesContainer = document.getElementById("jukebox-song-tiles");

  //get the current url in the input and split it to get the song id
  //we have to support different youtube url formats though
  //try regex
  var url = document.getElementById("jukebox-song-input").value;
  var url_substrings = url.split("/");
  var songId = url_substrings[url_substrings.length - 1];

  //creates a youtube frame embed song id in the src url
  const youTubeframe = document.createElement("div");
  youTubeframe.innerHTML = `<iframe id="player" type="text/html" width="300" height="100"
    src="https://www.youtube.com/embed/${songId}"
    frameborder="2"></iframe>`;

  //create a button which removes songs from the queue
  //although this will be admin accessible I guess? not sure
  const removeSongButtonDiv = document.createElement("div");
  const removeSongButton = document.createElement("div");
  removeSongButtonDiv.className =
    "Jukebox-queue-container-tile-cancel-button-container";
  removeSongButton.className = "Jukebox-queue-container-tile-cancel-button";
  removeSongButtonDiv.appendChild(removeSongButton);

  //create the song tile that will house the youtube frame and the cancellation button
  const songTile = document.createElement("div");
  songTile.className = "Jukebox-queue-container-tile";
  songTile.appendChild(youTubeframe);
  songTile.appendChild(removeSongButtonDiv);

  //add the cancellation event i.e removing div from parent node
  removeSongButton.addEventListener("click", () => {
    queueTilesContainer.removeChild(songTile);
  });
  // add song tile to queue
  queueTilesContainer.appendChild(songTile);
}

//add the event listener for adding songTiles to the yellow button on the jukebox tab
const jukeboxQueueButton = document.getElementById("jukebox-queue-button");
jukeboxQueueButton.addEventListener("click", () => addSongTile());

// these are events that cause the jukebox tab to open up
const jukeBoxContainer = document.getElementById("jukebox-queue-container");
const jukeboxOpenButton = document.getElementById("jukebox");

//click the jukebox open button -> change these classes
jukeboxOpenButton.addEventListener("click", () => {
  jukeboxOpenButton.className = "Jukebox-display-tag-alternate";
  jukeBoxContainer.className = "Jukebox-queue-container";
});
//close the jukebox
const jukeboxCloseButton = document.getElementById("close-jukebox-button");
jukeboxCloseButton.addEventListener("click", () => {
  jukeBoxContainer.className = "Jukebox-queue-container-alternate";
  jukeboxOpenButton.className = "Jukebox-display-tag";
});
