
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8-PLAYER'

const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const cdThumb = $('.cd-thumb')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const heading = $('header h2')
const audio = $('#audio')
const playlist = $('.playlist')
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom : false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function (key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config) );
    },  

    songs : [
        {
            'name': 'Hai Đứa Nhóc',
            'singer': 'Ronboogz',
            'image' :'./images/hai dua nhoc.jpg',
            'path': './video/y2meta.com - Hai Đứa Nhóc _ Ronboogz (Lyrics Video) (192 kbps).mp3' ,
        },
        {
            'name': 'Bạch Nguyệt Quang Và Nốt Chu Sa',
            'singer': 'Min Hii',
            'image' :'./images/not-chu-sa.jpg',
            'path': './video/y2meta.com - Bạch Nguyệt Quang Và Nốt Chu Sa (SpeedUp) - Min Hii _ Bao giờ thì anh mới biết ánh sao chỉ yêu mỗi (192 kbps).mp3' ,
        
        },
        {
            'name': 'Cảm Ơn Tổn Thương',
            'singer': 'Phạm Nguyên Ngọc',
            'image' :'./images/cam on ton thuong.jpg',
            'path': './video/y2meta.com - CẢM ƠN TỔN THƯƠNG _ Phạm Nguyên Ngọc (Original) (192 kbps).mp3' ,
        
        },
        {
            'name': 'Lời Tâm Sự Số 3',
            'singer': 'Mike',
            'image' :'./images/loi tam su so 3.jpg',
            'path': './video/y2meta.com - Mike - lời tâm sự số 3 (lyrics video) (192 kbps).mp3' ,
        
        },
        {
            'name': 'Em Thích',
            'singer': 'SEAN x @OfficialMusic',
            'image' :'./images/em thich.jpg',
            'path': './video/y2meta.com - SEAN x @LuaOfficialMusic _ EM THÍCH _ [OFFICIAL MV LYRIC] (192 kbps).mp3' ,
        
        },
        {
            'name': 'Tát Nước Đầu Đình',
            'singer': 'Lynk Lee x Binz',
            'image' :'./images/tat nuoc dau dinh.jpg',
            'path': './video/y2meta.com - Lynk Lee - Tát nước đầu đình ft. Binz (Audio) (128 kbps).mp3' ,
        
        },
        {
            'name': 'Muốn Quên Được Em',
            'singer': 'FREAKY',
            'image' :'./images/muon quen duoc em.jpg',
            'path': './video/y2meta.com-MUỐN QUÊN ĐƯỢC EM _ FREAKY x @cm1x x @SEANPOET _ Official Music Video-(240p).mp4' ,
        
        },
        {
            'name': 'Tội Cho Cô Gái Đó',
            'singer': 'Khắc Việt',
            'image' :'./images/toi cho co gai do.jpg',
            'path': './video/y2meta.com - KHẮC VIỆT - Tội Cho Cô Gái Đó  (OFFICAL MV) (192 kbps).mp3' ,
        
        },
        {
            'name': 'Khó Fine',
            'singer': 'Ronboogz',
            'image' :'./images/kho fine.jpg',
            'path': './video/y2meta.com - Khó fine _ Ronboogz (Lyrics video) (192 kbps).mp3' ,
        
        }
    ],
    render: function(){
        const htmls = this.songs.map((song, index) => {
            return `
                <div data-index = ${index} class="song ${index === this.currentIndex ? 'active': ''}">
                    <div class="thumb" style= "background-image:url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function (){
        // Tao thuoc tinh moi currentSong
        Object.defineProperty(this,'currentSong', {
            get: function (){
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function (){
        const cd = $('.cd')
        const _this = this
        const cdWidth = cd.offsetWidth
        
        // Xu li CD quay/ dung
        const cdThumbAnimate = cdThumb.animate ([
            {transform: 'rotate(360deg'}
        ], {
            duration: 10000, //10s
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // Xu li phong to/ thu nho CD
        document.onscroll = function(){
            var srollTop = window.scrollY || document.documentElement.srollTop
            var newCdWidth = cdWidth - srollTop
            // console.log(newCdWidth)
            if (isNaN(newCdWidth)){ 
                newCdWidth = cdWidth;
                // console.log('cdWidth', cdWidth)
            }
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth
        }
        // Xu li khi click play
        playBtn.onclick = function (){
            if (_this.isPlaying){
                audio.pause()
            }
            else {
                audio.play()
            }
        }
        // Khi song duoc play
        audio.onplay = function (){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        // Khi song bi pause
        audio.onpause = function (){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()

        }
        // Khi tien do bai hat thay doi
        audio.ontimeupdate = function (){
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)  
            progress.value = progressPercent
            progress.style.background = `linear-gradient(to right, #ec1f55 ${progressPercent}%  , #D3D3D3 ${progressPercent}% )`;
        }

        // Xu li khi tua song
        progress.oninput = function (event){
            console.log('typeof(audio.duration)',typeof(audio.duration))
            const seekTime =  event.target.value / 100 * audio.duration
            audio.currentTime = seekTime
        }

        // Khi next song
        nextBtn.onclick = function (){
            _this.nextSong()
            if (_this.isPlaying){
                audio.play()
            }
            else {
                audio.pause()
            }
        }
        prevBtn.onclick = function (){
            _this.prevSong()
            if (_this.isPlaying){
                audio.play()
            }
            else {
                audio.pause()
            }
        }
        randomBtn.onclick = function (){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom',_this.isRandom)
            randomBtn.classList.toggle('active',_this.isRandom)
            // toggle : neu randomBtn chua co active thi add/ co roi thi remove
        }
        repeatBtn.onclick = function (){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat',_this.isRepeat)
            repeatBtn.classList.toggle('active')
            audio.loop = !audio.loop
        }

        // Xu li khi het bai hat
        audio.onended = function (){
            _this.nextSong ()
            audio.play()
        }
        // Lang nghe hanh vi click vao playlist
        playlist.onclick = function (e){
            var songNode = e.target.closest('.song:not(.active)')
            var optionNode = e.target.closest('.option')
            if (songNode || optionNode){
                // Xu li khi click vao song
                if (songNode){
                    console.log(songNode.getAttribute('data-index'))
                    // _this.currentIndex = songNode.getAttribute('data-index')
                    _this.currentIndex = Number(songNode.dataset.index) 
                    _this.render()
                    _this.loadCurrentSong()
                    audio.play()

                }
                // Xu li khi click vao option
                if (e.target.closest('.option')){

                }
            }

        }
    },
    loadCurrentSong: function (){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function (){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat

    },
    nextSong: function (){
        if (this.isRandom){
            this.currentIndex = this.randomSong()
        }
        else {
            this.currentIndex++
            if (this.currentIndex >= this.songs.length){
                this.currentIndex = 0
            }
        }
        this.render()
        this.scrollToActiveSong()
        this.loadCurrentSong ()
    },
    prevSong: function (){
        if (this.isRandom){
            this.currentIndex = this.randomSong()
        }
        else {
            this.currentIndex--
            if (this.currentIndex <0 ){
                this.currentIndex = this.songs.length - 1
            }
        }
        this.render()
        this.scrollToActiveSong()
        this.loadCurrentSong ()
    },
    randomSong: function (){
        do {
            var randomSongIndex = Math.floor(Math.random() * this.songs.length);
        }
        while (this.currentIndex == randomSongIndex);

        return randomSongIndex;
    },
    scrollToActiveSong: function (){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
        },300)
    },
    start: function (){
        //Gan cau hinh tu config vao ung dung
        this.loadConfig()
        // Dinh nghia cac thuoc tinh cho object
        this.defineProperties ();
        // Lang nghe/ xu li cac su kien
        this.handleEvents();
        // Render playlist
        this.render();
        // Tai thong tin bai hat dau tien
        this.loadCurrentSong ()
    }   
}
app.start()
