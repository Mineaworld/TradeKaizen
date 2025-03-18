/**
 * Global error handler utility for component events
 */

export const handleEventSafely = <E extends React.SyntheticEvent>(
  e: E,
  handler?: (e: E) => void,
  options: {
    stopPropagation?: boolean;
    preventDefault?: boolean;
  } = { stopPropagation: true, preventDefault: false }
) => {
  try {
    if (options.stopPropagation) {
      e.stopPropagation();
    }
    if (options.preventDefault) {
      e.preventDefault();
    }
    if (handler) {
      handler(e);
    }
  } catch (error) {
    console.error("Error handling event:", error);
  }
};

/**
 * Creates a safe version of an event handler that won't throw unhandled exceptions
 */
export const createSafeEventHandler = <E extends React.SyntheticEvent>(
  handler?: (e: E) => void,
  options: {
    stopPropagation?: boolean;
    preventDefault?: boolean;
  } = { stopPropagation: true, preventDefault: false }
) => {
  return (e: E) => handleEventSafely(e, handler, options);
};
