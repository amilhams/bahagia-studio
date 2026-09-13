/* ==========================================================================
   MOTION SURAT / 3D ENVELOPE ANIMATION JS MODULE
   ========================================================================== */

export function initEnvelopeMotion() {
  const envelope = document.getElementById('envelopeContainer');
  const waxSeal = document.getElementById('waxSeal');
  const toggleBtn = document.getElementById('envelopeToggleBtn');

  if (!envelope) return;

  const toggleEnvelope = () => {
    const isOpen = envelope.classList.toggle('open');
    if (toggleBtn) {
      toggleBtn.innerHTML = isOpen
        ? `Tutup Surat <span style="font-size:1.1em;">↑</span>`
        : `Buka Surat Undangan <span style="font-size:1.1em;">↓</span>`;
    }
  };

  // Click on wax seal or envelope body to open
  envelope.addEventListener('click', (e) => {
    // Only toggle if not already clicking inside an active letter action link
    if (!e.target.closest('.letter-btn')) {
      toggleEnvelope();
    }
  });

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleEnvelope();
    });
  }
}
