import { useEffect, useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import type { L2D } from "l2d";
import { posXAtom, posYAtom, scaleAtom } from "@/atoms/viewer";

const POSITION_UNITS_PER_CANVAS_X = 2.65;
const POSITION_UNITS_PER_CANVAS_Y = 2;

export function useDragToReposition(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  l2dRef: React.RefObject<L2D | null>,
) {
  const posX = useAtomValue(posXAtom);
  const posY = useAtomValue(posYAtom);
  const scale = useAtomValue(scaleAtom);
  const setPosX = useSetAtom(posXAtom);
  const setPosY = useSetAtom(posYAtom);
  const setScale = useSetAtom(scaleAtom);

  // 用 ref 持有最新值，事件回调中读取，避免 stale closure 也避免频繁重建监听器
  const posXRef = useRef(posX);
  const posYRef = useRef(posY);
  const scaleRef = useRef(scale);
  useEffect(() => {
    posXRef.current = posX;
  }, [posX]);
  useEffect(() => {
    posYRef.current = posY;
  }, [posY]);
  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  const dragState = useRef<{
    startX: number;
    startY: number;
    startPosX: number;
    startPosY: number;
    width: number;
    height: number;
    scale: number;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);
      canvas.setPointerCapture(e.pointerId);
      dragState.current = {
        startX: e.clientX,
        startY: e.clientY,
        startPosX: posXRef.current,
        startPosY: posYRef.current,
        width,
        height,
        scale: Math.max(scaleRef.current, 0.1),
      };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragState.current || !l2dRef.current) return;
      const {
        startX,
        startY,
        startPosX,
        startPosY,
        width,
        height,
        scale,
      } =
        dragState.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      // 补偿当前缩放，避免模型放大后拖拽位移被放大
      const normalizedDx =
        ((dx / width) * POSITION_UNITS_PER_CANVAS_X) / scale;
      const normalizedDy =
        ((dy / height) * POSITION_UNITS_PER_CANVAS_Y) / scale;
      const newX = Math.max(-2, Math.min(2, startPosX + normalizedDx));
      const newY = Math.max(-2, Math.min(2, startPosY - normalizedDy));
      l2dRef.current.setPosition(newX, newY);
      setPosX(newX);
      setPosY(newY);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (canvas.hasPointerCapture(e.pointerId)) {
        canvas.releasePointerCapture(e.pointerId);
      }
      dragState.current = null;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!l2dRef.current) return;
      const factor = e.deltaY > 0 ? 0.95 : 1.05;
      const newScale = Math.max(0.1, Math.min(5, scaleRef.current * factor));
      scaleRef.current = newScale;
      l2dRef.current.setScale(newScale);
      setScale(newScale);
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
    };
    // canvasRef/l2dRef 是稳定的 ref 容器，setPosX/setPosY/setScale 是稳定的 Jotai setter
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
