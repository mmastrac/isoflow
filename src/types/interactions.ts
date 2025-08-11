import { ModelStore, UiStateStore, Size } from 'src/types';
import { useScene } from 'src/hooks/useScene';

export interface State {
  model: ModelStore;
  scene: ReturnType<typeof useScene>;
  uiState: UiStateStore;
  rendererRef: HTMLElement;
  rendererSize: Size;
  isRendererInteraction: boolean;
}

export type ModeActionsAction = (state: State) => void;
export type ModeActionsActionWithElement = (
  state: State,
  element: HTMLElement
) => void;

export type ModeActions = {
  entry?: ModeActionsActionWithElement;
  exit?: ModeActionsActionWithElement;
  mousemove?: ModeActionsActionWithElement;
  mousedown?: ModeActionsActionWithElement;
  mouseup?: ModeActionsActionWithElement;
};
