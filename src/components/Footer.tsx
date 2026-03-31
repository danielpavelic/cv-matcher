export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:justify-between sm:px-6">
        <p>&copy; {new Date().getFullYear()} AI Resume Matcher. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
