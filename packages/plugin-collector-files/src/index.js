const debug = require("debug")("phenomic:plugin:collector-files");

const sep = "/";
function normalizeWindowsPath(value: string) {
  return value.replace(/(\/|\\)+/g, sep);
}

export function getKey(name: string, json: PhenomicTransformResult): string {
  if (json.data.path) {
    debug(`key for '${name}' is '${json.data.path}' (from json)`);
    return json.data.path;
  }
  // normalize windows path
  name = normalizeWindowsPath(name);
  // remove (index).md,json etc, for key
  const key = name
    // remove extension for prettier keys
    .replace(/.(md|json)$/, "")
    // remove index too
    .replace(/\/index$/, "");
  debug(`key for '${name}' is '${key}' (automatically computed)`);
  return key;
}

export function formatDate(dateString: string) {
  const date = new Date(dateString).toISOString();
  return date.substring(0, date.indexOf("T"));
}

function isLiteral(value) {
  const type = typeof value;
  return type === "string" || type === "number" || type === "boolean";
}

function isArrayOfLiterals(array) {
  return Array.isArray(array) && array.every(isLiteral);
}

export function getFieldValue(json: PhenomicTransformResult, key: string) {
  if (isArrayOfLiterals(json.data[key])) {
    return json.data[key];
  }
  if (isLiteral(json.data[key])) {
    return [json.data[key]];
  }
  return [];
}

const dateLength = "YYYY-MM-DD".length;
export function injectData(
  name: string,
  json: PhenomicTransformResult
): PhenomicTransformResult {
  let date;
  try {
    date = formatDate(name.slice(0, dateLength));
  } catch (e) {
    // date is not valid
  }
  return {
    data: {
      date,
      filename: name,
      ...json.data
    },
    partial: {
      date,
      filename: name,
      ...json.partial
    }
  };
}

export function parsePath(name: string) {
  const pathSegments = name.split(sep);
  const allPaths = pathSegments.reduce((acc, v) => {
    acc.push(acc.length > 0 ? acc[acc.length - 1] + sep + v : v);
    return acc;
  }, []);
  const filename = pathSegments[pathSegments.length - 1];
  return { filename, allPaths };
}

export default function() {
  return {
    name: "@phenomic/plugin-collector-files",
    collect(db: PhenomicDB, name: string, json: PhenomicTransformResult) {
      name = normalizeWindowsPath(name);
      const key = getKey(name, json);
      const { filename, allPaths } = parsePath(name);
      const adjustedJSON = injectData(filename, json);
      // full resource, not sorted
      db.put(null, key, {
        ...adjustedJSON,
        id: key
      });
      return Promise.all(
        allPaths.map(pathName => {
          const relativeKey = key.replace(pathName + sep, "");
          const sortedKey = relativeKey;
          debug(`collecting ${relativeKey} for path '${pathName}'`);
          return Promise.all([
            db.put([pathName], relativeKey, {
              ...adjustedJSON,
              id: relativeKey
            }),
            // sorted list
            db.put([pathName, "default"], sortedKey, { id: relativeKey }),
            ...Object.keys(json.data).map(type => {
              return getFieldValue(json, type).map(value =>
                Promise.all([
                  // sorted list, filtered by tags
                  db.put([pathName, type, value], sortedKey, {
                    id: relativeKey
                  }),
                  // global tag list
                  db.put([type], value, { id: value, partial: value }),
                  db.put([type, "default"], value, {
                    id: value,
                    partial: value
                  }),
                  db.put([type, "path", pathName], value, {
                    id: value,
                    partial: value
                  })
                ])
              );
            })
          ]);
        })
      );
    }
  };
}
