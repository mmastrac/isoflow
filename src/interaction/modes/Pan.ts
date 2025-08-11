import { produce } from 'immer';
import { CoordsUtils, setWindowCursor } from 'src/utils';
import { ModeActions } from 'src/types';

export const Pan: ModeActions = {
  entry: (state, element) => {
    setWindowCursor('grab', element);
  },
  exit: (state, element) => {
    setWindowCursor('default', element);
  },
  mousemove: ({ uiState }) => {
    if (uiState.mode.type !== 'PAN') return;

    if (uiState.mouse.mousedown !== null) {
      const newScroll = produce(uiState.scroll, (draft) => {
        draft.position = uiState.mouse.delta?.screen
          ? CoordsUtils.add(draft.position, uiState.mouse.delta.screen)
          : draft.position;
      });

      uiState.actions.setScroll(newScroll);
    }
  },
  mousedown: ({ uiState, isRendererInteraction }, element) => {
    if (uiState.mode.type !== 'PAN' || !isRendererInteraction) return;

    setWindowCursor('grabbing', element);
  },
  mouseup: (state, element) => {
    setWindowCursor('grab', element);
  }
};
