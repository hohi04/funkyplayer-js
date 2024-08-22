class Player {
    constructor(playlist) {
      this.playlist = playlist;
      this.currentIndex = 0;
      this.player = document.getElementById('player');
      console.log(this.player);
      this.durationElement = document.getElementById('dur');
      console.log(this.durationElement);
  
      // Initialize player with the first track
      this.initializePlayer(this.playlist[this.currentIndex]);
      this.initEventListeners();
    }
  
    initializePlayer(track) {
      this.player.src = track.audio;
      $('.title').html(track.title);
      $('.artist').html(track.artist);
      $('.album').html(track.album);
      this.updateProgressBar();
    }
  
    initEventListeners() {
      $('#play-btn').on('click', () => this.togglePlay());
      $('#next').data('dir', 1).on('click', () => this.changeTrack(1));
      $('#prev').data('dir', -1).on('click', () => this.changeTrack(-1));
      $('.volumeControl .wrapper').on('click', (e) => {
        let volumePosition = e.pageX - $(e.currentTarget).offset().left;
        let audioVolume = volumePosition / $(e.currentTarget).width();

        if (audioVolume >= 0 && audioVolume <= 1) {
            this.player.volume = audioVolume;
            $(e.currentTarget).find('.inner').css('width', audioVolume * 100 + '%');
        }
        });

      $('.dropdown-toggle').on('click', function() {
        $(this).next('.dropdown').slideToggle('fast');
        });
      $(document).on('click', (e) => {
        let target = e.target;
        if (!$(target).is('.dropdown-toggle') && !$(target).parents().is('.dropdown-toggle')) {
          $('.dropdown').hide();
        }
      });  

      $('#darkButton').on('click', () => this.switchDark());
      $('#whiteButton').on('click', () => this.switchWhite());
      $('#blueButton').on('click', () => this.switchBlue());  
      // ... other event listeners
    }
  
    togglePlay() {
      if (this.player.paused) {
        this.player.play();
      } else {
        this.player.pause();
      }
  
      $('#play-btn').toggleClass('fa-play fa-pause');
    }
  
    changeTrack(direction) {
        this.currentIndex = (this.currentIndex + direction + this.playlist.length) % this.playlist.length;
        this.initializePlayer(this.playlist[this.currentIndex]);
    
        // Check if the player is playing and update the play button accordingly
        if (!this.player.paused) {
            $('#play-btn').removeClass('fa-play').addClass('fa-pause');
        } else {
            $('#play-btn').removeClass('fa-pause').addClass('fa-play');
        }
    }    
  
    updateProgressBar() {
      let totalDuration = this.calculateTotalValue(this.player.duration);
      $('.end-time').html(totalDuration);
  
      let currentTime = this.calculateCurrentValue(this.player.currentTime);
      $('.start-time').html(currentTime);
  
      this.durationElement.value = this.player.currentTime;
  
      if (this.player.currentTime === this.player.duration) {
        $('#play-btn').fadeIn('slow', function () {
          $(this).removeClass('fa-pause').addClass('fa-play');
          this.durationElement.value = 0;
        });
      }
    }
  
    calculateTotalValue(length) {
      let minutes = Math.floor(length / 60);
      let seconds = Math.floor(length % 60);
      return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }
  
    calculateCurrentValue(currentTime) {
      let minutes = Math.floor(currentTime / 60);
      let seconds = Math.floor(currentTime % 60);
      return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }

    setPlayerTime() {
        this.player.currentTime = this.durationElement.value;
    }
    
    setProgressBarMax() {
        this.durationElement.max = this.player.duration;
    }  
    
    switchDark() {
      $('#skin').attr('class', 'dark audio-player');
      $('.inner').css('background', '#fff');
      $('.title, .time, .fa-volume-up, .audio-player #play-btn, .ctrl_btn').css('color', '#fff');
    }
    
    switchWhite() {
      $('#skin').attr('class', 'white audio-player');
      $('.inner').css('background', '#555');
      $('.title, .time, .fa-volume-up, .audio-player #play-btn, .ctrl_btn').css('color', '#555');
    }
    
    switchBlue() {
      $('#skin').attr('class', 'blue audio-player');
      $('.inner').css('background', '#fff');
      $('.title, .time, .fa-volume-up, .audio-player #play-btn, .ctrl_btn').css('color', '#fff');
    }
 
  }

  // Initialize the Player class
  const playlist = [
        {
          title: 'Drive',
          artist: 'Funky Apricot',
          album: 'The autumn goat undercover',
          audio: 'assets/drive7.mp3',
        },
        {
          title: 'Inside',
          artist: 'Funky Apricot',
          album: 'The autumn goat undercover',
          audio: 'assets/inside.mp3',
        },
        {
          title: 'Metal',
          artist: 'Funky Apricot',
          album: 'The autumn goat undercover',
          audio: 'assets/metal.mp3',
        }
      ];
  
  const playerInstance = new Player(playlist);
  