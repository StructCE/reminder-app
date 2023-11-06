function nextChar(c: string) {
  return String.fromCharCode(c.charCodeAt(0) + 1);
}

export function getNextSortedBy(lastSortedBy: string | undefined): string {
  // output.length is input.length + 1
  //could amortize:
  // using getPreviousSorted as well;
  // periodic balancing;
  if (!lastSortedBy) return "m";

  const lastChar = lastSortedBy[lastSortedBy.length - 1]!;

  if (lastChar === "z") return lastSortedBy + "m";

  return lastSortedBy.slice(0, lastSortedBy.length - 1) + nextChar(lastChar);
}
