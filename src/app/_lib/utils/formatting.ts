// Fungsi-fungsi untuk formatting data

/**
 * Formats a date object or string into "DD MMM YYYY" format (e.g., "10 May 2024").
 * @param date The date to format.
 * @returns The formatted date string or "-" if the date is invalid.
 */
export function formatDate(date: Date | string | number | null | undefined): string {
  if (!date) {
    return "-";
  }
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return "-";
    }
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "-";
  }
}

/**
 * Formats a number into Indonesian Rupiah (IDR) currency format (e.g., "Rp\u00a010.000").
 * @param amount The number to format.
 * @param options Optional Intl.NumberFormatOptions to customize formatting.
 * @returns The formatted currency string or "-" if the amount is null or undefined.
 */
export function formatPrice(
  amount: number | null | undefined,
  options?: Intl.NumberFormatOptions,
): string {
  if (amount === null || amount === undefined) {
    return "-";
  }
  const defaultOptions: Intl.NumberFormatOptions = {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(options as any), // Spread options, ensuring type compatibility
  };
  try {
    return new Intl.NumberFormat("id-ID", { ...defaultOptions, ...options }).format(amount);
  } catch (error) {
    console.error("Error formatting price:", error);
    // Fallback for environments that might not support IDR well, or very small numbers
    if (typeof amount === 'number') {
        return `Rp ${amount.toLocaleString('id-ID')}`;
    }
    return "-";
  }
}

/**
 * Formats a number into a more compact representation (e.g., 1.5K, 2M).
 * @param num The number to format.
 * @param digits The number of digits to appear after the decimal point.
 * @returns The formatted compact number string.
 */
export function formatCompactNumber(num: number, digits = 1): string {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[^0]*)0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0";
}

// Fungsi untuk format angka dengan pemisah ribuan
export const formatNumberWithSeparator = (number: number | null | undefined): string => {
  if (number === null || number === undefined) {
    return '-'; // Atau string kosong '', tergantung preferensi
  }
  // Tampilkan tanda negatif jika angka negatif
  const formattedNumber = Math.abs(number).toLocaleString('id-ID');
  return number < 0 ? `-${formattedNumber}` : formattedNumber;
};