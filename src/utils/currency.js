export const formatRupiah = (amount) => {
    const num = Number(amount) || 0;
    
    // Fallback manual jika Intl tidak tersedia
    const fallbackFormat = 'Rp' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    
    try {
      if (typeof Intl === 'object' && Intl.NumberFormat) {
        return 'Rp' + num.toLocaleString('id-ID');
      }
      return fallbackFormat;
    } catch (e) {
      return fallbackFormat;
    }
  };