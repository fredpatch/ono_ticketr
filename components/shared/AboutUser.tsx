import { getFullDay } from "@/common/date";
import Link from "next/link";
import React from "react";
import {
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandTiktok,
  IconGlobe,
  IconBrandYoutube,
} from "@tabler/icons-react";

const AboutUser = ({ bio, social_links, joinedAt, className }: any) => {
  // Map the social media keys to Tabler icons
  const iconMap: { [key: string]: React.ElementType } = {
    twitter: IconBrandTwitter,
    youtube: IconBrandYoutube,
    instagram: IconBrandInstagram,
    facebook: IconBrandFacebook,
    linkedin: IconBrandLinkedin,
    tiktok: IconBrandTiktok,
    website: IconGlobe,
  };

  return (
    <div className={"md:w-[90%] md:mt-7 " + className}>
      <p className="text-xl leading-7">
        {bio.length ? bio : "Nothing about this user"}
      </p>

      <div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey">
        {Object.keys(social_links).map((key) => {
          const link = social_links[key];
          const IconComponent = iconMap[key];

          return link && IconComponent ? (
            <Link href={link} key={key} target="_blank">
              <IconComponent className="text-2xl hover:text-black" />
            </Link>
          ) : null;
        })}
      </div>

      <p className="text-xl leading-7 text-dark-grey">
        Joined on {getFullDay({ timestamp: joinedAt })}
      </p>
    </div>
  );
};

export default AboutUser;
