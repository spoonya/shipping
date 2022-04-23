export function isMediaBreakpoint(breakpoint = 767.98) {
  const mediaBreakpoint = breakpoint;

  if (document.documentElement.clientWidth > mediaBreakpoint) {
    return false;
  }

  return true;
}
