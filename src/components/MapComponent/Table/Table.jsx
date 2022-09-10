import React, { useState, useEffect } from "react";
// import TwitterEmbed from "../TwitterEmbed";
import CommentRows from "../CommentRows";
import { FixedSizeList } from "react-window";
import "./Table.scss";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const TableComponent = ({ coloumn, socialMediaResponse }) => {
  const [activeId, setActiveId] = useState();
  const [activeRow, setActiveRow] = useState();
  const [socialMediaData, setSocialMediaData] = useState(socialMediaResponse);
  const [dataSorting, setDataSorting] = useState({
    order: "desc",
    orderBy: "followers",
  });

  const handleSetActive = (socialMediaData) => {
    setActiveRow(socialMediaData);
    setActiveId(socialMediaData._id);
  };

  const handleRequestSort = (property) => {
    const newOrder = dataSorting.order === "asc" ? "desc" : "asc";
    setDataSorting({ order: newOrder, orderBy: property });
  };

  useEffect(
    () => {
      setSocialMediaData(socialMediaResponse);
    },
    //eslint-disable-next-line
    [socialMediaResponse]
  );

  useEffect(() => {
    const sortedData = socialMediaData.sort(
      getComparator(dataSorting.order, dataSorting.orderBy)
    );
    setSocialMediaData([...sortedData]);
    // eslint-disable-next-line
  }, [dataSorting]);

  return (
    <div>
      <div className="">
        <div className="rounded-t-xl overflow-hidden  from-emerald-50 to-teal-100 p-5">
          {coloumn.length > 0 && (
            <div className="overflow-hidden custom-scroll tableComments">
              <div className="pr-4 widthbox">
                <div className="flex my-2 border px-4 py-3 font-semibold text-[0.675rem] cursor-pointer">
                  {coloumn.map((col) => (
                    <div
                      key={col.value}
                      className="cursor-pointer w-[100px]"
                      onClick={() => handleRequestSort(col.value)}
                    >
                      {col.label}
                      <span>
                        {dataSorting.order === "desc" &&
                        dataSorting.orderBy === col.value
                          ? "↓"
                          : "↑"}
                      </span>
                    </div>
                  ))}
                </div>
                {coloumn.length > 0 && (
                  <FixedSizeList
                    itemData={socialMediaData}
                    height={700}
                    itemCount={socialMediaData.length}
                    itemSize={120}
                    width={"100%"}
                    style={{ marginTop: "12px" }}
                    className="mb-4 fixed_size_list"
                  >
                    {({ index, style }) => {
                      return (
                        <CommentRows
                          key={index}
                          socialMediaData={socialMediaData[index]}
                          style={style}
                          handleSetActive={handleSetActive}
                          coloumn={coloumn}
                          setActiveRow={setActiveRow}
                        />
                      );
                    }}
                  </FixedSizeList>
                )}
              </div>
            </div>
          )}
        </div>
        {/* {activeId && coloumn.length > 0 && (
          <TwitterEmbed activeId={activeId} activeRow={activeRow} />
        )} */}
      </div>
    </div>
  );
};
export default TableComponent;
