import Link from "next/link";

const UserCard = ({ user }: any) => {
  let {
    personal_info: { fullname, username, profile_img },
  } = user;

  // console.log("@@@ user card", user);
  return (
    <Link href={`/user/${username}`} className="flex gap-5 items-center mb-5">
      <img src={profile_img} alt="" className="w-14 h-14 rounded-full" />

      <div>
        <h1 className="font-medium text-xl line-clamp-2">{fullname}</h1>
        <p className="text-sm text-dark-grey">@{username}</p>
      </div>
    </Link>
  );
};

export default UserCard;
