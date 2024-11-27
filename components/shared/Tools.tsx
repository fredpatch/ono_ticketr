// defining the tools for the text editor
import Embeb from "@editorjs/embed";
import List from "@editorjs/list";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";

const tools: any = {
  embed: Embeb,
  list: {
    class: List,
    inlineToolbar: true,
  },

  header: {
    class: Header,
    config: {
      placeholder: "Enter a heading...",
      levels: [2, 3, 4],
      defaultLevel: 2,
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  marker: Marker,
  inlineCode: InlineCode,
};

export default tools;
