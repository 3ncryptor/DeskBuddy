// Premium glassmorphism toast styles for DeskBuddy

export const toastBaseStyle = {
  borderRadius: '16px',
  background: 'rgba(255,255,255,0.85)',
  color: '#1a237e',
  fontWeight: 700,
  fontSize: '1.13rem',
  boxShadow: '0 8px 32px #7f9cf522, 0 1.5px 8px #5bc0eb11',
  borderLeft: '7px solid #10b981',
  padding: '1.1rem 1.5rem 1.1rem 1.2rem',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  backdropFilter: 'blur(8px) saturate(120%)',
};

export const toastErrorStyle = {
  ...toastBaseStyle,
  color: '#d32f2f',
  borderLeft: '7px solid #d32f2f',
  background: 'rgba(255,240,240,0.95)',
};

export const toastSuccessStyle = {
  ...toastBaseStyle,
  color: '#059669',
  borderLeft: '7px solid #10b981',
  background: 'rgba(230,255,250,0.97)',
}; 