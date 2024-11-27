interface LoadMoreDataBtnProps {
  state: any;
  fetchDataFun: any;
  additionalParams?: any;
}

export const LoadMoreDataBtn = ({
  state,
  fetchDataFun,
  additionalParams,
}: LoadMoreDataBtnProps) => {
  if (state != null && state.results.length < state.totalDocs) {
    return (
      <button
        onClick={() =>
          fetchDataFun({
            ...additionalParams,
            page: state.page + 1,
          })
        }
        className="text-zinc-400 p-2 px-3 hover:bg-gray-600/30 rounded-md flex items-center gap-2"
      >
        Load more
      </button>
    );
  }
};
