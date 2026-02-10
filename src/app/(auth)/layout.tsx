export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Container flexbox untuk menengahkan konten secara vertikal & horizontal
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      {children}
    </div>
  );
}
