const f = (x) => x.toFixed(2);
const emi = (P, r, n) => (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

// compound interest defaults
let A = 10000 * Math.pow(1 + 0.08 / 12, 120);
console.log("CI FV (contrib 0):", f(A));
const rm = 0.08 / 12;
const contribFV = 100 * ((Math.pow(1 + rm, 120) - 1) / rm);
console.log("CI FV (contrib 100):", f(A + contribFV), "invested:", 10000 + 100 * 120, "interest:", f(A + contribFV - 22000));

// simple interest
console.log("SI:", (10000 * 6 * 5) / 100, "maturity:", 13000);

// prepayment
const r1 = 8.5 / 1200, n1 = 180, B = 3000000, prepay = 500000;
const e = emi(B, r1, n1);
console.log("prepay orig EMI:", f(e));
const rem = B - prepay;
const newMonths = Math.ceil(Math.log(e / (e - r1 * rem)) / Math.log(1 + r1));
console.log("new months:", newMonths, "yrs:", (newMonths / 12).toFixed(1), "reduced:", ((n1 - newMonths) / 12).toFixed(1));
console.log("interest saved (tenure):", f(e * n1 - (e * newMonths + prepay)));
const newEmi = emi(rem, r1, n1);
console.log("new EMI:", f(newEmi), "monthly savings:", f(e - newEmi), "interest saved (emi):", f(e * n1 - (newEmi * n1 + prepay)));

// loan eligibility
const maxEmi = 100000 * 0.5 - 5000;
const r2 = 8.5 / 1200, n2 = 240;
const loan = maxEmi * (Math.pow(1 + r2, n2) - 1) / (r2 * Math.pow(1 + r2, n2));
console.log("maxEMI:", maxEmi, "loan:", f(loan));

// BMI targets
for (const b of [18.4, 18.5, 24.9, 25.0, 29.9, 30.0, 35.0, 40.0]) {
  const w = b * 1.7 * 1.7;
  console.log("BMI", b, "weight:", w.toFixed(4), "recomputed:", (w / (1.7 * 1.7)).toFixed(6));
}
