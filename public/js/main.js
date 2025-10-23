document.querySelectorAll('input[type=number][id^=quantity_]').forEach(input => {
  input.addEventListener('change', e => {
    const id = e.target.id.split('_')[1];
    const btn = document.getElementById(`update-qty_${id}`);
    const original = parseInt(e.target.getAttribute('value'), 10);
    btn.style.background = e.target.value == original ? 'rgba(255, 255, 255, 0.02)' : 'var(--color-primary)';
    btn.disabled = e.target.value == original;
  });
});
