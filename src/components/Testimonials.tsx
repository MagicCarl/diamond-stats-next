// Real user quotes only — never invent these. Add entries as users provide
// them; the section renders nothing while this list is empty.
const testimonials: {
  quote: string;
  name: string;
  role: string;
}[] = [];

export default function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section className="mx-auto max-w-4xl px-6 pb-16">
      <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
        What parents &amp; coaches say
      </h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((item) => (
          <figure
            key={item.quote}
            className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="text-yellow-500" aria-hidden>
              ★★★★★
            </div>
            <blockquote className="mt-3 text-gray-700 dark:text-gray-300">
              &ldquo;{item.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-sm">
              <span className="font-semibold text-gray-900 dark:text-white">{item.name}</span>
              <span className="text-gray-500 dark:text-gray-400"> — {item.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
