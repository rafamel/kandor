export interface Tracker {
  request: () => void;
  response: () => void;
}

export function createTracker(action: () => void): Tracker {
  let hasRun = false;
  let request = false;
  let response = false;

  function run(): void {
    if (!request || !response) return;
    hasRun = true;
    action();
  }

  return {
    request() {
      if (hasRun) return;
      request = true;
      run();
    },
    response() {
      if (hasRun) return;
      response = true;
      run();
    }
  };
}
