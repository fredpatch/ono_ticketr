import { FilterPaginationData } from "../common/filter-pagination-data";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

const ServerDomain = process.env.NEXT_PUBLIC_API_URL as string;

export const fetchNotifications = async ({
  filter,
  page,
  deletedDocCount = 0,
  access_token,
  new_notification_available,
  userAuth,
  setUserAuth,
  notifications,
  setNotifications,
}: any) => {
  axios
    .post(
      ServerDomain + "/notifications/get-notifications",
      {
        filter,
        page,
        deletedDocCount,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
    .then(async ({ data: { notifications: notif } }) => {
      if (new_notification_available) {
        setUserAuth({ ...userAuth, new_notification_available: false });
      }

      let formattedData = await FilterPaginationData({
        state: notifications,
        data: notif,
        page,
        countRoute: "/notifications/all-notifications-count",
        data_to_send: { filter },
        user: access_token,
      });

      setNotifications(formattedData);
    })
    .catch((error) => {
      toast({
        title: "Error",
        description: `An error occurred while fetching notifications: ${error}.`,
        duration: 5000,
      });
    });
};
