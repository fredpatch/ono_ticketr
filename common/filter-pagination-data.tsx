import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

interface FilterPaginationDataProps {
  create_new_array?: any;
  state: any;
  data: any;
  page: any;
  countRoute: any;
  data_to_send?: any;
  user?: any;
}

export const FilterPaginationData = async ({
  create_new_array = false,
  state,
  data,
  page,
  countRoute,
  data_to_send = {},
  user = undefined,
}: FilterPaginationDataProps) => {
  let obj;
  let headers = user
    ? {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      }
    : {};

  if (state != null && !create_new_array) {
    obj = { ...state, results: [...state.results, ...data], page: page };
  } else {
    await axios
      .post(API_URL + countRoute, data_to_send, headers)
      .then(({ data: { totalDocs } }) => {
        obj = {
          results: data,
          page: 1,
          totalDocs,
        };
      })
      .catch((err) => {
        console.log("Filter pagination error ==>", err);
      });
  }

  return obj;
};
