export function getRelativeTime(timestamp: string) {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const elapsed = Number(new Date()) - Number(new Date(timestamp));

  // Get the time values
  const seconds = Math.round(elapsed / 1000);
  const minutes = Math.round(elapsed / (1000 * 60));
  const hours = Math.round(elapsed / (1000 * 60 * 60));
  const days = Math.round(elapsed / (1000 * 60 * 60 * 24));

  // Return the relative time
  if (seconds < 60) {
    return rtf.format(-seconds, "seconds");
  } else if (minutes < 60) {
    return rtf.format(-minutes, "minutes");
  } else if (hours < 24) {
    return rtf.format(-hours, "hours");
  } else {
    return rtf.format(-days, "days");
  }
}
