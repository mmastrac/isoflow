import type { EditorModeEnum, MainMenuOptions } from './common';
import type { Model } from './model';
import type { RendererProps } from './rendererProps';

export type InitialData = Model & {
  fitToView?: boolean;
  view?: string;
};

export interface IsoflowProps {
  initialData?: InitialData;
  mainMenuOptions?: MainMenuOptions;
  onModelUpdated?: (Model: Model) => void;
  width?: number | string;
  height?: number | string;
  enableDebugTools?: boolean;
  editorMode?: keyof typeof EditorModeEnum;
  renderer?: RendererProps;
  /**
   * Controls whether drag interactions are captured globally (window-level) or limited to the frame.
   *
   * - `true` (default): Drag events are captured globally, allowing dragging even when the mouse moves outside the component
   * - `false`: Drag events are limited to the component frame, useful for embedding in other pages
   *
   * @default true
   */
  enableGlobalDragHandlers?: boolean;
}
