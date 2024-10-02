class Player {
  constructor(playlist) {
    this.playlist = playlist; // Store the playlist
    this.currentIndex = 0; // Track the currently playing index
    this.player = document.getElementById("player"); // Get the audio player element
    this.durationElement = document.getElementById("dur"); // Get the progress bar element

    // Initialize player with the first track
    this.initializePlayer(this.playlist[this.currentIndex]);
    this.populatePlaylistDropdown(); // Populate the dropdown with tracks
    this.initEventListeners(); // Set up event listeners
  }

  // Initialize the player with the selected track
  initializePlayer(track) {
    this.player.src = track.audio; // Set the audio source
    $(".title").html(track.title); // Update the title
    $(".artist").html(track.artist); // Update the artist
    $(".album").html(track.album); // Update the album
    this.updateProgressBar(); // Update the progress bar
    this.updatePlayCount(track);
  }

  // Set up event listeners for user interactions
  initEventListeners() {
    $("#play-btn").on("click", () => this.togglePlay()); // Play/pause button
    $("#next")
      .data("dir", 1)
      .on("click", () => this.changeTrack(1)); // Next track
    $("#prev")
      .data("dir", -1)
      .on("click", () => this.changeTrack(-1)); // Previous track

    // Volume control
    $(".volumeControl .wrapper").on("click", (e) => {
      let volumePosition = e.pageX - $(e.currentTarget).offset().left;
      let audioVolume = volumePosition / $(e.currentTarget).width();
      if (audioVolume >= 0 && audioVolume <= 1) {
        this.player.volume = audioVolume;
        $(e.currentTarget)
          .find(".inner")
          .css("width", audioVolume * 100 + "%");
      }
    });

    // Progress bar click event
    this.durationElement.addEventListener("input", () => {
      this.player.currentTime = this.durationElement.value; // Update player time
    });

    // Playlist dropdown toggle
    $("#playlistToggle").on("click", (e) => {
        e.preventDefault();
        $("#playlistDropdown").slideToggle("fast"); // Toggle the playlist dropdown
      });

    // Close dropdown if clicked outside
    $(document).on("click", (e) => {
        if (!$(e.target).closest(".user_avatar").length) {
          $("#playlistDropdown").hide(); // Close the dropdown if clicked outside
        }
      });

    // Playlist item click event
    $("#playlistDropdown a").on("click", (e) => {
        e.preventDefault();
        const trackIndex = $(e.target).data("index");
        this.currentIndex = trackIndex; // Update the current track index
        this.playlist[this.currentIndex].playCount++; // Increment play count
        this.initializePlayer(this.playlist[this.currentIndex]); // Load the selected track
        if (!this.player.paused) {
            $("#play-btn").removeClass("fa-play").addClass("fa-pause");
          } else {
            $("#play-btn").removeClass("fa-pause").addClass("fa-play");
          }
        $("#playlistDropdown").hide(); // Hide the dropdown after selection
      });

    // Share button functionality
    $("#share-btn").on("click", (e) => {
      e.preventDefault();
      const currentUrl = window.location.href;
      navigator.clipboard
        .writeText(currentUrl)
        .then(() => {
          alert("URL copied to clipboard!");
        })
        .catch((err) => {
          alert("Failed to copy URL.");
        });
    });

    // Download button functionality
    $("#download-btn").on("click", (e) => {
      e.preventDefault();
      const currentTrack = this.playlist[this.currentIndex].audio;
      const link = document.createElement("a");
      link.href = currentTrack;
      link.download = currentTrack.split("/").pop(); // Get the file name from the URL
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    // Like button functionality
    $('.like').on('click', (e) => {
        e.preventDefault();
        if (!$(e.target).is('#share-btn') && !$(e.target).is('#download-btn')) {
            this.showThankYouMessage(); // Show thank you message
        }
    });
    

    // Event listener to update the progress bar as the audio plays
    this.player.addEventListener("timeupdate", () => {
      this.updateProgressBar(); // Update the progress bar based on current time
    });

    // Ensure maximum value of progress bar is set when a new track is loaded
    this.player.addEventListener("loadedmetadata", () => {
      this.setProgressBarMax(); // Set the maximum value for the progress bar
    });

    // Theme switcher buttons
    $("#darkButton").on("click", () => this.switchDark());
    $("#whiteButton").on("click", () => this.switchWhite());
    $("#blueButton").on("click", () => this.switchBlue());
  }

  // Populate the playlist dropdown with tracks
  populatePlaylistDropdown() {
    const dropdown = $("#playlistDropdown"); // Get the dropdown element
    dropdown.empty(); // Clear any existing items

    // Loop through the playlist and create list items
    this.playlist.forEach((track, index) => {
      const listItem = `<li><a href="#" data-index="${index}">${track.title} - ${track.artist}</a></li>`;
      dropdown.append(listItem); // Append the list item to the dropdown
    });
  }

  // Toggle play/pause functionality
  togglePlay() {
    if (this.player.paused) {
      this.player.play();
    } else {
      this.player.pause();
    }
    $("#play-btn").toggleClass("fa-play fa-pause");
  }

  // Change track functionality
  changeTrack(direction) {
    this.currentIndex =
      (this.currentIndex + direction + this.playlist.length) %
      this.playlist.length;
    this.initializePlayer(this.playlist[this.currentIndex]); // Load the selected track

    // Increment play count when track changes
    this.playlist[this.currentIndex].playCount++;
    this.updatePlayCount(this.playlist[this.currentIndex]); // Update display for play count

    // Check if the player is playing and update the play button accordingly
    if (!this.player.paused) {
      $("#play-btn").removeClass("fa-play").addClass("fa-pause");
    } else {
      $("#play-btn").removeClass("fa-pause").addClass("fa-play");
    }
  }

  // Update progress bar and time displays
  updateProgressBar() {
    if (!isNaN(this.player.duration)) {
      let totalDuration = this.calculateTotalValue(this.player.duration);
      $(".end-time").html(totalDuration); // Update total duration display
    } else {
      $(".end-time").html(""); // Clear duration if not available
    }

    let currentTime = this.calculateCurrentValue(this.player.currentTime);
    $(".start-time").html(currentTime); // Update current time display

    this.durationElement.value = this.player.currentTime; // Update progress bar value

    // Reset progress bar when track ends
    if (this.player.currentTime === this.player.duration) {
      $("#play-btn").fadeIn("slow", function () {
        $(this).removeClass("fa-pause").addClass("fa-play");
        this.durationElement.value = 0; // Reset progress bar to 0
      });
    }
  }

  // Set maximum value of progress bar based on track duration
  setProgressBarMax() {
    this.durationElement.max = this.player.duration; // Set max to the track duration
  }

  // Display the play count for the current track
  updatePlayCount(track) {
    $(".play-count").html(
      `${track.playCount} <i class="fa fa-microphone fa-fw"></i>`
    ); // Update play count display with microphone icon
  }

  // Format total duration to MM:SS
  calculateTotalValue(length) {
    let minutes = Math.floor(length / 60);
    let seconds = Math.floor(length % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`; // Format seconds with leading zero
  }

  // Format current time to MM:SS
  calculateCurrentValue(currentTime) {
    let minutes = Math.floor(currentTime / 60);
    let seconds = Math.floor(currentTime % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`; // Format seconds with leading zero
  }

  // Show thank you message for liking a track
  showThankYouMessage() {
    alert("Thank you for liking this track!"); // Display thank you message
  }

  // Switch to dark theme
  switchDark() {
    $("#skin").attr("class", "dark audio-player");
    $(".inner").css("background", "#fff");
    $(".title, .time, .fa-volume-up, .audio-player #play-btn, .ctrl_btn").css(
      "color",
      "#fff"
    );
  }

  // Switch to white theme
  switchWhite() {
    $("#skin").attr("class", "white audio-player");
    $(".inner").css("background", "#555");
    $(".title, .time, .fa-volume-up, .audio-player #play-btn, .ctrl_btn").css(
      "color",
      "#555"
    );
  }

  // Switch to blue theme
  switchBlue() {
    $("#skin").attr("class", "blue audio-player");
    $(".inner").css("background", "#fff");
    $(".title, .time, .fa-volume-up, .audio-player #play-btn, .ctrl_btn").css(
      "color",
      "#fff"
    );
  }
}

// Initialize the Player class with a sample playlist
const playlist = [
  {
    title: "Drive",
    artist: "Funky Apricot",
    album: "The autumn goat undercover",
    audio: "assets/drive7.mp3",
    playCount: 23,
  },
  {
    title: "Inside",
    artist: "Funky Apricot",
    album: "The autumn goat undercover",
    audio: "assets/inside.mp3",
    playCount: 17,
  },
  {
    title: "Metal",
    artist: "Funky Apricot",
    album: "The autumn goat undercover",
    audio: "assets/metal.mp3",
    playCount: 12,
  },
];

// Create a new Player instance
const audioPlayer = new Player(playlist);
