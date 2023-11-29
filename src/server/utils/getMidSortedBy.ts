import { getNextSortedBy } from "./getNextSortedBy";
import { getPreviousSortedBy } from "./getPreviousSortedBy";

function previousChar(c: string | undefined) {
  if (!c) throw new Error("deu ruim em previousChar");
  return String.fromCharCode(c.charCodeAt(0) - 1);
}

export function getMidSortedBy(previous: string, next: string): string {
  if (previous >= next) throw new Error("Tá chamando errado o sorting!");

  const mayBeFromPrevious = getNextSortedBy(previous);
  const mayBeFromNext = getPreviousSortedBy(next);

  if (
    (mayBeFromNext === previous ||
      mayBeFromPrevious.length < mayBeFromNext.length) &&
    mayBeFromPrevious < next
  )
    return mayBeFromPrevious;
  console.log("######### 0");
  console.log("mayBeFromNext", mayBeFromNext);
  console.log("mayBeFromPrevious", mayBeFromPrevious);
  if (mayBeFromNext > previous) return mayBeFromNext;

  console.log("######### 1");
  if (next.length === previous.length) {
    return previous + "m";
  }
  if (next.length > previous.length) {
    const appendChar = previousChar(next[next.length - 1]);

    // nunca deixe chegar em 'a' no final da string:
    if (appendChar === "a")
      return next.slice(next.length - 1) + appendChar + "m";

    return next.slice(next.length - 1) + appendChar;
  }

  // next.length < previous.length
  return mayBeFromPrevious;
}
