import { useEffect, useRef, useState } from "react";

// Hook to avoid double calls with side-effects.
//
// See:
// - https://stackoverflow.com/a/71755316/2582462
// - https://blog.ag-grid.com/avoiding-react-18-double-mount/
//
export const useEffectOnce = (effect: () => void | (() => void)) => {
  const effectFn = useRef<() => void | (() => void)>(effect);
  const destroyFn = useRef<void | (() => void)>();
  const effectCalled = useRef(false);
  const rendered = useRef(false);
  const [, setVal] = useState<number>(0);

  if (effectCalled.current) {
    rendered.current = true;
  }

  useEffect(() => {
    // Only execute the effect first time around.
    if (!effectCalled.current) {
      destroyFn.current = effectFn.current();
      effectCalled.current = true;
    }

    // This forces one render after the effect is run.
    setVal((val) => val + 1);

    return () => {
      // If the comp didn't render since the useEffect was called,
      // we know it's the dummy React cycle.
      if (!rendered.current) {
        return;
      }

      // Otherwise this is not a dummy destroy, so call the destroy func.
      if (destroyFn.current) {
        destroyFn.current();
      }
    };
  }, []);
};