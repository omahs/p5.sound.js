import * as Tone from "tone";
import {clamp} from "./Utils";

function loadSound (path) {
  let player = new SoundFile(
    path,
    function () { 
      self._decrementPreload();
    }
  );
  return player;
}

/**
 * Load and play sound files.
 * @class SoundFile
 * @constructor
 * @example
 * <div>
 * <code>
 * let sound, amp, delay, cnv;
 * 
 * function preload() {
 *   //replace this sound with something local with rights to distribute
 *   //need to fix local asset loading first though :) 
 *   sound = loadSound('https://tonejs.github.io/audio/berklee/gong_1.mp3');
 * }
 * 
 * function setup() {
 *   cnv = createCanvas(100, 100);
 *   textAlign(CENTER);
 *   cnv.mousePressed(playSound);
 *   amp = new Amplitude();
 *   delay = new Delay();
 *   sound.disconnect();
 *   sound.connect(delay);
 *   delay.connect(amp);
 * }
 * 
 * function playSound() {
 *   sound.play();
 * }
 * 
 * function draw() {
 *   let dtime = map(mouseX, 0, width, 0, 1);
 *   delay.delayTime(dtime);
 *   let f = map(mouseY, 0, height, 0, .75);
 *   delay.feedback(f);
 *   let level = map(amp.getLevel(), 0, 0.5, 0, 255);
 *   background(level, 0, 0);
 *   fill(255);
 *   text('click to play', width/2, 20);
 *  }
 * </code>
 * </div>
 */
class SoundFile {
  constructor(buffer, successCallback) {
    this.soundfile = new Tone.Player(buffer, successCallback).toDestination();
    this.playing = false;
    this.rate = 1;
  }

  getNode() {
    return this.soundfile;
  }

  connect(destination) {
    this.soundfile.connect(destination.getNode());
  }

  disconnect() {
    this.soundfile.disconnect(Tone.Context.destination);
  }

  /**
   * Start the soundfile.
   * @method start
   * @for SoundFile 
   */
  start() {
    this.soundfile.playbackRate = this.rate;
    this.soundfile.start();
    this.playing = true;
  }

  /**
   * Start the soundfile.
   * @method play
   * @for SoundFile
   */
  play() {
    this.soundfile.playbackRate = this.rate;
    console.log(this.rate);
    this.soundfile.start();
    this.playing = true;
    //Tone.getTransport().start();
  }

  /**
   * Stop the soundfile.
   * @method stop
   * @for SoundFile 
   */
  stop() {
    this.soundfile.stop();
  }

  /**
   * Pause the soundfile.
   * @method pause
   * @for SoundFile 
   */
  pause() {
    //no such pause method in Tone.js need to find workaround
    this.soundfile.playbackRate = 0;
    this.playing = false;
  }

  /**
   * Loop the soundfile.
   * @method loop
   * @for SoundFile
   * @param {Boolean} loopState Set to True or False in order to set the loop state.
   */
  loop(value = true) {
    this.soundfile.loop = value;
  }

  /**
   * Set a loop region, and optionally a playback rate, and amplitude for the soundfile.
   * @method setLoop
   * @for SoundFile
   * @param {Number} [startTime] Set to True or False in order to set the loop state.
   * @param {Number} [rate] Set to True or False in order to set the loop state.
   * @param {Number} [amp] Set to True or False in order to set the loop state.
   * @param {Number} [duration] Set to True or False in order to set the loop state.
   */
  loopPoints(startTime = 0, duration = this.soundfile.buffer.duration, schedule = 0) {
    this.soundfile.loopStart = startTime;
    this.soundfile.loopEnd = startTime + duration;
    

  }
  
  /**
   * Adjust the amplitude of the soundfile.
   * @method amp
   * @for SoundFile
   * @param {Number} amplitude amplitude value between 0 and 1.
   */
  amp(value) {
    let dbValue = Tone.gainToDb(value);
    this.soundfile.volume.value = dbValue;
  }

  /**
   * Set the playback rate of the soundfile.
   * @method rate
   * @for SoundFile
   * @param {Number} rate 1 is normal speed, 2 is double speed. Negative values plays the soundfile backwards.  
   */
  rate(value) {
    this.soundfile.playbackRate = value;
    this.rate = value;
  }

  /**
   * Returns the duration of a sound file in seconds.
   * @method duration
   * @for SoundFile 
   * @return {Number} duration
   */
  duration() {
    return this.soundfile.buffer.duration;
  }

  /**
   * Return the sample rate of the sound file.
   * @method sampleRate
   * @for SoundFile
   * @return {Number} sampleRate
   */
  sampleRate() {
    if (this.soundfile.buffer) return this.soundfile.buffer.sampleRate;
  }

  /**
   * Return the current position of the p5.SoundFile playhead, in seconds.
   * @method currentTime
   * @for SoundFile
   * @return {Number} currentTime
   */
  currentTime() {
    //let currentTime = Tone.Transport.seconds - this.soundfile.startTime;
    return currentTime;
  }

  /**
   * Move the playhead of a soundfile that is currently playing to a new position.
   * @method jump
   * @for SoundFile 
   * @param {Number} timePoint Time to jump to in seconds.
   */
  jump(value) {
    this.soundfile.seek(value);
  }

  /**
   * Return the playback state of the soundfile.
   * @method isPlaying
   * @for SoundFile 
   * @return {Boolean} Playback state, true or false.
   */
  isPlaying() {
    return this.playing;
  }

  /**
   * Return the playback state of the soundfile.
   * @method isLooping
   * @for SoundFile 
   * @return {Boolean} Looping State, true or false.
   */
  isLooping() {
    return this.soundfile.loop;
  }

  /**
   * Define a function to call when the soundfile is done playing.
   * @method onended
   * @for SoundFile
   * @param {Function} callback Name of a function that will be called when the soundfile is done playing.
   * @example
   * <div>
   * <code>
   * let player;
   *
   * function preload() {
   *   player = loadSound('https://tonejs.github.io/audio/berklee/gong_1.mp3');
   * }
   * 
   * function setup() {
   *   let cnv = createCanvas(100, 100);
   *   background(220);
   *   textAlign(CENTER);
   *   textSize(10);
   *   text('click to play', width/2, height/2);
   *   cnv.mousePressed(playSound);
   *   player.onended(coolFunction);
   * }
   * 
   * function coolFunction() {
   *   background(220);
   *   text('sound is done', width/2, height/2);
   * }
   * 
   * function playSound() {
   *   background(0, 255, 255);
   *   text('sound is playing', width/2, height/2);
   *   if (!player.isPlaying()) {
   *     player.play();
   *   }
   * }
   * </code>
   * </div>
   */
  onended(callback) {
    this.soundfile.onstop = callback;
  }
    
  /**
   * Return the number of samples in a sound file.
   * @method frames
   * @for SoundFile
   * @return {Number} The number of samples in the sound file.
   * @example
   * <div>
   * <code>
   * let player;
   *
   * function preload() {
   *   player = loadSound('https://tonejs.github.io/audio/berklee/gong_1.mp3');
   * }
   * 
   * function setup() {
   *   describe('A sketch that calculates and displays the length of a sound file using number of samples and sample rate.');
   *   createCanvas(100, 100);
   *   background(220);
   *   textAlign(CENTER);
   *   textWrap(WORD);
   *   textSize(10);
   *   frames = player.frames();
   *   sampleRate = player.sampleRate();
   *   sampleLength = round((frames / sampleRate), 2);
   *   info = `sample is ${sampleLength} seconds long`;
   *   text(info, 0, 20, 100);
   * }
   * </code>
   * </div>
   */
  frames() {
    if (this.soundfile.buffer) return this.soundfile.buffer.length;
  }
  
  /**
   * Gets the number of channels in the sound file.
   * @method sampleRate
   * @for SoundFile
   * @return Returns the sample rate of the sound file.
   */
  sampleRate() {
    if (this.soundfile.buffer) return this.soundfile.buffer.sampleRate;
  }

  /**
   * Gets the number of channels in the sound file.
   * @method channels
   * @for SoundFile
   * @return Returns the number of channels in the sound file.
   */
  channels() {
    if (this.soundfile.buffer) return this.soundfile.buffer.numberOfChannels;
  }
  
}

export default SoundFile;
export { loadSound };