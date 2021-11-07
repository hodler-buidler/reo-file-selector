import capitalizeFirst from './capitalizeFirst';

function capitalize(string: string): string {
  const particles = string.split(' ').map(capitalizeFirst);
  return particles.join(' ');
}

export default capitalize;
