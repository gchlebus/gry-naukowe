import { solveStages } from "./solver";
const scope = self as unknown as {
  onmessage: ((e: MessageEvent) => void) | null;
  postMessage: (v: unknown) => void;
};
scope.onmessage = (e) => {
  try {
    const plans = solveStages(e.data.state, (n) =>
      scope.postMessage({ type: "progress", stage: n }),
    );
    scope.postMessage({ type: "done", plans });
  } catch (error) {
    scope.postMessage({
      type: "error",
      message:
        error instanceof Error
          ? error.message
          : "Nie udało się obliczyć wskazówek.",
    });
  }
};
