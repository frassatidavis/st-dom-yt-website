import { useEffect, useRef } from "react";
import { classicPhoto } from "../constants/photos";

// React 18 doesn't whitelist the lowercase `fetchpriority` attribute and warns
// on the camelCase form. Set it imperatively via a ref so the attribute lands
// on the DOM node without React noise. Drop this once we upgrade to React 19.
function useFetchPriority(priority) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (priority) node.setAttribute("fetchpriority", priority);
    else node.removeAttribute("fetchpriority");
  }, [priority]);
  return ref;
}

export default function ResponsivePicture({
  src: everydaySrc,
  widths,
  sizes,
  alt,
  loading = "lazy",
  decoding = "async",
  fetchPriority,
  style,
  className = "",
  onLoad,
  onError,
}) {
  const imgRef = useFetchPriority(fetchPriority);
  // Classic Mode may have its own photo for this spot
  const src = classicPhoto(everydaySrc);

  if (!src) return null;

  const hasWidths = Array.isArray(widths) && widths.length > 0;

  if (!hasWidths) {
    return (
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        style={style}
        className={className}
        onLoad={onLoad}
        onError={onError}
      />
    );
  }

  const lastDot = src.lastIndexOf(".");
  const lastSlash = src.lastIndexOf("/");
  const dir = lastSlash >= 0 ? src.slice(0, lastSlash + 1) : "";
  const basename =
    lastDot > lastSlash ? src.slice(lastSlash + 1, lastDot) : src.slice(lastSlash + 1);

  const webpSrcset = widths
    .map((w) => `${dir}${basename}-${w}.webp ${w}w`)
    .join(", ");
  const jpgSrcset = widths
    .map((w) => `${dir}${basename}-${w}.jpg ${w}w`)
    .join(", ");

  return (
    <picture>
      <source type="image/webp" srcSet={webpSrcset} sizes={sizes} />
      <source type="image/jpeg" srcSet={jpgSrcset} sizes={sizes} />
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        style={style}
        className={className}
        onLoad={onLoad}
        onError={onError}
      />
    </picture>
  );
}
