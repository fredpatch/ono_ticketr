import { FilterPaginationData } from "../common/filter-pagination-data";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { lookInLocal } from "@/common/localeStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const publish_event = async (
  event: any,
  access_token: any,
  event_id: any
) => {
  const banner_public_id = lookInLocal("fileKey");
  console.log("Image file key sent to server: ", banner_public_id);
  const response = await axios.post(
    `${API_URL}/events/publish-event`,
    { ...event, id: event_id, banner_public_id },
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  return response.data;
};

export const latest_events = async (
  { page = 1 },
  events: any,
  setEvents: any
) => {
  await axios
    .post(`${API_URL}/events/latest-events`, {
      page,
    })
    .then(async ({ data }) => {
      let formattedData = await FilterPaginationData({
        state: events,
        data: data.events,
        page: page,
        countRoute: "/events/all-latest-events-count",
      });

      // console.log("@@@ FORMATTED DATA", formattedData);
      setEvents(formattedData);
    })
    .catch((error) => console.log(error));
};

// TODO: Add fetchTrendingBlogs
export const trending_events = async (setTrendingEvents: any) => {
  axios
    .get(`${API_URL}/events/trending-events`)
    .then(({ data }) => {
      // console.log(data.events);
      setTrendingEvents(data.events);
    })
    .catch((error) => {
      console.log(error);
    });
};

// TODO: Add fetchBlogsByCategory
export const eventsByCategory = async (
  { page = 1 },
  pageState: any,
  events: any,
  setEvents: any
) => {
  axios
    .post(`${API_URL}/events/search-posts`, {
      tag: pageState,
      page,
    })
    .then(async ({ data }) => {
      // console.log(data.blogs);

      let formattedData = await FilterPaginationData({
        state: events,
        data: data.events,
        page: page,
        countRoute: "/events/search-posts-count",
        data_to_send: { tag: pageState },
      });
      setEvents(formattedData);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const get_events = async ({
  page,
  draft,
  deletedDocCount = 0,
  query,
  access_token,
  events,
  setEvents,
  setDrafts,
  drafts,
}: any) => {
  await axios
    .post(
      `${API_URL}/events/user-written-events`,
      {
        page,
        draft,
        deletedDocCount,
        query,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
    .then(async ({ data }) => {
      let formattedData = await FilterPaginationData({
        state: draft ? drafts : events,
        data: data.events,
        page,
        user: access_token,
        countRoute: "/events/user-written-events-count",
        data_to_send: { draft, query },
      });

      // console.log("@@@ FORMATTED DATA drafts", formattedData);
      if (draft) {
        setDrafts(formattedData);
      } else {
        setEvents(formattedData);
      }
    })
    .catch((error) => console.log(error));
};

export const get_event = (
  event_id: any,
  setEvent: any,
  setSimilarEvents: any,
  setLoading: any,
  access_token: any
) => {
  axios
    .post(
      `${API_URL}/events/get-event`,
      {
        event_id,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
    .then(({ data: { event } }) => {
      // console.log("@@@ EVENT DATA", event);
      setEvent(event);

      axios
        .post(`${API_URL}/events/search-posts`, {
          tag: event.tags[0],
          limit: 6,
          eliminate_event: event_id,
        })
        .then(({ data }) => {
          // console.log("@@@ SIMILAR EVENTS DATA", data);
          setSimilarEvents(data.events);
        });

      setLoading(false);
    });
};

export const delete_event = async (
  event_id: any,
  access_token: any,
  setStateFunc: any,
  index: any,
  target: any
) => {
  target.setAttribute("disabled", true);

  await axios
    .post(
      `${API_URL}/events/delete-event`,
      { event_id },
      { headers: { Authorization: `Bearer ${access_token}` } }
    )
    .then(({ data }) => {
      target.removeAttribute("disabled");
      toast({
        description: "Event Deleted.",
        duration: 5000,
      });
      setStateFunc((prevVal: any) => {
        let { deletedDocCount, totalDocs, results } = prevVal;
        results?.splice(index, 1);

        if (!deletedDocCount) {
          deletedDocCount = 0;
        }

        if (!results.length && totalDocs - 1 > 0) {
          return null;
        }

        return {
          ...prevVal,
          totalDocs: totalDocs - 1,
          deletedDocCount: deletedDocCount + 1,
        };
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// export const get_user_events = ({
//   page = 1,
//   user_id,
//   events,
//   setEvents,
// }: any) => {
//   user_id = user_id == undefined ? events.user_id : user_id;

//   axios
//     .post(API_URL + "/events/search-posts", {
//       author: user_id,
//       page,
//     })
//     .then(async ({ data }) => {
//       let formattedData = await FilterPaginationData({
//         state: events,
//         data: data.events,
//         page,
//         countRoute: "/events/search-posts-count",
//         data_to_send: {
//           author: user_id,
//         },
//       });

//       // console.log("@@@ FORMATTED DATA", formattedData);
//       setEvents(formattedData);
//     });
// };

// export const user_profile = async (
//   profileId: any,
//   setProfile: any,
//   setLoading: any,
//   setProfileLoaded: any,
//   setEvents: any
// ) => {
//   axios
//     .post(API_URL + "/user/get-profile", { username: profileId })
//     .then(({ data: user }) => {
//       // console.log("@@@ USER =>", user);
//       if (user != null) {
//         setProfile(user);
//       }
//       setProfileLoaded(profileId);
//       get_user_events({ user_id: user._id, setEvents: setEvents });
//       setLoading(false);
//     })
//     .catch((error) => {
//       console.log(error);
//       setLoading(false);
//     });
// };
