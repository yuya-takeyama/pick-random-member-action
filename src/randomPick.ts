export const randomPick = (count: number, members: string[]): string[] => {
  if (count > members.length) {
    throw new Error('the number of members are insufficient');
  }
  const result = [];
  const shuffled = members.sort(() => Math.random() - 0.5);
  for (let i = 0; i < count; i++) {
    result.push(shuffled[i]);
  }

  return result;
};
