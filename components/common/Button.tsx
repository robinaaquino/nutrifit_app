export default function Button({
  type,
  text,
  round,
  headline,
  handleClick,
}: {
  type?: string;
  text: string;
  round?: boolean;
  headline?: boolean;
  handleClick?: any;
}) {
  return (
    <>
      <div>
        <button
          onClick={() => (handleClick ? handleClick() : null)}
          className={
            `items-center justify-center w-1/2    text-white transition-colors duration-200 bg-nf_green shrink-0 sm:w-auto gap-x-2 hover:bg-nf_dark_blue font-source` +
            (round ? ` rounded-full` : ` rounded-lg`) +
            (headline
              ? ` font-bold uppercase tracking-wider py-4 px-8`
              : ` text-sm tracking-wide px-5 py-2`)
          }
        >
          {type == "add" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : type == "previous" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 rtl:-scale-x-100"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
              />
            </svg>
          ) : type == "next" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 rtl:-scale-x-100"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          ) : null}

          <span>{text}</span>
        </button>
      </div>
    </>
  );
}
