export default function Footer() {
  return (
    <footer className="footer">
      <small>&copy; {new Date().getFullYear()} Qard — Finanzas Personales</small>
      <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
      <a href="https://github.com"    target="_blank" rel="noreferrer">GitHub</a>
      <a href="https://linkedin.com"  target="_blank" rel="noreferrer">LinkedIn</a>
    </footer>
  );
}