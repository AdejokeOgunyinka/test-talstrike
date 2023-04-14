const isFile = (input: any) => "File" in window && input instanceof File;

const convertJsonToFormData = (
  data: { [s: string]: unknown } | ArrayLike<unknown>
) => {
  const formData = new FormData();
  const entries = Object.entries(data); // returns array of object property as [key, value]
  for (let i = 0; i < entries.length; i++) {
    // don't try to be smart by replacing it with entries.each, it has drawbacks
    const arKey = entries[i][0];
    let arVal = entries[i][1];
    if (typeof arVal === "boolean") {
      arVal = arVal === true ? 1 : 0;
    }
    if (Array.isArray(arVal)) {
      console.log({ arKey });
      console.log({ arVal });

      if (isFile(arVal[0])) {
        for (let z = 0; z < arVal.length; z++) {
          formData.append(`${arKey}[]`, arVal[z]);
        }

        continue; // we don't need to append current element now, as its elements already appended
      } else if (arVal[0] instanceof Object) {
        for (let j = 0; j < arVal.length; j++) {
          if (arVal[j] instanceof Object) {
            // if first element is not file, we know its not files array
            for (const prop in arVal[j]) {
              if (Object.prototype.hasOwnProperty.call(arVal[j], prop)) {
                // do stuff
                if (!isNaN(Date.parse(arVal[j][prop]))) {
                  // console.log('Valid Date \n')
                  // (new Date(fromDate)).toUTCString()
                  formData.append(
                    `${arKey}[${j}][${prop}]`,
                    new Date(arVal[j][prop])?.toDateString()
                  );
                } else {
                  formData.append(`${arKey}[${j}][${prop}]`, arVal[j][prop]);
                }
              }
            }
          }
        }
        continue; // we don't need to append current element now, as its elements already appended
      } else {
        arVal = JSON.stringify(arVal);
      }
    }

    if (arVal === null) {
      continue;
    }
    formData.append(arKey, arVal as any);
  }
  return formData;
};

export default convertJsonToFormData;
