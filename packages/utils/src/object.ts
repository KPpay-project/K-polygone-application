export function getPropertyByPath<T>(
  obj: any,
  path: string,
): { value?: T; error?: string } {
  try {
    const keys = path.split(".");
    let result: any = obj;

    for (const key of keys) {
      if (!result || typeof result !== "object") {
        return { error: "Invalid property path or object is null/undefined." };
      }

      result = result[key];
    }

    return { value: result };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while accessing the property." };
  }
}

export function getMultiPropertyByPath<T>(
  obj: any,
  pathQuery: string,
): { values?: T[]; error?: string } {
  try {
    const paths = pathQuery.split(",").map((path) => path.trim());
    const values: T[] = [];

    paths.forEach((path) => {
      const {
        value,
        error,
      }: { value?: T | undefined; error?: string | undefined } =
        getPropertyByPath<T>(obj, path);
      if (error) {
        throw new Error(error);
      }
      values.push(value as T);
    });

    return { values: values };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while accessing the properties." };
  }
}

export function stripSensitiveProperties<
  T extends Record<string, any>,
  K extends keyof T,
>(object: T, propertiesArray: K[]): Omit<T, K> {
  const result = { ...object };

  propertiesArray.forEach((property) => {
    delete result[property];
  });

  return result;
}
