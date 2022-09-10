export const isValidArray = (array, withData = false) => {
  const validArray =
    !!array && typeof array === "object" && Array.isArray(array);
  if (validArray && withData) {
    const result = validArray && !!array.length;
    console.log("isValidArray withData ==> ", result);
    return result;
  }
  console.log("isValidArray withoutData ==> ", validArray);
  return validArray;
};
