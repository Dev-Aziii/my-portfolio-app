export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-6">
      <div className="text-center">
        <h1
          className="
            text-7xl sm:text-8xl font-extrabold mb-4
            text-transparent bg-clip-text
            bg-linear-to-r from-zinc-600 to-zinc-400
            dark:from-white dark:to-zinc-400
            drop-shadow-[1px_1px_2px_rgba(0,0,0,0.25)]
          "
        >
          404
        </h1>

        <p className="text-xl sm:text-2xl font-medium text-text-light dark:text-text-dark">
          Page not found
        </p>

        <p className="mt-3 text-sm text-text-muted-light dark:text-text-muted-dark">
          This route does not exist.
        </p>
      </div>
    </div>
  );
}
