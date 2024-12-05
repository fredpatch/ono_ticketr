import getDay, { getFullDay } from "@/common/date";
import { IconHeart } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

const EventPostCard = ({ event, author }: any) => {
  let {
    title,
    event_id,
    banner,
    description,
    location,
    startDateTime,
    endDateTime,
    price,
    isFree,
    url,
    content,
    tags,
    author: {
      personal_info: { fullname, username, profile_img },
    },
    activity: { total_likes },
    draft,
    publishedAt,
    updatedAt,
  } = event;

  // console.log("PUBLISHED AT ==>", author);
  // let { fullname, username, profile_img } = author;

  return (
    <Link
      href={`/events/${event_id}`}
      className="flex gap-8 items-center border-b border-grey pb-5 pt-5 mb-4 rounded-md"
    >
      <div className="w-full">
        <div className="flex gap-2 items-center mb-7">
          <Image
            width={50}
            height={50}
            src={profile_img}
            alt="profile"
            className="w-6 h-6 rounded-full"
          />
          <p className=" line-clamp-1">
            {fullname} @{username}
          </p>
          <p className=" min-w-fit">{getDay({ timestamp: publishedAt })}</p>
        </div>

        <h1 className="blog-title"> {title} </h1>
        <p className="my-3 text-md font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">
          {description}
        </p>

        <div className=" flex gap-4 mt-7">
          <span className="btn-light py-1 px-4">{tags[0]}</span>
          <span className="btn-dark py-1 px-4">
            {!isFree ? (price ? `${price} xaf` : "Free") : "Free"}
          </span>
          <span className=" ml-3 flex items-center gap-2 text-gray-400">
            <IconHeart className="w-6 h-6 text-red-400 fill-red-200" />
            {total_likes}
          </span>
        </div>
      </div>

      <div className="rounded-md h-28 aspect-square bg-transparent">
        <Image
          width={300}
          height={300}
          src={banner || "/assets/logo/1.png"}
          alt="banner_img"
          className="w-full h-full aspect-square object-cover rounded-sm"
        />
      </div>
    </Link>
  );
};

export default EventPostCard;
