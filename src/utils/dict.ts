interface Dict {
  value: number;
  label: string | number;
}

export const dict = (data: Dict[], value: string | number) => {
  const foundItem = data.find(v => v.value == value);
  if (foundItem) {
    return foundItem.label.toString();
  }
  return "";
};
