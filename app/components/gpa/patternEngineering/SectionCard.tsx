type SectionCardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function SectionCard({
  children,
  className = "",
}: SectionCardProps) {
  return (
    <section className={`mt-8 rounded-2xl bg-white p-6 shadow ${className}`}>
      {children}
    </section>
  );
}