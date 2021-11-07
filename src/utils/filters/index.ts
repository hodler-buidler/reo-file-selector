import capitalize from './capitalize';
import capitalizeFirst from './capitalizeFirst';
import shortenFileName from './shortenFileName';
import shortenStr from './shortenStr';

const filters = Object.freeze({
  shortenStr,
  shortenFileName,
  capitalizeFirst,
  capitalize,
});

export default filters;
