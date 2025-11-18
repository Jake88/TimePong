import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      {/* Main content container */}
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Game title */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-[var(--primary-text-color)] md:text-6xl">
            TimePong
          </h1>
          <p className="text-xl text-[var(--secondary-text-color)]">
            The Ultimate Drinking Game
          </p>
        </div>

        {/* Game description */}
        <div className="space-y-3 rounded-lg bg-[var(--secondary-bg)] p-6 text-left">
          <p className="text-[var(--secondary-text-color)]">
            A fast-paced drinking game that combines timing, luck, and hilarious challenges.
          </p>
          <p className="text-[var(--secondary-text-color)]">
            Draw cards to reveal actions, challenges, spells, and curses. The timer keeps everyone on their toes!
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/game')}
            className="w-full rounded-lg bg-[var(--limited-highlight)] px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-opacity-90 active:scale-95"
          >
            Start Game
          </button>

          <button
            onClick={() => navigate('/cards')}
            className="w-full rounded-lg border-2 border-[var(--limited-highlight)] bg-transparent px-8 py-4 text-lg font-semibold text-[var(--limited-highlight)] transition-all hover:bg-[var(--limited-highlight)] hover:bg-opacity-10 active:scale-95"
          >
            Browse Cards
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-8 space-y-2 text-sm text-[var(--light-grey)]">
          <p>Please drink responsibly</p>
          <p className="text-xs">Must be 21+ to play</p>
        </div>
      </div>
    </div>
  );
}
