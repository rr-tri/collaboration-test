export const getRandCol = () => {
  const colors = [
    'bg-red-900',
    'bg-orange-900',
    'bg-amber-900',
    'bg-yellow-900',
    'bg-lime-900',
    'bg-green-900',
    'bg-emerald-900',
    'bg-teal-900',
    'bg-cyan-900',
    'bg-sky-900',
    'bg-blue-900',
    'bg-indigo-900',
    'bg-violet-900',
    'bg-purple-900',
    'bg-fuchsia-900',
    'bg-pink-900',
    'bg-rose-900',
  ];
  for (let i = 16; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [colors[i], colors[j]] = [colors[j], colors[i]];
  }
  const x = colors[0];
  return x;
};

