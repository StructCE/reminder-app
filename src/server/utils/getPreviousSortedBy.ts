function previousChar(c: string) {
  return String.fromCharCode(c.charCodeAt(0) - 1);
}

export function getPreviousSortedBy(lastSortedBy: string): string {
  // output.length is input.length + 1
  //could amortize:
  // using getPreviousSorted as well;
  // periodic balancing;

  const lastChar = lastSortedBy[lastSortedBy.length - 1]!;

  if (lastChar === "b") return lastSortedBy + "am";

  return (
    lastSortedBy.slice(0, lastSortedBy.length - 1) + previousChar(lastChar)
  );
}
