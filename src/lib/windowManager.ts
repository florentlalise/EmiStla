let currentZIndex = 50;

export const getNextZIndex = () => {
  currentZIndex += 1;
  return currentZIndex;
};
