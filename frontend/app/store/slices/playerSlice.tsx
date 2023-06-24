import { Track } from '@/utils/types';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface PlayerState {
  playlist: Track[] | null;
  currentTrackId: number | null;
  isPlaying: boolean;
}

const initialState: PlayerState = {
  playlist: null,
  currentTrackId: null,
  isPlaying: false,
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    play: (state, { payload }: PayloadAction<{ playList?: Track[]; trackId?: number } | undefined>) => {
      if (payload) {
        if (payload.playList) {
          state.playlist = payload.playList;
        }

        if (payload.trackId !== undefined) {
          state.currentTrackId = payload.trackId;
        }
      }

      if (state.playlist && state.currentTrackId !== null) {
        state.isPlaying = true;
      }
    },
    pause: (state) => {
      state.isPlaying = false;
    },
  },
});

export const { play, pause } = playerSlice.actions;
export default playerSlice.reducer;
