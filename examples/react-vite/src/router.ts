const navigationEvent = "welkui:navigate";

/** Paths always start and end with "/" to match the pre-rendered GitHub Pages folders. */
export function normalizePath(pathname: string) {
  const path = `/${pathname.split("/").filter(Boolean).join("/")}`;
  return path === "/" ? path : `${path}/`;
}

export function subscribe(listener: () => void) {
  window.addEventListener("popstate", listener);
  window.addEventListener(navigationEvent, listener);
  return () => {
    window.removeEventListener("popstate", listener);
    window.removeEventListener(navigationEvent, listener);
  };
}

export const getPath = () => normalizePath(window.location.pathname);
export const getServerPath = () =>
  typeof window === "undefined" ? "/" : getPath();

export function navigate(to: string, { replace = false } = {}) {
  const url = new URL(to, window.location.href);
  const target = `${normalizePath(url.pathname)}${url.search}${url.hash}`;
  if (replace) window.history.replaceState(null, "", target);
  else window.history.pushState(null, "", target);
  window.dispatchEvent(new Event(navigationEvent));
}

/** Converts legacy "#/faq" links into "/faq/" before the app renders. */
export function redirectLegacyHash() {
  const { hash } = window.location;
  if (!hash.startsWith("#/")) return false;
  window.history.replaceState(null, "", normalizePath(hash.slice(1)));
  return true;
}

/** Lets plain internal <a href="/..."> links navigate without a full page load. */
export function interceptLinkClicks(event: MouseEvent) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    !(event.target instanceof Element)
  )
    return;
  const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
  if (
    !anchor ||
    anchor.hasAttribute("download") ||
    (anchor.target && anchor.target !== "_self")
  )
    return;
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return;
  if (
    url.hash &&
    normalizePath(url.pathname) === getPath() &&
    !url.hash.startsWith("#/")
  )
    return;
  event.preventDefault();
  navigate(
    url.hash.startsWith("#/")
      ? url.hash.slice(1)
      : `${url.pathname}${url.search}${url.hash}`,
  );
}
