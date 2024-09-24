import CustomStore from "devextreme/data/custom_store";

function handleErrors(response: any) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export const createDataSource = (options: any) => {
  let idField = "_id";
  // let database = options.database;
  let collectionName = options.collectionName;

  const customDataSource = new CustomStore({
    key: idField,
    load: (loadOptions) => {
      let url = `http://localhost:3000/query`;
      const query = fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // database: database,
          collection: collectionName,
          loadOptions: loadOptions,
        }),
      });

      return query
        .then(handleErrors)
        .then((response) => response.json())
        .catch(() => {
          throw "Network error";
        });
    },
  });

  return customDataSource;
};
