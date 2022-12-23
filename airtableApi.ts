import Airtable, { FieldSet, Records } from "airtable";
const { AIRTABLE_API_KEY, AIRTABLE_BASE } = process.env;

export interface Model extends FieldSet {
  name: string;
  file: string;
  points: string;
}

const table = "gallery";
const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE);

export const airtablePut = async (body: Model) => {
  const result = await base(table).create(body);
  console.debug("created ", result.getId());
  return result;
};

export const airtableList = () => {
  return new Promise<Records<FieldSet>>((resolve, reject) => {
    let allRecords: Records<FieldSet> = [];
    base(table)
      .select({
        maxRecords: 300,
        sort: [{ field: "Created", direction: "desc" }],
      })
      .eachPage(
        function page(records, fetchNextPage) {
          allRecords = allRecords.concat(records);
          fetchNextPage();
        },
        function done(err) {
          // console.log(allRecords);
          resolve(allRecords);
          if (err) {
            console.error(err);
            reject(err);
          }
        }
      );
  });
};

// export const airtableDelete = async (table: string, userIds: string[]) => {
//   const records = await base(table)
//     .select({
//       filterByFormula: `OR(${userIds
//         .map((u) => `{userId} = '${u}'`)
//         .join(', ')})`,
//     })
//     .firstPage();

//   if (records.length === 0) {
//     console.log('No records found for userIds', userIds);
//   }

//   return Promise.all(records.map((r) => r.destroy()));
// };
