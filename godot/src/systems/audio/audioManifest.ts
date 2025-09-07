/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// This file serves as a data-driven manifest for all audio assets.
// Since we cannot create actual audio files, we use placeholder paths.

export const AUDIO_MANIFEST: Record<string, string> = {
  // --- UI Sounds ---
  parser_success: '/audio/ui/parser_success.wav',
  parser_fail: '/audio/ui/parser_fail.wav',
  mark_gain: '/audio/ui/mark_gain.wav',
  clarity_loss: '/audio/ui/clarity_loss.wav',
  echo_created: '/audio/ui/echo_created.wav',

  // --- Ambient Loops ---
  ambient_ruins_day: '/audio/ambient/ruins_day.ogg',
  ambient_wilderness_day: '/audio/ambient/wilderness_day.ogg',
  ambient_court: '/audio/ambient/court.ogg',
  ambient_dream: '/audio/ambient/dream.ogg',
  ambient_wind: '/audio/ambient/wind_light.ogg',
  drone_low: '/audio/ambient/drone_low.ogg',

  // --- Event Sounds ---
  beat_resolve: '/audio/events/beat_resolve.wav',
  
  // --- Echo Sounds ---
  echo_oath_whisper: '/audio/echoes/oath_whisper.ogg',
  echo_betrayal: '/audio/echoes/betrayal_sting.ogg'
};

// Maps scene tags to ambient sound layers
export const SceneSoundMap = [
    { tag: 'ruin', layers: ['ambient_ruins_day', 'ambient_wind'] },
    { tag: 'forge_site', layers: ['ambient_dream', 'ambient_wind'] },
    { tag: 'outdoors', layers: ['ambient_wilderness_day', 'ambient_wind'] },
    { tag: 'sacred', layers: ['ambient_ruins_day', 'ambient_dream'] },
    { tag: 'cavern', layers: ['ambient_dream'] }
    // Add more mappings as needed
];

// Maps echo event types from the Chronicle to sound cues
export const EchoSoundMap: Record<string, string> = {
    'OATH_SWEAR': 'echo_oath_whisper',
    'OATH_RENOUNCE': 'echo_oath_whisper',
    'BETRAY_ACT': 'echo_betrayal'
    // Map more echo event types to sounds
};
