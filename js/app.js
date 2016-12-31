var audio = new AudioContext();
var config = {
    audio: true,
    video: false
};

Vue.component('looper', {
    props: ['audio'],
    template: '<audio controls loop :src="audio" autoplay></audio>',
});

Vue.component('recorder', {
    template: '<h1>recorder</h1>'
});

function handler(stream) {
    // var source = audio.createMediaStreamSource(stream);
    // source.connect(audio.destination);

    var vm = new Vue({
        el: '#app',
        data: {
            loopers: [],
            recorders: [],
        },
        methods: {
            subscribeRecorder: function() {
                var recorder = new MediaRecorder(stream);
                var recorderComponent = {
                    recorder: recorder,
                    data: []
                };

                recorder.ondataavailable = function(e) {
                    recorderComponent.data.push(e.data);
                }

                recorder.start();

                this.recorders.push(recorderComponent);
            },
            removeRecorder: function(index) {
                var list = this.recorders.splice(index, 1);
                var recorderComponent = list[0];

                recorderComponent.recorder.onstop = function(e) {
                    console.log(recorderComponent.data);
                    var blob = new Blob(recorderComponent.data,
                        { 'type' : 'audio/mp3' });

                    var audioUrl = URL.createObjectURL(blob);
                    console.log(audioUrl);
                    vm.registerLooper(audioUrl);
                }

                recorderComponent.recorder.stop();
            },
            registerLooper: function(url) {
                this.loopers.push(url);
            },
            toggleLooper: function(index) {
                console.log(index);
            }
        }
    })
}

function error(error) {
    console.log(error.message);
}

navigator.getUserMedia(config, handler, error);
