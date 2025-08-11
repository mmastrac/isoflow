import { useCallback, useEffect, useRef } from 'react';
import { useModelStore } from 'src/stores/modelStore';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { ModeActions, State, SlimMouseEvent } from 'src/types';
import { getMouse, getItemAtTile } from 'src/utils';
import { useResizeObserver } from 'src/hooks/useResizeObserver';
import { useScene } from 'src/hooks/useScene';
import { Cursor } from './modes/Cursor';
import { DragItems } from './modes/DragItems';
import { DrawRectangle } from './modes/Rectangle/DrawRectangle';
import { TransformRectangle } from './modes/Rectangle/TransformRectangle';
import { Connector } from './modes/Connector';
import { Pan } from './modes/Pan';
import { PlaceIcon } from './modes/PlaceIcon';
import { TextBox } from './modes/TextBox';

const modes: { [k in string]: ModeActions } = {
  CURSOR: Cursor,
  DRAG_ITEMS: DragItems,
  // TODO: Adopt this notation for all modes (i.e. {node.type}.{action})
  'RECTANGLE.DRAW': DrawRectangle,
  'RECTANGLE.TRANSFORM': TransformRectangle,
  CONNECTOR: Connector,
  PAN: Pan,
  PLACE_ICON: PlaceIcon,
  TEXTBOX: TextBox
};

const getModeFunction = (mode: ModeActions, e: SlimMouseEvent) => {
  switch (e.type) {
    case 'mousemove':
    case 'pointermove':
      return mode.mousemove;
    case 'mousedown':
    case 'pointerdown':
      return mode.mousedown;
    case 'mouseup':
    case 'pointerup':
      return mode.mouseup;
    default:
      return null;
  }
};

export const useInteractionManager = (
  enableGlobalDragHandlers: boolean = true
) => {
  const rendererRef = useRef<HTMLElement | null>(null);
  const reducerTypeRef = useRef<string | null>(null);
  const uiState = useUiStateStore((state) => {
    return state;
  });
  const model = useModelStore((state) => {
    return state;
  });
  const scene = useScene();
  const { size: rendererSize } = useResizeObserver(uiState.rendererEl);
  const el = enableGlobalDragHandlers
    ? window
    : ((rendererRef.current || uiState.rendererEl) as unknown as Window);
  const elCursor = enableGlobalDragHandlers
    ? document.body
    : ((rendererRef.current || uiState.rendererEl) as HTMLElement);

  const onMouseEvent = useCallback(
    (e: SlimMouseEvent) => {
      if (e.type === 'pointerdown') {
        if (e.target instanceof HTMLElement) {
          e.target.setPointerCapture((e as unknown as PointerEvent).pointerId);
        }
      }
      if (e.type === 'pointerup') {
        if (e.target instanceof HTMLElement) {
          e.target.releasePointerCapture(
            (e as unknown as PointerEvent).pointerId
          );
        }
      }

      if (!rendererRef.current) return;

      const mode = modes[uiState.mode.type];
      const modeFunction = getModeFunction(mode, e);
      if (!modeFunction) return;

      const nextMouse = getMouse({
        interactiveElement: rendererRef.current,
        zoom: uiState.zoom,
        scroll: uiState.scroll,
        lastMouse: uiState.mouse,
        mouseEvent: e,
        rendererSize
      });
      uiState.actions.setMouse(nextMouse);

      const baseState: State = {
        model,
        scene,
        uiState,
        rendererRef: rendererRef.current,
        rendererSize,
        isRendererInteraction: rendererRef.current === e.target
      };

      if (reducerTypeRef.current !== uiState.mode.type) {
        const prevReducer = reducerTypeRef.current
          ? modes[reducerTypeRef.current]
          : null;
        if (prevReducer && prevReducer.exit) {
          prevReducer.exit(baseState, elCursor);
        }
        if (mode.entry) {
          mode.entry(baseState, elCursor);
        }
      }
      modeFunction(baseState, elCursor);
      reducerTypeRef.current = uiState.mode.type;
    },
    [model, scene, uiState, rendererSize]
  );

  const onContextMenu = useCallback(
    (e: SlimMouseEvent) => {
      e.preventDefault();

      const itemAtTile = getItemAtTile({
        tile: uiState.mouse.position.tile,
        scene
      });

      if (itemAtTile?.type === 'RECTANGLE') {
        uiState.actions.setContextMenu({
          item: itemAtTile,
          tile: uiState.mouse.position.tile
        });
      } else if (uiState.contextMenu) {
        uiState.actions.setContextMenu(null);
      }
    },
    [uiState.mouse, scene, uiState.contextMenu, uiState.actions]
  );

  useEffect(() => {
    if (uiState.mode.type === 'INTERACTIONS_DISABLED') return;

    // Choose the element to attach event listeners to based on the enableGlobalDragHandlers setting
    if (!el) return;

    const onScroll = (e: WheelEvent) => {
      e.preventDefault();

      if (e.deltaY > 0) {
        uiState.actions.decrementZoom();
      } else {
        uiState.actions.incrementZoom();
      }
    };

    el.addEventListener('pointermove', onMouseEvent, { passive: false });
    el.addEventListener('pointerdown', onMouseEvent, { passive: false });
    el.addEventListener('pointerup', onMouseEvent, { passive: false });
    el.addEventListener('contextmenu', onContextMenu, { passive: false });
    uiState.rendererEl?.addEventListener('wheel', onScroll, { passive: false });

    return () => {
      el.removeEventListener('pointermove', onMouseEvent);
      el.removeEventListener('pointerdown', onMouseEvent);
      el.removeEventListener('pointerup', onMouseEvent);
      el.removeEventListener('contextmenu', onContextMenu);
      uiState.rendererEl?.removeEventListener('wheel', onScroll);
    };
  }, [
    uiState.editorMode,
    onMouseEvent,
    uiState.mode.type,
    onContextMenu,
    uiState.actions,
    uiState.rendererEl,
    enableGlobalDragHandlers
  ]);

  const setInteractionsElement = useCallback((element: HTMLElement) => {
    rendererRef.current = element;
  }, []);

  return {
    setInteractionsElement
  };
};
