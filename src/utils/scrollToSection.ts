export function scrollToSection(targetId: string) {
  const section = document.getElementById(targetId);
  if (!section) return;

  const headerOffset = 96;
  const rect = section.getBoundingClientRect();
  const targetY = rect.top + window.scrollY - headerOffset;

  window.scrollTo({ top: targetY, behavior: 'smooth' });
}
