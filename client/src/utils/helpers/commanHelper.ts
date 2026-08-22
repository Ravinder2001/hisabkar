export const formatDateTime = (dateString: string, includeTime: boolean = false) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  let formattedDate = `${day}/${month}/${year}`;

  if (includeTime) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    formattedDate += ` ${hours}:${minutes}`;
  }

  return formattedDate;
};

/** Converts a join date into a "2 years 3 months" / "5 months" / "12 days" style duration. */
export const formatMembershipDuration = (dateString: string) => {
  const joined = new Date(dateString);
  const now = new Date();

  let years = now.getFullYear() - joined.getFullYear();
  let months = now.getMonth() - joined.getMonth();
  if (now.getDate() < joined.getDate()) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years > 0) {
    return months > 0 ? `${years} yr${years > 1 ? "s" : ""} ${months} mo${months > 1 ? "s" : ""}` : `${years} yr${years > 1 ? "s" : ""}`;
  }
  if (months > 0) return `${months} month${months > 1 ? "s" : ""}`;

  const days = Math.max(0, Math.floor((now.getTime() - joined.getTime()) / (1000 * 60 * 60 * 24)));
  if (days === 0) return "Today";
  return `${days} day${days > 1 ? "s" : ""}`;
};

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Groups a timeline into "Today" / "Yesterday" / "17 Aug" style section labels. */
export const formatSectionLabel = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  if (isSameDay(date, today)) return `Today · ${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`;
  if (isSameDay(date, yesterday)) return `Yesterday · ${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`;
  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]}${date.getFullYear() !== today.getFullYear() ? ` ${date.getFullYear()}` : ""}`;
};
