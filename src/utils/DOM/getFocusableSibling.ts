export function getFocusableSibling<T extends Element>(
  element: T,
  direction: 'previous' | 'next',
): null | T {
  const siblingPropertyName = `${direction}ElementSibling`;
  const sibling = (element as any)[siblingPropertyName] as T | null;

  if (!sibling) return null;

  if (sibling.getAttribute('tabindex') === '0') return sibling;

  return getFocusableSibling(sibling, direction);
}
