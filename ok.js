const now = new Date();
const oneWeekAgo = now.getDate() - 7;

console.log(oneWeekAgo);

const groupedData = {
  footwear: 90,
  fragrance: 7200,
  skincare: 3200,
};

const totalAmount = 10000;

const values = Object.values(groupedData)
  .map((value) => (value / totalAmount) * 100)
  .map((value) => (value < 1 ? 1 : value).toFixed(2));

console.log("Object.values =", Object.values(groupedData));
console.log("VALUES =", values);
// console.log("RESULT =", result);
