import { GameProvider } from './components/GameProvider';

export default function MemorizeGameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GameProvider>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Pilot Memorize Game</h1>
        {children}
      </div>
    </GameProvider>
  );
}
