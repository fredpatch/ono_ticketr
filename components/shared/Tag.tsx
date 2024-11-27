import { EditorContext } from "@/app/(root)/editor/page";
import { useEditor } from "@/context/EditorContext";
import { IconX } from "@tabler/icons-react";
import { useContext } from "react";

const Tag = ({ tag, tagIndex }: any) => {
  // const context = useContext(EditorContext);
  // if (!context)
  //   throw new Error("EventEditor must be used within an EditorProvider");

  let { event } = useEditor();
  let { tags, setEvent } = event;

  const handleTagDelete = () => {
    tags = tags.filter((t: any) => t != tag);
    setEvent({ ...event, tags });
  };

  const handleTagEdit = (e: any) => {
    if (e.keyCode === 13 || e.keyCode === 188) {
      e.preventDefault();

      let currentTag = e.target.innerText;

      tags[tagIndex] = currentTag;
      setEvent({ ...event, tags });

      e.target.setAttribute("contentEditable", false);
    }
  };

  const handleOnClick = (e: any) => {
    e.target.setAttribute("contentEditable", true);
    e.target.focus();
  };
  return (
    <div className="tag relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10 items-center">
      <p
        className="outline-none"
        onKeyDown={handleTagEdit}
        onClick={handleOnClick}
      >
        {tag}
      </p>
      <button
        onClick={handleTagDelete}
        className="rounded-full absolute right-3 top-1/2 -translate-y-1/2"
      >
        <IconX
          className="text-sm pointer-events-none flex items-center"
          size={16}
        />
      </button>
    </div>
  );
};

export default Tag;
