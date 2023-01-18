const sudokuStr = `
                        000 000 200
                        000 050 009
                        002 709 003

                        003 000 072
                        040 007 905
                        009 010 608

                        500 098 000
                        000 300 000
                        091 645 000
`;

export const sudo = [...sudokuStr.replace(/\s/g, "")].map((i) => ~~i);
