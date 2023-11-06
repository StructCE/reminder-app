import {
  type FC,
  type PropsWithChildren,
  createContext,
  useContext,
  useRef,
} from "react";

const DragNDropContext = createContext<
  | undefined
  | {
      onDragStart: (movingIndex: number) => void;
      onDragEnter: (overIndex: number) => void;
      onDragEnd: () => void;
    }
>(undefined);

export const DragNDropContextProvider: FC<
  PropsWithChildren<{
    onDragEnd: (fromIndex: number, toIndex: number) => void;
  }>
> = ({ children, onDragEnd: onDragEndPassed }) => {
  const draggingRef = useRef<number>();
  const overRef = useRef<number>();

  function onDragStart(id: number) {
    draggingRef.current = id;
  }

  function onDragEnter(id: number) {
    overRef.current = id;
  }

  function onDragEnd() {
    if (draggingRef.current === undefined || overRef.current === undefined)
      return;

    onDragEndPassed(draggingRef.current, overRef.current);

    draggingRef.current = undefined;
    overRef.current = undefined;
  }

  return (
    <DragNDropContext.Provider
      value={{
        onDragEnd,
        onDragEnter,
        onDragStart,
      }}
    >
      {children}
    </DragNDropContext.Provider>
  );
};

export function useDragNDropContext() {
  const ctx = useContext(DragNDropContext);
  if (!ctx)
    throw new Error("useDragNDropContext must be used within its provider");

  return ctx;
}
