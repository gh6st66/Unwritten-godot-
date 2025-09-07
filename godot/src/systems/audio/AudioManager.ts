/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GameState } from '../../game/types';
import { AUDIO_MANIFEST, EchoSoundMap, SceneSoundMap } from './audioManifest';

type AudioLayer = 'ambient1' | 'ambient2' | 'drone' | 'echo' | 'ui' | 'event';

const AMBIENT_VOLUME = 0.3;
const UI_VOLUME = 0.6;
const DRONE_MAX_VOLUME = 0.4;
const ECHO_VOLUME = 0.25;
const DUCK_AMOUNT = 0.4; // Duck to 40% of original volume

/**
 * Manages all audio playback for the application.
 * Handles multiple layers for ambient sounds, UI feedback, and events.
 */
export class AudioManager {
  private audioContext: AudioContext | null = null;
  private audioElements: Partial<Record<AudioLayer, HTMLAudioElement>> = {};
  private echoPlaylist: string[] = [];
  private echoTimeout: number | null = null;

  constructor() {
    // Audio context is created on first user interaction.
  }

  private _initializeAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  /** Plays a sound on a specific layer. */
  public play(soundKey: string, layer: AudioLayer, loop = false, volume = 1.0) {
    this._initializeAudioContext();
    if (!this.audioContext || this.audioContext.state === 'suspended') {
        this.audioContext.resume();
    }
    
    const path = AUDIO_MANIFEST[soundKey];
    if (!path) {
      console.warn(`Audio key not found in manifest: ${soundKey}`);
      return;
    }

    let audio = this.audioElements[layer];
    if (!audio) {
      audio = new Audio();
      this.audioElements[layer] = audio;
    }

    if (audio.src.endsWith(path) && !audio.paused) {
        // Already playing this sound
        return;
    }
    
    audio.src = path;
    audio.loop = loop;
    audio.volume = volume;
    audio.play().catch(e => console.error(`Audio playback failed for ${soundKey}:`, e));
  }
  
  public stop(layer: AudioLayer) {
      const audio = this.audioElements[layer];
      if (audio) {
          audio.pause();
          audio.currentTime = 0;
      }
  }

  /** Sets the ambient soundscape based on scene tags and game state. */
  public setAmbient(sceneTags: string[], accordStability: number) {
    // Find first matching scene sound definition
    const sceneSound = SceneSoundMap.find(s => sceneTags.includes(s.tag));

    if (sceneSound) {
        // Layer 1
        this.play(sceneSound.layers[0], 'ambient1', true, AMBIENT_VOLUME);
        // Layer 2 with random offset
        if (sceneSound.layers[1]) {
            this.play(sceneSound.layers[1], 'ambient2', true, AMBIENT_VOLUME);
            const audio2 = this.audioElements['ambient2'];
            if (audio2) {
                audio2.currentTime = Math.random() * 10;
            }
        } else {
            this.stop('ambient2');
        }
    } else {
        this.stop('ambient1');
        this.stop('ambient2');
    }
    
    // Accord drone layer
    const instability = 1 - (Math.abs(accordStability) / 100);
    const droneVolume = DRONE_MAX_VOLUME * instability * instability; // Exponential makes it more noticeable at extremes
    if (droneVolume > 0.05) {
        this.play('drone_low', 'drone', true, droneVolume);
    } else {
        this.stop('drone');
    }

    // Start echo player if needed
    if (this.echoPlaylist.length > 0 && !this.echoTimeout) {
        this._scheduleNextEcho();
    }
  }

  public playUI(soundKey: keyof typeof AUDIO_MANIFEST) {
    this.play(soundKey, 'ui', false, UI_VOLUME);
  }

  public setEchoLayer(echoEvents: string[]) {
      this.echoPlaylist = echoEvents
        .map(eventKey => EchoSoundMap[eventKey])
        .filter(Boolean) as string[];
      
      if (this.echoTimeout) {
          clearTimeout(this.echoTimeout);
          this.echoTimeout = null;
      }
      this.stop('echo');
      
      if (this.echoPlaylist.length > 0) {
          this._scheduleNextEcho();
      }
  }
  
  private _scheduleNextEcho() {
      if (this.echoPlaylist.length === 0) return;
      
      const delay = 60000 + Math.random() * 120000; // 1-3 minutes
      this.echoTimeout = window.setTimeout(() => {
          const soundKey = this.echoPlaylist[Math.floor(Math.random() * this.echoPlaylist.length)];
          this.play(soundKey, 'echo', false, ECHO_VOLUME);
          this._scheduleNextEcho(); // Schedule the next one
      }, delay);
  }


  /** Duck the ambient layers. */
  public duckAmbient(isDucking: boolean) {
    const layersToDuck: AudioLayer[] = ['ambient1', 'ambient2', 'drone', 'echo'];
    for (const layer of layersToDuck) {
        const audio = this.audioElements[layer];
        if (audio) {
            audio.volume = (audio.dataset.baseVolume ? parseFloat(audio.dataset.baseVolume) : audio.volume);
            if(isDucking) {
                audio.dataset.baseVolume = String(audio.volume);
                audio.volume *= DUCK_AMOUNT;
            }
        }
    }
  }
}
