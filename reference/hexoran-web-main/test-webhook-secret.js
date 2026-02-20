// Quick test to verify webhook secret
const secret = "Hexor@n000007";

console.log("Secret:", secret);
console.log("Length:", secret.length);
console.log("Bytes:", Buffer.from(secret, 'utf8'));
console.log("First char code:", secret.charCodeAt(0));
console.log("Last char code:", secret.charCodeAt(secret.length - 1));

