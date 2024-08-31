import reelConfig from "../../constants/reelConfig.json";

const checkWin = (run: number[]): number => {

  // Convert reel positions into Symbol matrix
  const matrix = run.map(
    (pos, i) => {
      const config = reelConfig.reels[i];
      const symbols1 = config.concat().splice(pos, 3);

      if (symbols1.length === 3) return symbols1;
      else return symbols1.concat(config.concat().splice(0, 3 - symbols1.length));
    }
  );

  let winRow;
  
  // Check every row for wins
  for (let i = 0; i < 3; i ++) {
    const symbols: Record<number, number> = {};

    for (let j = 0; j < run.length; j ++) {
      if (!symbols[matrix[j][i]]) symbols[matrix[j][i]] = 1;
      else symbols[matrix[j][i]] ++;
    }

    for (const symbol in symbols) {
      if (symbols[symbol] === run.length) {
        winRow = i;
        break;
      }
    }
  }

  return (winRow !== undefined) ? winRow : -1;
};

export default checkWin;