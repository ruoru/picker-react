export function typeIs(variable) {
  const typeName = Object.prototype.toString.call(variable).replace(/^\[object |]$/gi, '');
  return typeName.toLowerCase();
}

export function isNumber(variable) {
  return typeIs(variable) === 'number' && Number.isFinite(variable);
}

export default {
  typeIs,
  isNumber,
};