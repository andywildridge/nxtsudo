import { getPossiblesAndSolved } from "./initFns";

const sudokuStr: string = `
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

console.log("STARTING");

// transform string to number array(81)
//
const sudo: number[] = [...sudokuStr.replace(/\s/g, "")].map((i) => ~~i);

export const info = getPossiblesAndSolved(sudo);
