export function numberToWords(amount: number) {
    const ones: Record<string, unknown> = {
        1: "One",
        2: "Two",
        3: "Three",
        4: "Four",
        5: "Five",
        6: "Six",
        7: "Seven",
        8: "Eight",
        9: "Nine",
    };

    const tens: Record<string, unknown> = {
        10: "Ten",
        11: "Eleven",
        12: "Twelve",
        13: "Thirteen",
        14: "Fourteen",
        15: "Fifteen",
        16: "Sixteen",
        17: "Seventeen",
        18: "Eighteen",
        19: "Nineteen",
        20: "Twenty",
        30: "Thirty",
        40: "Forty",
        50: "Fifty",
        60: "Sixty",
        70: "Seventy",
        80: "Eighty",
        90: "Ninety",
    };

    if (amount === 0) return "Zero";

    if (ones[amount]) return ones[amount];
    if (tens[amount]) return tens[amount];

    let words = "";

    const thousands = Math.floor(amount / 1000);
    const remainder = amount % 1000;

    if (thousands > 0) {
        words += convertThreeDigitNumber(thousands, ones, tens) + " Thousand";
        if (remainder > 0) words += " ";
    }

    if (remainder > 0) {
        words += convertThreeDigitNumber(remainder, ones, tens);
    }

    return words;
}

function convertThreeDigitNumber(
    amount: number,
    ones: Record<string, unknown>,
    tens: Record<string, unknown>
) {
    let words = "";

    const hundreds = Math.floor(amount / 100);
    const remainder = amount % 100;

    if (hundreds > 0) {
        words += ones[hundreds] + " Hundred";
        if (remainder > 0) words += " and ";
    }

    if (remainder > 0) {
        if (remainder < 10) {
            words += ones[remainder];
        } else if (tens[remainder]) {
            words += tens[remainder];
        } else {
            const tensDigit = Math.floor(remainder / 10) * 10;
            const onesDigit = remainder % 10;
            words += tens[tensDigit];
            if (onesDigit > 0) {
                words += " " + ones[onesDigit];
            }
        }
    }

    return words;
}
